function dialog(layer, htmlString, $dom, dos, form, title) {
	layer.open({
		title: title || '',
		type: 6,
		area: ['630px', 'auto'],
		shade: 0.3,
		shadeClose: true,
		closeBtn: 1,
		fixed: true,
		maxmin: false,
		anim: 5, //0-6的动画形式，-1不开启
		tips: [2, '#2F4056'],
		content: htmlString(),
		btn: ['DO'],
		btn1: dos.bind(null, layer, form, $dom),
		cancel: function(index, layero) { // 点击窗口的x关闭按钮
			console.log('box close button clicked');
			// $('#control').val('local')
			// form.render()
		},
	});	
}



export default dialog