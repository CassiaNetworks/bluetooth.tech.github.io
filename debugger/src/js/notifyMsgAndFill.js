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
    urlArr  
}from './urlconfig'
import globalData from './globalData'

const notifyMsgAndFill = {}
notifyMsgAndFill.start = function() {
	globalData.neverSave.notifySSE.status = 'toOpen'
	if (globalData.neverSave.notifySSE.es !== '') {
		return
	}
	const ajaxResult = api.receiveNotification(urlArr.notifyMsg,  globalData.neverSave.notifySSE),
		$parent1 = $('.l4 ul'),
		$parent2 = $('#notify ul')
	ajaxResult.addEventListener('message', function(e) {
		let data = null
		if (!e.data.match("keep-alive") ) {
			data = JSON.parse(e.data)
			showLog($parent1, {
				message: `<b>mac:${data.id}</b>&nbsp;&nbsp;&nbsp;${data.value}`
			})
			showLog($parent2, {
				message: JSON.stringify(data, null, 2)
			})

		} else {
			showLog($parent2, {
				message: e.data
			})

		}
	})
	showMethod('notify')
}

notifyMsgAndFill.stop = function() {
	// debugger
	console.log(globalData)
	globalData.neverSave.notifySSE.status = 'toClosed'
	if (globalData.neverSave.notifySSE.es) {
		globalData.neverSave.notifySSE.es.close()
		globalData.neverSave.notifySSE.status = 'closed'
		globalData.neverSave.notifySSE.es = ''
	}
}

export default notifyMsgAndFill