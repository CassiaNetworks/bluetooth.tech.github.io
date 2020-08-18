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
// import * as mainHandle from './mainHandle'
import {
	urlArr,
	updateUrlArr
} from './src/js/urlconfig'


// 获取url参数对象
function getUrlVars(url) {
	var urlParams = url.split("?")[1];
	if (!urlParams) return {};
	var paramArray = urlParams.split("&");
	var len = paramArray.length;
	var paramObj = {};
	var arr = [];
	for (var i = 0; i < len; i++) {
			arr = paramArray[i].split("=");
			paramObj[arr[0]] = arr[1];
	}
	return paramObj;
}

// http://xxx:8080/index.html?control=remote... -> xxx:8080/api
function getHostApiByUrl(url) {
	var host = (url.split('?') || [])[0] || '';
	host = host.replace('http://', '').replace('https://', '');
	host = (host.split('/') || [])[0]; // 只取host+port
	host += '/api';
	return host;
}

// 如果存在ac参数的话初始化ac参数
// control=remote&devKey=cassia&devSecret=cassia&hubMac=11:22:33:44:55:66&lang=cn
function initAcVars(form) {
	var url = window.location.href;
	var vars = getUrlVars(url);
	if (!vars['control']) return console.log('not from ac, do nothing:', url);
	if (vars['lang'] == 'cn') $('#control').val('远程');
	else $('#control').val('remote');
	globalData.saved.acaddress = getHostApiByUrl(url);
	globalData.saved.oAuth_dev = vars['devKey'];
	globalData.saved.secret = vars['devSecret'];
	$('#hubMac').val(vars['hubMac']);
	$('#hubMac').trigger('blur');
	// globalData.saved.hubMac = vars['hubMac'];
	globalData.lang = vars['lang'] || 'en';
	i18n(globalData.lang);
	control(vars['control'], form);
}

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

	initAcVars(form); // AC集成参数处理

	form.on('switch(switchScan)', function (data) {
		handle.linkage(0)
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
		handle.linkage(5)
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
		handle.linkage(4)
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

