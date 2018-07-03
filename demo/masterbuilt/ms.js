$.ajaxSetup({
	contentType: "application/x-www-form-urlencoded"
});
$(document).ready(function(){
	var isOauth = localStorage.getItem("isOauth");
	var token = "";
	console.log(typeof isOauth);
	var hubIP = getStorageItem("hubIP");//= "192.168.199.239";
	$("#hubIP").val(hubIP);
	//var hubMac = "CC:1B:E0:E0:1B:04";
	var hubMac = getStorageItem("hubMac");
	var isConnect = false;
	var isLight = false;
	var isPower = false;
	var isDevice = false;
	var setTemp = 0;
	var currentTemp = 0;
	 // 35~~~~~~255
	var source;
	var notifySource;
	var node;
		localORoauth();
		setTimeout(function(){
			getDevices();
		},1000);

	function getDevices(){
		var storedNode = getStorageItem("storageNode");
		$.get("http://"+hubIP+"/gap/nodes/?connection_state=connected&mac="+hubMac+token,function(data){
			// json = JSON.parse(data);
			json = (data);
			console.log(json);
			var nodesID;
			for (var i = 0; i < json.nodes.length; i++) {
				console.log(json.nodes[i].id);
				nodesID = json.nodes[i].id;
				try{
					if(storedNode[nodesID].node0){
						node = nodesID;
						isConnect = true;
						$("#connect").html("connected").css("background-color","red");
						nootify();
						return true;
					}else{
						return false;
					}
				}catch(e){
						return false;
				}
			}
		},"json");
	}

	$("#hubIP").on("keyup",function(){
		if(isOauth == "true" || isOauth == true){
			hubMac = $(this).val();
			setStorageItem("hubMac",hubMac);
			console.log(hubMac);
		}else{
			hubIP = $(this).val();
			setStorageItem("hubIP",hubIP);
		}
	});
	$("#select").change(function(){
		if($(this).val() == "bendi"){
			localControl();
		}
		if($(this).val() == "oauth"){
			oauthControl();
		}
	});


	$("#connect").on('click',function(){
		if(!Oauth()){
			return;
		}
		isConnect = !isConnect;
		
		if(isConnect){
			if (getDevices()) {
				return;
			};	
			var MData,connectingCode,PairingID,isNode;
			var storedNode = getStorageItem("storageNode");
			source = new EventSource("http://"+hubIP+"/gap/nodes/?event=1&chip=1"+"&mac="+hubMac+token);
			source.onmessage = function(event){
				var scanJson = JSON.parse(event.data);
				var adData = scanJson.adData;
				node = scanJson.bdaddrs[0].bdaddr;

				if(!adData){return};
				MData = adData.toString().slice(adData.indexOf('4248'),adData.length);
				try{ 
					storedNode[node].node0;
					isNode = true;
				}catch(e){isNode = false};
					//console.log(MData);
				if(MData.length == 32){
					PairingID = getPairingID(MData);
					$.post("http://"+hubIP+"/gap/nodes/"+node+"/connection/?mac="+hubMac+token,
						{"type":"public","chip":1},
						function(data){// connect
							$.get("http://"+hubIP+"/gatt/nodes/"+node+"/handle/37/value/"+PairingID+"/?mac="+hubMac+token,
							function(data){//Write Pairing ID 
								$.get("http://"+hubIP+"/gatt/nodes/"+node+"/handle/40/value/?mac="+hubMac+token,
								function(data){//Waiting Reply From 0xFFF2
									console.log(data.value);
									connectedCode = data.value.slice(4,20);
									// debugger
									console.log(node+"--------------",connectedCode);
										if(storedNode === null){
											storedNode = {};
										}
										storedNode[node] = {"node0":node,"connectedCode0":connectedCode};
										setStorageItem("storageNode",storedNode);
									$.get("http://"+hubIP+"/gatt/nodes/"+node+"/handle/37/value/"+"0E08"+connectedCode+"/?mac="+hubMac+token,
									function(data){
										$.get("http://"+hubIP+"/gatt/nodes/"+node+"/handle/40/value/?mac="+hubMac+token,
										function(data){
											console.log(data);
											if(data.value == "0b0000"){
												$("#connect").html("Connected").css("background-color","red");
												isPower = true;
												$("#power").css("background-color","red");
												nootify();
											}else{
												alert("connection fail");
											}
										},"json");//read 40
									}); 
								},"json");
							});
						});	
					source.close();

				}else if(isNode){
					var connectedCode = storedNode[node].connectedCode0;
					connectingCode = getConnectingCode (MData,connectedCode);
					$.post("http://"+hubIP+"/gap/nodes/"+node+"/connection/?mac="+hubMac+token,
						{"type":"public","chip":1},
						function(data){// connect
							$.get("http://"+hubIP+"/gatt/nodes/"+node+"/handle/37/value/"+connectingCode+"/?mac="+hubMac+token,
							function(data){//Write Pairing ID 
								console.log(connectingCode);
								$.get("http://"+hubIP+"/gatt/nodes/"+node+"/handle/40/value/?mac="+hubMac+token,
								function(data){//Waiting Reply From 0xFFF21
									console.log(data);
									try{
										if(data.value != "0b0100"){
											isPower = true;
											$("#connect").html("connected").css("background-color","red");
											$("#power").css("background-color","red");
											nootify();
										}else{
											alert("connection fail");
										}
									}catch(e){

									}
									
								});
							});
						});
					source.close();
				} 
			};
		}else{
			if(!Oauth()){
				return;
			}
			$.ajax({
				url: "http://"+hubIP+"/gap/nodes/"+node+"/connection?mac="+hubMac+token,
				type: 'DELETE',
				success: function(result) {
					if(result == "OK"){
						$("#connect").html("Connect").css("background-color","transparent");
						$("#power").css("background-color","transparent");
						$("#liht").css("background-color","transparent");
						$("#remainTime").html("00:00");
						$("#getTemp").html("35F");
						clearInterval(interval);
						clearInterval(interval);
						notifySource.close();
					}
				}
			});
		}
	});

	$("#light").on("click",function(){
		if(!Oauth()){
			return;
		}
		isLight = !isLight;
		if(isLight){
				$.get("http://"+hubIP+"/gatt/nodes/"+node+"/handle/43/value/"+"a1000300000000"+"/?mac="+hubMac+token,
				function(data){
				
					if (data == "OK"){
						$("#light").css("background-color","red");
					}
				});
		}else{
			$(this).css("background-color","transparent");
			$.get("http://"+hubIP+"/gatt/nodes/"+node+"/handle/43/value/"+"a1000100000000"+"/?mac="+hubMac+token,
			function(data){
			});
		}
	});

	$("#power").on("click",function(){// 开关设备电源
		if(!Oauth()){
			return;
		}
		isPower = !isPower;
		if(isPower){
			$.get("http://"+hubIP+"/gatt/nodes/"+node+"/handle/43/value/"+"a1000100000000"+"/?mac="+hubMac+token,
			function(data){
				if (data == "OK"){
					$("#power").css("background-color","red");
				}
			});
		}else{
			isLight = false;
			$("#light").css("background-color","transparent");
			$(this).css("background-color","transparent ");
			$.get("http://"+hubIP+"/gatt/nodes/"+node+"/handle/43/value/"+"a1000000000000"+"/?mac="+hubMac+token,
			function(data){
			});
		}
		
	});
	$("#setTime").on("click",function(){
		if(!Oauth()){
			return;
		}
		time = $("#time").val();
		var setTime = setTimeX(time);
		var temp = setTimeX(setTemp);
		$.get("http://"+hubIP+"/gatt/nodes/"+node+"/handle/43/value/"+"a10205"+setTime+temp+"/?mac="+hubMac+token,
		function(data){
			sm(time);
			$("#time").val("");
		});
	});

	$("#setTemp").on("click",function(){
		if(!Oauth()){
			return;
		}
	    setTemp = $("#temp").val();
		var setTime = setTimeX(time);
		var temp = setTempX(setTemp);
		$("#settemp").html(setTemp+"F");
		$.get("http://"+hubIP+"/gatt/nodes/"+node+"/handle/43/value/"+"a10205"+setTime+temp+"/?mac="+hubMac+token,
		function(data){
			$("#temp").val("");
		});
	});
	var interval;
	function nootify(){
		clearInterval(interval);


		$.get("http://"+hubIP+"/gatt/nodes/"+node+"/handle/47/value/0100/?mac="+hubMac+token,
		function(data){
			console.log(data);
		});
		notifySource = new EventSource("http://"+hubIP+"/gatt/nodes/?event=1&mac="+hubMac+token);
		notifySource.onmessage = function(event){
			//console.log(event.data + "$$$$$$"+typeof event.data);
			try{
				var notifyJSON = JSON.parse(event.data);
				if(notifyJSON.id == node){
					notifyX(notifyJSON);
				}
			}catch(e){

			}
			

		};
		
		interval = setInterval(function(){
			$.get("http://"+hubIP+"/gatt/nodes/"+node+"/handle/43/value/a20100/?mac="+hubMac+token,
			function(data){
				
			});
		},2000);
		
	}
	function xor(a,b){// xor
		a = parseInt(a,16);
		b = parseInt(b,16);
		a=a.toString(2).split('').reverse();
		b=b.toString(2).split('').reverse();
		var L=Math.max(a.length,b.length),re=[];
		for(var i=0;i<L;i++){
			re.push(  a[i]^b[i] );
		}
		var end = parseInt( re.reverse().join(''),2).toString(16);
		return end.length < 4 ? "0" + end : end;
	}  

	function setTimeX(time){
			time = parseInt(time,10);
			time = time.toString(16);
			if(time.length == 3){
				time = time.slice(1,3) + "0" + time.slice(0,1);
			}else if(time.length == 2){
				time = time + "00";
			}else if(time.length == 1){
				time = "0" + time + "00";
			}else{
				return;
			}
			return time;
	}
	function setTempX(temp){
			temp = parseInt(temp,10).toString(16);
			if(temp.length == 3){
				temp = temp.slice(1,3) + "0" + temp.slice(0,1);
			}else if(temp.length == 2){
				temp = temp + "00";
			}else if(temp.length == 1){
				temp = "0" + temp + "00";
			}else{
				return;
			}
			return temp;
	}
	function notifyX(notifyJSON){
		if(notifyJSON.value == "b2000000"){
			console.log(notifyJSON.value);
			$("#remainTime").html("00:00");
			return;
		}
		var status = notifyJSON.value.slice(4,6);
		var temp1 = notifyJSON.value.slice(8,10);
		var temp2 = notifyJSON.value.slice(10,12);

		var meatProbe1 = notifyJSON.value.slice(12,14);
		var meatProbe2 = notifyJSON.value.slice(14,16);		

		var time1 = notifyJSON.value.slice(16,18);
		var time2 = notifyJSON.value.slice(18,20);
					//status();
		statusX(status);
		getTemp(temp1,temp2);
		getMeatProbe(meatProbe1,meatProbe2);
		remainTime(time1,time2);
		console.log(notifyJSON.value);
	}
//_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_  status  time   temp   meatprobe

	function statusX(status){
		if(status == "00"){
			isLight = false;   $("#light").css("background-color","transparent");
			isPower = false;   $("#power").css("background-color","transparent");
		}
		if(status == "01"){
			isLight = false;   $("#light").css("background-color","transparent");
			isPower = true;	   $("#power").css("background-color","red");
		}
		if(status == "03"){
			isLight = true;	   $("#light").css("background-color","red");
			isPower = true;	   $("#power").css("background-color","red");
		}
		if(status == "05"){
			isLight = false;   $("#light").css("background-color","transparent");
			isPower = true;	   $("#power").css("background-color","red");
		}
		if(status == "07"){
			isLight = true;	   $("#light").css("background-color","red");
			isPower = true;	   $("#power").css("background-color","red");
		}
	}
	function remainTime(time1,time2){
		var	remainTime = parseInt(time2 + time1,16);
		time = remainTime.toString(10);
		sm(time);

	}
	function sm(time){
		var s = parseInt(time / 60);
		var m = time%60;
		s = s < 10 ? "0" + s : s;
		m = m < 10 ? "0" + m : m;
		$("#remainTime").html(s+":"+m);
	}

	function getTemp(temp1,temp2){
		var exponent = (temp2 + temp1).slice(0,1);
		var getTemp = (temp2 + temp1).slice(1,4);
		getTemp = parseInt(getTemp,16).toString(10);
		if(exponent == "f"){
			$("#getTemp").html(getTemp/10 + "F");
		}else{
			$("#getTemp").html(getTemp + "F");
		}
		
	}
	function getMeatProbe(meatProbe1,meatProbe2){
		var exponent = (meatProbe2 + meatProbe1).slice(0,1);
		var getMeatProbe = (meatProbe2 + meatProbe1).slice(1,4);
		getMeatProbe = parseInt(getMeatProbe,16).toString(10);
		if(exponent == "f"){
			$("#meatProbe").html(getMeatProbe/10 + "F");
		}else{
			$("#meatProbe").html(getMeatProbe + "F");
		}
	}
//_*_*_*_*_*_*_*_*__**_*_*_*_*_*_*_getConnectingCode And  getPairingID
	function getConnectingCode(MData,connectedCode){
		var mac1 = MData.slice(0,4);
		var mac2 = MData.slice(4,8);
		var mac3 = MData.slice(8,12);
		var mac4 = MData.slice(12,16);
		var connectingCode1 =  connectedCode.slice(0,4);
		var connectingCode2 =  connectedCode.slice(4,8);
		var connectingCode3 =  connectedCode.slice(8,12);
		var connectingCode4 =  connectedCode.slice(12,16);
		var connectingCode = "0E"+"08"+xor(mac1,connectingCode1) + xor(mac2,connectingCode2)+xor(mac3,connectingCode3) + xor(mac4,connectingCode4);
		console.log("masterbuilt Smoker"+" connectedCode : "+connectedCode);
		return connectingCode;
	}

	function getPairingID(MData){
		var mac1 = MData.slice(0,4);
		var mac2 = MData.slice(4,8);
		var mac3 = MData.slice(8,12);
		var mac4 = MData.slice(12,16);
		var pairingCode1 =  MData.slice(16,20);
		var	pairingCode2 =  MData.slice(20,24);
		var pairingCode3 =  MData.slice(24,28);
		var pairingCode4 =  MData.slice(28,32);
		var PairingID= "0E"+"08"+xor(mac1,pairingCode1) + xor(mac2,pairingCode2)+xor(mac3,pairingCode3) + xor(mac4,pairingCode4);
		return 	PairingID;
	};

	//-*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_local And  oauth _*_*_*_*_**_*_*_*_*_*_*_*_**_*_*_
	function localORoauth(){
			console.log(isOauth);
			if(isOauth == "true" || isOauth == true){
				$("#select").val("oauth");
				oauthControl();
			}else{
				$("#select").val("bendi");
				localControl();
			}
	}
	function localControl(){
		isOauth = false;
		localStorage.setItem("isOauth",isOauth);
		hubIP = getStorageItem("hubIP");
		$("#cassiaRouter").html("Cassia Router IP:");
		$("#hubIP").val(hubIP).attr('placeholder', 'HUB IP');
		token = "";
	}
	function oauthControl(){
		isOauth = true;
		localStorage.setItem("isOauth",isOauth);
		hubIP = "api.cassianetworks.com";
		hubMac = getStorageItem("hubMac");
		$("#cassiaRouter").html("Cassia Router MAC:");
		$("#hubIP").val(hubMac).attr('placeholder', 'HUB MAC');
		
		$.ajax({
		 type: 'POST',
		 url: "http://api.cassianetworks.com/oauth2/token",
		 data: { "grant_type": "client_credentials"}, //data: {key:value}, 
		 //添加额外的请求头
		 headers : {
		 				"Authorization":"Basic dGVzdGVyOjEwYjgzZjlhMmU4MjNjNDc=",
		 				"Content-Type":"application/x-www-form-urlencoded"
					},
		 //请求成功的回调函数
		 success: function(data){
		   console.log(data);
		   token = "&access_token=" + data.access_token;

		},
		});
	}

function Oauth(){

	if(isOauth){
		hubMac =  $("#hubIP").val();
		if(hubMac == ""&&hubMac.length != 17){
			alert("Cassia Router MAC fail");
			return false;
		}else{
			return true;
		}
	}else{
		hubIP =  $("#hubIP").val();
		if(hubIP == ""){
			alert("Cassia Router IP fail");
			return false;
		}else{
			return true;
		}	
	}

}
//_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_**_*_*_*_*_*_ set/get  StorageItem
	function getStorageItem(value){
		try{
			return JSON.parse(localStorage.getItem(value));
		}catch(e){
			return {};
		}	
	}
	function setStorageItem(key,value){
		try{
			localStorage.setItem(key,JSON.stringify(value));
			return true;
		}catch(e){
			
		}	
	}
});


