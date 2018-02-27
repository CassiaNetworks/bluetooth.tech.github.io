import {
    api
} from './api'
import {
    showLog
} from './showlog'
import globalData from './globalData'
import {
    showMethod
} from './showmethod'
import {
    urlArr
}from './urlconfig'
const scan = {
        start: scanHandle,
        stop
    },
    itemHandle = {},
    $log = $('#scanLog ul')
itemHandle.add = function(data) {
    // debugger
    let _data = {
        mac: data.mesg.bdaddrs[0].bdaddr,
        name: data.mesg.name,
        type: data.mesg.bdaddrs[0].bdaddrType,
        rssi: data.mesg.rssi
    };

    if (data.allItem[_data.mac]) {
        // debugger
        if (_data.name !== "(unknown)")
            data.allItem[_data.mac].name.innerHTML = _data.name
            // data.allItem[_data.mac].type.innerHTML = _data.type
            // 
            // 每一秒更新一次rssi
            // 
        if (data.allItem[_data.mac].lastUpdate !== data.allItem[_data.mac].flag) {
            if (data.allItem[_data.mac].rssi.innerHTML !== _data.rssi) {
                data.allItem[_data.mac].rssi.innerHTML = _data.rssi
                data.allItem[_data.mac].lastUpdate = data.allItem[_data.mac].flag
            }
        }



        data.allItem[_data.mac].rssi.style.color = '#5FB878'
    } else {
        // debugger
        data.allItem[_data.mac] = createItem(_data)
        data.parentNode.appendChild(data.allItem[_data.mac].li)
        data.allItem[_data.mac].rssi.style.color = 'red'
    }
    data.allItem[_data.mac].mesg = data.mesg
    data.allItem[_data.mac].flag = data.flag
    data.allItem[_data.mac].lastUpdate = data.flag


    function createItem(data) {

        let li = document.createElement('li'),
            result = {
                li
            },
            temp,
            divLayuiFormItem,
            count = 0
        for (let i in data) {
            temp = _createItem(i, data[i])
            if (count % 2 === 0) {
                divLayuiFormItem = document.createElement('div')
                divLayuiFormItem.className = "layui-form-item"
            }

            divLayuiFormItem.appendChild(temp.divLayuiInline)
            li.appendChild(divLayuiFormItem)
            result[i] = temp.spanLayuiInput
            count++
        }

        divLayuiFormItem = document.createElement('div')
        divLayuiFormItem.className = "layui-form-item"
        divLayuiFormItem.innerHTML = `<div class="layui-input-inline">
								<button class="layui-btn" data-type=${data.type} data-mac=${data.mac}>connect</button>
							</div>`
        li.appendChild(divLayuiFormItem)

        count = null
        temp = null
        divLayuiFormItem = null

        return result


        function _createItem(name, value) {

            let divLayuiInline = document.createElement('div'),
                labelLyauiFomrLabel = document.createElement('label'),
                divlayuiInputInline = document.createElement('div'),
                spanLayuiInput = document.createElement('span')


            divLayuiInline.className = "layui-inline"
            labelLyauiFomrLabel.className = "layui-form-label"
            divlayuiInputInline.className = "layui-input-inline"
            spanLayuiInput.className = "layui-input"

            labelLyauiFomrLabel.innerHTML = `${name}:`
            spanLayuiInput.innerHTML = value


            divlayuiInputInline.appendChild(spanLayuiInput)
            divLayuiInline.appendChild(labelLyauiFomrLabel)
            divLayuiInline.appendChild(divlayuiInputInline)

            // debugger
            return {
                divLayuiInline,
                labelLyauiFomrLabel,
                spanLayuiInput
            }
        }
    }

}
itemHandle.destroy = function(data) {
    data.el.removeChild(data.allItem[data.mac].li)
    delete data.allItem[data.mac]
}

function scanHandle(data, timeout) {
    if (globalData.neverSave.scanSSE.es !== '')
        return
    globalData.neverSave.scanSSE.status = 'toOpen'
    let _allItem = {},
        parentNode = document.querySelector('.l2 ul.bb1'),
        url = urlArr.scan
    parentNode.innerHTML = ''
    globalData.neverSave.scanSSE.timer = null
    globalData.neverSave.scanSSE.es = null
    api.start(url, data, globalData.neverSave.scanSSE, cb.bind(null, timeout))
    showMethod('scan')

    globalData.neverSave.scanSSE.timer = setInterval(function() {
        checkDeviceTimeout(_allItem)
    }, 1000)

    function checkDeviceTimeout(obj) {
        if (globalData.neverSave.scanSSE.status === 'toClosed') {
            return
        }
        // console.log('old', obj)
        for (var index in obj) {
            if (obj[index].flag > 0) {
                obj[index].flag--
                    // console.log(obj[index])
            } else {
                // debugger
                // !!!!!!!!!!console.log('delete', index)
                itemHandle.destroy({
                        el: parentNode,
                        mac: index,
                        allItem: _allItem
                    })
                    // !!!!!console.log('new', obj)
            }
        }
    }

    function cb(timeout, item) {
        // debugger
        // mac = temp.bdaddrs[0].bdaddr
        // showLog($log, {
        //     message: item
        // })
        // 
        // globalData.neverSave.length++
        // $('#scanLog ul li').eq(globalData.neverSave.length%5)
        // .html(item)
        itemHandle.add({
            parentNode: parentNode,
            mesg: JSON.parse(item),
            allItem: _allItem,
            flag: timeout

        })
    }
}

function stop() {
    // debugger
    globalData.neverSave.scanSSE.status = 'toClosed'
    globalData.neverSave.scanSSE.es && globalData.neverSave.scanSSE.es.close()
    clearInterval(globalData.neverSave.scanSSE.timer)
    globalData.neverSave.scanSSE.es = ''
}


export default scan