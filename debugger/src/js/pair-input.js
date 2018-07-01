import {
	api
} from './api'
import {
	urlArr
} from './urlconfig'

import {
	showMethod
} from './showmethod'
import {
	showLog
} from './showlog'

function pair_input(deviceMac,x) {
	const url = urlArr.pair_input.replace("*deviceMac*", deviceMac),
		parent = $('#pairInputLog ul')

	let ajaxResult = api.pairInput(url,x)
	showMethod('pair_input')
	ajaxResult.done(function (e) {
		showLog(parent, {
			before: `mac:&nbsp;&nbsp;${deviceMac} pair-input`,
			message: JSON.stringify(e, null, 2),
			class: 'success'
		})
		$(`.l3 ul li[data-mac='${deviceMac}']`).slideUp('normal', function() {
			this.remove()
		});
			console.log("写入配对码成功",x)
		
	}).fail(function (e) {
		showLog(parent, {
			before: `mac:&nbsp;&nbsp;${deviceMac} pair-input`,
			message: JSON.stringify(e, null, 2),
			class: 'fail'
		})
		$(`.l3 ul li[data-mac='${deviceMac}']`).slideUp('normal', function() {
			this.remove()
		});
		console.log(e)
	})

}



export default pair_input