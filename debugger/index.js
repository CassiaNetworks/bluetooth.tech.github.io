import './src/css/index.css'
import * as handle from './src/js/mainHandle'
import scan from './src/js/scan'
import notifyStateAndFill from './src/js/notifyStateAndFill'
import notifyMsg from './src/js/notifyMsgAndFill'
import globalData from './src/js/globalData'
import i18n from  './src/js/i18n'
import {control} from './src/js/oAuth2'
import {
	api
} from './src/js/api'

import {
	urlArr,
	updateUrlArr
} from './src/js/urlconfig'



i18n();
(function () {
	$('#hubIp').val(globalData.saved.hubIp).triggerHandler('blur')
	$('#hubMac').val(globalData.saved.hubMac).triggerHandler('blur')
}())

layui.use(['layer', 'form'], function () {
	
	// form.render()
	var layer = layui.layer,
		form = layui.form()
	$('#reboot').click(function () {
		console.log(urlArr.reboot)
		api.reboot(urlArr.reboot).done(
			layer.load(2, {
				time: 5 * 1000
			})
		)
	});


	form.on('select(control)',function(data){
		control(data.value,form);
	});
	form.on('select(lang)',function(data){
		i18n(data.value,form.render)
		// setTimeout(form.render,500)
	});
	form.on('switch(switchScan)', function (data) {
		if (data.elem.checked) {
			console.log(globalData.saved)
			scan.start({
				chip: globalData.saved.chip || 0
			}, globalData.neverSave.scanSSE.timeOut)
				// data.elem.setAttribute('disabled', 'true')
		} else {
			scan.stop()
		}
		// console.log(data.elem); //得到checkbox原始DOM对象
		// console.log(data.elem.checked); //开关是否开启，true或者false
	});

	form.on('switch(switchNotifyState)', function (data) {
		if (data.elem.checked) {
			notifyStateAndFill.start()
			// data.elem.setAttribute('disabled', 'true')
		} else {
			notifyStateAndFill.stop()
		}
		// console.log(data.elem); //得到checkbox原始DOM对象
		// console.log(data.elem.checked); //开关是否开启，true或者false
	});

	form.on('switch(switchNotifyMsg)', function (data) {
		if (data.elem.checked) {
			notifyMsg.start()

			// data.elem.setAttribute('disabled', 'true')
		} else {
			notifyMsg.stop(0)
		}
		// console.log(data.elem); //得到checkbox原始DOM对象
		// console.log(data.elem.checked); //开关是否开启，true或者false
	});

	$('#clearNotify').on('click', function () {
		$('.box .l4 ul').empty()
	})



	handle.mainHandle(layer, form)
	handle.connectButton()
	handle.getConnectLists()
	handle.disConnectDevice()
	handle.getAllServices()
	handle.gopair()
	handle.cancelpair()


});

layui.use(['element'], function () {
	let element = layui.element();
	// element.tabChange('log', 1);
})

