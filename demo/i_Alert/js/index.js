/**
 *      Created by guangyan on 2017/6/9.
 *      2016/12/27 16:49
 *      guangyan@cassianetworks.com
 *      df095efe1f027001290994ef52ff76ff65fe
 *      df-09-5e-fe-1f-02-70-01-29-09-94-ef-52-ff-76-ff-65-fe
 *      
 *      Gyro  0-5字节
 *      GyroX : 09df
 *      GyroY : fe5e
 *      GyroZ : 021f
 *
 *      Acc  6-11字节
 *      AccX : 0170
 *      AccY : 0929
 *      AccZ : ef94
 *
 *      Mag 7-12字节
 *      MagX : 2901
 *      MagY : ff76
 *      MagZ : fe65  
 *      
 */
$(document).ready(function(){
handle_value = {
    37:"0100",39:"01",45:"0100",47:"01",53:"0100",55:"01",69:"0100",71:"01",61:"0100",63:"ff00"
}

var host,username,password,APmac,token,isconnect = false;
var ref = "64"; //采集数据默认值
var refArr = {
        41:ref,49:ref,57:ref,73:ref
    }
var connectNum = 0;//连接device的数量
//断开连接
$(".disconbtn").on('click',function(){
    $.each( device.real, function( index, val ) {
        console.log(index,val);
        disconnect(host,APmac,index,token);
    });

    location.reload();
    
  /*  oAuth("192.168.199.237","tester","10b83f9a2e823c47")*/
});
/*//调节速率 的demo
$('.refbtn').on('click',function(){

});*/
//开始连接
$(".conbtn").on('click',function(){
    host = $("#acaddress").val().trim();
    username = $("#username").val().trim();
    password = $("#password").val().trim();
    APmac = $("#apmac").val().trim();
    if(host == "" || username == "" || password == "" || APmac == ""){
        alert("The input can not be empty");
        return;
    }
    oAuth(host,username,password).then(function(value){// 获取token
        console.log(value)
        token = value;
        if(token === "err" || !token){
            alert("To get token failed, check AC address and Developer");
            return 
        }
        else{
            scan(host,APmac,token,scan2conn);
            notification(host,APmac,token,notify2canvas);
        }
    }).catch(function(){
        console.log("获取token失败，请检查填写是否正确");
    }); // oauth

});

$("#ref").on("change",function(){
    console.log($(this).val()/100 + "s");
    $("#refTime").html("("+$(this).val() / 100 + "s)");
    ref = parseInt($(this).val(),10).toString(16);
    console.log(ref)
    refArr = {
        41:ref,49:ref,57:ref,73:ref
    }
});



let connectedDeviceCount = function (device) {
    let n = 0;
    for (let i in device.real) {
        if (device.real[i].connect && !device.real[i].virtual) {
            n++
        }
    }
    console.log('n', n)
    return n
}


function scan2conn(scanData){
     //   console.log(scanData)
        let data = JSON.parse(scanData);
        let mac = data.bdaddrs[0].bdaddr;
        let deviceName = data.name;
        //if($.inArray(mac,nodeArr) != -1){
        if(deviceName == "CC2650 SensorTag"){
            if (!device.real[mac]) {
                device.newItem = true
                device.real[mac] = {
                    name: data.name,
                    connect: false,
                    created: false,
                    lastConnect: 1
                }
                if (connectNum === 0) {
                    $.extend(true, device.real[mac], device.real.temp);
                    delete device.real.temp
                }
            }
            if(device.newItem){
                let newConnect = new Date().getTime();
                for (let i in device.real) {
                    if (!device.real[i].connect) {
                        let lastConnect = device.real[i].lastConnect
                        if (lastConnect && (newConnect - lastConnect <= 5000)) return
                        device.real[i].lastConnect = newConnect;
                        console.log('正在连接', i);
                        connect(host,APmac,mac,token,function(){
                            console.log("connect",mac)
                            if (device.real[mac].connect) return;
                            device.real[mac].connect = true;
                            device.real2.push(mac);
                            connectNum = connectedDeviceCount(device);
                            if (connectNum === 1) {
                                $('#graphic .message').eq(0).children('b').html(`Mac:${mac}`);
                                $('#graphic .chart')[0].dataset.mac = i;
                               // $('#graphic .name')[0].innerHTML = device.real[i].name;
                            } else {
                                !device.real[mac].created && createChart(connectNum, device.real[i].name, mac)
                            }
                            $.extend(true, device.real[mac], deviceDataInit);
                            co(function*(){
                                try {
                                for(let key in handle_value) {
                                    console.log(key,handle_value[key]);
                                    yield write(host,APmac,mac,key,handle_value[key],token).catch(function(){
                                        //console.log(mac,key)
                                        device.real[mac].connect = false;
                                        disconnect(host,APmac,mac,token);
                                        throw "guale";
                                    });
                                }  
                                    for(let k in refArr){
                                        console.log(k,ref)
                                        yield write(host,APmac,mac,k,refArr[k],token);
                                    }     
                                } catch(e) {
                                    console.log(e);
                                }
                            });
                        });
                    }
                }
            }
                
    }
}
/*function writeALL(){
    co(function*(){
        try {
        for(let key in handle_value) {
            console.log(key,handle_value[key])
            yield write(host,APmac,node,key,handle_value[key],token);
        }               
        } catch(e) {
            console.log(e);
        }
    });
}*/

function notify2canvas(notifyData){
    //console.log(notifyData)
    let data = JSON.parse(notifyData);
    let mac = data.id;
    let handle = data.handle;
    let value = data.value;
    if (typeof device.real[mac] === 'undefined')
            return
    //console.log(handle,value); 
        let date = new Date();
        let dateStr = [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');

    switch(handle){
        case 36:
            let temp = sensorTmp007Convert(value);
            let temperatureData = device.real[mac].temperatureData,
            temperatureDate = device.real[mac].temperatureDate;
            temperatureData.push(temp);
            temperatureDate.push(dateStr);
            if(temperatureData.length >= 12){
                temperatureData.shift();
                temperatureDate.shift();
            }

            device.real[mac].temperatureChart.setOption({
                xAxis: {
                    data: temperatureDate
                },
                series: [{
                    data: temperatureData
                }]
            });
            
        break;

        case 44:
            let hum = sensorHdc1000Convert(value);
            let humData = device.real[mac].humData,
            humDate = device.real[mac].humDate;
            humData.push(hum);
            humDate.push(dateStr);

            if(humData.length >= 12){
                humData.shift();
                humDate.shift();
            }
            device.real[mac].humChart.setOption({
                xAxis: {
                    data: humDate
                },
                series: [{
                    data: humData
                }]
            });
        break;
        case 52:
            let pressure = calcBmp280(value);
            let pressureData = device.real[mac].pressureData,
            pressureDate = device.real[mac].pressureDate;
            pressureData.push(pressure);
            pressureDate.push(dateStr);
            if(pressureData.length >= 12){
                pressureData.shift();
                pressureDate.shift();
            }

            device.real[mac].pressureChart.setOption({
                xAxis: {
                    data: pressureDate
                },
                series: [{
                    data: pressureData
                }]
            });
            
        break;
        case 68://光
            let light = SensorOpt3001_convert(value);
            let lightData = device.real[mac].lightData,
            lightDate = device.real[mac].lightDate;
            //console.log(68,value,light)
            lightData.push(light);
            lightDate.push(dateStr);
            if(lightData.length >= 12){
                lightData.shift();
                lightDate.shift();
            }

            device.real[mac].lightChart.setOption({
                xAxis: {
                    data: lightDate
                },
                series: [{
                    data: lightData
                }]
            });
            
        break;
        case 60://运动demo
           // console.log(value);
            let gyroarr = gyro(value);
            let accarr = acc(value);
            let magarr = mag(value);
            let accxData = device.real[mac].accxData,
                accyData = device.real[mac].accyData,
                acczData = device.real[mac].acczData,
                accDate = device.real[mac].accDate,
                gyroxData = device.real[mac].gyroxData,
                gyroyData = device.real[mac].gyroyData,
                gyrozData = device.real[mac].gyrozData,
                gyroDate = device.real[mac].gyroDate,
                magneticDate = device.real[mac].magneticDate,
                magneticxData = device.real[mac].magneticxData,
                magneticyData = device.real[mac].magneticyData,
                magneticzData = device.real[mac].magneticzData;
               // magnetometerRData = device.real[mac].magnetometerRData;

                accxData.push(accarr[0]);
                accyData.push(accarr[1]);
                acczData.push(accarr[2]);
                accDate.push(dateStr);
                gyroxData.push(gyroarr[0]);
                gyroyData.push(gyroarr[1]);
                gyrozData.push(gyroarr[2]);
                gyroDate.push(dateStr);
                magneticxData.push(magarr[0]);
                magneticyData.push(magarr[1]);
                magneticzData.push(magarr[2]);
                magneticDate.push(dateStr);
                if(accxData.length >= 12){
                    accxData.shift();
                    accyData.shift();
                    acczData.shift();
                    accDate.shift();
                    gyroxData.shift();
                    gyroyData.shift();
                    gyrozData.shift();
                    gyroDate.shift();
                    magneticxData.shift();
                    magneticyData.shift();
                    magneticzData.shift();
                }

                device.real[mac].accChart.setOption({
                    xAxis: {
                        data: accDate
                    },
                    series: [{
                        data: accxData
                    }, {
                        data: accyData
                    }, {
                        data: acczData
                    }]
                });
                device.real[mac].gyroChart.setOption({
                    xAxis: {
                        data: gyroDate
                    },
                    series: [{
                        data: gyroxData
                    }, {
                        data: gyroyData
                    }, {
                        data: gyrozData
                    }]
                });
                device.real[mac].magneticChart.setOption({
                    xAxis: {
                        data: magneticDate
                    },
                    series: [{
                        data: magneticxData
                    }, {
                        data: magneticyData
                    }, {
                        data: magneticzData
                    },]
                });
        break;
    }
}
let device = {
    real: {
        temp: {}
    },
    real2: [], //真实的mac
    virtualSensor: [], //添加的chart的virtual Mac会在这里
    virtualMacArr: false, //总的virtual MAC 会shift头mac
    macRouterMap: {},
    newItem: false
};

var chartInit = function (n, mac) {
    let _mac = mac || 'temp',
        _n = n - 1
    device.real[_mac].accChart = echarts.init($('.acc')[_n]);
    device.real[_mac].gyroChart = echarts.init($('.gyro')[_n]);
    device.real[_mac].magneticChart = echarts.init($('.magnetic')[_n]);
    device.real[_mac].lightChart = echarts.init($('.light')[_n]);
    device.real[_mac].temperatureChart = echarts.init($('.temperature')[_n]);
    device.real[_mac].humChart = echarts.init($('.hum')[_n]);
    device.real[_mac].pressureChart = echarts.init($('.pressure')[_n]);

        let tooltip = {
            trigger: 'axis',
            // formatter: function (params) {
            //     params = params[0];
            //     let date = new Date(params.name);
            //     return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '</br>' ;
            // },
        };
        let xAxis = {
                nameLocation: 'middle',
                name: 'time',
                type: 'category',
                boundaryGap: false,
                data: []
            }
        let grid = {
                left: '3%',
                right: '0%',
                bottom: '3%',
                containLabel: true
            };

        device.real[_mac].accChart.setOption({
            title: {
                text: lang[lang.useLang].Accelerometer
            },
            tooltip: {
                trigger: 'axis',
            },/*
            legend: {
                data: ['x', 'y', 'z']
            },*/
            xAxis: xAxis,
            yAxis: {
                name: 'm/s²'
            },
            grid: grid,
            series: [{
                name: 'x',
                type: 'line',
                sampling: 'average'
            }, {
                name: 'y',
                type: 'line',
                sampling: 'average',
            }, {
                name: 'z',
                type: 'line',
                sampling: 'average',
            }]
        });

        device.real[_mac].gyroChart.setOption({
            title: {
                text: lang[lang.useLang].Gyroscope
            },
            tooltip: tooltip,
            xAxis: xAxis,
            yAxis: {
                name: '°/S'
            },
            grid: grid,
            series: [{
                name: 'x',
                type: 'line',
                sampling: 'average',
            }, {
                name: 'y',
                type: 'line',
                sampling: 'average',
            }, {
                name: 'z',
                type: 'line',
                sampling: 'average',
            }]
        });
        device.real[_mac].magneticChart.setOption({
            title: {
                text: lang[lang.useLang].Magneto
            },
            tooltip: tooltip,
            xAxis: xAxis,
            yAxis: {
                name: 'uT'
            },
            grid: grid,
            series: [{
                name: 'x',
                type: 'line',
                sampling: 'average'
            }, {
                name: 'y',
                type: 'line',
                sampling: 'average'
            }, {
                name: 'z',
                type: 'line',
                sampling: 'average'
            }, /*{
                name: 'r',
                type: 'line',
                sampling: 'average'
            }*/]
        })
        device.real[_mac].lightChart.setOption({
            title: {
                text: lang[lang.useLang].Digitlight
            },
            tooltip: tooltip,
            xAxis: xAxis,
            yAxis: {
                name: 'lux'
            },
            grid: grid,
            series: [{
                name: lang[lang.useLang].Digitlight,
                type: 'line',
                sampling: 'average'
            }]
        });

        device.real[_mac].temperatureChart.setOption({
            title: {
                text: lang[lang.useLang].Temperature
            },
            tooltip: tooltip,
            xAxis: xAxis,
            yAxis: {
                name: '℃'
            },
            grid: grid,
            series: [{
                name: lang[lang.useLang].Temperature,
                type: 'line',
                sampling: 'average'
            }]
        });

        device.real[_mac].humChart.setOption({
            title: {
                text: lang[lang.useLang].Humidity
            },
            tooltip: tooltip,
            xAxis: xAxis,
            yAxis: {
                name: 'rh%'
            },
            grid: grid,
            series: [{
                name: lang[lang.useLang].Humidity,
                type: 'line',
                sampling: 'average'
            }]
        });
        device.real[_mac].pressureChart.setOption({
            title: {
                text: lang[lang.useLang].Pressure
            },
            tooltip: tooltip,
            xAxis: xAxis,
            yAxis: {
                name: 'kPa'
            },
            grid: grid,
            series: [{
                name: lang[lang.useLang].Pressure,
                type: 'line',
                sampling: 'average'
            }]
        });
        mac === 'temp' ? device.real[_mac].created = true : 0;
};
    chartInit(1);

    let deviceDataInit = {
            accxData: [],
            accyData: [],
            acczData: [],
            accDate: [],
            gyroxData: [],
            gyroyData: [],
            gyrozData: [],
            gyroDate: [],
            lightData: [],
            lightDate: [],
            noiseData: [],
            noiseDate: [],
            temperatureData: [],
            temperatureDate: [],
            humData: [],
            humDate: [],
            pressureData: [],
            pressureDate: [],
            magneticDate: [],
            magneticxData: [],
            magneticyData: [],
            magneticzData: [],
            magnetometerRData: []
        };
        function createChart(n, name, mac) {
            let chartHtmlStr = function () {
                return `<div class="chart" data-mac='${mac}'>
            <div class="content-header">
                <h1 style="display: inline;">TI&nbsp;</h1>
                <span class="name"></span>
                <b>Mac:</b>
                <span class="hidden">状态:</span>
                <span class="status hidden">在线</span>
            </div>
            <div class="row">
              <div class="col-md-3"><div class="temperature pic"></div></div>
              <div class="col-md-3"><div class="hum pic"></div></div>
              <div class="col-md-3"><div class="pressure pic"></div></div>
              <div class="col-md-3"><div class="light pic"></div></div>
            </div>
            <div class="row">
             <div class="col-md-3"> <div class="gyro pic"></div></div>
              <div class="col-md-3"><div class="acc pic"></div></div>
              <div class="col-md-3"><div class="magnetic pic"></div></div>`;
            };
            let chartList = $('#graphic .chart');
            if (chartList[0].dataset.mac === '') {
                chartList[0].dataset.mac = mac;
                //$(chartList[0]).find('span')[0].innerHTML = name;
                device.real[mac].created = true;
            } else {
                $('#graphic').append(chartHtmlStr());
                chartInit(n, mac);
                console.log(n,mac);
               // $('#graphic .message').eq(n-1).children('b').html(`Mac:${mac}`);
                $('#graphic .chart:eq(1)').find('b').html(`Mac:${mac}`);
                $('#graphic .chart')[n-1].dataset.mac = mac;
            }
        }
});

