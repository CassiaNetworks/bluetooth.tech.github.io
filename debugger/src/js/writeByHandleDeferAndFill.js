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



function writeByHandleDeferAndFill(arr, deviceMac) {
	let handle, writeValue, interval,
		type, defer,
		ajaxResult,
		url,
		temp
	arr.forEach((item, index, arr) => {
		defer = null
		interval = null

		temp = item.split(',')
		handle = temp[0].split(':')[0].trim()
		writeValue = temp[0].split(':')[1].trim()
		if (temp[1].indexOf('interval') !== -1) {
			interval = parseInt(temp[1].split(':')[1], 10)
			type = temp[2]
		} else {
			type = temp[1]
			defer = temp[2]
		}
		type = type && parseInt(type.trim(), 10)
		defer = defer && parseInt(defer.trim(), 10)
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

		function fn(url, type) {
			// console.log('type', type)
			console.log('url', url)
			console.log(new Date())
			ajaxResult = api.writeByHnadle(url, type ? null : {
				option: 'cmd'
			}).done(function(e) {
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
			}).always(function() {
				// methodConfig.writeByHandle.url = api.addURLParam(url, type ? {
				// 	option: 'cmd'
				// } : null, false)
				showMethod('writeByHandle')
			})
		}


		if (interval) {
			(function() {
				setInterval(fn.bind(this, url, type), interval)
			})()

		} else if (defer) {
			(function() {
				setTimeout(fn.bind(this, url, type), defer)
			})()
		} else {
			fn.call(this, url, type)
		}

	})

}

export default writeByHandleDeferAndFill