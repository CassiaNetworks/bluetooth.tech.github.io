import {
	api
} from './api'
import {
	urlArr
} from './urlconfig'
// import pair_input from './pair-input'
import {
	showMethod
} from './showmethod'
import {
	showLog
} from './showlog'

function pairInput(deviceMac) {
	const url = urlArr.unpair.replace("*deviceMac*", deviceMac),
		$parent = $('#unpairLog ul')
	let ajaxResult = api.unpair(url)
	showMethod('unpair')
	ajaxResult.done(function (e) {
		showLog($parent, {
			before: `mac:${deviceMac}&nbsp;&nbsp;`,
			message: JSON.stringify(e),
			class: 'success'
		})
		console.log("取消配对成功")
		// debugger
	}).fail(function (e) {
		showLog($parent, {
			before: `mac:${deviceMac}&nbsp;&nbsp;`,
			message: JSON.stringify(e),
			class: 'fail'
		})
		console.log(e)
	})

}



export default pairInput