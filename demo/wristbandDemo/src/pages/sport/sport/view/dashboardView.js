import {
    DashBoardItemColl
} from '../models/dashboardmodel'
import {
    dashboardStr,
    dashboardStrVivalink,
    dashboardPosition
} from '../template/dashboardStr'

import {
    dashBoardItemColl
} from '../models/dashboardmodel'

import {
    hubs
} from 'cp'

import HW from '../../../../public-resource/libs/peripherals/HW3300000001'
import _iw from '../../../../public-resource/libs/peripherals/iw'


const DashboardView = Backbone.View.extend({
    model: dashBoardItemColl,
    events: {
        'click .blue a': 'resetStep',
        'click .send': 'send',
        'click .position-details': 'togglePositionDetails'
    },
    send: function (e) {
        const target = e.target,
            // type = target.dataset.type,
            str = $(target).prev().val(),
            node = target.dataset.node;
        let name = target.dataset.name;
        if (name.match("Brace")) {
            console.log("brace");
            _iw.sendMsg(node, hubs, str);
        } else {
            HW.sendMsg(node, hubs, str)
        }
    },
    initialize: function () {
        this.render()
        this.userName = {}
        this.totalStep = {}
        this.cal = {}
        this.heartRate = {}
        this.step = {}
        this.loc = {}
        this.dashBoard = {}
        this.positionInfo = {}
        this.timeFlag = {}
        this.temperature = {}
        this.battery = {}
        // for (let item of this.model.toJSON()) {
        //     this.storeElem(item)
        // }
        setInterval(this.checkTime.bind(this), 1000)
        this.listenTo(this.model, 'add', this.add)
        this.listenTo(this.model, 'change', this.upgrade)
    },
    togglePositionDetails(e) {
        const node = e.target.dataset.node;
        this.dashBoard[node].find('.position-info').animate({ width: 'toggle' }, 'fast')
    },
    checkTime() {
        const defaultLimit = -6;
        const limitVivalink = -60;
        let limit = defaultLimit;
        const modelList = this.model.toJSON()
        for (let item of modelList) {
            const life = hubs.locationData[item.node].life
            if (item.name === "vivalink") {
                limit = limitVivalink
            }
            if (life >= 3) {
                this.dashBoard[item.node].stop(true, false).css('opacity', 1)
            }

            else if (life === limit) {
                this.dashBoard[item.node].stop(true, false).css('opacity', .2)
                this.model.get(item.node).set('loc', '未知')
            }
            if (life !== limit) {
                this.model.get(item.node).set('timeFlag', this.model.get(item.node).get('timeFlag') + 1);
            }
        }
    },
    resetStep: function (e) {
        const node = e.target.dataset.node,
            model = this.model.get(node)
        model.set('baseCircleStep', model.get('totalStep') + model.get('baseStep'))
        model.set('step', 0)
        model.set('cal', '0.00')
        this.upgrade(model)
    },
    add: function (model) {
        const item = model.toJSON()
        if (item.baseName === 'vivalink') {
            this.$el.append(dashboardStrVivalink(item));
        } else {
            this.$el.append(dashboardStr(item));
        }
        this.storeElem(item)

    },
    upgrade: function (model) {
        const item = model.toJSON()
        if (item.baseName === 'vivalink') {
            model.hasChanged('temperature') && this.temperature[item.node].html(item.temperature)
            model.hasChanged('battery') && this.battery[item.node].html(item.battery)

        } else {
            model.hasChanged('toatalStep') && this.totalStep[item.node].html(item.totalStep)
            model.hasChanged('cal') && this.cal[item.node].html(item.cal)
            model.hasChanged('heartRate') && this.heartRate[item.node].html(item.heartRate)
            model.hasChanged('step') && this.step[item.node].html(item.step)
        }
        if (model.hasChanged('timeFlag')) {
            this.timeFlag[item.node].html(item.timeFlag)
        }
        if (model.hasChanged('loc')) {
            model.set('timeFlag', 0, {
                silent: true
            });
            this.loc[item.node].html(item.loc)
            this.positionInfo[item.node].append(dashboardPosition(`离开 ${model.previous('loc')} 进入 `, item.loc))
            this.timeFlag[item.node] = this.positionInfo[item.node].find('li:last-child .position-duration')
            this.timeFlag[item.node].html(model.get('timeFlag'))
        }

    },
    storeElem: function (item) {
        if (item.baseName === 'vivalink') {
            this.temperature[item.node] = this.$el.find(`li[data-node='${item.node}'] .temperature span`)
            this.battery[item.node] = this.$el.find(`li[data-node='${item.node}'] .battery span`)
        } else {
            this.totalStep[item.node] = this.$el.find(`li[data-node='${item.node}'] .totalStep span`)
            this.cal[item.node] = this.$el.find(`li[data-node='${item.node}'] .yellow p span`)
            this.heartRate[item.node] = this.$el.find(`li[data-node='${item.node}'] .red p span`)
            this.step[item.node] = this.$el.find(`li[data-node='${item.node}'] .blue p span`)
            this.loc[item.node] = this.$el.find(`li[data-node='${item.node}'] .loc span`)
        }
        this.positionInfo[item.node] = this.$el.find(`li[data-node='${item.node}'] .position-info>ul`)
        this.timeFlag[item.node] = this.positionInfo[item.node].find('li:last-child .position-duration')
        this.dashBoard[item.node] = this.$el.find(`li[data-node='${item.node}']`)

    },
    render: function () {
        const coll = this.model.toJSON()
        let str = ''
        coll.forEach(function (element) {
            str += dashboardStr(element)
        }, this);
        this.$el.html(str)
    }
})

export {
    DashboardView,
    DashBoardItemColl
}