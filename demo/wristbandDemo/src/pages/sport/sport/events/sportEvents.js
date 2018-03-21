// const finshedConfig = require('/')
// const startWork = require('/')
const utils = require('publicDir/libs/utils/utils')
let sportEventProxy = {}
_.extend(sportEventProxy, Backbone.Events)

// sportEventProxy.on('finshedConfig', finshedConfig)
// sportEventProxy.on('startWork', startWork)
sportEventProxy.on('changeLang', utils.changeLang)
layui.use(['layer'], function () {
    const layer = layui.layer
    sportEventProxy.on('config', layer.tab)
})
module.exports = sportEventProxy