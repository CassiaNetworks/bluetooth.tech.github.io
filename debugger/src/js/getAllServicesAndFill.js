import {
	api
} from './api'
import {
	readByHandleAndFill
} from './readByHandleAndFill.js'
import {
	writeByHandleAndFill
} from './writeByHandleAndFill.js'
import {
	showMethod
} from './showmethod'
import {
	showLog
} from './showlog'
import {
	gattServices
} from './gattServices'
import {
	gattCharacteristics
} from './gattCharacteristics'
import {
    urlArr  
}from './urlconfig'
import formatServicesData from './formatServicesData'
import * as mainHandle from './mainHandle'

const hasGetServices = {}
console.log("***********",mainHandle)

// hasGetServices[deviceMac] = 0  '未获取'
// hasGetServices[deviceMac] = 1  '正在获取'
// hasGetServices[deviceMac] = 3  '获取失败'
// hasGetServices[deviceMac] = {}  '获取成功'

function convertGattInfoByUUID(devicesServicesTree) {
	devicesServicesTree.forEach(function(deviceServiceTree) {
		deviceServiceTree.children.forEach(function(service) {
			let id = parseInt(service.uuid.split('-')[0], 16).toString(16).toUpperCase();
			if (gattServices[id]) { // 标准定义的显示易读，并增加uuid字段显示
				service.name = gattServices[id];
				service.children.unshift({name: `uuid:${service.uuid}`}); 
			}
			service.name = gattServices[id] || service.name;
			service.children.forEach(function(serviceChild) {
				if (serviceChild.name === 'characteristics') { // 处理characteristics
					serviceChild.children.forEach(function(charChild) {
						let id = parseInt(charChild.uuid.split('-')[0], 16).toString(16).toUpperCase();
						if (gattCharacteristics[id]) { // 标准定义的显示易读，并增加uuid字段显示
							charChild.name = gattCharacteristics[id] || charChild.name;
							charChild.children.unshift({name: `uuid:${charChild.uuid}`}); // char增加显示uuid字段
						}
					});
				}
			})
		})
	});
}

function getAllServicesAndFill(deviceMac) {
	layui.use(['tree', 'form', 'layer'], function() {
		const form = layui.form(),
			layer = layui.layer,
			$parent = $('.box .l3').find(`ul.bb1>li div.tree > ul[data-mac='${deviceMac}']`),
			url = urlArr.getAllServices.replace("*deviceMac*", deviceMac)

		if (hasGetServices[deviceMac] === 1)
			return
		if (typeof hasGetServices[deviceMac] === 'object') {
			if ($parent.children().length !== 0)
				return
			else {
				layui.tree({
					elem: $parent,
					nodes: hasGetServices[deviceMac]
				})
				setTimeout(function() {
					form.render()
				}, 500)
			}
			return
		}
		hasGetServices[deviceMac] = 0
		const ajaxResult = api.getAllServices(url),
			$parent2 = $('#getAllServices ul');
			console.log("getAllServices::",ajaxResult);
		showMethod('getAllServices');
		(function(deviceMac, form, layer, $parent, url, ajaxResult, $parent2) {

			ajaxResult.done(function(e) {
				console.log('getAllServicesAndFill.js  ajaxResult done',$.extend(true, {}, e))
				showLog($parent2, {
					message: JSON.stringify(e, null, 2),
					class: 'success'
				})
				hasGetServices[deviceMac] = formatServicesData(e, deviceMac);
				console.log('getAllServicesAndFill.js',hasGetServices[deviceMac]);
				convertGattInfoByUUID(hasGetServices[deviceMac]);
				layui.tree({
					elem: $parent,
					nodes: hasGetServices[deviceMac]
				})
				clearTimeout($parent.timer)
				$parent.timer = setTimeout(function() {
					const $ul = $(`.l3 ul[data-mac='${deviceMac}']`)
					
					form.render()

					$ul.find('button.js-try').click(function(e) {
						const handle = e.target.dataset.handle;
						const deviceMac = e.target.dataset.devicemac;
						if (e.target.dataset.action === 'read') {
							mainHandle.linkage(12)
							readByHandleAndFill(e.target, {deviceMac, handle})
						} else {
							let writeValue
							mainHandle.linkage(6)
							if ($ul.find(`input.js${handle}`).length === 2 && e.target.dataset.action === 'writeWithoutRes') {
								writeValue = $ul.find(`input.js${handle}`).eq(0).val().trim()
							} else if ($ul.find(`input.js${handle}`).length === 2 && e.target.dataset.action === 'writeWithRes') {
								mainHandle.linkage(6)
								writeValue = $ul.find(`input.js${handle}`).eq(1).val().trim()
							} else {
								writeValue = $ul.find(`input.js${handle}`).eq(0).val().trim()
							}
							writeByHandleAndFill(e.target, {deviceMac, writeValue, handle})
						}
					})

					form.on('switch(notify)', function(e) {
						// debugger
						const handle = e.elem.dataset.handle,
							writeValue = e.elem.checked ? '0100' : '0000',
							deviceMac = e.elem.dataset.devicemac

						writeByHandleAndFill(e.elem, {
							deviceMac,
							writeValue,
							handle
						})

					})
					form.on('switch(indicate)', function(e) {
						const handle = e.elem.dataset.handle,
							writeValue = e.elem.checked ? '0200' : '0000',
							deviceMac = e.elem.dataset.devicemac
						writeByHandleAndFill(e.elem, {
							deviceMac,
							writeValue,
							handle
						})
					})
				}, 500)


			}).fail(function(e) {
				console.log("getAllServicesAndFill.js  fail :: ", e);
				// debugger
				if (e.responseText === 'DISCOVER WRONG')
					layer.open({
						title: '获取设备服务错误',
						content: deviceMac + '未连接!',
						icon: 2
					});
				hasGetServices[deviceMac] = 3
				showLog($parent2, {
					message: JSON.stringify(e, null, 2),
					class: 'fail'
				})
			})
		}(deviceMac, form, layer, $parent, url, ajaxResult, $parent2))
	})
}



export {
	getAllServicesAndFill

}