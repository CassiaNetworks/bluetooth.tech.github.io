import {
    DashBoardItemColl
} from '../models/dashboardmodel'
import {
    dashboardStr
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
        'click .send': 'send'
    },
    send: function (e) {
        const target = e.target,
            // type = target.dataset.type,
            str = $(target).prev().val(),
            node = target.dataset.node;
            let name = target.dataset.name;
            if(name.match("Brace")){
                console.log("brace");
                _iw.sendMsg(node,hubs,str);
            }else{
                HW.sendMsg(node, hubs, str)
            }

            //console.log("ccccccccccccccccccccccccc",target);
        


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


        for (let item of this.model.toJSON()) {
            this.storeElem(item)
        }
        setInterval(this.checkTime.bind(this), 1000)
        this.listenTo(this.model, 'add', this.add)
        this.listenTo(this.model, 'change', this.upgrade)
    },
    checkTime() {
        const modelList = this.model.toJSON()
        for (let item of modelList) {
            const life = hubs.locationData[item.node].life
            switch (life) {
                case 4:
                    {
                        this.dashBoard[item.node].stop(true, false).css('opacity', 1)
                        break;
                    }
                case -60:
                    {
                        this.dashBoard[item.node].stop(true, false).css('opacity', .2)
                        this.model.get(item.node).set('loc','未知')
                        // this.loc[item.node].html('未知')
                        break;
                    }
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
        this.$el.append(dashboardStr(model.toJSON()))
        this.storeElem(item)
    },
    upgrade: function (model) {
        const item = model.toJSON()
        this.totalStep[item.node].html(item.totalStep)
        this.cal[item.node].html(item.cal)
        this.heartRate[item.node].html(item.heartRate)
        this.step[item.node].html(item.step)
        this.loc[item.node].html(item.loc)
        // debugger
    },
    storeElem: function (item) {
        this.totalStep[item.node] = this.$el.find(`li[data-node='${item.node}']> .totalStep span`)
        this.cal[item.node] = this.$el.find(`li[data-node='${item.node}'] .yellow p span`)
        this.heartRate[item.node] = this.$el.find(`li[data-node='${item.node}'] .red p span`)
        this.step[item.node] = this.$el.find(`li[data-node='${item.node}'] .blue p span`)
        this.loc[item.node] = this.$el.find(`li[data-node='${item.node}'] .loc span`)
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
// setTimeout(function () {
//     dashBoardItemColl.add({
//         userName: 'ww',
//         totalStep: '123',
//         cal: '44',
//         heartRate: '67',
//         step: '20',
//         message: 'pp',
//         node: '11:22:33:44:55:66',
//         say: true

//     })
// }, 1000)
// setTimeout(function () {
//     dashBoardItemColl.add({
//         userName: 'ww',
//         totalStep: '123',
//         cal: '44',
//         heartRate: '67',
//         step: '20',
//         message: 'pp',
//         node: '11:22:33:44:55:66'
//     })
// }, 1000)

// setTimeout(function () {
//     dashBoardItemColl.at(0).set({
//         userName: 'ww',
//         totalStep: '0',
//         cal: '0',
//         heartRate: '607',
//         step: '0',
//         message: '0pp',
//         node: '11:22:33:44:55:66'
//     })
//     // add({
//     //         userName: 'ww',
//     //         totalStep: '123',
//     //         cal: '44',
//     //         heartRate: '67',
//     //         node: '1122',
//     //         step: '20',
//     //         message: 'pp'
//     //     })
// }, 2500)

export {
    DashboardView,
    DashBoardItemColl
}