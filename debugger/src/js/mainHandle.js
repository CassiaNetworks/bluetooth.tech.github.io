import connectDevice from './connectDevice'
import disConnectDeviceAndFill from './disConnectDeviceAndFill'
import {
    getConnectListAndFiil
} from './getConnectList'

import {
    getAllServicesAndFill
} from './getAllServicesAndFill'
import notifyMsg from './notifyMsgAndFill'
import notifyStateAndFill from './notifyStateAndFill'
import {
    connectTips
} from './connectTip'


import scanTip from './scanTip'
import connectListTip from './connectListTip'
import getAllServicesTip from './getAllServicesTip'
import notifyMsgTip from './notifyMsgTip'
import notifyStateTip from './notifyStateTip'
import disconnectTip from './disconnectTip'
import writeByHnadleTip from './writeByHandleTip.js'
import globalData from './globalData'
import i18n from './i18n'

/**
 * { 左侧八个按钮动作  }
 */


const $l1 = $('.box .l1'),
    $l3 = $('.box .l3')

function mainHandle(layer, form) {
    $l1.on('click', function(e) {
        let targetId = e.target.id;
        switch (targetId) {
            case 'bscan':
                {   
                    scanTip(layer, form, e.target) 

                    break
                }
            case 'bConnect':
                {
                    connectTips(layer, form, e.target)
                    break
                }

            case 'bconnectList':
                {
                    e.target.fn = getConnectListAndFiil
                    connectListTip(layer, form, e.target)

                    break
                }
            case 'bdiscoverSer':
                {

                    e.target.fn = getAllServicesAndFill
                    getAllServicesTip(layer, form, e.target)
                    break
                }
            case 'bnotify':
                {
                    e.target.start = notifyMsg.start
                    e.target.stop = notifyMsg.stop
                    notifyMsgTip(layer, form, e.target)
                    break
                }
            case 'bnotifyState':
                {
                    e.target.start = notifyStateAndFill.start
                    e.target.stop = notifyStateAndFill.stop
                    notifyStateTip(layer, form, e.target)
                    break
                }
            case 'bwrite':
                {
                    writeByHnadleTip(layer, form, e.target)
                    break
                }
            case 'bdisconnect':
                {
                    e.target.fn = disConnectDeviceAndFill
                    disconnectTip(layer, form, e.target)
                    break
                }
        }
        i18n(globalData.lang)
       form.render(); 
    })
}


function connectButton() {
    $('.box .l2').on('click', '.layui-btn', function() {
        const deviceMac = this.dataset.mac,
            type = this.dataset.type
        connectDevice(null, type, deviceMac)
    })
}

function disConnectDevice() {
    $l3.on('click', "[data-action='disconnect']", function() {
        let deviceMac = this.dataset.mac
        disConnectDeviceAndFill(deviceMac)
    })
}

function getAllServices() {

    $l3.on('click', "button[data-action='services']", function() {
        // debugger
        let deviceMac = this.dataset.mac
        getAllServicesAndFill(deviceMac)

    })
}



/**
 * 获取已连接设备列表
 */
function getConnectLists() {
    $l3.on('click', '.connectList', function() {
        getConnectListAndFiil()
    })
}



export {
    mainHandle,
    connectButton,
    getConnectLists,
    disConnectDevice,
    getAllServices
}