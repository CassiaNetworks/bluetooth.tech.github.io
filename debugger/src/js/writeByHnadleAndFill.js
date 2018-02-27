import {
	api
} from './api'
import {
    urlArr  
}from './urlconfig'
import {
	showMethod
} from './showmethod'
import {
	showLog
} from './showlog'
const writeByHnadleAndFill = (event, {
	deviceMac,
	writeValue,
	handle
}) => {
	let url, ajaxResult, action = event.dataset.action

	url = urlArr.writeByHandle.replace(/\*((deviceMac)|(handle)|(writeValue))\*/g, function(match, pos, originalText) {
		switch (match) {
			case '*deviceMac*':
				return deviceMac
			case '*handle*':
				return handle
			case '*writeValue*':
				return writeValue
		}
	})

	if (action === 'writeWithRes') {
		ajaxResult = api.writeByHnadle(url, null)
		
	} else if (action === 'writeWithoutRes') {
		ajaxResult = api.writeByHnadle(url, {
			option: 'cmd'
		})
	} else if (action === 'notify') {
		ajaxResult = api.writeByHnadle(url, null)
	} else if (action === 'indicate') {
		ajaxResult = api.writeByHnadle(url, null)
	}
	showMethod('writeByHandle')
	ajaxResult.done(function(e) {
		// debugger
		showLog($('#writeValueLog'), {
			message: deviceMac + ':' + JSON.stringify(e),
			class: 'success'
		})
	}).fail(function(e) {
		showLog($('#writeValueLog'), {
			message: deviceMac + ':' + JSON.stringify(e, null, 2),
			class: 'fail'
		})
	})

}

export {
	writeByHnadleAndFill
}