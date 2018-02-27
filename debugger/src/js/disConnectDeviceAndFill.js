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

function disConnectDeviceAndFill(deviceMac) {
	const url = urlArr.connectDevice.replace("*deviceMac*", deviceMac),
		parent = $('#disconnectLog ul')
	let ajaxResult = api.disconnectDevice(url)
	showMethod('disconnectDevice')
	ajaxResult.done(function(e) {
		// debugger
		showLog(parent, {
			before: `mac:&nbsp;&nbsp;${deviceMac} disconnect`,
			message: JSON.stringify(e, null, 2),
			class: 'success'
		})
		$(`.l3 ul li[data-mac='${deviceMac}']`).slideUp('normal', function() {
			this.remove()
		});
	}).fail(function(e) {
		showLog(parent, {
			before: `mac:&nbsp;&nbsp;${deviceMac} disconnect`,
			message: JSON.stringify(e, null, 2),
			class: 'fail'
		})
	})

}



export default disConnectDeviceAndFill