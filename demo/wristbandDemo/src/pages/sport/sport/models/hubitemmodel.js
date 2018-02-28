const hubConfig = require('configDir/hubConfig.json')
const utils = require('publicDir/libs/utils/utils')
const baseData = {
    method: hubConfig.info.method,
    mac: 'CC:1B:E0:E0:A8:13',
    ip: '192.168.199.133',
    server: hubConfig.info.server,
    developer: hubConfig.info.developer,
    password: hubConfig.info.password,
    verify: false,
    online: false,
    location:''
}
const HubItemModel = Backbone.Model.extend({
    defaults: baseData,
    initialize: function () {
        this.set('cid', this.cid)
        this.set('location', this.cid)
    }
});

const HubItemColle = Backbone.Collection.extend({
    initialize: function () {
        this.add(new HubItemModel)
    },
    test: function (model) {
        if (model.get('verify') === false)
            return
        // 测试hub是否可用
        const option = {
            success: function () {
                this.set('online', true)
                $(`li[data-cid='${this.cid}']`).find('.test i').html('OK')
            },
            error: function (xhr) {
                this.set('online', false)
                $(`li[data-cid='${this.cid}']`).find('.test i').html(xhr[1])
            }
        }
        utils.checkOnline(model, option)
    }
})


exports.baseData = baseData
exports.Model = HubItemModel
exports.Collection = HubItemColle
