import Module from './mpy-cross.js';

var pyCode = '';
var file = null;
var target = null;

async function fileChange(event) {
    file = event.target.files[0];
    if (!file) {
        pyCode = '';
        return;
    }

    console.log(file);

    const reader = new FileReader();
    reader.onload = async function (e) {
        pyCode = e.target.result;
        logMessage(`🎯 file changed: ${file.name} ${file.size}`, true);
        document.getElementById('compileBtn').disabled = false;
        console.log(e.target.result);
        // event.target.value = "";
    };

    reader.readAsText(file);
}

async function compile() {
    if (!pyCode || !file) {
        logMessage('🛑 stop compile: no code');
        console.log(pyCode, file);
        return;
    }

    logMessage('⏳ compile...');
    document.getElementById('compileBtn').disabled = true;

    var mpyCross = await Module({
        noInitialRun: true,
        print: (text) => {
            logMessage(`ℹ️ stdout: ${text}`)
        },
        printErr: (text) => {
            if (target) target.value = '';
            console.error(`⚠️ stderr: ${text}`);
        },
        locateFile: (path, prefix) => {
            if (path.endsWith(".wasm")) {
                return "./mpy-cross.wasm";
            }
            return prefix + path;
        }
    });

    mpyCross.FS.writeFile(file.name, pyCode);

    const outName = file.name.replace(/\.py$/, ".mpy");

    const args = [file.name, "-o", outName];
    const ret = mpyCross.callMain(args);

    const mpyData = mpyCross.FS.readFile(outName);
    if (ret === 0) {
        logMessage(`✅ success: ${outName} ${mpyData.length}`);
    } else {
        logMessage("❌ failed");
    }

    downloadFile(outName, mpyData);

    if (target) target.value = '';
}

function logMessage(msg, clear = false) {
    const logDom = document.getElementById("log");
    if (clear) {
        logDom.textContent = '';
    }
    logDom.textContent += msg + "\n";
}

function downloadFile(name, data) {
    const blob = new Blob([data], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
}

document.getElementById('compileBtn').addEventListener('click', compile);
document.getElementById("fileInput").addEventListener("change", fileChange);