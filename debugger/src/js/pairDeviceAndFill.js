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

function pairDeviceAndFill(deviceMac) {
	const url = urlArr.pair.replace("*deviceMac*", deviceMac),
		parent = $('#pairLog ul')
	let ajaxResult = api.pair(url)
	showMethod('pair')
	ajaxResult.done(function(e) {
		// debugger
		showLog(parent, {
			before: `mac:&nbsp;&nbsp;${deviceMac} pair`,
			message: JSON.stringify(e, null, 2),
			class: 'success'
		})
		$(`.l3 ul li[data-mac='${deviceMac}']`).slideUp('normal', function() {
			this.remove()
		});
	}).fail(function(e) {
		showLog(parent, {
			before: `mac:&nbsp;&nbsp;${deviceMac} pair`,
			message: JSON.stringify(e, null, 2),
			class: 'fail'
		})
	})

}



export default pairDeviceAndFill