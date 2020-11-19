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

function checkChipAdvStatusHandler() {
	if (data.access_token) updateUrlArr(globalData.saved.acaddress);
	let url = urlArr.cassiaInfo;
	let parentoAuth = $('#advertiseStartLog ul');
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
	let parentoAuth = $('#advertiseStartLog ul');
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
	let parentoAuth = $('#advertiseStartLog ul');
	mainHandle.linkage(13);
	showLog(parentoAuth, {
		message: `[${new Date()}] ` + 'start advertise on chip 0 error: ' + JSON.stringify(e),
		class: 'fail'
	});
}

// 开启广播
function advertiseStart(adChip, adType, adData, adRespData, adChannelmap, adInterval) {
  console.log('start advertise clicked');

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
	globalData.saved.adChip = adChip;
	globalData.saved.adType = adType;
	globalData.saved.adData = adData;
	globalData.saved.adRespData = adRespData;
	globalData.saved.adChannelmap = adChannelmap;
	globalData.saved.adInterval = adInterval;

	let data = {
		chip: adChip,
		ad_type: adType,
		ad_data: adData,
		resp_data: adRespData,
		channelmap: adChannelmap,
		interval: adInterval
	};

	// 动态更新URL地址和mac参数
	if (data.access_token) updateUrlArr(globalData.saved.acaddress);

	let url = urlArr.advertiseStart;
	if (url.includes(`//advertise`)) { // 说明配置AC/AP MAC, AP IP完整
		let info = globalData.lang === 'cn' ? '请配置远程方式+Router Mac或者本地方式+Router IP' : 'Please configure Remote Control+Router Mac or Local Control+Router IP';
		return layer.msg(info, {icon:5,title:'Advertise',time: 3000});
	} else if (url.includes('/api/') && url.includes('mac=&')) { // 说明使用的AC方式，并且没有配置网关mac地址
		let info = globalData.lang === 'cn' ? '请配置远程方式+Router Mac或者本地方式+Router IP' : 'Please configure Remote Control+Router Mac or Local Control+Router IP';
		return layer.msg(info, {icon:5,title:'Advertise',time: 3000});
	}
	for (let key in data) {
		url += `&${key}=${data[key]}`;
	}
	api.advertiseStart(url, startSuccess, startError);
	showMethod('advertiseStart');
}


// 停止广播
function advertiseStop(adChip) {
	console.log('stop advertise clicked');
	// 用户本地保存
	globalData.saved.adChip = adChip;

	let data = {
		chip: adChip,
	};

	// 动态更新URL地址和mac参数
	if (data.access_token) updateUrlArr(globalData.saved.acaddress);
	let url = urlArr.advertiseStop;
	if (url.includes(`//advertise`)) { // 说明配置AC/AP MAC, AP IP完整
		let info = globalData.lang === 'cn' ? '请配置远程方式+Router Mac或者本地方式+Router IP' : 'Please configure Remote Control+Router Mac or Local Control+Router IP';
		return layer.msg(info, {icon:5,title:'Advertise',time: 3000});
	} else if (url.includes('/api/') && url.includes('mac=&')) { // 说明使用的AC方式，并且没有配置网关mac地址
		let info = globalData.lang === 'cn' ? '请配置远程方式+Router Mac或者本地方式+Router IP' : 'Please configure Remote Control+Router Mac or Local Control+Router IP';
		return layer.msg(info, {icon:5,title:'Advertise',time: 3000});
	}
	for (let key in data) {
		url += `&${key}=${data[key]}`;
	}
	api.advertiseStop(url, stopSuccess, stopError);
	showMethod('advertiseStop');
}

function stopSuccess() {
	console.log('stop advertise ok');
	layer.closeAll();
	let parentoAuth = $('#advertiseStopLog ul');
	mainHandle.linkage(14);
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

function stopError(e) {
	layer.msg('Error', {icon: 2,title:'Advertise',time: 3000});
	let parentoAuth = $('#advertiseStopLog ul');
	mainHandle.linkage(14);
	showLog(parentoAuth, {
		message: `[${new Date()}] ` + 'stop advertise on chip 0 error: ' + JSON.stringify(e),
		class: 'fail'
	});
}

export {
	advertiseStart,
	advertiseStop
}