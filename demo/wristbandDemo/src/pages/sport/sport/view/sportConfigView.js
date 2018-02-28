let hubConfigItemStr = require('../template/hubConfigItemStr')
let peripheralsConfigItemStr = require('../template/peripheralsConfigItemStr')
const hubItem = require('../models/hubitemmodel')
const perItem = require('../models/peripheralitemmodel')
const utils = require('utils/utils')
import appModel from '../page'
import {
    allHubs,
    hubs,
    peripherals
} from 'cp'
const hubItemCollection = new hubItem.Collection
const perItemCollection = new perItem.Collection
const form = layui.form()
let HubItemView = Backbone.View.extend({
    model: function () {
        if (this.attributes.view === 'hub') {
            return hubItemCollection
        } else {
            return perItemCollection
        }
    },
    // model:new hubItem.Collection,
    events: {
        'click .addhub': 'addhub',
        'click .delete button': 'delete',
        'click .finsh': 'finsh',
        'click .reset': 'reset'
    },
    initialize: function () {
        //判断传选择的视图  hub配置或者peripheral配置
        if (this.attributes.view === 'hub') {
            this.attributes._model = hubItem.Model;
            this.attributes.select = 'ul.config-tip-hub li.addhub';
            this.attributes['template'] = _.template(hubConfigItemStr.liItem);
            this.attributes['footer'] = hubConfigItemStr.footer;

            this.listenTo(this.model(), 'change', function () {

            });
            //根据radio的值修改验证规则
            form.on(`radio`, function (data) {

                if (data.elem.dataset.nochange === '1') {
                    return
                }
                const cid = $(this).attr('name'),
                    parent = $(`li[data-cid='${cid}']`)
                let select = '',
                    verifyNameArr = ''
                const verifys = {
                    "local": ['ip', 'location', 'mac'],
                    "remote": ['mac', 'server', 'developer', 'password', 'location']
                }


                let verifyElem = parent.find('*[lay-verify]')
                verifyElem.removeAttr('lay-verify').addClass('layui-bg-gray layui-disabled')
                if (data.value === '0') {
                    verifyNameArr = verifys.local
                } else {
                    verifyNameArr = verifys.remote
                }
                verifyNameArr.forEach(function (item) {
                    if (select === '') {
                        select = `[name='${item}']`
                    } else {
                        select += `,[name='${item}']`
                    }
                })
                parent.find(select).each(function () {
                    $(this).attr('lay-verify', $(this).attr('name')).removeClass('layui-bg-gray layui-disabled')
                })

            });

            //表单验证规则
            form.verify({
                location: function (value) {
                    const _value = $.trim(value)
                    if (_value === '') {
                        return 'Location不能为空'
                    }
                },
                perMac: function (value) {
                    const _value = $.trim(value)
                    if (_value && !utils.Reg.mac.test(_value)) {
                        return 'Mac输入错误'
                    }
                },
                mac: function (value) {
                    const _value = $.trim(value)
                    if (_value === '') {
                        return 'Mac不能为空'
                    }
                    if (/\：/.test(_value)) {
                        return '请使用英文符号'
                    }
                    if (!utils.Reg.mac.test(_value)) {
                        return 'Mac输入错误'
                    }

                },
                ip: function (value) {
                    const _value = $.trim(value)
                    if (_value === '') {
                        return 'HubIp不能为空'
                    }
                    if (utils.Reg.server.test(_value)) {
                        return '请使用英文符号'
                    }
                    if (!utils.Reg.ip.test(_value)) {
                        return 'HubIp输入错误'
                    }

                },
                server: function (value) {
                    const _value = $.trim(value)
                    if (_value === '') {
                        return 'Server不能为空'
                    }
                    if (utils.Reg.server.test(_value)) {
                        return '请使用英文符号'
                    }
                },
                developer: function (value) {
                    const _value = $.trim(value)
                    if (_value === '') {
                        return 'Developer不能为空'
                    }
                    if (!utils.Reg.developer.test(_value)) {
                        return 'Develop只能是字母数字下划线，且不能以数字开头'
                    }
                },
                password: function (value) {
                    const _value = $.trim(value)
                    if (_value === '') {
                        return 'Password不能为空'
                    }
                }
            });
            //点击hubtest时绑定事件
            form.on('submit(testHub)', function (e) {
                const data = utils.trimeClone(e.field),
                    cid = e.elem.dataset.cid,
                    submodel = this.model().get(cid)

                submodel.set(data)
                submodel.set('method', data[cid])
                submodel.set('verify', true)
                submodel.set('online', false)
                console.log('hub配置信息', submodel.attributes)
                this.model().test(submodel)

                return false;
            }.bind(this));


        } else {
            this.attributes['footer'] = peripheralsConfigItemStr.footer
            this.attributes['template'] = peripheralsConfigItemStr.liItem
            this.attributes._model = perItem.Model
            this.attributes.select = 'ul.config-tip-peripheral li.addhub'

            /**
             *点击手环test时绑定事件
             */
            form.on('submit(testPer)', function (e) {
                const data = utils.trimeClone(e.field),
                    cid = e.elem.dataset.cid,
                    submodel = this.model().get(cid)
                for (let key in data) {
                    submodel.set(key, data[key])
                }
                const position = data[cid] === '0' ? 0 : 1
                submodel.set('verify', true)
                submodel.set('location', position)
                return false;
            }.bind(this));
        }
        this.render()
    },
    autoVerify: function (e) {
        const cid = $(e.target).parents('.hub-item').data('cid')

        debugger
        if (this.model().get(cid).get('verify')) {
            this.model().get(cid).set('verify', false)
            this.model().get(cid).set('online', false)
        }
    },
    addhub: function (e) {
        const length = this.model().length
        if ($(e.target).attr('alt') === 'add' && length) {
            const models = this.model().models
            let cid, $prevTest
            cid = models[length - 1].cid
            $prevTest = $(`.test button[data-cid='${cid}']`)
            $prevTest.trigger('click')
            if (!models[length - 1].get('verify'))
                return
        }

        const newModel = new this.attributes._model,
            lang = appModel.get(appModel.get('lang'))
        this.model().push(newModel)
        let keys = _.defaults(newModel.toJSON(), lang)
        $(this.attributes.select).before(this.attributes.template(keys))
        form.render()
        const $radio = $('.config-tip-hub.config-tip .layui-unselect.layui-form-radio.layui-form-radioed>i')
        $radio.trigger('click')
    },
    delete: function (e) {
        const cid = e.target.dataset.cid,
            parent = $(`li[data-cid='${cid}']`)
        this.model().remove(this.model().get(cid))
        parent.remove()
    },
    finsh: function (e) {
        const collection = this.model()
        if ($(e.target).hasClass('per')) {
            $(`button[lay-filter='testPer']`).trigger('click')
            const verify = collection.pluck('verify')
            if (verify.indexOf(false) === -1) {
                peripherals.length = 0
                let devices = []
                let emptyMacDevices = []
                let emptyMacName = [],
                    temp, repeat = false

                if (collection.toJSON().length === 0) {
                    layui.layer.msg('请添加手环！！', {
                        icon: 2,
                        time: 1000
                    });
                    return
                }

                collection.toJSON().forEach(item => {
                    temp = _.pick(item, 'name', 'node', 'location', 'cid')
                    if (_.findWhere(devices, {
                            name: item.name
                        })) {
                        repeat = 'name'
                        return
                    }
                    devices.push(temp)
                    if (item.mac === '') {
                        emptyMacDevices.push(temp)
                        emptyMacName.push(item.name)
                    }
                })

                if (repeat === 'name') {
                    layui.layer.msg('手环型号不能重复！！', {
                        icon: 2,
                        time: 1000
                    });
                    return
                }


                Array.prototype.push.apply(peripherals, emptyMacDevices)
                for (let item of devices) {
                    if (emptyMacName.indexOf(item.name) === -1) {
                        peripherals.push(item)
                        this.model().get(item.cid).set(item)
                    }
                }
                allHubs.peripheralsVer = true
                if (allHubs.peripheralsVer && allHubs.hubVer) {
                    layui.layer.closeAll()

                } else {
                    layui.layer.msg('手环验证成功，请填写hub信息', {
                        icon: 1,
                        time: 1000
                    });
                }
            }
            console.log(peripherals)
            return
        }
        $('.config-tip-hub .test button').trigger('click')

        clearInterval(hubs.timer)
        hubs.timer = setInterval(function () {
            const verify = collection.pluck('verify')
            const online = collection.pluck('online'),
                allHub = collection.toJSON()

            //所有hub通过在线
            if (verify.indexOf(false) === -1 && online.indexOf(false) === -1) {
                clearInterval(hubs.timer)
                allHubs.length = 0
                let repeat = false
                if (allHub.length === 0) {
                    layui.layer.msg('请添加hub！！', {
                        icon: 2,
                        time: 1000
                    })
                    return
                }
                for (let item of allHub) {
                    if (_.findWhere(allHubs, {
                            mac: item.mac
                        })) {
                        repeat = 'mac'
                        break
                    }
                    if (_.findWhere(allHubs, {
                            method: '0',
                            ip: item.ip
                        })) {
                        repeat = 'ip'
                        break
                    }
                    allHubs.push(item)
                    this.model().get(item.cid).set(item)
                }
                allHubs.hubVer = true
                if (repeat === 'mac') {
                    layui.layer.msg('重复添加hub！！', {
                        icon: 2,
                        time: 1000
                    })
                    return
                }
                if (repeat === 'ip') {
                    layui.layer.msg('hub IP 重复！！', {
                        icon: 2,
                        time: 1000
                    })
                    return
                }
                if (allHubs.peripheralsVer && allHubs.hubVer) {
                    layui.layer.closeAll()
                } else {
                    layui.layer.msg('hub验证成功，请填写手环信息', {
                        icon: 1,
                        time: 1000
                    });
                }
                console.log(allHubs)
            }
        }.bind(this), 200)
    },
    reset: function () {
        // debugger
    },
    render: function () {

        let str = ''
        const lang = appModel.get(appModel.get('lang'))
        const self = this
        this.model().models.forEach(function (item) {
            str += self.attributes.template(_.defaults({}, item.toJSON(), lang))
        })
        str += self.attributes.footer
        this.$el.html(str)
        form.render()
        // const $icon = this.$el.find('.layui-anim.layui-icon')
        const $radio = $('.config-tip-hub.config-tip .layui-unselect.layui-form-radio.layui-form-radioed>i')
        // $icon.removeClass('layui-anim')
        $radio.trigger('click')
        // $icon.addClass('layui-anim layui-anim-scaleSpring')







    }
});

module.exports = HubItemView
export default {
    hubItemCollection,
    perItemCollection
}