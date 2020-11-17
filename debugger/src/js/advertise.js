import {
    urlArr,
    updateUrlArr,
    data
} from './urlconfig';
import {
    methodConfig,
    showMethod
} from './showmethod';
import {
	showLog
} from './showlog';
import globalData from './globalData';
import i18n from './i18n';
import * as mainHandle from './mainHandle'
import { api } from './api';

// 用于定时获取芯片的广播状态，周期为30秒
let checkChipAdvStatusInterval = 30 * 1000;
let checkChipAdvStatusTimer = null;

function advertiseBoxShow(form){
	layer.open({
			title: 'Advertise',
			type: 6,
			area: ['630px', 'auto'],
			shade: 0.3,
			shadeClose: true,
			closeBtn: 1,
			fixed: true,
			maxmin: false,
			anim: 5, //0-6的动画形式，-1不开启
			tips: [2, '#2F4056'],
			content: htmlString(),
			btn: ['start', 'stop'],
			btn1: start,
			btn2: stop,
			cancel: function(index, layero) { // 点击窗口的x关闭按钮
				console.log('advertise box close button clicked');
				// $('#control').val('local')
				// form.render()
			},
	});	

	// TODO: 是否需要根据不同的adType控制传入的各个参数?
	// 注册对应的事件, 根据选择的不同类型的广播，控制对应原始的显示隐藏
	// form.on('select(adType)', function(data) {
	// 	console.log('adType changed:', data.value);
	// });

	$('#adType').val(globalData.saved.adType || '0');

	console.log('open advertise setting:', globalData.lang);
	i18n(globalData.lang, form.render);
}

var htmlString = function() {
	let temp = `
	<form class="layui-form" action="#" style="padding-top: 15px; padding-right: 15px;">
		<div class="layui-form-item">
			<label class="layui-form-label" i18n="adType">Adv Type:</label>
			<div class="layui-input-block">
				<select name="adType" lay-filter="adType" id="adType">
					<option value="0">ADV_IND</option> <!-- 可被连接，可被扫描 -->
					<option value="1">ADV_DIRECT_IND</option> <!-- 可被指定的设备连接，不可被扫描 -->
					<option value="2">ADV_SCAN_IND</option> <!-- 不可以被连接，可以被扫描 -->
					<option value="3">ADV_NONCONN_IND</option> <!-- 不可以被连接，不可以被扫描 -->
					<option value="4">SCAN_RSP</option> <!-- 扫描响应 -->
				</select>  
			</div>
		</div>
		<div class="layui-form-item" class="adData">
			<label class="layui-form-label" i18n="adData">Adv Data:</label>
			<div class="layui-input-block">
				<input type="text" lay-verify="adData" value="${globalData.saved.adData}"  class="layui-input" id="adData" placeholder="">
			</div>
		</div>
		<div class="layui-form-item" class="adRespData">
			<label class="layui-form-label" i18n="adRespData">Resp Data:</label>
			<div class="layui-input-block">
				<input type="text" lay-verify="adRespData" value="${globalData.saved.adRespData}"  class="layui-input" id="adRespData" placeholder="">
			</div>
		</div>
		<div class="layui-form-item" class="adChannelmap">
			<label class="layui-form-label" i18n="adChannelmap">Channel:</label>
			<div class="layui-input-block">
				<input type="text" value="${globalData.saved.adChannelmap}"  class="layui-input" id="adChannelmap" placeholder="">
			</div>
		</div>
		<div class="layui-form-item" class="adInterval">
			<label class="layui-form-label" i18n="adInterval">Adv Interval:</label>
			<div class="layui-input-block">
				<input type="text" value="${globalData.saved.adInterval}"  class="layui-input" id="adInterval" placeholder="">
			</div>
		</div>
	</form>`;
	return temp
}

// 开启广播
function start() {
	console.log('start advertise clicked');

	let adType = $("#adType").val();
	let adData = $('#adData').val();
	let adRespData = $('#adRespData').val();
	let adChannelmap = +$('#adChannelmap').val();
	let adInterval = +$('#adInterval').val();

	// 参数检查
	if (adData.length <= 0 || adData.length > 62 || adData.length % 2 !== 0 || !/^[0-9a-fA-F]*$/.test(adData)) {
		let info = globalData.lang === 'cn' ? '请输入合法的广播包内容' : 'Please enter legal advertise data';
		return layer.msg(info, {icon:5,title:'Advertise',time:3000});
	}
	if (adRespData.length <= 0 || adRespData.length > 62 || adRespData.length % 2 !== 0 || !/^[0-9a-fA-F]*$/.test(adRespData)) {
		let info = globalData.lang === 'cn' ? '请输入合法的扫描响应内容' : 'Please enter legal scan response data';
		return layer.msg(info, {icon:5,title:'Advertise',time:3000});
	}
	if (+adInterval <= 0) {
		let info = globalData.lang === 'cn' ? '请输入合法的广播周期' : 'Please enter legal advertise interval';
		return layer.msg(info, {icon:5,title:'Advertise',time:3000});
	}

	// 用户本地保存
	globalData.saved.adType = adType;
	globalData.saved.adData = adData;
	globalData.saved.adRespData = adRespData;
	globalData.saved.adChannelmap = adChannelmap;
	globalData.saved.adInterval = adInterval;

	let data = {
		chip: 0,
		ad_type: adType,
		ad_data: adData,
		resp_data: adRespData,
		channelmap: adChannelmap,
		interval: adInterval
	};

	// TODO: 是否需要根据不同的adType控制传入的各个参数?

	// 动态更新URL地址和mac参数
	if (data.access_token) updateUrlArr(globalData.saved.acaddress);

	let url = urlArr.advertiseStart;
	if (url.includes(`//advertise`)) { // 说明配置AC/AP MAC, AP IP完整
		let info = globalData.lang === 'cn' ? '请配置远程方式+Router Mac或者本地方式+Router IP' : 'Please configure Remote Control+Router Mac or Local Control+Router IP';
		return layer.msg(info, {icon:5,title:'Advertise',time:5000});
	} else if (url.includes('/api/') && url.includes('mac=&')) { // 说明使用的AC方式，并且没有配置网关mac地址
		let info = globalData.lang === 'cn' ? '请配置远程方式+Router Mac或者本地方式+Router IP' : 'Please configure Remote Control+Router Mac or Local Control+Router IP';
		return layer.msg(info, {icon:5,title:'Advertise',time: 5000});
	}
	for (let key in data) {
		url += `&${key}=${data[key]}`;
	}
	api.advertiseStart(url, startSuccess, startError);
	showMethod('advertiseStart');
}

