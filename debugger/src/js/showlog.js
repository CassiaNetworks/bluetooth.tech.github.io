function showLog(parent, data) {
	// debugger
	let _data = Object.assign({
		before: '',
		message: '',
		after: '',
		class: ''
	}, data)

	let temp = `<li><pre class='${_data.class}'>${_data.before}${_data.message}${_data.after}</pre></li>`
	// setTimeout(function() {
	// 	parent.append(temp)
	// }, 300);
	parent.append(temp)
}

export {
	showLog
}