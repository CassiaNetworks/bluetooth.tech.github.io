/**
 * The Dedicated Worker that hosts the engine.
 *
 * Everything expensive happens here — the wasm module, the agent loop, SQLite —
 * so a long turn or a big session query never janks the page. The worker itself
 * is deliberately thin: it loads the module, forwards calls, and forwards
 * frames back. All the judgement lives in Rust.
 *
 * Note this dies with the document. A reload does not resume a turn, it ends
 * one; see the note in `host.rs`.
 */

import init, { AgentHost, openHost } from '../pkg/agent_web_core.js';
import type { Frame, Ready, Reply, Request, ToWorker } from './protocol';
import { isInit, PROTOCOL_VERSION } from './protocol';

declare const self: DedicatedWorkerGlobalScope;

let host: AgentHost | null = null;
/**
 * Set by the first `init`. Nothing happens until then — the page picks the
 * database, and `AgentClient` sends it before any request.
 */
let booted: Promise<void> | null = null;

function post(message: Reply | Frame | Ready) {
	self.postMessage(message);
}

/** Every frame the engine produces, tagged with the stream that asked for it. */
function sink(stream: string, frame: string) {
	post({ stream, frame });
}

async function boot(namespace?: string) {
	try {
		await init();
	} catch (e) {
		post({ ready: true, protocol: PROTOCOL_VERSION, error: `could not load wasm: ${e}` });
		return;
	}

	// Persistent storage first; fall back to in-memory rather than refusing to
	// start. A private window or a denied storage quota should cost history, not
	// the whole application.
	try {
		host = await openHost(sink, namespace);
		post({ ready: true, protocol: PROTOCOL_VERSION });
	} catch (e) {
		try {
			host = new AgentHost(sink);
			post({ ready: true, protocol: PROTOCOL_VERSION, ephemeral: true });
		} catch (fatal) {
			post({
				ready: true,
				protocol: PROTOCOL_VERSION,
				error: `no session storage available: ${e}; in-memory also failed: ${fatal}`,
			});
		}
	}
}

/**
 * Params are positional per method rather than a named object, because the
 * generated wasm bindings are positional and a translation layer between the
 * two would be one more place for them to disagree.
 *
 * A case may return a promise; see the caller. Most do not, and it matters that
 * they do not — `send` reserves its turn before returning.
 */
function dispatch(h: AgentHost, method: Request['method'], p: any): unknown {
	switch (method) {
		case 'configure':
			return h.configure(p.baseUrl, p.apiKey, p.model);
		case 'installTools':
			return h.installTools(p.payload, p.endpoint);
		case 'attach':
			return h.attach(p.stream, p.session, p.follow === true);
		case 'detach':
			return h.detach(p.stream);
		case 'send':
			// Synchronous by design: the ack says only whether the turn was
			// accepted, and the turn itself is registered before this returns so
			// the attach that follows cannot miss it. Output arrives as frames.
			return JSON.parse(h.send(p.session, p.text, JSON.stringify(p.options ?? {})));
		case 'steer':
			return h.steer(p.session, p.message ?? '');
		case 'rewind':
			return JSON.parse(h.rewind(p.session, p.userIndex ?? 0));
		case 'models':
			return h.models().then((raw) => JSON.parse(raw));
		case 'cancel':
			return h.cancel(p.session);
		case 'confirm':
			return h.confirm(p.session, p.callId, p.approved, p.approveAll ?? false, p.amendedArgs);
		case 'setAuto':
			return h.setAuto(p.session, p.enabled === true);
		case 'answer':
			return h.answer(p.session, JSON.stringify(p.answers ?? []));
		case 'upload':
			return JSON.parse(h.upload(p.name ?? '', p.mime ?? '', p.bytes));
		case 'readUpload': {
			// Two calls, one round trip: the id's extension decides the type,
			// and that table belongs next to the one that produced the id.
			const bytes = h.readUpload(p.id);
			return bytes ? { bytes, mime: h.uploadMime(p.id) } : null;
		}
		case 'skills':
			return JSON.parse(h.skills());
		case 'skillText':
			return h.skillText(p.name, p.which) ?? null;
		case 'skillIcon': {
			const bytes = h.skillIcon(p.name);
			return bytes ? { bytes, mime: h.skillIconMime(p.name) } : null;
		}
		case 'setSkillFlag':
			return h.setSkillFlag(p.name, p.flag, p.value === true);
		case 'importSkill':
			return JSON.parse(h.importSkill(p.bytes));
		case 'previewSkill':
			return JSON.parse(h.previewSkill(p.bytes));
		case 'deleteSkill':
			return JSON.parse(h.deleteSkill(p.name));
		case 'themes':
			return JSON.parse(h.themes());
		case 'savedThemes':
			return JSON.parse(h.savedThemes());
		case 'saveTheme':
			return JSON.parse(h.saveTheme(p.name, p.css ?? '', p.js ?? '', p.session ?? undefined));
		case 'activateTheme':
			return JSON.parse(h.activateTheme(p.name ?? undefined));
		case 'deleteTheme':
			return JSON.parse(h.deleteTheme(p.name));
		case 'allowDir':
			return h.allowDir(p.dir ?? '');
		case 'allowedDirs':
			return JSON.parse(h.allowedDirs());
		case 'forgetDirs':
			return h.forgetDirs(p.dir);
		case 'runtimeStat':
			return JSON.parse(h.runtimeStat(p.category ?? undefined));
		case 'runtimeClear':
			return JSON.parse(h.runtimeClear(JSON.stringify(p.categories ?? [])));
		case 'turns':
			return h.turns();
		case 'sessions':
			return JSON.parse(h.sessions());
		case 'session':
			return JSON.parse(h.session(p.session));
		case 'search':
			return JSON.parse(h.search(p.query ?? '', p.limit ?? 20, p.exclude));
		case 'updateSession':
			return h.updateSession(p.session, p.title, p.pinned);
		case 'deleteSession':
			return h.deleteSession(p.session);
		default: {
			// Exhaustiveness: adding a Method without a case is a compile error.
			const never: never = method;
			throw new Error(`unknown method: ${never}`);
		}
	}
}

self.onmessage = (e: MessageEvent<ToWorker>) => {
	if (isInit(e.data)) {
		// Booting on the first message rather than on load is what lets the page
		// choose the database. A second init is ignored: the store is open and
		// reopening it under another name would strand every session already in
		// flight.
		if (!booted) booted = boot(e.data.namespace);
		return;
	}

	const { id, method, params } = e.data;
	if (!host) {
		post({ id, error: 'the worker is still starting' });
		return;
	}
	// A panic in the engine arrives here as a thrown JsValue, or as a rejection
	// for the methods that are async. Reporting it on the reply keeps the page
	// usable; the worker itself is still fine, because a wasm panic aborts the
	// call rather than the module.
	const failed = (err: unknown) =>
		post({ id, error: err instanceof Error ? err.message : String(err) });

	try {
		const result = dispatch(host, method, params ?? {});
		if (result instanceof Promise) result.then((value) => post({ id, result: value }), failed);
		else post({ id, result });
	} catch (err) {
		failed(err);
	}
};
