import globalData from './globalData'
import tip from './tips'
function htmlString() {
	console.log(globalData.neverSave.notifySSE.status)
	let temp = `<form class="layui-form  notifyMsg-tip tip" action="#">
  <div class="layui-form-item">
    <label class="layui-form-label">Receive indication &amp; notification：GET/SSE</label>
  </div>
  <fieldset class="layui-elem-field layui-field-title">
    <legend i18n ='hubNotifyStatus'>Hub通知状态</legend>
  </fieldset>
  <div class="layui-form-item">
    <div class="layui-inline">
		<label class="layui-form-label" style="width:auto" i18n='openHubNotify'>打开Hub通知</label>
		<input type="checkbox" lay-skin="switch" lay-filter="switchNotifyMsg1" title="打开通知" ${globalData.neverSave.notifySSE.status.indexOf('pen')!== -1 ? 'checked' :''}>
	</div>
  </div>
  <fieldset class="layui-elem-field layui-field-title">
    <legend i18n='description'>描述</legend>
  </fieldset>
  <div class="layui-form-item layui-form-text">
    <div class="descriptors connect-des">
      <p><b>接口URL：</b>调用接口后，此URL会自动生成在下面的”API接口”的窗口中。</p>
      <p><b>接口描述：</b>此接口是sse长链接，当打开蓝牙设备的notification/indication后，蓝牙设备会将消息上报到蓝牙路由器，但是如果在pc上希望接收到此消息，还需要调用此接口来建立蓝牙路由器到pc端的数据通路，这样蓝牙路由器才会将收到的蓝牙设备的数据转发到pc端。</p>
      <p><b>SSE：</b>server-sent events，简称：see。是一种http的长链接，请求需要手动关闭，否则理论上在不报错的情况下会一直进行，每条数据会以“data: ” 开头。在调试中可以直接将sse的url输入在浏览器中进行调用。但是在编程中使用一般的http请求无法请求到数据(一般的http请求都是在请求结束后返回所有的数据)，我们目前提供了iOS/java/nodejs/js/c#等的demo来实现sse的调用，如果在这方面遇到困难可以参考。另外，当调用sse时，最好对该长链接进行监控，以便在长链接出现错误或意外停止后进行重启，或者其他操作。</p>
    </div>
  </div>
  <div class="layui-form-item">
    <div class="layui-input-block">
      <button class="layui-btn" lay-submit lay-filter="bnotify">do</button>
    </div>
  </div>
</form>`
	return temp
}

function notifyMsgTip(layer, form, $dom) {
	function dos(layer, form, $dom) {
		// debugger
		$('form.notifyMsg-tip button[lay-filter="bnotify"]')[0].start = $dom.start
		$('form.notifyMsg-tip button[lay-filter="bnotify"]')[0].stop = $dom.stop
		form.on('submit(bnotify)', function(data) {
			if ($('form.notifyMsg-tip input[type="checkbox"]').prop('checked')) {

				if (globalData.neverSave.notifySSE.es === '' && globalData.neverSave.notifySSE.status !== 'toOpen') {
					globalData.neverSave.notifySSE.status = 'toOpen'
					$('.l4 input[type="checkbox"]').prop('checked', true)
					form.render('checkbox')
					data.elem.start && data.elem.start()
					layer.closeAll('tips');
				}

			} else {
				$('.l4 input[type="checkbox"]').prop('checked', false)
				form.render('checkbox')
				data.elem.stop && data.elem.stop()
			}
			layer.closeAll('tips');
			return false
		});
	}
	// layer.open({
	// 	type: 4,
	// 	area: ['300px', 'auto'],
	// 	// shade: 0,
	// 	closeBtn: 0,
	// 	shadeClose: true,
	// 	fixed: false,
	// 	maxmin: false,
	// 	anim: 5, //0-6的动画形式，-1不开启
	// 	tips: [2, '#2F4056'],
	// 	content: [htmlString(), $dom],
	// 	success: dos.bind(null, layer, form, $dom)
	// });
	tip(layer, htmlString, $dom, dos, form)
	form.render()
}



export default notifyMsgTip