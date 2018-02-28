require('configModule')
require('./index.css')
const lang = require('configDir/lang.json')
const sportBodyViewStr = require('./template/sportBodyViewStr')
const sportEventProxy = require('./events/sportEvents')
const utils = require('publicDir/libs/utils/utils')
const SportConfigView = require('./view/sportConfigView')
const hubStr = require('./template/hubConfigItemStr')
const perpheralStr = require('./template/peripheralsConfigItemStr')
import {
	DashboardView
} from './view/dashboardView'
import {
	startWork
} from 'cp'



const SportBodyModel = Backbone.Model.extend({
	defaults: lang.sport,
	initialize: function () {
		this.on('change:lang', function (model, newValue) {
			sportEventProxy.trigger('changeLang', this.get(newValue))
		})
	}
})
const sportBodyModel = new SportBodyModel({
	'lang': utils.getLang()
})
//定义hub配置页面中hub的视图
let hubItemView, perpheralItemView
const SportBodyView = Backbone.View.extend({
	model: sportBodyModel,
	events: {
		"click #startWork": "startWork",
		"click #config": "propConfig"
	},
	propConfig: function () {
		sportEventProxy.trigger('config', {
			closeBtn: 1,
			area: ['700px', '500px'],
			tab: [{
				title: "蓝牙路由器配置",
				content: hubStr.ul
			}, {
				title: '手环配置',
				content: perpheralStr.ul
			}],
			shade: 0.6 //遮罩透明度
				,
			maxmin: true //允许全屏最小化
				,
			anim: 5 //0-6的动画形式，-1不开启
				,
			//弹窗成功后的回调
			success: function () {
				hubItemView = new SportConfigView({
					el: $('.config-tip-hub'),
					attributes: {
						'view': 'hub'
					}
				})
				perpheralItemView = new SportConfigView({
					el: $('.config-tip-peripheral'),
					attributes: {
						'view': 'perpheral'
					}
				})
			},
			//右上角取消回调
			cancel: function () {
				//销毁hub配置页面中hub的视图
				hubItemView.remove()
				perpheralItemView.remove()
			}
		})
	},
	startWork: function () {
		startWork()
	},
	initialize: function () {
		this.render()
	},
	changeLang: function (key) {
		const _key = key === 'en' ? 'en' : 'cn'
		this.model.set('lang', _key)
	},
	template: _.template(sportBodyViewStr),
	render: function () {
		this.$el.html(this.template(this.model.get(this.model.get('lang'))));
		return this
	}
})

var sportView = new SportBodyView({
	el: $('#root')
})

new DashboardView({
	el: '#root .show-pannel ul'
})

export default sportBodyModel
module.exports = sportView


// setTimeout(function () {
// 	sportView.changeLang('en')
// 	$('#config').trigger('click')
// }, 500)