// 停止广播
function stop() {
	console.log('stop advertise clicked');
	// 动态更新URL地址和mac参数
	if (data.access_token) updateUrlArr(globalData.saved.acaddress);
	let url = urlArr.advertiseStop;
	if (url.includes(`//advertise`)) { // 说明配置AC/AP MAC, AP IP完整
		let info = globalData.lang === 'cn' ? '请配置远程方式+Router Mac或者本地方式+Router IP' : 'Please configure Remote Control+Router Mac or Local Control+Router IP';
		return layer.msg(info, {icon:5,title:'Advertise',time: 5000});
	} else if (url.includes('/api/') && url.includes('mac=&')) { // 说明使用的AC方式，并且没有配置网关mac地址
		let info = globalData.lang === 'cn' ? '请配置远程方式+Router Mac或者本地方式+Router IP' : 'Please configure Remote Control+Router Mac or Local Control+Router IP';
		return layer.msg(info, {icon:5,title:'Advertise',time: 5000});
	}
	api.advertiseStop(url, stopSuccess, stopError);
	showMethod('advertiseStop');
}

function stopSuccess() {
	console.log('stop advertise ok');
	layer.closeAll();
	let parentoAuth = $('#advertiseLog ul');
	mainHandle.linkage(13);
	clearInterval(checkChipAdvStatusTimer);
	checkChipAdvStatusTimer = null;
	console.log('stop checkChipAdvStatusTimer ok');
	showLog(parentoAuth, {
		message: `[${new Date()}] ` + 'stop adverise on chip 0 ok',
		class: 'success'
	});
	showLog(parentoAuth, {
		message: `[${new Date()}] ` + 'stop check chip 0 adv status timer ok',
		class: 'success'
	});
}

function checkChipAdvStatusHandler() {
	if (data.access_token) updateUrlArr(globalData.saved.acaddress);
	let url = urlArr.cassiaInfo;
	let parentoAuth = $('#advertiseLog ul');
	api.cassiaInfo(url, function(data) {
		showLog(parentoAuth, {
			message: `[${new Date()}] ` + 'get chip adv status by timer: ' + data['chipinfo']['0']['status'],
			class: 'success'
		});
	}, function(e) {
		mainHandle.linkage(13);
		showLog(parentoAuth, {
			message: `[${new Date()}] ` + 'get chip adv status by timer: ' + JSON.stringify(e),
			class: 'fail'
		});
	});
	showMethod('cassiaInfo');
}

function startSuccess(data) {
	console.log('start advertise ok:', data);
	layer.closeAll();
	let parentoAuth = $('#advertiseLog ul');
	mainHandle.linkage(13);
	showLog(parentoAuth, {
		message: `[${new Date()}] ` + 'start advertise on chip 0: ' + JSON.stringify(data),
		class: 'success'
	});
	setTimeout(checkChipAdvStatusHandler, 1000); // 立即获取芯片状态
	if (checkChipAdvStatusTimer) clearInterval(checkChipAdvStatusTimer);
	checkChipAdvStatusTimer = setInterval(checkChipAdvStatusHandler, checkChipAdvStatusInterval);
	console.log('start checkChipAdvStatusTimer ok:', checkChipAdvStatusInterval);
	showLog(parentoAuth, {
		message: `[${new Date()}] ` + 'start check chip 0 adv status by timer: 30s',
		class: 'success'
	});
}

function startError(e) {
	layer.msg('Error', {icon: 2,title:'Advertise',time: 3000});
	let parentoAuth = $('#advertiseLog ul');
	mainHandle.linkage(13);
	showLog(parentoAuth, {
		message: `[${new Date()}] ` + 'start advertise on chip 0 error: ' + JSON.stringify(e),
		class: 'fail'
	});
}

function stopError(e) {
	layer.msg('Error', {icon: 2,title:'Advertise',time: 3000});
	let parentoAuth = $('#advertiseLog ul');
	mainHandle.linkage(13);
	showLog(parentoAuth, {
		message: `[${new Date()}] ` + 'stop advertise on chip 0 error: ' + JSON.stringify(e),
		class: 'fail'
	});
}

export {
	advertiseBoxShow
}