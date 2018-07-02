$(function () {
    var devices = {}
    var allRawData = ""
    var echart2 = {}
    echart = {}
    myChartx = {}
    myCharty = {}
    myChartz = {}
    myChartxfft = {}
    myChartyfft = {}
    myChartzfft = {}
    notifyData = {}
    iAlert_MACS = []
    iAlertarr = []
    connectFirst = false
    iAlertDevice = {
        real: {
            // temp: {}
        },
        real2: [], //真实的mac
        virtualSensor: [], //添加的chart的virtual Mac会在这里
        virtualMacArr: false, //总的virtual MAC 会shift头mac
        macRouterMap: {},
        newItem: false,
        connectNum: 0
    }
    var connecting = {};
    $('.alertclose').on('click', function(){
        $('.alert').hide()
    })
    $('.row').hide()
    //reload
    $('.refresh').on('click',function(){
        location.search = '?v='+(new Date()).getTime()
    })
    //start
    $('.Connect').on('click',function(){
        connectFirst = true
        iAlert_MACS = $(".devMac").val().trim().split(',')
        console.log("connecting...")
    })
    $('.Scan').on('click', function () {
        console.log("scanning...      Please waiting for the image ")
        $('.content1').empty()
        var macs = $('.devMac').val().split(',')
        var hub_mac = $('.hubIp').val().split(',')
        var task = []
        var index = 0
        for (let i in macs) {
            task.push(run.bind(null, hub_mac, macs[i], i, macs, next))
        }
        function next() {
            if (task.length) {
                task.shift()()
            }
        }
        next()
        $(".btn2").live('click',function(macs,i){
            let rawbtn = $(this).attr("id").substring(3,$(this).attr("id").length).replace(/:/g,'')
            $('#'+rawbtn).show()
        })
        $('.clo').live('click',function(macs,i){
            let rawbtn = $(this).attr("id").substring(3,$(this).attr("id").length).replace(/:/g,'')
            $('#'+rawbtn).hide()
        })
    })
    
    function run(hub_mac, device_mac, i, macs, callback) {
        everyData=[]
        tdData = []
        deviceData={
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
        }
        notifyData[macs[i]]={
            point: 0,
            data: ["",""],
            isOver:false
        }
        $('.row ul').empty()
        $('.all').append("<div class='row' id="+device_mac.toUpperCase().replace(/:/g,'')+"><button class='clo' id=clo"+device_mac.toUpperCase().replace(/,/g,'')+">close</button><ul class='devData' name=write"+device_mac.toUpperCase().replace(/:/g,'')+"></ul></div>")
        $('.content').append("<div class='content1 clearfix' name="+device_mac.toUpperCase()+"><ul class='date' name="+device_mac.toUpperCase()+"><li><span>Customer Tag:</span><span class='user'></span></li><li><span>Status：</span><span class='status'></span></li><li><span>Vrms X：</span><span class='V_X'></span></li><li><span>Vrms Y：</span><span class='V_Y'></span></li><li><span>Vrms Z：</span><span class='V_Z'></span></li><li><span>Battery:</span><span class='battery'></span></li><li><span>Temperature:</span><span class='temp'></span></li><li><span>Device Type:</span><span class='type'></span></li><li><span>Hours Running:</span><span class='hour'></span></li></ul><button class='btn2' id=raw"+device_mac.toUpperCase()+">Rawdata</button><div class='canvas'><div id="+device_mac.toUpperCase()+" style='width: 470px;height:300px;'></div></div><div class='canvas'><div id="+device_mac.toUpperCase()+"a"+" style='width: 470px;height:300px;'></div></div><div class='canvas'><div id='mainx"+device_mac.toUpperCase()+"' style='width: 470px;height:300px;'></div></div><div class='canvas'><div id='mainy"+device_mac.toUpperCase()+"' style='width: 470px;height:300px;'></div></div><div class='canvas'><div id='mainz"+device_mac.toUpperCase()+"' style='width: 470px;height:300px;'></div></div><div class='canvas'><div id='fftx"+device_mac.toUpperCase()+"' style='width: 470px;height:300px;'></div></div><div class='canvas'><div id='ffty"+device_mac.toUpperCase()+"' style='width: 470px;height:300px;'></div></div><div class='canvas'><div id='fftz"+device_mac.toUpperCase()+"' style='width: 470px;height:300px;'></div></div></div>")
        myChartx[device_mac.toUpperCase()] = echarts.init(document.getElementById('mainx'+device_mac.toUpperCase()));
        myCharty[device_mac.toUpperCase()] = echarts.init(document.getElementById('mainy'+device_mac.toUpperCase()));
        myChartz[device_mac.toUpperCase()] = echarts.init(document.getElementById('mainz'+device_mac.toUpperCase()));
        myChartxfft[device_mac.toUpperCase()] = echarts.init(document.getElementById('fftx'+device_mac.toUpperCase()));
        myChartyfft[device_mac.toUpperCase()] = echarts.init(document.getElementById('ffty'+device_mac.toUpperCase()));
        myChartzfft[device_mac.toUpperCase()] = echarts.init(document.getElementById('fftz'+device_mac.toUpperCase()));
        echart[device_mac.toUpperCase()]= echarts.init(document.getElementById(device_mac.toUpperCase()))
        echart2[device_mac.toUpperCase()]= echarts.init(document.getElementById(device_mac.toUpperCase()+"a"))
        if (device_mac.toUpperCase() == $(".content1 ul").eq(i).attr("name")){
            if(!devices[device_mac.toUpperCase()]){
                $('.content1 ul').eq(i).prepend("<p>"+device_mac.toUpperCase()+"</p>")
                devices[device_mac.toUpperCase()] = true;    
            }
        }
        var flag;
    api
    .use({
        server: $('.ip').val() || 'http://api.cassianetworks.com',
        hub: hub_mac || 'CC:1B:E0:E0:02:74',
        developer: $('.Developer').val() || 'tester',
        key:  $('.key').val() ||'10b83f9a2e823c47'
    })
    .oauth2({
        success: function () {
            var time = function(){
                return new Date();
            }
            var lastTime = 0;
            api
            //notify callback
            .scan({})
            .on('scan', function (hub, data) {
                if (data == ':keep-alive') return;

                var mac = JSON.parse(data).bdaddrs[0].bdaddr
                var type = JSON.parse(data).bdaddrs[0].bdaddrType
                if (connectFirst) {
                    if(iAlert_MACS.indexOf(mac) !== -1){

                        if(!connecting[mac]){
                            connecting[mac] = time();
                        }
                        lastTime = connecting[mac];
                        connecting[mac] = time();
                        if(time() - lastTime < 10000){
                            return;
                        }
                        if (!iAlertDevice.real[mac]) {
                            iAlertDevice.newItem = true;
                            iAlertDevice.real[mac] = {
                                connect: false,
                                created: false,
                                lastConnect: 1
                            };
                        }
                        iAlertarr.push(mac);
                            // console.log(iAlertDevice.real,iAlertDevice)

                        for (let i in iAlertDevice.real) {
                            if (!iAlertDevice.real[mac].connect) {
                                api
                                .conn({
                                    node: macs,
                                    type: type
                                })
                                .on('conn', function (hub, node, data) {
                                    if (iAlertDevice.real[node].connect) return; 
                                    iAlertDevice.real[node].connect = true;
                                    if(iAlertDevice.real[node].connect){
                                        callback && callback() 
                                        if (node) {
                                            api
                                            .write({
                                                handle: 28,
                                                node: node,
                                                value: 'f8'
                                            })
                                            .write({
                                                handle: 75,
                                                node: node,
                                                value: 'f9'
                                                
                                            })
                                        }
                                    } 
                                })
                                // console.log(iAlertDevice.real[mac].connect)
                            }
                        }
                    }
                }
                for (var i = 0; i < macs.length; i++) {
                var scanData = JSON.parse(data).adData
                if (mac == macs[i] && scanData) {
                    var date = new Date();
                    var h = date.getHours().toString().length === 1 ? "0" + date.getHours() : date.getHours();
                    var m = date.getMinutes().toString().length === 1 ? "0" + date.getMinutes() : date.getMinutes();
                    var s = date.getSeconds().toString().length === 1 ? "0" + date.getSeconds() : date.getSeconds();
                    var timer = h + ":" + m + ":" + s;
                    deviceData.dateArr.push(timer);
                    deviceData.date = deviceData.dateArr.slice(-10);
                    $(".content1 ul[name='"+macs[i].toUpperCase()+"']").find(".Revisions").html(scanData.substring(22,24))
                    $(".content1 ul[name='"+macs[i].toUpperCase()+"']").find(".user").html(scanData.substring(24,42))
                    $(".content1 ul[name='"+macs[i].toUpperCase()+"']").find(".status").html(parseInt(scanData.substring(42,46),16))
                    $(".content1 ul[name='"+macs[i].toUpperCase()+"']").find(".V_X").html(parseInt(scanData.substring(46,48),16))
                        xxx = parseInt(scanData.substring(46,48),16)
                        deviceData.V_X.push(xxx)
                        deviceData.V_X_A = deviceData.V_X.slice(-10)
                    $(".content1 ul[name='"+macs[i].toUpperCase()+"']").find(".V_Y").html(parseInt(scanData.substring(48,50),16))
                    yyy = parseInt(scanData.substring(48,50),16)
                        deviceData.V_Y.push(yyy)
                        deviceData.V_Y_A = deviceData.V_Y.slice(-10)
                    $(".content1 ul[name='"+macs[i].toUpperCase()+"']").find(".V_Z").html(parseInt(scanData.substring(50,52),16))
                    zzz = parseInt(scanData.substring(50,52),16)
                        deviceData.V_Z.push(zzz)
                        deviceData.V_Z_A = deviceData.V_Z.slice(-10)
                    $(".content1 ul[name='"+macs[i].toUpperCase()+"']").find(".battery").html(parseInt(scanData.substring(52,54),16))
                        aaa = parseInt(scanData.substring(52,54),16)
                        deviceData.dian.push(aaa)
                        deviceData.ddd = deviceData.dian.slice(-10)
                        //console.log(deviceData.ddd)
                    $(".content1 ul[name='"+macs[i].toUpperCase()+"']").find(".temp").html(parseInt(scanData.substring(54,56),16))
                        asd = parseInt(scanData.substring(54,56),16)
                        deviceData.wendu.push(asd);
                        deviceData.www = deviceData.wendu.slice(-10);
                        // console.log(deviceData.www)
                    $(".content1 ul[name='"+macs[i].toUpperCase()+"']").find(".type").html(parseInt(scanData.substring(56,58),16))
                    $(".content1 ul[name='"+macs[i].toUpperCase()+"']").find(".hour").html(parseInt(scanData.substring(58,62),16))
                    $(".content1 div[name='"+macs[i].toUpperCase()+"']").find("ul").prepend("<li>"+scanData.substring(58,62)+"</li>")    
                    ec(mac,deviceData.electricity_x,deviceData.wendu,echart,deviceData,echart2)
                }
                }
            })
            .on('notify',function(hub, data){
                R_judge = true
                if(data.match("keep")) return
                let deviceMac = JSON.parse(data).id;
                if(!notifyData[deviceMac.toUpperCase()]) return;
                let rawData = JSON.parse(data).value;
                $(".row ul[name=write"+deviceMac.toUpperCase().replace(/:/g,'')+"]").prepend("<li>"+rawData+"------"+deviceMac+"</li>")
                console.log(notifyData[deviceMac].point)
                let point = notifyData[deviceMac].point;
                if(rawData == "ff" || rawData == "fe") return;
                if(notifyData[deviceMac].isOver == true) return;
                if(rawData.match("00000000")){
                    notifyData[deviceMac].data[point] += rawData;
                    notifyData[deviceMac].point += 1;
                    if(notifyData[deviceMac].point >= 2){
                        notifyData[deviceMac].isOver = true;
                        console.log("Successful access to complete data , haha");
                        fft(notifyData,deviceMac,data)
                        return
                    }
                }
                notifyData[deviceMac].data[point] += rawData;
                console.log(notifyData[deviceMac].data);
            })
            
        }
    });
    
    }
})

function hash_change() {
    location.hash = $('.hubIp').val() + '|' + $('.devMac').val() + '|' + $('.ip').val() + '|' + $('.key').val() + '|' + $('.Developer').val()
}
$('.hubIp, .devMac, .ip, .key, .Developer').on('change', hash_change).on('keydown', hash_change).on('blur', hash_change)
var s = String(location.hash).replace('#', '').split('|')
$('.hubIp').val(s[0])
$('.devMac').val(s[1])
$('.ip').val(s[2])
$('.key').val(s[3])
$('.Developer').val(s[4])

