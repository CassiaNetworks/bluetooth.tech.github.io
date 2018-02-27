import globalData from './globalData'


const $hubIp = $('#hubIp')
const $hubMac = $('hubMac')
let data = {},
    urlArr = {}


data.hubIp = $hubIp.val().trim()
data.hubMac = $hubMac.val()
data.perMac = '*deviceMac*'
data.handle = '*handle*'
data.writeValue = '*writeValue*'
data.access_token = '';

function updateUrlArr(hubIp) {
    urlArr.scan = `http://${hubIp}/gap/nodes/?mac=${data.hubMac}&access_token=${data.access_token}&active=1`
    urlArr.connectDevice = `http://${hubIp}/gap/nodes/${data.perMac}/connection/?mac=${data.hubMac}&access_token=${data.access_token}`
    urlArr.disconnectDevice = `http://${hubIp}/gap/nodes/${data.perMac}/connection?mac=${data.hubMac}&access_token=${data.access_token}`
    urlArr.getConnectedDeviceList = `http://${hubIp}/gap/nodes/?connection_state=connected&mac=${data.hubMac}&access_token=${data.access_token}`
    urlArr.getConnectState = `http://${hubIp}/management/nodes/connection-state?mac=${data.hubMac}&access_token=${data.access_token}`
    urlArr.getAllServices = `http://${hubIp}/gatt/nodes/${data.perMac}/services/characteristics/descriptors?mac=${data.hubMac}&access_token=${data.access_token}`
    urlArr.readByHandle = `http://${hubIp}/gatt/nodes/${data.perMac}/?mac=${data.hubMac}&access_token=${data.access_token}`
    urlArr.notifyMsg = `http://${hubIp}/gatt/nodes/?mac=${data.hubMac}&event=1&access_token=${data.access_token}`
    urlArr.writeByHandle = `http://${hubIp}/gatt/nodes/${data.perMac}/handle/${data.handle}/value/${data.writeValue}/?mac=${data.hubMac}&access_token=${data.access_token}`
    urlArr.reboot = `http://${hubIp}/cassia/reboot/?mac=${data.hubMac}&access_token=${data.access_token}`
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
    globalData.saved.hubMac = this.value.trim()
})

export {
    urlArr,
    data,
    updateUrlArr
}