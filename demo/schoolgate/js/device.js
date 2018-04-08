var deviceMacArr;
var upperThreshold = -35;
var lowerThreshold = -70;
var flag = {}
function onloadDevice(){
	deviceMacArr = JSON.parse(mystorage.get("deviceMacArr")) || {};
	let infoText = mystorage.get("infoText") || '';
	console.log(deviceMacArr,infoText);
	if(!$.isEmptyObject(deviceMacArr)){
		for(let key in deviceMacArr){
			let mac = key.replace(/:/g,'');
			$(".shouhuan").prepend(`<li style="margin:10px 0;" id="`+mac+`">
	        <div class="form-inline">
	          <div class="form-group">
			    <labelan1 for="">手环&姓名：</label>
			    <input type="text" class="form-control" placeholder="AA:BB:CC:DD:EE:FF" disabled="disabled" value="`+key+`">
			    <input type="text" class="form-control" placeholder="小明" disabled="disabled" value="`+deviceMacArr[key]+`">
			  </div>
			  <button class="btn btn-success" disabled="disabled">添加</button>
			  <button class="btn btn-info">修改</button>
			  <button class="btn btn-danger">删除</button>
			</div>
	  	  </li>`);
			//$("#"+mac).find("input").css("background","#5cb85c");
		}
	}
	$('#infoText').val(infoText);
}
onloadDevice();

//------------------添加手环mac地址----------

$("body").on("click",'.shouhuan .btn-success',function(){
	let device = $(this).parent().find("input:first");
	let name = $(this).parent().find("input:last");
	let isNew = $(this).parents(".shouhuan").children("li:last-child").find("input:first");
	if(device.val() == "" || name.val() == ""){
		alert("输入不能为空");
		return;
	}
	if(deviceMacArr[device.val()]){
		alert("不要重复添加");
		return;
	}
	deviceMacArr[device.val()] = name.val();
	device.attr("disabled","disabled");
	$(this).attr("disabled","disabled");
	name.attr("disabled","disabled");
	if(isNew.val() !== ''){
		let mac = device.val().replace(/:/g,'');
		$(".shouhuan").append(`<li style="margin:10px 0;" id="`+mac+`">
	        <div class="form-inline">
	          <div class="form-group">
			    <labelan1 for="">手环&姓名：</label>
			    <input type="text" class="form-control" placeholder="AA:BB:CC:DD:EE:FF">
			    <input type="text" class="form-control" placeholder="小明">
			  </div>
			  <button class="btn btn-success">添加</button>
			  <button class="btn btn-info">修改</button>
			  <button class="btn btn-danger">删除</button>
			</div>
	  	  </li>`);
	}
	mystorage.set("deviceMacArr",JSON.stringify(deviceMacArr));

});				
//----------修改手环的mac地址
$("body").on("click",'.shouhuan .btn-info',function(){
	let device = $(this).parent().find("input:first");
	$(this).parent().find("input:last").attr("disabled",false);
	device.attr("disabled",false);
	$(this).prev().attr("disabled",false)
	delete deviceMacArr[device.val()];
	mystorage.set("deviceMacArr",JSON.stringify(deviceMacArr));

});
//------------删除手环mac地址---------------
$("body").on("click",'.shouhuan .btn-danger',function(){
	let device = $(this).parent().find("input:first");
	delete deviceMacArr[device.val()];
	$(this).parent().parent().remove();
	mystorage.set("deviceMacArr",JSON.stringify(deviceMacArr));
});


$("#infoStart").on("click",function(){
	let ip = $("#infoText").val().trim();
	scan(ip,data2info);
});
$("#infoStop").on("click",function(){
	let ip = $("#infoText").val().trim();
	stopScan(ip);
});
$("#infoText").on('keyup',function(){
	//console.log($(this).val());
	let value = $(this).val().trim();
	mystorage.set("infoText",value);
});
function data2info(scanData,hubIP){
	let data = JSON.parse(scanData);
	let deviceMac = data.bdaddrs[0].bdaddr;
	let rssi = data.rssi;

	if(rssi > upperThreshold && ! flag[deviceMac]){
		flag[deviceMac] = true;
		console.log('infoInput --> 打卡成功：', deviceMac,rssi);
		let mac = deviceMac.replace(/:/g,'');
		$(".shouhuan").append(`<li style="margin:10px 0;" id="`+mac+`">
	        <div class="form-inline">
	          <div class="form-group">
			    <labelan1 for="">手环&姓名：</label>
			    <input type="text" class="form-control" placeholder="AA:BB:CC:DD:EE:FF" value="`+deviceMac+`">
			    <input type="text" class="form-control" placeholder="小明">
			  </div>
			  <button class="btn btn-success">添加</button>
			  <button class="btn btn-info">修改</button>
			  <button class="btn btn-danger">删除</button>
			</div>
	  	  </li>`);
	}
	if(flag[deviceMac && rssi < lowerThreshold]){
		flag[deviceMac] = null;
		delete flag[deviceMac];
		console.log('infoInput --> 取消打卡记录：', deviceMac);
	}
}