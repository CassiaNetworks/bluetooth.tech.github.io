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
            'username':'开发者账号:',
            'password':'密码:',
            'host':'AC 地址:',
            'connectedNum':'已连接数量: ',
            'oAouh-Tip-p1':'<b>接口URL：</b>调用接口后，此URL会自动生成在下面的”API接口”的窗口中。',
            'oAouh-Tip-p2':'<b>接口描述：</b>此接口是通过oAuth2.0认证实现云端远程控制。将用户名和密码以base64编码的方式添加在请求参数中，认证成功后获得1小时有效期的access_token,你可以添加参数access_token访问其他API，从而实现远程控制。',
            'oAouh-Tip-p3':'<b>参数解释：用户名/密码：</b>从Cassia请求的开发者账户和密码(会以base64编码的方式添加在请求中)。',
            'oAouh-Tip-p4':'<b>AC Address</b>和蓝牙路由器交互的服务器地址。'
        },
        en = {
            'control':'Control',
            'local':'Local',
            'remote':'Remote',
            '_lang': 'en',
            'lang': 'Language',
            'title': 'Cassia Bluetooth Debug Tool',
            'header': 'Cassia Bluetooth Debug  Tool',
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
            'username':'Developer Key:',
            'password':'Developer Secret:',
            'host':'AC Server Address:',
            'connectedNum':'connected number: ',
            'oAouh-Tip-p1':'<b>Interface URL:</b>calling the interface, this URL is suyomatically generated in the window below "API Interface".',
            'oAouh-Tip-p2':'<b>Interface Description:</b>This interface is achieved through oAuth2.0 cloud remote control. The developer key and developer secret to base64 encoding added in the request parameters, access to 1hour after the successful authentication access_token, you can add parameters access_token access other API, in order to achieve remote control.',
            'oAouh-Tip-p3':'<b>Parameter Explanation:Developer Key / Developer Secret:</b>Developer credential requested from Cassia (will be added as a base64 encoding in the request).',
            'oAouh-Tip-p4':'<b>AC Address: </b>The address of the AC Server that interacts with the Bluetooth router.'
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
        }, 25);
    };
    i18n.render();
    return i18n
}

export default i18n