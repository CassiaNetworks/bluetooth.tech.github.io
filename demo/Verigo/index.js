$(function () {
    console.log(Date.now())
    var myChart = echarts.init(document.getElementById('main'))
    var myChart1 = echarts.init(document.getElementById('main1'))
    var myChart2 = echarts.init(document.getElementById('main2'))
    let tooltip = {
            trigger: 'axis',
        };

        let grid = {
            left: '3%',
            right: '0%',
            bottom: '3%',
            containLabel: true
        };

        let xAxis = {
            nameLocation: 'middle',
            name: 'time',
            type: 'category',
            boundaryGap: false,
            data: []
        };
        myChart.setOption({
            title: {
                text: 'temperatureC8:FD:19:A1:77:36'
            },
            tooltip: tooltip,
            xAxis: xAxis,
            yAxis: {
                name: '℉',
                min:'dataMin',
                max:'dataMax'
            },
            grid: grid,
            series: [{
                name: 'temperature',
                type: 'line',
                sampling: 'average'
            }]
        });
        myChart1.setOption({
            title: {
                text: 'humidityC8:FD:19:A1:77:36'
            },
            tooltip: tooltip,
            xAxis: xAxis,
            yAxis: {
                name: 'RH',
                min:'dataMin',
                max:'dataMax'
            },
            grid: grid,
            series: [{
                name: 'humidity',
                type: 'line',
                sampling: 'average'
            }]
        });
        myChart2.setOption({
            title: {
                text: 'temperature88:C2:55:AF:F7:94'
            },
            tooltip: tooltip,
            xAxis: xAxis,
            yAxis: {
                name: '℉',
                min:'dataMin',
                max:'dataMax'
            },
            grid: grid,
            series: [{
                name: 'temperature',
                type: 'line',
                sampling: 'average'
            }]
        });
    $('.Scan').on('click',function(){
        // console.log(123)
        function run(hub_mac, device_mac, i, macs, callback) {
            var hub_mac = $('.hubIp').val()
            var devmacs = [];
            var devmacs = $('.devMac').val().split(',')
            var obj = {
                tem:[],
                hum:[],
                onlytem:[],
                date:[]
            }
            var only=[];
            var huni=[];
            var temp=[]
            var a=[];
            api
                .use({
                    server: $('.ip').val() || 'http://api.cassianetworks.com',
                    hub: hub_mac || 'CC:1B:E0:E0:02:74',
                    developer: $('.Developer').val() || 'tester',
                    key:  $('.key').val() ||'10b83f9a2e823c47'
                })
                .oauth2({
                    success: function () {
                        api
                        .scan({

                        })
                        .on('scan', function (hub, data) {
                            let scanData = JSON.parse(data).scanData
                            if (!scanData) {return}
                            let devmac = JSON.parse(data).bdaddrs[0].bdaddr
                            if (scanData.length == 62) {
                                switch(scanData.substring(8, 10)){
                                    case "01":
                                        raw = "0x" + scanData.substring(34, 36) + scanData.substring(32, 34)+scanData.substring(30, 32)
                                        raw_tem =(((parseInt(raw.substring(2, 5),16)*10*0.01)*9)/5)+32
                                        // ((cTemp*9)/5) + 32
                                        raw_hum = parseInt(raw.substring(5, 8),16)
                                        obj.onlytem.push(raw_tem)
                                        timer = format(Date.now(), 'MM-dd HH:mm:ss')
                                        obj.date.push(timer);
                                        obj.hum.push(raw_hum)
                                        date = obj.date.slice(-10)
                                        humi = obj.hum.slice(-10)
                                        only = obj.onlytem.slice(-10)
                                        ec(only,humi,date)
                                    break;
                                    case "02":
                                        timer = format(Date.now() , 'MM-dd HH:mm:ss')
                                        obj.date.push(timer);
                                        date = obj.date.slice(-10)
                                        raw = "0x" + scanData.substring(34, 36) + scanData.substring(32, 34)+scanData.substring(30, 32)
                                        only_tem = (((parseInt(raw.substring(2, 5),16)*10*0.01)*9)/5)+32
                                        obj.tem.push(only_tem)
                                        temp = obj.tem.slice(-10)
                                        onlytem(temp, date)
                                    break;
                                }
                            }else{
                                return
                            }
                            
                        })
                    }
                });    
        }
        run()
    })
    function ec(temp,humi,date){
        console.log(temp,humi)
            myChart.setOption({
                xAxis: {
                    data: date
                },
                series: [{
                    data: temp
                }]
            });
            myChart1.setOption({
                xAxis: {
                    data: date
                },
                series: [{
                    data: humi
                }]
            })
    }
    function onlytem(only,date){
        console.log(only,date)
            myChart2.setOption({
                xAxis: {
                    data: date
                },
                series: [{
                    data: only
                }]
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

var format = function (time, format) {
    var t = new Date(time);
    var tf = function (i) {
        return (i < 10 ? '0' : '') + i
    };
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
        switch (a) {
            case 'yyyy':
            return tf(t.getFullYear());
            break;
            case 'MM':
            return tf(t.getMonth() + 1);
            break;
            case 'mm':
            return tf(t.getMinutes());
            break;
            case 'dd':
            return tf(t.getDate());
            break;
            case 'HH':
            return tf(t.getHours());
            break;
            case 'ss':
            return tf(t.getSeconds());
            break;
        }
    })
}
