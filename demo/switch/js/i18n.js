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
        'vrms_iAlert':"Vrms_iAlert",
        'fft_iAlert_x':"fft_iAlert_x",
        'fft_iAlert_y':"fft_iAlert_y",
        'fft_iAlert_z':"fft_iAlert_z",
        'time_iAlert_x':"time_iAlert_x",
        'time_iAlert_y':"time_iAlert_y",
        'time_iAlert_z':"time_iAlert_z",
        'stop':'stop',
        'ready':'start',
        'local':'local',
        'remote':'remote'

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
        'vrms_iAlert':"Vrms_iAlert",
        'fft_iAlert_x':"fft_iAlert_x",
        'fft_iAlert_y':"fft_iAlert_y",
        'fft_iAlert_z':"fft_iAlert_z",
        'time_iAlert_x':"时间波_x",
        'time_iAlert_y':"时间波_y",
        'time_iAlert_z':"时间波_z",
        'stop':'停止',
        'ready':'开始',
        'local':'本地',
        'remote':'远程'
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


