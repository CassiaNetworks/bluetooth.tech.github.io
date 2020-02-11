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

const readByHandleAndFill = (event, {
	deviceMac,
	handle
}) => {
	let url, action = event.dataset.action

	url = urlArr.readByHandle.replace(/\*((deviceMac)|(handle))\*/g, function(match, pos, originalText) {
		switch (match) {
			case '*deviceMac*':
				return deviceMac
			case '*handle*':
				return handle
		}
	})

  let ajaxResult = api.readByHandle(url, null);
	showMethod('readByHandle');
	
	const $readResult = $($(event).parent().find('input')[0]);
  $readResult.val('reading');
	ajaxResult.done(function(e) {
		// debugger
		showLog($('#readValueLog'), {
			message: deviceMac + ':' + JSON.stringify(e),
			class: 'success'
		})
    $readResult.val(e.value || '');
	}).fail(function(e) {
		showLog($('#readValueLog'), {
			message: deviceMac + ':' + JSON.stringify(e, null, 2),
			class: 'fail'
    });
    $readResult.val('read failed');
	})
}

export {
	readByHandleAndFill
}