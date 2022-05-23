
function scan(host,mac,token,cb){
	let url = "http://"+host+"/api/gap/nodes/?mac="+mac+"&event=1&active=1&access_token="+token;
	let es = new EventSource(url);
	es.onmessage=function(event){
		/*let data = JSON.parse(event.data);
		console.log(data.name)
*/		if(event.data !== ":keep-alive"){
			cb(event.data);
		}
	}
	/*es.onerror = function(){
		alert("Check that the network and APMac are correct");
	}*/
}
function connect(host,mac,node,token,cb){
	let url = "http://"+host+"/api/gap/nodes/"+node+"/connection?mac="+mac;
	console.log(mac,node)
	/*$.post(url,{"type":"public"},function(data){
		//alert("Connected")
		//es.close();
		cb();
	});*/
	$.ajax({
		type:"POST",
		url:url,
		headers : {
		 			"Authorization":"Bearer " + token,
		 			"Content-Type" : "application/json"
				  },
		//dataType:'text',
		success:function(data){
			console.log(data)
			 cb();
		},
		error:function(err){
			console.log(err)
		}
	});
}
function write(host,mac,node,handle,value,token){
	return new Promise(function(resolve, reject) {
		let url = "http://"+host+"/api/gatt/nodes/"+node+"/handle/"+handle+"/value/"+value+"/?mac="+mac;
		$.ajax({
			type:"GET",
			url:url,
			headers : {
	 			"Authorization":"Bearer " + token,
	 			"Content-Type" : "application/json"
		  	},
			dataType:'text',
			success:function(data){
				console.log(data)
				resolve(data)
			},
			error:function(err){
				console.log(err)
				reject(err)
			}
		});
	});
}

function notification(host,mac,token,cb){
	let url = "http://"+host+"/api/gatt/nodes/?mac="+mac+"&event=1&access_token="+token; 
	let es = new EventSource(url);

	es.onmessage=function(event){
		if(event.data !== ":keep-alive"){
			console.log('aaaaaaaaaaaaaaaaaaaaaaaa',event.data);
			cb(event.data);
		}
	}
	es.onerror = function(e){
		//alert("Check that the network and APMac are correct");
		console.log("notification",e)
	}
}

function getDevice(host,mac,token){
	return new Promise(function(resolve, reject) {
		let url = "http://"+ host +"/api/gap/nodes/?connection_state=connected&mac="+ mac +"&access_token=" + token;
		$.ajax({
			url:url,
			type: 'GET',
			success: function(data){
				console.log("getConnected List", data);
				resolve(data);
			},
			error: function(err){
				console.error(err);
				reject(err);
			}
		});
	});
}
function disconnect(host,mac,node,token){
	return new Promise(function(resolve, reject) {
		let url = "http://"+host+"/api/gap/nodes/"+node+"/connection?mac="+mac;
		$.ajax({
			url:url,
			type: 'DELETE',
			 //dataType:'text',
					headers : {
			 			"Authorization":"Bearer " + token,
				  	},
			success: function(result) {
				console.log(result);
				//alert("disconnect");
				//location.reload();
				resolve(result);
			},
			error:function(err){
				console.error(err);
				reject(err);
			}
				
		});
	});
	
}

function oAuth(host,userName,password){
	return new Promise(function(resolve, reject) {
		$.ajax({
			 type: 'POST',
			 url: "http://"+host+"/api/oauth2/token",
			 data: { "grant_type": "client_credentials"}, //data: {key:value}, 
			 //添加额外的请求头
			 headers : {
			 				"Authorization":"Basic " + btoa(userName +':'+password),
			 				"Content-Type":"application/x-www-form-urlencoded"
						},
			 //请求成功的回调函数
			 success: function(data){
			   console.log(data);
			   resolve(data.access_token);
			  // console.log(data.access_token)
			   //return data.access_token;
			},
			error: function(e) { 
				reject(e)
			}
		});
	});
}




/*S1100	1.11.10.62

Cassia-AC-v1.11.10.79*/