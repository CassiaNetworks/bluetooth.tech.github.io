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

function connectDevice(chip, type, deviceMac) {
	const url = urlArr.connectDevice.replace("*deviceMac*", deviceMac),
		$parent = $('#connect ul')

	api.connectDevice(url, {
		qs: {
			chip:chip
		},
		type
	}).done(function(e) {
		showLog($parent, {
			before: `mac:${deviceMac}&nbsp;&nbsp;`,
			message: JSON.stringify(e),
			class: 'success'
		})
	}).fail(function(e) {
		// debugger
		showLog($parent, {
			before: `mac:${deviceMac}&nbsp;&nbsp;`,
			message: JSON.stringify(e),
			class: 'fail'
		})

	}).always(function(e) {
		console.log('connect:', e)

	})

	showMethod('connectDevice')

}
export default connectDevice