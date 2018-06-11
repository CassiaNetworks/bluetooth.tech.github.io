/**
 *      Created by guangyan on 2017/9/4.
 *      
 *      guangyan@cassianetworks.com
 */
var lang = {
    en: {
        'SamplingFrequency': 'Sampling Frequency',
        'RefreshRate': 'Refresh Rate',
        'connect': 'Connect',
        'disconnectAll': 'DisconnectAll',
        'receivepacket': 'Receive packet',
        'Accelerometer': 'Accelerometer',
        'Gyroscope': 'Gyroscope',
        'Magneto': 'Magneto-meter',
        'Humidity': 'Humidity',
        'Pressure': 'Pressure',
        'Temperature': 'Temperature',
        'Acoustic': 'Acoustic',
        'Digitlight': 'Digit light',
        'refBtn':"caiji",
        'electricity':'electricity',
        'batteryVoltage': 'Battery Voltage',
        'stop':'stop',
        'start':'start',
        'local':'local',
        'remote':'remote',
        'language':'language：',
        'timestamp':'Timestamp：',
        'systolic':'Systolic：',
        'diastolic':'Diastolic：',
        'meanAp':'MeanAp：',
        'pulseRate':'PulseRate：',
        'bodyMovement':'Body Movement：',
        'irregular':'Irregular：',
        'battery':'Battery：',
        'connStatus':'Connection Status：'

    },
    cn: {
        'SamplingFrequency': '采样频率',
        'RefreshRate': '页面刷新频率',
        'connect': '连接',
        'disconnectAll': '断开所有连接',
        'receivepacket': '收到数据包:',
        'Accelerometer': '加速度',
        'Gyroscope': '陀螺仪',
        'Magneto': '磁感',
        'Humidity': '湿度',
        'Pressure': '压力',
        'Temperature': '温度',
        //'Acoustic': '声感',
        'Digitlight': '光照',
        'refBtn':"采集",
        'electricity':'电流',
        'batteryVoltage': '电池电压',
        'stop':'停止',
        'start':'开始',
        'local':'本地',
        'remote':'远程',
        'language': '语言：',
        'control': '控制：',
        'timestamp':'时间：',
        'systolic':'收缩压：',
        'diastolic':'舒张压力：',
        'meanAp':'平均动脉压',
        'pulseRate':'脉搏：',
        'bodyMovement':'身体移动：',
        'irregular':'不规则脉搏：',
        'battery':'电量：',
        'connStatus':'连接状态：'
    },
    //useLang: getCookie('useLang') || 'en'
    useLang: mystorage.get('useLang') || 'en'
    //useLang: "cn" || 'en'
}

$('#lang').on('change', function () {
    console.log($(this).val())
        if ($(this).val() === 'en') {
            lang.useLang = 'en'
        } else {
            lang.useLang = 'cn'
        }
       // setCookie('useLang', lang.useLang, 100)
        mystorage.set('useLang',lang.useLang)
        location.reload()
});

function changeSelectLangShow() {
    $('#lang').val(lang.useLang)
}

function changeUiLangShow() {
    var text = ''
    $('.i18n').each(function () {
        text = lang[lang.useLang][$(this).attr('i18n')]
        if (text) {
            $(this).html(text)
        }
    })
}
changeSelectLangShow()
changeUiLangShow()


