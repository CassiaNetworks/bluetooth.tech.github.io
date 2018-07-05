import globalData from './globalData'

const i18n = function (language,cb) {
    var cn = {
            //--common--//
            'control':'控制',
            'local':'本地',
            'remote':'远程',
            '_lang': 'cn',
            'lang': 'Language',
            'title': 'Cassia 蓝牙调试工具',
            'header': 'Cassia 蓝牙调试工具',
            'reboot': '重启',
            'allApi': '总览API',
            'sm':'扫描',
            'sb':'设备',
            'lj':'连接',
            'unpair':'取消配对',
            'ylj':'已连接',
            'fx':'发现',
            'sb-fw':'设备服务',
            'fw':' ',
            'connDeviceLog':'连接设备',
            'connedDeviceLog':'已连接设备',
            'writeComLog':'写入指令',
            'openHub':'打开Router',
            'notify':'通知',
            'connDevice': '连接设备',
            'connedDevice': '已连接设备',
            // 'connectedNum':'已连接数量: ',
            'discoverServices': '发现设备服务',
            'openNotify': '打开router通知',
            'stateChange': '连接状态变化',
            'scanDevice': '扫描设备',
            'writeCom': '写入指令',
            // 'stateChangeNotify': '连接状态变化通知',
            'dk':'打开',
            'router':'router通知',
            'tz':' ',
            'zt':'状态变化',
            'bh':' ',
            'ljj':'连接',
            'xr':'写入指令',
            'zl':' ',
            'router-mac':'路由器 Mac',
            'router-ip':'路由器 Ip',
            'disCon': '断开连接',
            'getCond':'已连接',
            'scanList': '扫描列表',
            'startScan': '开始扫描',
            'devcieAndService': '设备及服务列表',
            // 'Pair':'配对',
            // 'Unpair':'取消配对',
            // 'Seri':'服务',
            // 'Disc':'断连',
            // 'getList': '获取已连接设备',
            'co-st':'连接状态',
            'ch-no':'变化通知',
            'notifyList': '通知列表',
            // 'openHubNotify': '打开router通知',
            'clearList': '清空此列表',
            'apiSocket': 'API接口',
            'scanResult': '扫描结果',
            'pair_input':'写入配对码',
            'disService': '发现服务',
            'getMsg': '接收设备信息',
            'firstCode':'请先进行配对',
            'deviceConStateChange': '设备连接转态变化',
            'arguments': '参数',
            'optional': '(选填)',
            'required': '(必填)',
            'description': '描述',
            'pairInput':'写入配对码',
            'hubNotifyStatus': 'router通知状态',
            'method': '方法名',
            'addMore': '加载更多',
            'username':'开发者账号:',
            'password':'密码:',
            'host':'AC 地址:',
            'yes':'是',
            'input':'输入',
            'close':'关闭',
            'pleaseCode':'请输入配对码',
            'pair':'配对',
            'cond':'已连接',
            'num':'数量:',
            'interfaceURL':'<b>接口URL：</b>调用接口后，此URL会自动生成在下面的”API接口”的窗口中。',
            'oAouh-Tip-p2':'<b>接口描述：</b>此接口是通过oAuth2.0认证实现云端远程控制。将用户名和密码以base64编码的方式添加在请求参数中，认证成功后获得1小时有效期的access_token,你可以添加参数access_token访问其他API，从而实现远程控制。',
            'oAouh-Tip-p3':'<b>参数解释：用户名/密码：</b>从Cassia请求的开发者账户和密码(会以base64编码的方式添加在请求中)。',
            'oAouh-Tip-p4':'<b>AC Address</b>和蓝牙路由器交互的服务器地址。',
            'connectList-Tip-p2': '<b>接口描述：</b>此接口是GET请求，调用接口后，蓝牙路由器会将目前连接的设备的列表返回到pc端。',
            'connect-Tip-p1': '<b>chip：</b>蓝牙路由器共有两个芯片，芯片0和芯片1，在调用接口时可以通过添加queryString来选择芯片(?chip=0或者?chip=1)，每个芯片的连接上限是11个设备，如果不填此参数，蓝牙路由器会根据连接数量自动匹配芯片。',
            'connect-Tip-p2': '<b>deviceMac：</b>要连接的设备的MAC地址。',
            'pair-Tip-p2': '<b>deviceMac：</b>要配对的设备的MAC地址。',
            'connect-Tip-p3': '<b>type：</b>此参数在body中，是必填项。蓝牙设备的MAC地址分为random和public两种，所以在连接设备时，需要指出设备的广播type，广播type可以从扫描数据中获取。',
            'unpair-Tip-p2': '<b>接口描述：</b>此接口是DELETE请求，调用接口后，蓝牙路由器会与指定MAC地址的蓝牙设备取消配对。</p>',
            'unpair-Tip-p3': '<b>>参数解释：deviceMac：</b>要取消配对的设备的MAC地址。</p>',
            'disconn-Tip-p2': '<b>接口描述：</b>此接口是DELETE请求，调用接口后，蓝牙路由器会与指定MAC地址的蓝牙设备断连。</p>',
            'disconn-Tip-p3': '<b>参数解释：deviceMac：</b>要断连的设备的MAC地址。</p>',
            'services-Tip-p1': '<b>接口描述：</b>此接口是GET请求，调用接口后，蓝牙路由器会向指定的蓝牙设备请求其服务的树形列表，调用次接口的主要目的是为对蓝牙设备进行读写操作时，获取蓝牙设备的characteristic所对应的valueHandle或者handle。',
            'services-Tip-p2': '<b>参数解释：deviceMac：</b>要请求服务列表的设备的MAC地址。',
            'notify-Tip-p1': '<b>接口描述：</b>此接口是sse长链接，当打开蓝牙设备的notification/indication后，蓝牙设备会将消息上报到蓝牙路由器，但是如果在pc上希望接收到此消息，还需要调用此接口来建立蓝牙路由器到pc端的数据通路，这样蓝牙路由器才会将收到的蓝牙设备的数据转发到pc端。',
            'notify-Tip-p2': '<b>SSE：</b>server-sent events，简称：see。是一种http的长链接，请求需要手动关闭，否则理论上在不报错的情况下会一直进行，每条数据会以“data: ” 开头。在调试中可以直接将sse的url输入在浏览器中进行调用。但是在编程中使用一般的http请求无法请求到数据(一般的http请求都是在请求结束后返回所有的数据)，我们目前提供了iOS/java/nodejs/js/c#等的demo来实现sse的调用，如果在这方面遇到困难可以参考。另外，当调用sse时，最好对该长链接进行监控，以便在长链接出现错误或意外停止后进行重启，或者其他操作。',
            'connState-Tip-p1': '<b>接口描述：</b>此接口是sse长链接，当蓝牙路由器上的蓝牙设备的连接状态发生改变时（连接成功或者发生断连），会通过此接口将消息通知到pc端。',
            'scan-Tip-p1': '<b>接口描述：</b>此接口是sse长链接调用接口后，蓝牙路由器会扫描周边的设备,并将蓝牙设备的MAC地址(bdaddr)、广播type（bdaddrType）、广播报数据（adData/scanData）、设备名称（name）、信号强度（rssi）等信息以http response的形式返回（原始数据见“http response”窗口。',
            'scan-Tip-p2': '<b> 参数解释：chip：</b>蓝牙路由器共有两个芯片，芯片0和芯片1，在调用接口时可以通过添加queryString来选择芯片(?chip=0或者?chip=1)，如果不填,会默认用芯片0扫描，芯片0扫描距离会优于芯片1，也建议一般情况下使用芯片0扫描。',
            'write-Tip-p1': '<b>接口描述：</b>本接口是负责与设备通讯的主要接口，具体负责向蓝牙设备写入指令以及打开蓝牙设备的notification/indication，下面会具体讲解两个功能分别如何实现。',
            'write-Tip-p2': '<b>1、对蓝牙设备写入指令：</b>当需要往蓝牙设备指定的characteristic写入指令时，先调用“发现服务”的接口，当返回蓝牙设备服务信息的树形列表后，寻找指定的characteristic所对应的valueHandle（characteristic内包含handle、valueHandle、properties、descriptors等属性），然后调用此接口时，handle对应的值是characteristic的valueHandle，value对应的值是需要写入的指令内容（将指令的每个byte顺序拼在一起写成一个字符串）。',
            'write-Tip-p3': '<b>2、打开蓝牙设备的notification/indication：</b>当需要接收蓝牙设备发来的数据时，需要先打开蓝牙设备的notification或者indication（打开的过程在本质上也是对蓝牙设备下发的一个指令），当需要打开指定characteristic的notification或者indication时，也是先调用“发现服务”的方法，找到指定的characteristic所对应的descriptors，打开descriptors，找到uuid包含“00002902”所对应的handle，然后调用此接口，接口中的handle就是上面descriptor的handle，如果是打开notification，value对应的是“0100”，如果是打开indication，value对应的是“0200”，如果是关闭notification/indication，value对应的是“0000”。',
            'write-Tip-p4': '<b>参数解释： deviceMac：</b>要写入指令的设备的MAC地址。',
            'write-Tip-p5': '<b>handle：</b>通过“发现服务接口”所找到的characteristic所对应的valueHandle或者handle。',
            'write-Tip-p6': '<b>value：</b>要写入的指令的值，或者“0100”（打开notification）、“0200”（打开indication）、“0000”（关闭notification和indication）。',
            'write-Tip-p7': ' <b>handle & value输入格式</b>',
            'write-Tip-p8': '单条指令格式 handle:value1,type',
            'write-Tip-p9': 'handle为要写入的handle如20',
            'write-Tip-p10': 'value1 为要写入的值（十六进制）',
            'write-Tip-p11': 'type为写入类型，0代表write without response，1代表write with response',
            'write-Tip-p12': '多条语句之间用回车键换行'
        },
        en = {
            'control':'Control',
            'local':'Local',
            'remote':'Remote',
            '_lang': 'en',
            'lang': '语言',
            'title': 'Cassia Bluetooth Debug Tool',
            'header': 'Cassia Bluetooth Debug  Tool',
            'reboot': 'Reboot',
            'allApi': 'API Info',
            'firstCode':'Please pair first',
            'sm':'Scan',
            'sb':'Device',
            'lj':'Connect',
            'unpair':'Unpair',
            'pairInput':'Pair Input',
            'pair':'Pair',
            'Pair':'Pair',
            'Unpair':'Unpair',
            'Seri':'Serivices',
            'Disc':'Disconnect',
            'pair_input':'Pair_input',
            'ylj':'Connected',
            'fx':'Discover',
            'fw':'Services',
            'sb-fw':'Device',
            'connDeviceLog':'Connect Device',
            'connedDeviceLog':'Connected Devices',
            'writeComLog':'Write Instruction',
            'router-mac':'Router MAC',
            'router-ip':'Router Ip',
            'openHub':'Open Router',
            'notify':'Notification',
            'connDevice': 'Connect Device',
            'connedDevice': 'Connected Devices',
            // 'connectedNum':'connected number: ',
            'scanDevice': 'Scan\rDevice',
            'openNotify': 'Open Router Notify',
            'stateChange': 'Connection State Changes',
            'writeCom': 'Write Instruction',
            // 'stateChangeNotify': 'Connection State Changes Notify',
            'discoverServices': 'Discover Device Services',
            'dk':'Open',
            'router':'Router',
            'tz':'Notify',
            'xr':'Write',
            'zl':'Instruction',
            'ljj':'Connection',
            'zt':'State',
            'bh':'Changes',
            'getCond':'Connected',
            'disCon': 'Disconnect',
            'scanList': 'Scan List',
            'startScan': 'Start Scan',
            'devcieAndService': 'Device and Services List',
            // 'getList': 'Connected Devices',
            'co-st':'Connection State',
            'ch-no':'Notification',
            'notifyList': 'Notify List',
            // 'openHubNotify': 'Open Router Notify',
            'clearList': 'Clear List',
            'apiSocket': 'Api Interfaces',
            'scanResult': 'Scan Results',
            'disService': 'Discover Services',
            'getMsg': 'Devices\'s Messages',
            'deviceConStateChange': 'State Changes',
            'arguments': 'Parameter',
            'optional': '(optional)',
            'required': '(Required)',
            'description': 'Description',
            'hubNotifyStatus': 'router Notify Status',
            'method': 'Method',
            'addMore': 'Add More',
            'username':'Developer Key:',
            'password':'Developer Secret:',
            'pleaseCode':'Please enter the pair code',
            'host':'AC Server Address:',
            'yes':'yes',
            'input':'import',
            'close':'close',
            'cond':'Connected',
            'num':'Number:',
            'interfaceURL':'<b>Interface URL:</b>calling the interface, this URL is suyomatically generated in the window below "API Interface".',
            'oAouh-Tip-p2':'<b>Interface Description:</b>This interface is achieved through oAuth2.0 cloud remote control. The developer key and developer secret to base64 encoding added in the request parameters, access to 1hour after the successful authentication access_token, you can add parameters access_token access other API, in order to achieve remote control.',
            'oAouh-Tip-p3':'<b>Parameter Explanation:Developer Key / Developer Secret:</b>Developer credential requested from Cassia (will be added as a base64 encoding in the request).',
            'oAouh-Tip-p4':'<b>AC Address: </b>The address of the AC Server that interacts with the Bluetooth router.',
            'connectList-Tip-p2': '<b>Interface Description:</b>This interface is a GET request. After calling the interface, the Bluetooth router will return the list of currently connected devices to the PC side.',
            'connect-Tip-p1': '<b>chip：</b>There are two chips in the Bluetooth router, the chip 0 and the chip 1, when calling the interface, you can select the chip (? chip = 0 or? chip = 1) by adding queryString and the connection ceiling of each chip is 20 devices for E1000 router. Without this parameter, the Bluetooth router automatically matches the chip according to the number of connections.',
            'connect-Tip-p2': '<b>deviceMac：</b>MAC address of the device to connect to.',
            'pair-Tip-p2': '<b>deviceMac：</b>MAC address of the device to pair to.',
            'connect-Tip-p3': `<b>type：</b>This parameter is required in the body. The MAC addresses of Bluetooth devices are divided into random and public, so when connecting devices, you need to indicate the device's broadcast type, it can be obtained from the scan data.`,
            'disconn-Tip-p2': '<b>Interface Description:</b>After calling the interface, the Bluetooth router will be disconnected from the Bluetooth device with the specified MAC address.</p>',
            'disconn-Tip-p3': '<b>Parameter Explanation: deviceMac:</b> MAC address of the device to be disconnected. </p>',
            'unpair-Tip-p2': '<b>Interface Description:</b>After calling the interface, the Bluetooth router will be unpaired from the Bluetooth device with the specified MAC address.</p>',
            'unpair-Tip-p3': '<b>Parameter Explanation: deviceMac:</b> MAC address of the device to be unpaired. </p>',
            'services-Tip-p1': `<b>Interface Description: </b>This interface is a GET request. After the interface is called, the Bluetooth router will request the specified Bluetooth device for the tree list of its service. The main purpose of calling the secondary interface is to obtain the Bluetooth device's read / value corresponding to the valueHandle or handle.`,
            'services-Tip-p2': '<b>Parameter Explanation: deviceMac:</b>MAC address of the device on which the service list is to be requested.',
            'notify-Tip-p1': '<b>Interface Description: </b>This interface is sse long link, when you open the notification / indication Bluetooth device, the Bluetooth device will report the message to the Bluetooth router, but if you want to receive this message on the pc, you also need to call this interface to establish a Bluetooth router Data path to the pc end, so that the Bluetooth router will receive the data of the Bluetooth device is forwarded to the pc side.',
            'notify-Tip-p2': '<b>SSE：</b>server-sent events，Short: see Is a long link http, the request needs to be manually shut down, or in theory, no error will continue, each data will be "data:" at the beginning. Debugging can be directly input sse url in the browser to call. But in the process of using ordinary HTTP requests can not request data (the general http request is returned after the request all the data), we currently provide a demo of iOS / java / nodejs / js / c # to achieve sse Call, if you encounter difficulties in this regard can refer to. In addition, when calling sse, it is best to monitor the long link in order to restart the long link after an error or unexpected stop, or other operation.',
            'connState-Tip-p1': '<b>Interface Description:</b>This interface is sse long link, when the Bluetooth router on the Bluetooth device connection status changes (connection is successful or disconnected), will be notified through this interface to the pc side of the message.',
            'scan-Tip-p1': `<b>Interface Description:</b>This interface is the sse long-link call interface, Bluetooth router will scan the surrounding devices, and the Bluetooth device's MAC address (bdaddr), broadcast type (bdaddrType) broadcast data (adData / scanData), device name name), signal strength (rssi) and other information in the form of http response (the original data, see "http response" window.`,
            'scan-Tip-p2': '<b>Parameters: chip: </b>Bluetooth router has two chips, chip 0 and chip 1, when calling the interface can be added by adding queryString chip (? Chip = 0 or chip = 1), if you do not fill, the default chip 0 Scan, chip 0 scanning distance will be better than chip 1, it is recommended to use chip 0 scan under normal circumstances.',
            'write-Tip-p1': '<b>Interface Description:</b>This interface is responsible for communicating with the main interface of the device. It is responsible for writing instructions to the Bluetooth device and opening the notification / indication of the Bluetooth device. The following describes how to implement the two functions.',
            'write-Tip-p2': '<b>1、Write command to bluetooth device:</b>When it needs to write the command to the Bluetooth device in the specified characteristic, it first calls the interface of "find service", after returning to the tree list of the bluetooth device service information, look for the corresponding characteristic valueHandle (property contains handle, valueHandle, properties, descriptors and other attributes), and then call this interface, the handle corresponding value is characteristic valueHandle value corresponding value is the need to write the contents of the instruction Spell together written as a string).',
            'write-Tip-p3': '<b>2、open the Bluetooth device notification / indication: </b>When you need to receive the data sent by the Bluetooth device, you need to open the notification or indication of the Bluetooth device (the opening process is essentially an instruction issued by the Bluetooth device), when needed Open the notification or indication of the specified characteristic, it is also called the "discovery service" method to find the descriptors corresponding to the specified characteristic, open the descriptors, find uuid contains "00002902" corresponding to the handle, and then call this interface, the interface The handle is the handle of the above descriptor. If it is open, the value corresponds to "0100". If the indication is on, the value corresponds to "0200". If the notification / indication is off, the value corresponds to "0000".',
            'write-Tip-p4': '<b><b>Parameter Explanation: deviceMac:</b>MAC address of the device to write the instruction.',
            'write-Tip-p5': '<b>handle：</b>The valueHandle or handle corresponding to the characteristic found through the Discovery Service Interface.',
            'write-Tip-p6': '<b>value：</b>The value of the command to be written, or "0100" (open notification), "0200" (open indication), "0000" (close notification and indication).',
            'write-Tip-p7': ' <b>handle & value Input format</b>',
            'write-Tip-p8': 'Single instruction format handle: value1, type',
            'write-Tip-p9': 'handle to write the handle as 20',
            'write-Tip-p10': 'value1 is the value to be written (hex)',
            'write-Tip-p11': 'type is write type, 0 means write without response, and 1 means write with response',
            'write-Tip-p12': 'Use a carriage-return between the multiple statements'
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