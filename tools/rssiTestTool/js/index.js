$(function(){

var hubIP;
var deviceMacArr = [];
var device = {};
var time = 0;
var timer = null;
$('#startScan').on('click',function(){
	hubIP = $('#hubIP').val().trim();
	deviceMacArr = $('#deviceMacArr').val().trim().split(',');

	for(let i = 0, len = deviceMacArr.length; i < len; i++){
		domInit(deviceMacArr[i],i);
	}
	api
		.use({
			server: hubIP,
			hub: ''
		})
		//.on('notify', notification)
		.scan()
		.on('scan', scan2conn);
	timer = setInterval(function(){
		time += 1;
		//console.log(time);
		$('#time').html(time + 's');
		// if(time === 30){
		// 	console.log('测试完成');
		// 	api.scan.close();
		// 	timer&&clearInterval(timer);
		// }
	},1000)
});
$('#stopScan').on('click',function(){
	api.scan.close();
	clearInterval(timer)
})
var scan2conn = function(hubMac,scanData){
	if(scanData.match&&scanData.match("keep")) return;
	let data = JSON.parse(scanData),
	deviceMac = data.bdaddrs[0].bdaddr,
	type = data.bdaddrs[0].bdaddrType,
	rssi = data.rssi;

	if(deviceMacArr.indexOf(deviceMac) === -1) return ;
	console.log(scanData)
	if(!device[deviceMac]){
		device[deviceMac] = {
			minRssi:rssi,
			maxRssi:rssi,
			rssiArr:[rssi],
			scanNum:1,
		};
	}else{
		device[deviceMac].scanNum += 1;
		device[deviceMac].rssiArr.push(rssi);
		if(rssi > device[deviceMac].maxRssi) device[deviceMac].maxRssi = rssi;
		if(rssi < device[deviceMac].minRssi) device[deviceMac].minRssi = rssi;
	}
	mac = deviceMac.replace(/:/g,'');
	//console.log(device[deviceMac]);
	let deviceInfo = $("#" + mac);
	deviceInfo.children('p').eq(1).html("Min rssi：" + device[deviceMac].minRssi);
	deviceInfo.children('p').eq(2).html("Max rssi：" + device[deviceMac].maxRssi);
	deviceInfo.children('p').eq(3).html("ave rssi：" + pingjun(device[deviceMac].rssiArr));
	deviceInfo.children('p').eq(4).html("Number:" + device[deviceMac].scanNum);
	deviceInfo.children('p').eq(5).html("rssi:" + device[deviceMac].rssiArr);
	

};

var pingjun = function(arr){
	return arr.reduce((a, b)=> a + b) / arr.length
}
var domInit = function(deviceMac,num){
	let rawHtml = `<div class="scanInfo" id="`+deviceMac.replace(/:/g,'')+`">
			<p>DeviceMac：`+deviceMac+`</p>
			<p>Min rssi：</p>
			<p>Max rssi：</p>
			<p>ave rssi：</p>
			<p>Number：</p>
			<p style="overflow-y: auto; height:60px;">rssi :</p>
			<p>第`+ ( num + 1 ) + `个</p>
		</div>`;
	$('.content').append(rawHtml);
};

});

$("input").on('keyup',function(){
 //alert($(this).val())
 mystorage.set($(this).attr('id'),$(this).val());
 console.log($(this).attr('id'),$(this).val());
 });

 function loadData(){
     $("#hubIP").val(mystorage.get("hubIP") || "");
     $("#deviceMacArr").val(mystorage.get("deviceMacArr") || "");
     $('#infoText').val(mystorage.get("infoText") || "");
 }

$("#infoStart").on("click",function(){
	console.log($('#infoText').val());
		let ip = $('#infoText').val().trim() || '10.71.147.112';
	api
		.use({
			server: ip,
			hub: ''
		})
		//.on('notify', notification)
		.scan()
		.on('scan', scan2conn2);
});

var upperThreshold = -30;
var lowerThreshold = -70;
var flag = {}
var str = '';
function scan2conn2(hubMac,scanData){
	if(scanData.match&&scanData.match("keep")) return;
	let data = JSON.parse(scanData),
	deviceMac = data.bdaddrs[0].bdaddr,
	rssi = data.rssi;
	// console.log('@@@@');
	if(rssi > upperThreshold && ! flag[deviceMac]){
		flag[deviceMac] = true;
		console.log('infoInput --> 打卡成功：', deviceMac,rssi);
		let mac = deviceMac.replace(/:/g,'');
		str = str + deviceMac + ',';
		mystorage.set('deviceMacArr', str);
	}
	if(flag[deviceMac && rssi < lowerThreshold]){
		flag[deviceMac] = null;
		delete flag[deviceMac];
		console.log('infoInput --> 取消打卡记录：', deviceMac);
	}
}

 loadData();
