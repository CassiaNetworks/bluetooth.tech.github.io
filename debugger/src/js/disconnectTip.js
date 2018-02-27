import globalData from './globalData'
import tip from './tips'

function htmlString() {
	let temp = `<form class="layui-form  disconnect-tip tip" action="#">
  <div class="layui-form-item">
    <label class="layui-form-label">Disconnect a device：DELETE</label>
  </div>
  <fieldset class="layui-elem-field layui-field-title">
    <legend i18n ='arguments'>参数</legend>
  </fieldset>
  <div class="layui-form-item">
    <label class="layui-form-label">deviceMac:</label>
    <div class="layui-input-inline">
      <input type="text" name="deviceMac"  placeholder="CC:1B:E0:E0:10:C1" value="${globalData.saved.deviceMac?globalData.saved.deviceMac:''}" lay-verify='deviceMac'  class="layui-input">
    </div>
    <div class="layui-form-mid layui-word-aux" i18n = 'required'>(必填)</div>
  </div>
  <fieldset class="layui-elem-field layui-field-title">
    <legend i18n ='description'>描述</legend>
  </fieldset>
  <div class="layui-form-item layui-form-text">
    <div class="descriptors connect-des">
      <p><b>接口URL：</b>调用接口后，此URL会自动生成在下面的”API接口”的窗口中。</p>
      <p><b>接口描述：</b>此接口是DELETE请求，调用接口后，蓝牙路由器会与指定MAC地址的蓝牙设备断连。</p>
      <p><b>参数解释：deviceMac：</b>要断连的设备的MAC地址。</p>
    </div>
  </div>
  <div class="layui-form-item">
    <div class="layui-input-block">
      <button class="layui-btn" lay-submit lay-filter="bdisconnect">do</button>
    </div>
  </div>
</form>`
	return temp
}

function getAllServicesTip(layer, form, $dom) {
	form.verify({
		deviceMac: [/^([0-9a-f]{2}:){5}[0-9a-f]{2}$/gi, '请输入正确的mac地址']
	});

	function dos(layer, form, $dom) {
		// debugger
		$('form.disconnect-tip button[lay-filter="bdisconnect"]')[0].fn = $dom.fn
		form.on('submit(bdisconnect)', function(data) {
			let deviceMac = globalData.saved.deviceMac = $('.disconnect-tip input').val().trim()
			data.elem.fn && data.elem.fn(deviceMac)
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


export default getAllServicesTip