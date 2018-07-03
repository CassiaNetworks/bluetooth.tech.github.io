/**
 * Created by KangWei on 2017/1/20.
 * 2017/1/20 16:17
 * Komodo
 */
const HEART_RATE_HANDLE_HW = 23; //HW330
const HEART_RATE_HANDLE_MIO = 15; //mio
const PULSE_OXIMETRY_HANDLER = 2066;
const REG_HW = /^HW330/i;
const REG_MIO = /^mio/i;
// let heartRateChart = echarts.init(document.getElementById('heart_rate_chart'));
let dataArrays = [];
let body = $('body')
let devices = [];
let charts = [];
let hubIP = '',
    devicesMac = '',
    reg_ip = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/,
    reg_mac = /^[0-f]{2}\:[0-f]{2}\:[0-f]{2}\:[0-f]{2}\:[0-f]{2}\:[0-f]{2}$/i;
let mio, heartRateValues, heartRateTime, connDevice = {};

let dataHandle = function (hub, data) {
    console.log(hub + data)
    if (data !== 'keep-alive') {
        let obj = JSON.parse(data);
        if (!heartRateValues) {
            heartRateValues = [];
            heartRateTime = [];
        } else if (heartRateValues.length > 120) {
            heartRateValues.shift();
            heartRateTime.shift();
        }
        if (obj) { //heart rate
            let date = new Date();
            let dateStr = [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');
            heartRateTime.push(dateStr);
            let index = indexOf(devices, obj);
            let dataArray = dataArrays[index];
            if (dataArray.length > 120) {
                dataArray.shift();
                heartRateTime.shift();
            }
            dataArray.push(parseInt(obj.value.substr(2, 2), 16));
            if (index < 0) return;
            charts[index].setOption({
                xAxis: {
                    data: heartRateTime
                },
                series: [{
                    data: dataArrays[index]
                }]
            })
        } else {

        }
    }
};

function indexOf(array, value) {
    if (array) {
        // if (array.indexOf) {
        //     return array.indexOf(value);
        // }
        for (let i = 0, len = array.length; i < len; i++) {
            if (array[i].mac == value.id || array[i].id == value.id) {
                return i;
            }
        }
    }
    return -1;
}
var timer = null;
let writeSpecialValue = function (e, args) {
    let pos = indexOf(devices, {
        id: args
    })
    // debugger

    devices[pos].conn = true;

    if (!timer) {
        timer = setInterval(function () {
            api.connlist({
                success: function (data) {
                    for (let i in devices) {
                        let mac = devices[i].mac,
                            conn = devices[i].conn
                        if (conn) {
                            let pos = indexOf(data.nodes, {
                                id: mac
                            })
                            if (pos == -1) {
                                // debugger
                                devices[i].conn = false
                            }
                        }
                    }

                }
            })
        }, 4000)
    }

    api.write({
        node: args,
        handle: REG_HW.test(devices[pos].version) ? HEART_RATE_HANDLE_HW : HEART_RATE_HANDLE_MIO,
        value: '0100'
    });

    // index++;
    // device = devices[index];
    // if (device && device.mac) {
    //     api
    //         .on('conn', writeSpecialValue)
    //         .on('notify', dataHandle)
    //         .conn({
    //             node: device.mac,
    //             type: 'random'
    //         })
    // }


};


function getIpMac() {
    hubIP = $('#hub_ip').val().trim()
    devicesMac = $('#device_mac').val().trim()
    if (!reg_ip.test(hubIP) || !reg_mac.test(devicesMac)) {
        layer.alert('hubIP或者MAC输入错误')
        return false
    }
    localStorage.setItem('komodo', JSON.stringify([hubIP, devicesMac]))
    return true
}

let index;
body.delegate('#start', 'click', function () {
    if (api.notfiy && api.notify.es)
        return
    //此接口用于连接设备
    console.log('connect clicked');
    // index = 0;
    // if (!getIpMac()) {
    //     return
    // }
    // let device = devices[index];
    api.notify(true)
    api.on('scan', function (hub, data) {
        var _data = data
        if (data === 'keep-alive') {
            return
        }
        _data = JSON.parse(data)
        let mac = _data.bdaddrs[0].bdaddr,
            pos = indexOf(devices, {
                id: mac
            });
        if ((pos > -1 && _data.adData && REG_HW.test(_data.name)) || (pos > -1 && _data.adData && REG_MIO.test(_data.name))) {
            let type = _data.bdaddrs[0].bdaddrType,
                version = _data.name;
            devices[pos].version = version
            if (!devices[pos].lastConn) {
                devices[pos].lastConn = 0
            }
            // console.log(version)

            let now = $.now()
            // console.log(mac, now, devices[pos].lastConn)
            if (now - devices[pos].lastConn > 3000 && !devices[pos].conn) {
                console.log(devices)
                devices[pos].lastConn = now
                api
                    .on('conn', writeSpecialValue)
                    .on('notify', dataHandle)
                    .conn({
                        node: mac,
                        type: type
                    })
            }
        }

    }).scan(0)





});

function stopAll() {
    api.notify(false)
    clearInterval(timer)
    api.scan.close()
    for (let dev of devices) {
        console.warn(dev)
        api.conn.close({
            node: dev.mac
        })
        dev.conn = false
    }
}

body.delegate('#stop', 'click', stopAll)

$('#resetall').on('click', function () {
    localStorage.removeItem('mio')
    for (let dev of devices) {
        api.conn.close({
            node: dev.mac
        })
    }

})

$('#disconnect').on('click', function () {
    if (!getIpMac()) {
        return
    }

    api
        .use({
            server: hubIP,
            hub: ''
        })
        .conn.close({
            node: devicesMac
        })
})

$('#start_heart').click(function () {
    api.write({
        node: devicesMac,
        handle: HEART_RATE_HANDLE,
        value: '0100'
    });
});

$('#stop_heart').click(
    function () {
        api.write({
            node: devicesMac,
            handle: HEART_RATE_HANDLE,
            value: '0000'
        });
    }
)

let tooltip = {
    trigger: 'axis',
};

let grid = {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
};

let xAxis = {
    type: 'category',
    boundaryGap: false,
    data: [],
};

let yAxis = {
    type: 'value',
    min: 40,
    max: 120
};

let series = [{
    type: 'line'
}];

// heartRateChart.setOption({
//     title: {
//         text: 'heart rate'
//     },
//     tooltip: tooltip,
//     xAxis: xAxis,
//     yAxis: {
//         name: 'bps'
//     },
//     series: series
// });

function restoreData(devices) {
    let content = '';
    if (devices) {
        for (let dev of devices) {
            content += dev.mac + ',' + dev.name + ';'
        }

        $("#devices_config").val(content);
    }
}

$(function () {

    let arrUl = $('.show-pannel ul');

    let lStorage = window.localStorage;


    let defaultData = {
        devices: '',
        hubIp: ''
    };


    if (lStorage.mio) {
        defaultData = JSON.parse(lStorage.mio);
        devices = defaultData.devices;
        api.use({
            server: defaultData.hubIp || '192.168.0.109',
        });

        // restoreData(devices);
        fillData(defaultData.devices);
    }
    $('#config').click(function () {
        if (lStorage.mio) {
            defaultData = JSON.parse(lStorage.mio);
        } else {
            defaultData = {
                devices: '',
                hubIp: ''
            }
        }
        layerIndex = layer.open({
            skin: 'config-layer',
            type: 1,
            title: ['Config' /**, 'font-size:30px;background:#f0a900;padding-top:10px;padding-bottom:10px;padding-left:20px;color:#fff;height:55px;line-height:55px;'*/ ],
            moveType: 1,
            area: ['550px', '300px'],
            shadeClose: true, //点击遮罩关闭
            content: alertContent
        });

        restoreData(defaultData.devices)

        $('#hub_ip').attr({
            value: defaultData.hubIp
        });



        $('#reset').click(function () {
            $('#hub_ip').val("");
            $('#devices_config').val("")
            lStorage.removeItem('mio')
        });

        $('#finish').click(function () {
            let devices = [];
            let hubIp = $('#hub_ip').val();
            let devicesConfig = $('#devices_config').val();
            // debugger
            let allDevices = devicesConfig.split(';');
            let reg_mac = /^([0-9a-f]{2}:){5}[0-9a-f]{2}$/i,
                reg_name = /\w+/,
                reg_ip = /^((([1-9]?|1\d)\d|2([0-4]\d|5[0-5]))\.){3}(([1-9]?|1\d)\d|2([0-4]\d|5[0-5]))$/
            if (!reg_ip.test(hubIp)) {
                alert('hubIP error')
                return
            }

            for (let device of allDevices) {
                if (device.trim()) {
                    let mac = device.split(',')[0],
                        name = device.split(',')[1]
                    if (!reg_name.test(name)) {
                        alert('name error')
                        return
                    }
                    if (!reg_mac.test(mac)) {
                        alert('sensor config error')
                        return
                    }
                    devices.push({
                        name: name,
                        mac: mac
                    })
                }
            }


            objData = {
                'hubIp': hubIp,
                'devices': devices
            };
            lStorage.mio = JSON.stringify({
                devices: objData.devices,
                hubIp: objData.hubIp,
            });

            api.use({
                server: hubIp || '192.168.0.109',
            })
            fillData(devices);

            layer.close(layerIndex);
            return false;
        })

    });

    /**
     * li 标签的模板
     */
    function sampleTem(obj) {
        let uiHtml = "";
        if (!obj) return;
        uiHtml = '<li><button class="layui-btn layui-btn-primary" id="start">start work</button>\
                              <button class="layui-btn layui-btn-primary" id="stop">stop</button>\
                        </li>'

        for (let i = 0; i < obj.length; i++) {
            let device = obj[i];
            if (device.mac) {
                uiHtml += (`
                        <li>
                            <div class="chart-style" id="${device.name}"></div>
                        </li>
                        `);
            }
        }
        return uiHtml
    }

    function fillData(data) {
        console.log('receiveData:', data);
        arrUl.html(sampleTem(data))

        for (let dev of data) {
            let chart = echarts.init(document.getElementById(dev.name));
            // 指定图表的配置项和数据
            let option = {
                title: {
                    text: dev.name
                },
                tooltip: tooltip,
                xAxis: xAxis,
                yAxis: {
                    name: 'bps',
                    min: 40,
                    max: 120
                },
                series: series
            };
            chart.setOption(option);
            charts.push(chart);
            dataArrays.push([])
        }

    }

    let alertContent = `<div class="layui-form config">
                <div class="layui-form-item">
                    <label class="layui-form-label">HUB IP</label>
                    <div class="layui-input-inline">
                        <input type="text" name="hubIp" id="hub_ip" placeholder="Please type the local hub's ip"   value="" class="layui-input">
                    </div>
                </div>

                <div class="layui-form-item layui-form-text sensor-config">
                    <label class="layui-form-label">sensor config</label>
                    <div class="layui-input-inline">
                      <textarea placeholder="C0:77:19:AA:5D:B2,li;E9:14:DD:A4:C2:9C,lll;" id="devices_config" class="layui-textarea"></textarea>
                    </div>
                </div>

                <div class="layui-form-item">
                    <div class="layui-input-block">
                        <button class="layui-btn layui-btn-warm" id="reset">Reset</button>
                        <button class="layui-btn layui-btn-warm" id="finish" >Done</button>
                    </div>
                </div>

            </div>`;
})