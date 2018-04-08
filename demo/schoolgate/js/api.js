var scanEsArr = [];
function scan(host,cb){
	let url = "http://"+host+"/gap/nodes/?mac=&event=1&chip=0";
	let es = new EventSource(url);
	scanEsArr.push(es);
	es.onmessage=function(event){
		if(event.data.match("retry") || event.data.match("keep")) return;
		cb(event.data,host);
	}
}


/*var token;
var host = "api.cassianetworks.com";
var userName = "tester";
var password = "10b83f9a2e823c47";
function auth(){
	$.ajax({
	 type: 'POST',
	 url: "http://"+host+"/oauth2/token",
	 data: { "grant_type": "client_credentials"}, //data: {key:value}, 
	 //添加额外的请求头
	 headers : {
	 				"Authorization":"Basic " + btoa(userName+':'+password),
	 				"Content-Type":"application/x-www-form-urlencoded"
				},
	 //请求成功的回调函数
	 success: function(data){
	   console.log(data);
	   token = "&access_token=" + data.access_token;
	},
	});
}
auth();
*/