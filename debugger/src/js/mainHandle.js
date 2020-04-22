import connectDevice from './connectDevice'
import disConnectDeviceAndFill from './disConnectDeviceAndFill'
import unpairDeviceAndFill from './unpairDeviceAndFill'
import pairDeviceAndFill from './pairDeviceAndFill'
import pair from './pair'
import unpair from './unpair'
import {
    getConnectListAndFill
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
import {
    pairTips
} from './pairTip'
import unpairTips from './unpairTip'
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
    $l1.on('click', function (e) {
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
                    e.target.fn = getConnectListAndFill
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
            case 'bpair':
                {
                    e.target.fn = pairDeviceAndFill
                    pairTips(layer, form, e.target)
                    break
                }
            case 'bpairInput':
                {
                    // e.target.fn = pairDeviceAndFill
                    $('.firstPair').show()
                    $('.yes').unbind('click').bind('click', function () {
                        $('.firstPair').hide()
                    })
                    break
                }
            case 'bunpair':
                {
                    e.target.fn = unpairDeviceAndFill
                    console.log(e.target)
                    unpairTips(layer, form, e.target)
                    break
                }
        }
        i18n(globalData.lang)
        form.render();
    })
}
function linkage(id){
    $('.log .layui-tab-title li').eq(id).addClass('layui-this').siblings().removeClass('layui-this')
    $('.layui-tab-card .layui-tab-content>div').eq(id).addClass('layui-show').siblings().removeClass('layui-show')
}

function connectButton() {
    $('.box .l2').on('click', "[data-action='connect']", function () {
        linkage(1)
        const deviceMac = this.dataset.mac,
            type = this.dataset.type
        connectDevice(null, type, deviceMac)
    })
}
function cancelpair() {
    $('body').on('click', "[data-action='unpair']", function () {
        // debugger
        linkage(11)
        let deviceMac = this.dataset.mac
        unpair(deviceMac)
    })
}
function disConnectDevice() {
    $l3.on('click', "[data-action='disconnect']", function () {
        linkage(7)
        let deviceMac = this.dataset.mac
        disConnectDeviceAndFill(deviceMac)
    })
}

function getAllServices() {
    $l3.on('click', "button[data-action='services']", function () {
        // debugger
        linkage(3)
        let deviceMac = this.dataset.mac
        getAllServicesAndFill(deviceMac)

    })
}
function gopair() {
    $l3.on('click', "[data-action='pair']", function (e) {
        // debugger
        linkage(9)
        let deviceMac = this.dataset.mac
        pair(deviceMac, e.target)
    })
}


/**
 * 获取已连接设备列表
 */
function getConnectLists() {
    $l3.on('click', '.connectList', function () {
        linkage(2)
        getConnectListAndFill()
    })
}



export {
    mainHandle,
    connectButton,
    getConnectLists,
    disConnectDevice,
    getAllServices,
    gopair,
    cancelpair,
    linkage
}