import {
	api
} from './api'
import {
	urlArr
} from './urlconfig'
import pair_input from './pair-input'
import {
	showMethod
} from './showmethod'
import {
	showLog
} from './showlog'
let temp = `<form class="layui-form  getpair-tip tip" action="#">
	<div class="layui-form-item">
	  <label class="layui-form-label">getpair a device：GET</label>
	</div>
	<fieldset class="layui-elem-field layui-field-title">
	  <legend  i18n='arguments'>参数</legend>
	</fieldset>
	
	<div class="layui-form-item">
	  <label class="layui-form-label">pair code:</label>
	  <div class="layui-input-inline">
		<input type="text" name="pair code"  placeholder="CC:1B:E0:E0:10:C1" value="" lay-verify='deviceMac'  class="layui-input">
	  </div>
	  <div class="layui-form-mid layui-word-aux" i18n = 'required'>(必填)</div>
	</div>
	
	
	<fieldset class="layui-elem-field layui-field-title">
	  <legend i18n = 'description'>描述</legend>
	</fieldset>
	<div class="layui-form-item layui-form-text">
	  <div class="descriptors getpair-des">
		<p i18n="getpair-Tip-p1"><b>chip：</b>蓝牙路由器共有两个芯片，芯片0和芯片1，在调用接口时可以通过添加queryString来选择芯片(?chip=0或者?chip=1)，每个芯片的连接上限是11个设备，如果不填此参数，蓝牙路由器会根据连接数量自动匹配芯片。</p>
		<p i18n="getpair-Tip-p2"><b>deviceMac：</b>要连接的设备的MAC地址。</p>
		<p i18n="getpair-Tip-p3"><b>type：</b>此参数在body中，是必填项。蓝牙设备的MAC地址分为random和public两种，所以在连接设备时，需要指出设备的广播type，广播type可以从扫描数据中获取。</p>
	  </div>
	</div>
	<div class="layui-form-item">
	  <div class="layui-input-block">
		<button class="layui-btn" lay-submit lay-filter="getpair">do</button>
	  </div>
	</div>
  </form>`

function gopair(deviceMac, etarget) {

	const url = urlArr.pair.replace("*deviceMac*", deviceMac),
		parent = $('#pairLog ul')
	let ajaxResult = api.pair(url)
	showMethod('pair')
	ajaxResult.done(function (e) {
		// debugger
		if (e.pairingStatus === "Passkey Input Expected") {
			$('.pairCode').show()
			$('.sub').unbind('click').bind('click',function () {
				var x = $('.Code').val()
				$('.pairCode').hide()
				pair_input(deviceMac, x)
			})
			$('.close').unbind('click').bind('click',function(){
				$('.pairCode').hide()

			})
			showLog(parent, {
				before: `mac:&nbsp;&nbsp;${deviceMac} pair`,
				message: JSON.stringify(e, null, 2),
				class: 'success'
			})
			$(`.l3 ul li[data-mac='${deviceMac}']`).slideUp('normal', function () {
				this.remove()
			});
		}
		if (e.pairingStatus === 'Pairing Successful') {
			alert('已经配对')
		}
	}).fail(function (e) {
		console.log(e)
	})

}



export default gopair