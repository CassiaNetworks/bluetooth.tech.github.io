function tip(layer, htmlString, $dom, dos, form) {
	
	layer.open({
		type: 4,
		area: ['400px', 'auto'],
		// shade: 0,
		closeBtn: 0,
		shadeClose: true,
		fixed: false,
		maxmin: false,
		anim: 5, //0-6的动画形式，-1不开启
		tips: [2, '#2F4056'],
		content: [htmlString(), $dom],
		success: dos.bind(null,layer, form, $dom)
	});
}

export default tip