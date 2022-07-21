import './src/css/index.css'
import * as handle from './src/js/mainHandle'
import scan from './src/js/scan'
import notifyStateAndFill from './src/js/notifyStateAndFill'
import notifyMsg from './src/js/notifyMsgAndFill'
import globalData from './src/js/globalData'
import i18n from  './src/js/i18n'
import {control} from './src/js/oAuth2'
import {advertiseBoxShow} from './src/js/advertise'
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
// eg. https://q1.lunxue.cc/debugger/index.html?view&devKey=cassia&devSecret=cassia&lang=cn&control=remote&hubMac=CC:1B:E0:E0:E1:90
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
	$('#control').val('remote');
	globalData.saved.acaddress = getHostApiByUrl(url);
	globalData.saved.oAuth_dev = vars['devKey'];
	globalData.saved.secret = vars['devSecret'];
	$('#hubMac').val(vars['hubMac']);
	$('#hubMac').trigger('blur');
	// globalData.saved.hubMac = vars['hubMac'];
	globalData.lang = vars['lang'] || 'en';
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
		form = layui.form();

	initAcVars(form); // AC集成参数处理
	
	$('#reboot').click(function () {
		console.log(urlArr.reboot)
		api.reboot(urlArr.reboot).done(
			layer.load(2, {
				time: 5 * 1000
			})
		)
	});

	// 自定义广播: 点击跳出参数配置对话框 -> 开始/停止
	$('#advertise').click(function () {
		advertiseBoxShow(form);
	});

	form.on('select(control)',function(data){
		control(data.value,form);
	});


	form.on('select(lang)',function(data) {
		console.log('language changed:', data.value, globalData.lang);
		globalData.lang = data.value;
		i18n(globalData.lang, form.render)
		// setTimeout(form.render,500)
	});

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

	showCrosAlertDialog();
});

// 开启cros配置提示信息对话框
function showCrosAlertDialog() {
	var htmlString = function() {
		let info =  '从v2.0.3版本开始，默认情况下，AC和路由器上的CORS被禁用。使用此蓝牙调试工具时，请在控制台设置中设置“Access Control Allow Origin”。请参考<a target="_blank" style="color: #2897ff; text-decoration: none;" href="../debugger2/dist/Debugger2-Troubleshooting.pdf"> Debugger2-Troubleshooting </a>了解详细说明。如果使用 <span style="color: #ff0000; font-weight: bold;">Chrome版本>=94</span>，请复制此链接并在Chrome打开 <span style="color: #2897ff;">chrome://flags/#block-insecure-private-network-requests</span> 设置为Disabled。';
		if (globalData.lang !== 'cn') {
			info = 'Starting v2.0.3 release, CORS is disabled by default on AC and Router. When using this Bluetooth Debug Tool, please set ‘Access Control Allow Origin’ in the console setting. Please refer to <a target="_blank" style="color: #2897ff; text-decoration: none;" href="../debugger2/dist/Debugger2-Troubleshooting.pdf">Debugger2-Troubleshooting</a> for detailed instruction. If using <span style="color: #ff0000; font-weight: bold;">Chrome version>=94</span>, please copy this link and open it in Chrome<span style="color: #2897ff;"> chrome://flags/#block-insecure-private-network-requests</span> is set to Disabled.';
		}
			return `
			<form class="layui-form" action="#" style="">
				<div class="layui-form-item" style="padding: 25px; line-height: 25px;" i18n="configOrigin">
					${info}
				</div>
			</form>`
	};
	layer.open({
		title: '',
		type: 6,
		area: ['460px', 'auto'],
		shade: 0,
		shadeClose:true,
		closeBtn: 1,
		shadeClose: true,
		fixed: true,
		maxmin: false,
		anim: 5, //0-6的动画形式，-1不开启
		tips: [2, '#2F4056'],
		content:htmlString(),
		btn: [],
		btn1: function() {
			// form.render()
		},
		btn2:function(index, layero){
			// form.render()
		},
		cancel:function(index, layero){
			// form.render()
		},
	});	
}

layui.use(['element'], function () {
	let element = layui.element();
	// element.tabChange('log', 1);
})

