import fire_static from 'publicDir/imgs/fire_static.jpg'
import heart_staic from 'publicDir/imgs/heart_staic.jpg'
import running_static from 'publicDir/imgs/running_static.jpg'
import './dashboard.css'

function dashboardPosition(msg, loc) {
	const time = new Date().toTimeString().split(' ')[0];
	const str = `
	<li> 
	<span class='position-time'>${time}: </span>
	<span class='position-level'>${msg?msg:'进入'} </span>
	<span class='position-message'>${loc}</span>
	<span>停留</span>
	<span class='position-duration'>0</span>
	<span>秒</span>
</li>`
	return str;
}

function dashboardStr(data) {
	const str = `<li data-node='${data.node}'>
						<div class='sport-info'>
							<input type='text' class='userName' value='${data.userName}'></input>
							${data.loc?'<p class="loc">位置：<span >'+data.loc+'</span></p>':''}
							<button class='position-details' data-node='${data.node}'>详细</button>
							<p class="totalStep">累计步数 : <span >${data.totalStep}</span></p>
							${data.say?"<input type = 'text' value='你好'><button class='send layui-btn layui-btn-warm layui-btn-mini' data-name='"+data.name+"' data-node='"+data.node+"'>send</button>":''}
							<div class="yellow">
								<img src=${fire_static} alt="icon">
								<p><span>${data.cal}</span>千卡</p>
							</div>
							<div class="red">
								<img src=${heart_staic} alt="icon">
								<p><span>${data.heartRate}</span>/s</p>
							</div>
							<div class="blue">
								<img src=${running_static} alt="icon">
								<a href="javascript:;" data-node='${data.node}'></a>
								<p><span>${data.step}</span>步</p>
							</div>
							<div class = 'model'>
								<p>型号:${data.name}<p>
							</div>
						</div>
						<div class='position-info' hidden>
							<ul>
							${dashboardPosition(null,data.loc)}
							</ul>	
						</div>
					</li>`
	return str
}




export {
	dashboardStr,
	dashboardPosition
}
