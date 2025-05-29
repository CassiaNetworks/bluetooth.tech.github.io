$(function () {
	//var IP = "192.168.199.237";//X1000
	var IP = "192.168.199.121";//C1000
	var star = null,end = null;
	//var notification = "http://"+IP+"/gatt/nodes/?mac=&event=1"
	//data: {"handle":"EF:78:19:48:D7:50","connectionState":"disconnected"}
	var hubState = "http://"+IP+"/management/nodes/connection-state?mac=";
	$("#start").on("click",function(){
	
			let es = new EventSource(hubState);
			es.onmessage=function(event){
				if(event.data !== ":keep-alive"){
					let data = JSON.parse(event.data);
					console.log(data);
					if(data.connectionState && data.connectionState == "connected"){
						star = new Date().getTime();
						console.log("connected");

					}
					if(data.connectionState && data.connectionState == "disconnected"){
						end = new Date().getTime();
						alert((end - star)/1000);
					};
				}
			}
			es.onerror = function(e){
				//alert("Check that the network and APMac are correct");
				console.log("notification",e)
			}
		
	});
});