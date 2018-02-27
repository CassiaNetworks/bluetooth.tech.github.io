import globalData from './globalData'

const i18n = function (language,cb) {
    var cn = {
            //--common--//
            'control':'控制',
            'local':'本地',
            'remote':'远程',
            '_lang': 'cn',
            'lang': '语言',
            'title': 'Cassia 蓝牙调试工具',
            'header': 'cassia 蓝牙调试工具',
            'reboot': '重启',
            'allApi': '总览API',
            'scanDevice': '扫描设备',
            'connDevice': '连接设备',
            'connedDevice': '已连接设备',
            'discoverServices': '发现设备服务',
            'openNotify': '打开Hub通知',
            'stateChange': '连接状态变化',
            'writeCom': '写入指令',
            'disCon': '断开连接',
            'scanList': '扫描列表',
            'startScan': '开始扫描',
            'devcieAndService': '设备及服务列表',
            'getList': '获取已连接设备',
            'stateChangeNotify': '连接状态变化通知',
            'notifyList': '通知列表',
            'openHubNotify': '打开Hub通知',
            'clearList': '清空此列表',
            'apiSocket': 'API接口',
            'scanResult': '扫描结果',
            'disService': '发现服务',
            'getMsg': '接收设备信息',
            'deviceConStateChange': '设备连接转态变化',
            'arguments': '参数',
            'optional': '(选填)',
            'required': '(必填)',
            'description': '描述',
            'hubNotifyStatus': 'Hub通知状态',
            'method': '方法名',
            'addMore': '加载更多',
            'username':'用户名:',
            'password':'密码:',
            'host':'云服务器:',
            'connectedNum':'已连接数量: '
        },
        en = {
            'control':'control',
            'local':'local',
            'remote':'remote',
            '_lang': 'en',
            'lang': 'Language',
            'title': 'Cassia bluetooth Dev Tools',
            'header': 'Cassia bluetooth Dev Tools',
            'reboot': 'Reboot',
            'allApi': 'API Info',
            'scanDevice': 'Scan Device',
            'connDevice': 'Connect Device',
            'connedDevice': 'Connected Devices',
            'discoverServices': 'Discover Device Services',
            'openNotify': 'Open Hub Notify',
            'stateChange': 'Connection State Changes',
            'writeCom': 'Write Instruction',
            'disCon': 'Disconnect',
            'scanList': 'Scan List',
            'startScan': 'Start Scan',
            'devcieAndService': 'Device and Services List',
            'getList': 'Connected Devices',
            'stateChangeNotify': 'Connection State Changes Notify',
            'notifyList': 'Notify List',
            'openHubNotify': 'Open Hub Notify',
            'clearList': 'Clear List',
            'apiSocket': 'Api Interfaces',
            'scanResult': 'Scan Results',
            'disService': 'Discover Services',
            'getMsg': 'Devices\'s Messages',
            'deviceConStateChange': 'Devices Connection State Changes',
            'arguments': 'Parameter',
            'optional': '(optional)',
            'required': '(Required)',
            'description': 'Description',
            'hubNotifyStatus': 'Hub Notify Status',
            'method': 'Method',
            'addMore': 'Add More',
            'username':'username:',
            'password':'password:',
            'host':'HOST:',
            'connectedNum':'connected number: '
        },
        lang = {},
        i18n = function (k) {
            return lang[k] || null;
        },
        auto = function () {
            var bl = (navigator.language || navigator.browserLanguage).toLowerCase();
            bl.match('cn') ? (lang = cn) : (lang = en);
        };

    /* auto select language form settings */
    if (typeof language === 'undefined') {
        try {
            var s = JSON.parse(localStorage.getItem('settings'));
            if (!s.language || s.language === 0) {
                auto();
            } else {
                (s.language === 'cn') ? (lang = cn) : (lang = en);
            }
        } catch (e) {
            auto()
        }
    } else if (language === 'cn') {
        lang = cn
    } else {
        lang = en
    }

    i18n.render = function () {
        globalData.lang = lang._lang
        console.warn(globalData.lang)

        $('#lang option').removeAttr('checked')
        $('#lang').val(globalData.lang)

        setTimeout(function () {
            var a = document.getElementsByTagName('*'),
                t, s;
            for (var i in a) {
                t = a[i];
                if (t && t.getAttribute) {
                    s = t.getAttribute('i18n');
                    // console.log('#######', t.getAttribute('i18n-loaded') !== globalData.lang)
                    if (s && i18n(s) && t.getAttribute('i18n-loaded') !== globalData.lang) {
                        t.innerHTML = i18n(s);
                        t.setAttribute('i18n-loaded', globalData.lang);
                    }
                }
            }
            cb&&cb()
        }, 15);
    };
    i18n.render();
    return i18n
}

export default i18n