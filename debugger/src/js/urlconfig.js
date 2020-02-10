import globalData from './globalData'


const $hubIp = $('#hubIp')
const $hubMac = $('#hubMac')
let data = {},
    urlArr = {}


data.hubIp = $hubIp.val().trim()
data.hubMac = $hubMac.val()
data.perMac = '*deviceMac*'
data.handle = '*handle*'
data.writeValue = '*writeValue*'
data.access_token = '';

// TODO: 这里即使配置的云AC，也是通过调用AP的API来使用的，所以要求环境必须为PC与AP在同一内网，否则调试工具是不起作用的
function updateUrlArr(hubIp) {
    urlArr.scan = `http://${hubIp}/gap/nodes/?mac=${data.hubMac}&access_token=${data.access_token}&active=1`
    urlArr.connectDevice = `http://${hubIp}/gap/nodes/${data.perMac}/connection/?mac=${data.hubMac}&access_token=${data.access_token}`
    urlArr.disconnectDevice = `http://${hubIp}/gap/nodes/${data.perMac}/connection?mac=${data.hubMac}&access_token=${data.access_token}`
    urlArr.getConnectedDeviceList = `http://${hubIp}/gap/nodes/?connection_state=connected&mac=${data.hubMac}&access_token=${data.access_token}`
    urlArr.getConnectState = `http://${hubIp}/management/nodes/connection-state?mac=${data.hubMac}&access_token=${data.access_token}`
    urlArr.getAllServices = `http://${hubIp}/gatt/nodes/${data.perMac}/services/characteristics/descriptors?mac=${data.hubMac}&access_token=${data.access_token}`
    urlArr.readByHandle = `http://${hubIp}/gatt/nodes/${data.perMac}/handle/${data.handle}/value/?mac=${data.hubMac}&access_token=${data.access_token}`
    urlArr.notifyMsg = `http://${hubIp}/gatt/nodes/?mac=${data.hubMac}&event=1&access_token=${data.access_token}`
    urlArr.writeByHandle = `http://${hubIp}/gatt/nodes/${data.perMac}/handle/${data.handle}/value/${data.writeValue}/?mac=${data.hubMac}&access_token=${data.access_token}`
    urlArr.reboot = `http://${hubIp}/cassia/reboot/?mac=${data.hubMac}&access_token=${data.access_token}`
    urlArr.pair_input = `http://${hubIp}/management/nodes/${data.perMac}/pair-input?&access_token=${data.access_token}`
    urlArr.unpair=`http://${hubIp}/management/nodes/${data.perMac}/bond?&access_token=${data.access_token}`
    urlArr.pair = `http://${hubIp}/management/nodes/${data.perMac}/pair?&access_token=${data.access_token}`
}
updateUrlArr(data.hubIp)



$hubIp.on('blur', function() {
    data.hubIp = this.value.trim()
    updateUrlArr(data.hubIp)
    globalData.saved.hubIp = data.hubIp
})
$('#hubMac').on('blur', function() {
    data.hubMac = this.value.trim()
    updateUrlArr(data.hubIp)
    globalData.saved.hubMac = data.hubMac
})

export {
    urlArr,
    data,
    updateUrlArr
}