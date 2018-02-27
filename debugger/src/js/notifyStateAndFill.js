import {
	api
} from './api'
import {
	showMethod
} from './showmethod'
import {
	showLog
} from './showlog'
import {
	htmlTemp
} from './getConnectList'
import {
    urlArr  
}from './urlconfig'
import globalData from './globalData'


const notifyStateAndFill = {}
notifyStateAndFill.start = function() {
	globalData.neverSave.stateSSE.status = 'toOpen'
	if (globalData.neverSave.stateSSE.es !== '') {
		return
	}
	const url = urlArr.getConnectState,
		ajaxResult = api.getConnectState(url, globalData.neverSave.stateSSE),
		$parent = $('#connectState ul')
	let data = ''
	ajaxResult.addEventListener('message', function(e) {
		//
		// debugger
		// console.log('connectState:', e)
		showLog($parent, {
			message: e.data
		})
		if (!e.data.match("keep-alive")) {
			// debugger
			//console.log(typeof e.data +"notifystateandfill"+e.data)
			data = JSON.parse(e.data)
			stateNotifyHandle(data)
				// console.log('notify:',e)
		}
	})
	showMethod('getConnectState')
}


function stateNotifyHandle(data) {
	const state = data.connectionState,
		mac = data.handle,
		$l3 = $('.box .l3 ul.bb1'),
		$li = $l3.children(`li:has(span.layui-input:contains("${mac}"))`)
		// debugger
		// console.log("~~~~~",$li)
	if (state === 'connected' && !$li[0]) {
		// debugger
		$l3.append(htmlTemp(mac, ''))
	} else if (state === 'disconnected') {
		$li[0] && $li.slideUp('normal', function() {
			this.parentNode.removeChild(this)
		});

		// debugger
	}
}
notifyStateAndFill.stop = function() {
	globalData.neverSave.stateSSE.status = 'toClosed'
	if (globalData.neverSave.stateSSE.es) {
		globalData.neverSave.stateSSE.es.close()
		console.log('has closed')
		globalData.neverSave.stateSSE.status = 'closed'
		globalData.neverSave.stateSSE.es = ''
	}
}


export default notifyStateAndFill