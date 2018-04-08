var hubinArr = [];
var huboutArr = [];


var hubLi = `
      <li style="margin-top: 10px;">
	        <div class="form-inline">
		      <div class="form-group">
			    <label for="##">路由器IP：</label>
			    <input type="text" class="form-control"  placeholder="192.168.199.100">
			  </div>
		      <button class="btn btn-success">添加</button>
			  <button class="btn btn-info">修改</button>
			  <button class="btn btn-danger">删除</button>
			</div>
	      </li>
`;
//-----------添加蓝牙路由器mac地址-----

function loadHub(){
	hubinArr = mystorage.get("hubinArr") || [];
	huboutArr = mystorage.get("huboutArr") || [];
	console.log("hubinArr",hubinArr,"huboutArr",huboutArr);
	if(hubinArr.length !== 0){
		for(let i = 0,len = hubinArr.length; i<len;i++){
			$(".hub-in").prepend(`<li style="margin: 10px 0">
          	<div class="form-inline">
	          <div class="form-group">
			    <label for="##">路由器IP：</label>
			    <input type="text" class="form-control"  placeholder="192.168.199.100" disabled="disabled" value="`+hubinArr[i]+`">
			  </div>
			  <button class="btn btn-success" disabled="disabled">添加</button>
			  <button class="btn btn-info">修改</button>
			  <button class="btn btn-danger">删除</button>
			</div>
          </li>`)
		}
	}
	if(huboutArr.length !== 0){
		for(let i = 0,len = huboutArr.length; i<len;i++){
			$(".hub-out").prepend(`<li style="margin: 10px 0">
	      	<div class="form-inline">
	          <div class="form-group">
			    <label for="##">路由器IP：</label>
			    <input type="text" class="form-control"  placeholder="IP" disabled="disabled" value="`+huboutArr[i]+`">
			  </div>
			  <button class="btn btn-success" disabled="disabled">添加</button>
			  <button class="btn btn-info">修改</button>
			  <button class="btn btn-danger">删除</button>
			</div>
	      </li>`)	
		}	
	}
}
loadHub();





//-----------添加蓝牙路由器IP地址-----
$("body").on("click",'.hub-in .btn-success',function(){
	let hubip = $(this).parent().find('input');
	let hubipval = hubip.val().trim();
	let isNew = $(this).parents('.hub-in').children("li:last-child").find("input");
	if(hubipval == ""){
		alert("输入不能为空");
		return;
	}
	if(hubinArr.indexOf(hubipval) != -1 || huboutArr.indexOf(hubipval) != -1){
		alert("不要重复添加");
		return;
	}	
	hubip.attr("disabled","disabled"); 
	$(this).attr("disabled","disabled"); 
	if(isNew.val() !== ''){
		$(".hub-in").append(hubLi);
	}
	hubinArr.push(hubipval);
	console.log(hubinArr);
	mystorage.set("hubinArr",hubinArr);
});

$("body").on("click",'.hub-out .btn-success',function(){
	let hubip = $(this).parent().find('input');
	let hubipval = hubip.val().trim();
	let isNew = $(this).parents('.hub-out').children("li:last-child").find("input");
	if(hubipval == ""){
		alert("输入不能为空");
		return;
	}
	if(hubinArr.indexOf(hubipval) != -1 || huboutArr.indexOf(hubipval) != -1){
		alert("不要重复添加");
		return;
	}		
	hubip.attr("disabled","disabled");
	if(isNew.val() !== ''){
			$(".hub-out").append(hubLi);
	}
	$(this).attr("disabled","disabled"); 
	huboutArr.push(hubipval);
	console.log(huboutArr);
	mystorage.set("huboutArr",huboutArr);
});
//-------------修改路由器ip地址----
$("body").on("click",'.hub .btn-info',function(){
	let hubip = $(this).parent().find('input');
	let hubipval = hubip.val().trim();
	$(this).prev().attr("disabled",false);
	hubip.attr("disabled",false);
	if(hubinArr.indexOf(hubipval) != -1 ){
		hubinArr.splice($.inArray(hubipval,hubinArr),1);
		mystorage.set("hubinArr",hubinArr);
	} 
	if(huboutArr.indexOf(hubipval) != -1){
		huboutArr.splice($.inArray(hubipval,huboutArr),1);
		mystorage.set("huboutArr",huboutArr);
	} 

});

//------------------删除---------
$("body").on("click",'.hub-in .btn-danger',function(){
	let hubip = $(this).parent().find('input');
	$(this).parent().parent().remove();
	hubinArr.splice($.inArray(hubip.val().trim(),hubinArr),1);
	mystorage.set("hubinArr",hubinArr);
});
//------------------删除--------- 
$("body").on("click",'.hub-out .btn-danger',function(){
	let hubip = $(this).parent().find('input');
	$(this).parent().parent().remove();
	huboutArr.splice($.inArray(hubip.val().trim(),huboutArr),1);
	mystorage.set("huboutArr",huboutArr);
});