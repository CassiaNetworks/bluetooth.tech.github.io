/*

02-01-06-0E-16- F4-FD - 01 -20-63-DC-DE-A0-3F-00-01-9B-97
               UUID  包的类型
02 01 06 0E 16 F4FD  01    1D315CB77897000500B6
 */

$(function () {
    var devices = {};
    //reload
    $('.refresh').on('click',function(){
        location.search = '?v='+(new Date()).getTime();
    });
    //start
    $('.btn1').on('click', function () {
        var macs = $('.devMac').val().split(',');
        var hub_mac = $('.hubIp').val().split(',');
        // console.log(macs)
        var task = [];
        var index = 0;
        for (let i in macs) {
            task.push(run.bind(null, hub_mac, macs[i], i, macs, next))
        }
        function next() {
            if (task.length) {
                task.shift()();
            }
        }
        next();
    });
echarts2={};
    function run(hub_mac, device_mac, i, macs, callback) {
        /*deviceData={
            //arrays for raw data
            T_time : [],
            T_temperature : [],
            electricity : [],
            T_time_x : [],
            T_temperature_x : [],
            electricity_x : [],
            _sss:[],
            real:{

            },
            wendu : [],
            www :[],
            dian:[],
            ddd:[],
            timeFin:{},
            hours:[],
            hours_a:[],
            status:[],
            status_a:[],
            V_X:[],
            V_Y:[],
            V_Z:[],
            V_X_A:[],
            V_Y_A:[],
            V_Z_A:[],
            dateArr:[],
            date:[]
        }*/
        if(!devices[device_mac.toUpperCase()]){
            $('.content1').append(

            `<ul class='date' name="`+device_mac.toUpperCase()+`">
              <li>
                <span>Battery Flag :</span>
                <span class='BatteryFlag'></span>
              </li>
              <li>
                <span>Config ID : </span>
               <span class='ConfigID'></span>
             </li>
             <li>
               <span>Transmissin ID：</span>
               <span class='TransmissinID'></span>
             </li>
             <li>
               <span>Serial Number：</span>
               <span class='SerialNumber'></span>
             </li>
             <li>
               <span>Cumulative Machine Hours：</span>
               <span class='CumulativeMachineHours'></span>
             </li>`)
            if (device_mac.toUpperCase() == $(".content1 ul").eq(i).attr("name")){
                $('.content1 ul').eq(i).prepend("<p>"+device_mac.toUpperCase()+"</p>")     
        }
                devices[device_mac.toUpperCase()] = true;    
        }
        
        //  
        //  </ul>
        //    <div class='canvas'>
        //      <div id="+device_mac.toUpperCase()+" style='width: 1000px;height:500px;'></div>
        //     </div>
        //     <div class='canvas'>
        //       <div id="+device_mac.toUpperCase()+"a"+" style='width: 1000px;height:500px;'></div>
        //     </div>")
        //echarts[device_mac.toUpperCase()]= echarts.init(document.getElementById(device_mac.toUpperCase()))
        //echarts2[device_mac.toUpperCase()]= echarts.init(document.getElementById(device_mac.toUpperCase()+"a"))
        //
        
        //setup trend data chart
        
        var flag;
    api
    .use({
        server: $('.ip').val() || 'http://api.cassianetworks.com',
        hub: hub_mac || 'CC:1B:E0:E0:02:74',
        developer: 'tester',
        key: '10b83f9a2e823c47'
    })
    .oauth2({
        success: function () {
            api
            //notify callback
            .scan({})
            .on('scan', function (hub, data) {
            if (data == ':keep-alive') return;
            var mac = JSON.parse(data).bdaddrs[0].bdaddr;
            if(macs.indexOf(mac) == -1) return;
            // console.log(mac)
            //console.log("test-----test",data,macs);
                
            //for (var i = 0; i < macs.length; i++) {
            var scanData = JSON.parse(data).adData || JSON.parse(data).adData;
            //console.log("scanData::",scanData);
            if (!scanData) return ;
                var valid = scanData.slice(-20);
                console.log("valid",valid);
                var endNum = "";
                for(let i = 0,len = valid.length;i<len;i = i + 2){
                    let num = parseInt(valid.slice(i,i+2),16).toString(2).toString();
                    if(num.length < 8){
                        for(let j = 0,len2 = 8-num.length; j < len2; j++){
                            num = "0" + num;
                        }
                    } 
                    endNum += num;
                }
                console.log("endNum::",endNum);
                if(endNum.length !== 80) return;
                let BatteryFlag = parseInt(endNum.slice(0,1),2);
                let ConfigID = parseInt(endNum.slice(1,5),2);
                let TransmissinID = parseInt(endNum.slice(5,18),2);
                let SerialNumber = parseInt(endNum.slice(18,48),2);
                let CumulativeMachineHours = parseInt(endNum.slice(48,80),2);
                console.log("BatteryFlag",BatteryFlag);
                /*
                var date = new Date();
                var h = date.getHours().toString().length === 1 ? "0" + date.getHours() : date.getHours();
                var m = date.getMinutes().toString().length === 1 ? "0" + date.getMinutes() : date.getMinutes();
                var s = date.getSeconds().toString().length === 1 ? "0" + date.getSeconds() : date.getSeconds();
                var timer = h + ":" + m + ":" + s;
                deviceData.dateArr.push(timer);
                deviceData.date = deviceData.dateArr.slice(-10);*/
               // console.log("test::",macs);
                $(".content1 ul[name='"+mac.toUpperCase()+"']").find(".BatteryFlag").html(BatteryFlag)
                $(".content1 ul[name='"+mac.toUpperCase()+"']").find(".ConfigID").html(ConfigID)
                $(".content1 ul[name='"+mac.toUpperCase()+"']").find(".TransmissinID").html(TransmissinID)
                $(".content1 ul[name='"+mac.toUpperCase()+"']").find(".SerialNumber").html(SerialNumber)
                $(".content1 ul[name='"+mac.toUpperCase()+"']").find(".CumulativeMachineHours").html(CumulativeMachineHours)
                       /* xxx = parseInt(scanData.substring(46,48),16)
                        deviceData.V_X.push(xxx)
                        deviceData.V_X_A = deviceData.V_X.slice(-10)
                        //console.log(deviceData.V_X_A)
                    $(".content1 ul[name='"+macs[i].toUpperCase()+"']").find(".V_Y").html(parseInt(scanData.substring(48,50),16))
                    yyy = parseInt(scanData.substring(48,50),16)
                        deviceData.V_Y.push(yyy)
                        deviceData.V_Y_A = deviceData.V_Y.slice(-10)
                        //console.log(deviceData.V_Y_A)
                    $(".content1 ul[name='"+macs[i].toUpperCase()+"']").find(".V_Z").html(parseInt(scanData.substring(50,52),16))
                    zzz = parseInt(scanData.substring(50,52),16)
                        deviceData.V_Z.push(zzz)
                        deviceData.V_Z_A = deviceData.V_Z.slice(-10)
                        //console.log(deviceData.V_Z_A)
                    $(".content1 ul[name='"+macs[i].toUpperCase()+"']").find(".battery").html(parseInt(scanData.substring(52,54),16))
                        aaa = parseInt(scanData.substring(52,54),16)
                        deviceData.dian.push(aaa)
                        deviceData.ddd = deviceData.dian.slice(-10)
                        //console.log(deviceData.ddd)
                    $(".content1 ul[name='"+macs[i].toUpperCase()+"']").find(".temp").html(parseInt(scanData.substring(54,56),16))
                        asd = parseInt(scanData.substring(54,56),16)
                        deviceData.wendu.push(asd);
                        deviceData.www = deviceData.wendu.slice(-10);
                        console.log(deviceData.www)
                    $(".content1 ul[name='"+macs[i].toUpperCase()+"']").find(".type").html(parseInt(scanData.substring(56,58),16))
                    $(".content1 ul[name='"+macs[i].toUpperCase()+"']").find(".hour").html(parseInt(scanData.substring(58,62),16))
                    $(".content1 div[name='"+macs[i].toUpperCase()+"']").find("ul").prepend("<li>"+scanData.substring(58,62)+"</li>")    
                    ec(mac,deviceData.electricity_x,deviceData.wendu,echarts,deviceData,echarts2)*/
            //}
            callback && callback() 
            });
        }
    });
    }
});


function scanParse(hubMac, scanData){
    let data = JSON.parse(scanData);
    let mac = data.bdaddrs[0].bdaddr;
    let type = data.bdaddrs[0].bdaddrType;
    let deviceName = data.name;
}
function hash_change() {
    location.hash = $('.hubIp').val() + '|' + $('.devMac').val() + '|' + $('.ip').val()
}
$('.hubIp, .devMac, .ip').on('change', hash_change).on('keydown', hash_change).on('blur', hash_change)
var s = String(location.hash).replace('#', '').split('|')
$('.hubIp').val(s[0])
$('.devMac').val(s[1])
$('.ip').val(s[2])

