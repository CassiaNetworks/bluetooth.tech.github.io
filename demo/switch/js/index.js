$(function(){
	var hubIP;
	var useway = mystorage.get('useway') || 'local' ;
	$('#local-control').val(useway);
	if (useway == 'local') {
		$('.cloud-control').hide();
		$('.row').css("padding-bottom","0px");
		$('#ap-ip-label').html('Router IP:');
		$('#ap-ip').attr('placeholder', '192.168.1.1');
	}else{
		$('.cloud-control').show();
		$('#ap-ip-label').html('AC Address:');
		$('#ap-ip').attr('placeholder', 'ac.cassia.pro:8080/api');

	}

$('#local-control').on('change', function () {
		console.log($(this).val())
        if ($(this).val() === 'local') {
        	useway = 'local';
        	$('#ap-ip-label').html('Router IP:');
        	$('#ap-ip').attr('placeholder', '192.168.1.1');
        } else {
        	useway = 'cloud';
        	$('#ap-ip-label').html('AC Address:');
        	$('#ap-ip').attr('placeholder', 'ac.cassia.pro:8080/api');
        }
        mystorage.set('useway',useway);
        mystorage.remove('ap-ip');
        location.reload();
        console.log($('#ap-ip').val());
});


// 准备的点击事件
$("#ready").on("click",function(){
	useway = mystorage.get('useway') || 'local' ;
	console.log(useway);
	if(useway === 'local'){
		hubIP = $("#ap-ip").val();
	    api
			.use({
				server: hubIP,
				hub: ''
			})
			.scan({})
			.on('scan', scan2conn);
	}
	if(useway === 'cloud'){
		hubIP = $("#ap-ip").val();
		hubMac = $("#ap-mac").val() || '';
	    api
			.use({
				server: hubIP,
				hub: hubMac,
				developer:$("#username").val()||'tester',
				key:$("#password").val()||"10b83f9a2e823c47"
			})
			.oauth2({
				success:function(){
				api
					.scan({})
					.on('scan', scan2conn);
				}
			});
	}
});

$('#stop').on('click', function () {
	api.scan.close();
});




var scan2conn = function (hub,scanData) {
	//console.log(' adsadsadsa');
	if(scanData.match&&scanData.match("keep")) return;
	let data = JSON.parse(scanData),
	deviceMac = data.bdaddrs[0].bdaddr,
	type = data.bdaddrs[0].bdaddrType;
	if(deviceMac.slice(0,11) === 'E2:15:00:00'){
		if(data.adData.slice(16,17) === '0'){
			$('#deng').attr('src', 'off.png');  
		}
		if(data.adData.slice(16,17) === '1'){
			$('#deng').attr('src', 'on.png');  
		}
	}
}

})