/**
 * i18n.js
 * Internationalization options to enable localization.
 * 
 * Created by guangyan on 2017/6/9.
 * 2016/12/27 16:49
 * guangyan@cassianetworks.com
 *
 * Cleaned up by Kevin Yang 2019/3/1
 * kevin@cassianetworks.us
 */

var lang = {
  en: {
    'SamplingFrequency': 'Sampling Frequency',
    'RefreshRate': 'Refresh Rate',
    'connect': 'Connect',
    'disconnectAll': 'Disconnect All',
    'receivepacket': 'Receive packet',
    'Accelerometer': 'Accelerometer',
    'Gyroscope': 'Gyroscope',
    'Magneto': 'Magneto-meter',
    'Humidity': 'Humidity',
    'Pressure': 'Barometer / Atmospheric Pressure',
    'Temperature': 'Temperature',
    //'Acoustic': 'Acoustic',
    'Digitlight': 'Lumination',
    'refBtn':"caiji",
    '_work18n': 'Total Sensors Connected: '
  },
  cn: {
    'SamplingFrequency': '采样频率', // TODO: is it 采集频率 or 采样频率?
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
    '_work18n': '已连接数量: '
  },
  useLang: mystorage.get('useLang') || 'en'
}

$('#lang').on('change', function () {
  if ($(this).val() === 'en') {
    lang.useLang = 'en'
  } else {
    lang.useLang = 'cn'
  }
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
