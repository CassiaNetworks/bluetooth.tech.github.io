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

function unpairDeviceAndFill(deviceMac) {
	const url = urlArr.unpair.replace("*deviceMac*", deviceMac),
		parent = $('#unpairLog ul')
	let ajaxResult = api.unpair(url)
	showMethod('unpair')
	ajaxResult.done(function(e) {
		// debugger
		console.log(parent,`mac:&nbsp;&nbsp;${deviceMac} unpair`)
		showLog(parent, {
			before: `mac:&nbsp;&nbsp;${deviceMac} unpair`,
			message: JSON.stringify(e, null, 2),
			class: 'success'
		})
		$(`.l3 ul li[data-mac='${deviceMac}']`).slideUp('normal', function() {
			this.remove()
		});
	}).fail(function(e) {
		showLog(parent, {
			before: `mac:&nbsp;&nbsp;${deviceMac} unpair`,
			message: JSON.stringify(e, null, 2),
			class: 'fail'
		})
	})

}



export default unpairDeviceAndFill