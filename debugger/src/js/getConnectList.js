import {
	api
} from './api'
import {
	showMethod
} from './showmethod.js'
import {
	showLog
} from './showlog'
import {
	data,
	urlArr,
	updateUrlArr
}from './urlconfig'
import globalData from './globalData'

function htmlTemp(mac, name) {
	return `<li data-mac=${mac}>
				<div class="layui-form-item">
					<div class="layui-inline">
						<label class="layui-form-label">mac:</label>
						<div class="layui-input-inline">
							<span class="layui-input">${mac}</span>
						</div>
					</div>
					<div class="layui-inline">
						<label class="layui-form-label">name:</label>
						<div class="layui-input-inline">
							<span class="layui-input">${name}</span>
						</div>
					</div>
				</div>
				<div class="layui-form-item">
					<div class="layui-input-inline">
						<button class="layui-btn" data-mac=${mac} data-action='services' i18n="Seri">Serivices</button>
					</div>
					<div class="layui-input-inline">
						<button class="layui-btn" data-mac=${mac} data-action='pair' i18n="Pair">Pair</button>
					</div>
					<div class="layui-input-inline">
						<button class="layui-btn" data-mac=${mac} data-action='unpair' i18n="Unpair">Unpair</button>
					</div>
					<div class="layui-input-inline">
						<button class="layui-btn" data-mac=${mac} data-action='disconnect' i18n="Disc">Disconnect</button>
					</div>
				</div>
				<div class="layui-input-item tree">
					<ul data-mac=${mac}></ul> 
				</div>
			</li>`
}



function getConnectListAndFill() {
	if (data.access_token) updateUrlArr(globalData.saved.acaddress);
	const parent1 = $('.l3 ul'),
		parent2 = $('#connectLists ul'),
		ajaxResult = api.getConnectList(urlArr.getConnectedDeviceList);

	showMethod('getConnectList')
	ajaxResult.done(function(e) {
		console.log('getConnectList typeof：',typeof e, e);
		let temp = '',
			mac,
			name;
			// debugger
		showLog(parent2, {
			message: JSON.stringify(e)
		});
		let num = 0;
		//console.log("getConnectListAndFill::", e);
		if(!e.nodes.forEach){
			parent1.html(temp);
			$('#connectedNum').html(num);
			return;
		}
		e.nodes.forEach((item, index, arr) => {
			num ++;
			// debugger
			mac = item.id;
			name = item.name;
			temp += htmlTemp(mac, name);
		});
		console.log('getConnectList conncected number:', num);
		
		parent1.html(temp);
		$('#connectedNum').html(num);
		mac = null;
		temp = null;
		name = null;
	});
}



export {
	getConnectListAndFill,
	htmlTemp
}