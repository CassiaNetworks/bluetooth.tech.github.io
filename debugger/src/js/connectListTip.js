function htmlString() {
	let temp = `<form class="layui-form  connect-tip tip" action="#">
  <div class="layui-form-item">
    <label class="layui-form-label">Get connected devices as list：GET</label>
  </div>
  <fieldset class="layui-elem-field layui-field-title">
    <legend i18n='arguments'>描述</legend>
  </fieldset>
  <div class="layui-form-item layui-form-text">
    <div class="descriptors connect-des">
      <p><b>接口URL：</b>调用接口后，此URL会自动生成在下面的”API接口”的窗口中。</p>
      <p><b>接口描述：</b>此接口是GET请求，调用接口后，蓝牙路由器会将目前连接的设备的列表返回到pc端。</p>
    </div>
  </div>
  <div class="layui-form-item">
    <div class="layui-input-block">
      <button class="layui-btn" lay-submit lay-filter="connectList">do</button>
    </div>
  </div>
</form>`
	return temp
}

function connectListTip(layer, form, $dom) {
	form.verify({
		deviceMac: [/^([0-9a-f]{2}:){5}[0-9a-f]{2}$/gi, '请输入正确的mac地址'],
		zeroOne: [/^[01]$/, '请输入chip,0或者1']
	});

	function dos(layer, form, $dom) {
		$('form.connect-tip button[lay-filter="connectList"]')[0].fn = $dom.fn
		form.on('submit(connectList)', function(data) {
			data.elem.fn && data.elem.fn()
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
	// 	success: dos.bind(null,layer, form, $dom)
	// });
	// 
	tip(layer, htmlString, $dom, dos, form)
	form.render()
}


import tip from './tips'
export default connectListTip