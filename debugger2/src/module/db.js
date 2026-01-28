const _ = require('lodash');
import libEnum from '../lib/enum.js';
import libLogger from '../lib/logger.js';
import apiModule from './api.js';

const logger = libLogger.genModuleLogger('db');
const storageKey = 'storageKey';

let storage = {
  devConfSaveTimer: null,
  accessToken: '', // ac连接方式token
  devConf: {
    controlStyle: libEnum.controlStyle.AP, // 连接方式
    transportType: libEnum.transportType.HTTP, // 通信方式: HTTP 或 MQTT
    apServerURI: 'http://192.168.5.100', // AP服务器地址
    acServerURI: 'http://192.168.5.100', // AC服务器地址
    baseURI: 'http://192.168.5.100', //
    acDevKey: 'cassia', // 开发者账号
    acDevSecret: 'cassia', // 开发者密码
    mac: '', // 路由器MAC
    filter_name: [], // 扫描name过滤
    filter_mac: [], // 扫描mac过滤
    phy: [], // 扫描phy
    filter_rssi: -75,
    chip: 0, // 扫描使用的芯片
    scanParams: '', // 扫描接口其他参数
    connChip: 0, // 连接使用的芯片
    discovergatt: '1', // 是否开启，默认开启，与API默认参数保持一致
    connTimeout: 15, // 连接超时时间，单位秒，默认为10秒
    connPhy: '',
    secondaryPhy: '',
    connParams: '', // 连接接口其他参数
    autoSelectionOn: 'off', // 是否开启优选，默认不开启
    aps: [], // 优选选择的网关列表
    // MQTT 配置
    mqtt: {
      protocol: 'ws',           // ws | wss
      server: 'broker.emqx.io',  // broker server address
      port: '8083',             // broker WebSocket port
      tcpPort: '1883',          // broker TCP port (用于代码生成)
      path: '/mqtt',            // WebSocket path，缺省 /mqtt
      username: '',
      password: '',
      clientId: '',
      gateway: 'CC:1B:E0:00:00:01',              // 目标网关 MAC
      keepalive: 60,
      cleanSession: true
    }
  },
  devConfDisplayVars: {
    activeControlTab: 'HTTP', // 当前激活的 Control Tab: HTTP | MQTT
    oldVersionUrl: '#', // 老版本debugger链接
    leftConfWidth: '430px', // 左侧配置栏宽度
    leftConfLabelWidth: '125px', // 左侧label宽度
    leftConfHeight: '100%', // 左侧配置栏高度
    scanTabsActiveTab: 'scanResult', // 当前激活的扫描tab页
    apiDemoTabsActiveTab: 'singleDevice', // API demo激活的tab页
    updatePhy: {
      visible: false,
      deviceMac: '',
      tx: '',
      rx: '',
      codedOption: '',
    },
    pair: { // pair
      visible: false,
      timeout: 5, // 单位秒 
      iocapability: 'KeyboardDisplay',
      bond: '1'
    },
    pairBySecurityOOB: { // security pair
      visible: false, 
      deviceMac: '',
      rand: '',
      confirm: ''
    },
    pairByLegacyOOB: {
      visible: false,
      deviceMac: '',
      tk: '',
    },
    pairByPasskey: {
      visible: false,
      deviceMac: '',
      passkey: '',
    },
    toolsBinaryConversion: {
      type: '10',
      value: ''
    },
    toolsHexTextConversion: {
      type: 'text',
      value: ''
    },
    toolsBase64: {
      type: 'text',
      value: ''
    },
    toolsJsonConversion: {
      inline: '',
      format: ''
    },
    language: 'cn',
    mainWidth: 18,
    isConfigMenuItemOpen: true,
    scanFilterNamesInputVisible: false,
    scanFilterNamesInputValue: '',
    scanFilterMacsInputVisible: false,
    scanFilterMacsInputValue: '',
    apiScanFilterNamesInputVisible: false,
    apiScanFilterNamesInputValue: '',
    apiScanFilterMacsInputVisible: false,
    apiScanFilterMacsInputValue: '',
    isScanning: false,
    isNotifyOn: false,
    isApiScanning: false,
    apiOutputDisplayCount: 20,
    apiDebuggerMenuWidth: '110px',
    activeMenuItem: 'scanListMenuItem',
    activeApiDebugMenuItem: 'scan',
    activeApiDemoMenuItem: 'demo1',
    activeApiDebugOutputMenuItem: 'output',
    activeApiTabName: 'scan', // scan | connect | disconnect | read | write | writeNoRes ...
    activeApiDemoTabName: 'connectWriteNotify', // scan | connectWriteNotify
    activeApiOutputTabName: 'output', // output | curl | nodejs
    rssiChartStopped: false, // 是否暂停了rssi chart
    rssiChartSwitch: false, // 是否开启rssi chart，默认关闭
    rssiChartPeriod: 60, // 单位秒，统计周期
    rssiChartDataSpan: 2000, // 单位毫秒, 统计间隔, 此毫秒长度认为1个广播点
    rssiChartDataCount:  (60 * 1000 / 2000), // rssiChartPeriod * 1000 / rssiChartDataSpan;

    deviceScanDataStopped: false,
    deviceScanDataSwitch: false, // 是否开启了数据
    deviceScanDataFilterDuplicate: '1000',
    deviceScanDataTimestamp: '0',

    // API Debugger 共享的 Device MAC（所有 API 使用同一个）
    apiDebuggerDeviceMac: 'C0:00:5B:D1:AA:BC',

    apiDebuggerParams: { // 调试工具参数
      [libEnum.apiType.AUTH]: {},
      [libEnum.apiType.SCAN]: {
        chip: 0, 
        filter_name: [], 
        filter_mac: [], 
        phy: [], 
        filter_rssi: -65,
        timestamp: '0',
      },
      [libEnum.apiType.CONNECT]: {
        chip: 0, 
        deviceMac: 'C0:00:5B:D1:AA:BC', 
        addrType: libEnum.deviceAddrType.PUBLIC, 
        discovergatt: '1', 
        connTimeout: 15,
        connPhy: '', 
        secondaryPhy: '', 
        connParams: ''
      },
      [libEnum.apiType.READ]: {deviceMac: 'C0:00:5B:D1:AA:BC', handle: '39'},
      [libEnum.apiType.READ_PHY]: {deviceMac: 'C0:00:5B:D1:AA:BC'},
      [libEnum.apiType.UPDATE_PHY]: {
        deviceMac: 'C0:00:5B:D1:AA:BC',
        tx: '',
        rx: '',
        codedOption: '',
      },
      [libEnum.apiType.WRITE]: {deviceMac: 'C0:00:5B:D1:AA:BC', handle: '39', value: '21ff310302ff31', noresponse: false},
      [libEnum.apiType.DISCONNECT]: {deviceMac: 'C0:00:5B:D1:AA:BC'},
      [libEnum.apiType.DISCOVER]: {deviceMac: 'C0:00:5B:D1:AA:BC'},
      [libEnum.apiType.NOTIFY]: {
        timestamp: '0',
        sequence: '0',
      },
      [libEnum.apiType.CONNECT_STATUS]: {},
      [libEnum.apiType.PAIR]: {iocapability: 'KeyboardDisplay', deviceMac: 'C0:00:5B:D1:AA:BC'},
      [libEnum.apiType.PAIR_INPUT]: {inputType: 'Passkey', deviceMac: 'C0:00:5B:D1:AA:BC', passkey: '', tk: '', rand: '', confirm: ''},
      [libEnum.apiType.UNPAIR]: {deviceMac: 'C0:00:5B:D1:AA:BC'},
    },
    apiDemoParams: { // demo工具参数
      connectWriteNotify: { // [单设备] 建连->写入->通知
        connect: {
          tempFromApiLogUrl: '',
          chip: 0,
          deviceMac: 'C0:00:5B:D1:AA:BC',
          addrType: libEnum.deviceAddrType.PUBLIC
        },
        write: { // [多设备] 扫描->建连->写入->通知
          tempFromApiLogUrl: '',
          handle: 39,
          value: '21ff310302ff31',
          noresponse: false
        },
        code: ''
      },
      scanConnectWriteNotify: {
        scan: {
          tempFromApiLogUrl: '',
          chip: 0,
          filter_name: [],
          filter_mac: [],
          phy: [],
          filter_rssi: -75
        },
        write: {
          tempFromApiLogUrl: '',
          handle: 39,
          value: '21ff310302ff31',
          noresponse: false
        },
        code: ''
      }
    }
  }
};

let cache = { 
  // MQTT 运行时状态（不持久化）
  mqtt: {
    status: libEnum.mqttStatus.DISCONNECTED,
    connectedAt: null,      // MQTT 连接成功的时间戳
    lastHeartbeat: null,
    gatewayInfo: {
      model: '',
      version: '',
      uptime: 0,
      uplink: '',
      private_ip: ''
    },
    reconnectCount: 0,
    lastError: ''
  },
  
  // 是否正在接收 MQTT 扫描数据
  isReceivingMqttScanData: false,
  
  devConfRules: {
    'apServerURI': [
      { validator: function(rule, value, callback) {
        if(!/(http|https):\/\/.*[^/^api]$/.test(value)) callback('Eg: http://192.168.5.100');
        else callback();
      }, trigger: 'change' }
    ],
    'acServerURI': [ // AC模式才检查
      { validator: function(rule, value, callback) {
        if (storage.devConf.controlStyle !== 'AC') return callback();
        if (!/(http|https):\/\/.*[^/^api]$/.test(value)) callback('Eg: http://192.168.5.100');
        else callback();
      }, trigger: 'change' }
    ],
    'acDevKey': [ // AC模式才检查
      { validator: function(rule, value, callback) {
        if (storage.devConf.controlStyle !== 'AC') return callback();
        if(!value) callback('require');
        else callback();
      }, trigger: 'blur' }
    ],
    'acDevSecret': [ // AC模式才检查
      { validator: function(rule, value, callback) {
        if (storage.devConf.controlStyle !== 'AC') return callback();
        if(!value) callback('require');
        else callback();
      }, trigger: 'blur' }
    ],
    'mac': [ // AC模式才检查
      { validator: function(rule, value, callback) {
        console.log('mac check', storage.devConf.controlStyle, value);
        if (storage.devConf.controlStyle !== 'AC') return callback();
        if(!value) callback('require');
        else callback();
      }, trigger: 'change' }
    ],
    'connTimeout': [
      { validator: function(rule, value, callback) {
        value = +value;
        if(!(value >= 0.2 && value <= 20)) callback('Eg: value >= 0.2 && value <= 20');
        else callback();
      }, trigger: 'change' }
    ],
  }, // devConf检查规则

  isGettingAcRouterList: false, // AC动态获取router列表
  acRouterList: [], // AC动态获取router列表
  model: '', // 当前选择的网关对应model

  clientHeight: 0, // dom高度, 响应动态变化
  vxeGridHeight: 0, // vxe表格高度, 响应动态变化
  currentConnectedTab: 'connectTab0',
  scanDisplayFilterContent: '',
  connectDisplayFilterContent: '',
  
  notifyDisplayFilterContent: '',
  notifyDisplayTimestamp: '0',
  notifyDisplaySequence: '0',

  apiLogDisplayFilterContent: '',
  isApiDebuggerLoading: false,
  isNotifyLoading: false,
  devicesConnectLoading: {

  },
  apiDebuggerResult: { 
    [libEnum.apiType.AUTH]: {
      resultList: [],
      code: {
        [libEnum.codeType.CURL]: '',
        [libEnum.codeType.NODEJS]: '',
        [libEnum.codeType.MQTT]: '',
        [libEnum.codeType.MOSQUITTO]: ''
      }
    },
    [libEnum.apiType.SCAN]: {
      sse: null,
      resultList: [
        // {time: 1582882186095, data: '{"name":"(unknown)","evtType":3,"rssi":-80,"adData":"1EFF06000109200262A12A0E18F1516C3D7DABD42556C51B45E9094EB88D2B","bdaddrs":[{"bdaddr":"76:95:9B:89:BB:A5","bdaddrType":"random"}]}'}
      ],
      displayResultList: [],
      code: {
        [libEnum.codeType.CURL]: '',
        [libEnum.codeType.NODEJS]: '',
        [libEnum.codeType.MQTT]: '',
        [libEnum.codeType.MOSQUITTO]: ''
      }
    },
    [libEnum.apiType.CONNECT]: {
      resultList: [],
      code: {
        [libEnum.codeType.CURL]: '',
        [libEnum.codeType.NODEJS]: '',
        [libEnum.codeType.MQTT]: '',
        [libEnum.codeType.MOSQUITTO]: ''
      }
    },
    [libEnum.apiType.READ]: {
      resultList: [],
      code: {
        [libEnum.codeType.CURL]: '',
        [libEnum.codeType.NODEJS]: '',
        [libEnum.codeType.MQTT]: '',
        [libEnum.codeType.MOSQUITTO]: ''
      }
    },
    [libEnum.apiType.READ_PHY]: {
      resultList: [],
      code: {
        [libEnum.codeType.CURL]: '',
        [libEnum.codeType.NODEJS]: '',
        [libEnum.codeType.MQTT]: '',
        [libEnum.codeType.MOSQUITTO]: ''
      }
    },
    [libEnum.apiType.UPDATE_PHY]: {
      resultList: [],
      code: {
        [libEnum.codeType.CURL]: '',
        [libEnum.codeType.NODEJS]: '',
        [libEnum.codeType.MQTT]: '',
        [libEnum.codeType.MOSQUITTO]: ''
      }
    },
    [libEnum.apiType.WRITE]: {
      resultList: [],
      code: {
        [libEnum.codeType.CURL]: '',
        [libEnum.codeType.NODEJS]: '',
        [libEnum.codeType.MQTT]: '',
        [libEnum.codeType.MOSQUITTO]: ''
      }
    },
    [libEnum.apiType.DISCONNECT]: {
      resultList: [],
      code: {
        [libEnum.codeType.CURL]: '',
        [libEnum.codeType.NODEJS]: '',
        [libEnum.codeType.MQTT]: '',
        [libEnum.codeType.MOSQUITTO]: ''
      }
    },
    [libEnum.apiType.CONNECT_LIST]: {
      resultList: [],
      code: {
        [libEnum.codeType.CURL]: '',
        [libEnum.codeType.NODEJS]: '',
        [libEnum.codeType.MQTT]: '',
        [libEnum.codeType.MOSQUITTO]: ''
      }
    },
    [libEnum.apiType.DISCOVER]: {
      resultList: [],
      code: {
        [libEnum.codeType.CURL]: '',
        [libEnum.codeType.NODEJS]: '',
        [libEnum.codeType.MQTT]: '',
        [libEnum.codeType.MOSQUITTO]: ''
      }
    },
    [libEnum.apiType.NOTIFY]: {
      resultList: [],
      code: {
        [libEnum.codeType.CURL]: '',
        [libEnum.codeType.NODEJS]: '',
        [libEnum.codeType.MQTT]: '',
        [libEnum.codeType.MOSQUITTO]: ''
      }
    },
    [libEnum.apiType.CONNECT_STATUS]: {
      resultList: [],
      code: {
        [libEnum.codeType.CURL]: '',
        [libEnum.codeType.NODEJS]: '',
        [libEnum.codeType.MQTT]: '',
        [libEnum.codeType.MOSQUITTO]: ''
      }
    },
    [libEnum.apiType.PAIR]: {
      resultList: [],
      code: {
        [libEnum.codeType.CURL]: '',
        [libEnum.codeType.NODEJS]: '',
        [libEnum.codeType.MQTT]: '',
        [libEnum.codeType.MOSQUITTO]: ''
      }
    },
    [libEnum.apiType.PAIR_INPUT]: {
      resultList: [],
      code: {
        [libEnum.codeType.CURL]: '',
        [libEnum.codeType.NODEJS]: '',
        [libEnum.codeType.MQTT]: '',
        [libEnum.codeType.MOSQUITTO]: ''
      }
    },
    [libEnum.apiType.UNPAIR]: {
      resultList: [],
      code: {
        [libEnum.codeType.CURL]: '',
        [libEnum.codeType.NODEJS]: '',
        [libEnum.codeType.MQTT]: '',
        [libEnum.codeType.MOSQUITTO]: ''
      }
    }
  },
  scanResultList: [ // 扫描结果缓存池，mac为唯一key，重复的只更新rssi值，显示列表从这取数据，TODO: 待优化查找
    // {name: 'UNKNOWN', mac: 'CC:1B:E0:E0:DD:70', bdaddrType: 'public', rssi: -75, adData: '0201061BFF5701006BFCA25D5ED51C0B3E60820178B901BE01D40B59A1259C'},
    // {name: 'MI BAND 3', mac: 'CC:1B:E0:E0:DD:71', bdaddrType: 'random', rssi: -75, adData: '0201061BFF5701006BFCA25D5ED51C0B3E60820178B901BE01D40B59A1259C'},
  ],
  deviceScanDetail: { // 设备扫描数据详情，点击detail -> 打开dialog -> 开启SSE -> 记录数据 -> 关闭dialog -> 关闭SSE -> 释放数据
    sse: null,
    updateQueue: [], // 防抖
    updateTimer: null, // 防抖
    data: [],
  },
  notifyDisplayResultList: [

  ],
  apiLogResultList: [
    // {
    //   timestamp: Date.now(), 
    //   timeStr: '2020-03-10T02:48:41.235', 
    //   apiName: '扫描设备', 
    //   apiContentJson: '',
    //   apiContent: {
    //     url: 'http://192.168.5.105/gap/nodes/?mac=&access_token=&active=1&event=1&chip=0',
    //     method: 'GET',
    //     headers: {},
    //     data: {
    //       body: {},
    //       params: {},
    //       query: {}
    //     }
    //   }
    // }
  ],
  scanDisplayResultList: [ // 用于显示的列表
    // {name: 'MI BAND 3', mac: 'CC:1B:E0:E0:DD:71', bdaddrType: 'random', rssi: -75, adData: '0201061BFF5701006BFCA25D5ED51C0B3E60820178B901BE01D40B59A1259C'},
  ],
  scanDevicesRssiHistory: {

  },
  connectedList: [ // 连接结果列表
    // {name: '123', mac: 'CC:1B:E0:E0:DD:71', bdaddrType: 'random', chip: 0},
  ],
  devicesServiceList: { // 设备服务列表

  }, 
  notifyResultList: [ // 通知列表
    // {time: Date.now(), mac: 'CC:1B:E0:E7:FE:F8', handle: 15, value: '001122334455667788990011223344556677889100112233445566778899001122334455667788920011223344556677889900112233445566778892'},
    // {time: Date.now(), mac: 'CC:1B:E0:E7:FE:F8', handle: 15, value: '0011223344556677889900112233445566778892'},
    // {time: Date.now(), mac: 'CC:1B:E0:E7:FE:F8', handle: 15, value: '0011223344556677889900112233445566778893'},
  ], 
  notifyDisplayResultList: []
};

function save(key, value) {
  window.localStorage.setItem(key, value);
}

function get(key) {
  return window.localStorage.getItem(key);
}

function getBaseURI(devConf) {
  let url = devConf.apServerURI;
  if (devConf.controlStyle === libEnum.controlStyle.AC) {
    url = devConf.acServerURI;
    url = url + '/api'; 
  }
  return url;
}

function saveApDevConf(_devConf) {
  _devConf.baseURI = getBaseURI(_devConf);
  storage.devConf = _devConf;
  save(storageKey, JSON.stringify(storage.devConf)); // 只保存配置，其他缓存不保存
}

// 更新接口地址（仅持久化，不获取 token）
// token 获取已移至 vue.js 中的 fetchAcTokenOnBlur，在输入框失焦时触发
function saveAcDevConf(_devConf) {
  _devConf.baseURI = getBaseURI(_devConf);

  // XSS过滤
  _.forEach(_devConf, (v, k) => {
    if (_.isString(v)) _devConf[k] = filterXSS(v);
  });
  storage.devConf = _devConf;
  
  // 保存配置到 localStorage
  save(storageKey, JSON.stringify(storage.devConf));
  
  // 不再在保存时获取 token，避免输入过程中多次弹出"获取 token 失败"
  return Promise.resolve(null);
}

function checkAndClearPhyParams(model) {
  if (!['X1000', 'S2000'].includes(model)) {
    return;
  }

  storage.devConf.phy = '';
  storage.devConf.connPhy = '';
  storage.devConf.secondaryPhy = '';

  storage.devConfDisplayVars.apiDebuggerParams[libEnum.apiType.SCAN].phy = '';
  storage.devConfDisplayVars.apiDebuggerParams[libEnum.apiType.CONNECT].connPhy = '';
  storage.devConfDisplayVars.apiDebuggerParams[libEnum.apiType.CONNECT].secondaryPhy = '';
}

// 保存失败回调（可由 vue.js 设置）
let onSaveError = null;

function setOnSaveError(callback) {
  onSaveError = callback;
}

function saveDevConf(_devConf) {
  clearTimeout(storage.devConfSaveTimer);
  storage.devConfSaveTimer = setTimeout(function() {
    logger.info('save dev conf:', _devConf);
    if (_devConf.controlStyle === libEnum.controlStyle.AC) {
      // AC 模式：仅持久化，不再获取 token（token 获取移至 blur 事件）
      return saveAcDevConf(_devConf);
    }
    return saveApDevConf(_devConf);
  }, 500); // 减少到 500ms 防抖，加快保存响应
}

// 立即保存配置（用于 beforeunload 事件）
function saveDevConfImmediately() {
  clearTimeout(storage.devConfSaveTimer);
  save(storageKey, JSON.stringify(storage.devConf));
  logger.info('save dev conf immediately');
}

function getDevConf() {
  return storage.devConf;
}

function getDevConfDisplayVars() {
  return storage.devConfDisplayVars;
}

function getCache() {
  return cache;
}

function getStorage() {
  return storage;
}

function loadStorage() {
  storage.devConf = JSON.parse(get(storageKey)) || storage.devConf;

  // 新版本兼容老版本的本地存储
  if (!_.has(storage.devConf, 'connChip')) storage.devConf.connChip = 0;
  if (!_.has(storage.devConf, 'discovergatt')) storage.devConf.discovergatt = '1';
  if (!_.has(storage.devConf, 'connTimeout')) storage.devConf.connTimeout = 15;
  if (!_.has(storage.devConf, 'connParams')) storage.devConf.connParams = '';
  if (!_.has(storage.devConf, 'scanParams')) storage.devConf.scanParams = '';
  if (!_.has(storage.devConf, 'autoSelectionOn')) storage.devConf.autoSelectionOn = 'off';
  if (!_.has(storage.devConf, 'aps')) storage.devConf.aps = storage.devConf.mac || ['*'];
  
  // MQTT 配置兼容性
  if (!_.has(storage.devConf, 'transportType')) storage.devConf.transportType = libEnum.transportType.HTTP;
  
  // 同步 activeControlTab 与 transportType，确保 UI 和配置一致
  storage.devConfDisplayVars.activeControlTab = storage.devConf.transportType || libEnum.transportType.HTTP;
  
  if (!_.has(storage.devConf, 'mqtt')) {
    storage.devConf.mqtt = {
      protocol: 'ws',
      server: 'broker.emqx.io',
      port: '8083',
      path: '/mqtt',
      username: '',
      password: '',
      clientId: '',
      gateway: 'CC:1B:E0:00:00:01',
      keepalive: 60,
      cleanSession: true
    };
  }
  // 兼容旧版本没有 path 字段的情况，缺省为 mqtt
  if (!_.has(storage.devConf.mqtt, 'path')) {
    storage.devConf.mqtt.path = 'mqtt';
  }
  // 兼容旧版本 brokerUrl 格式，迁移到新的 protocol/server/port 格式
  if (_.has(storage.devConf.mqtt, 'brokerUrl') && !_.has(storage.devConf.mqtt, 'protocol')) {
    const brokerUrl = storage.devConf.mqtt.brokerUrl || '';
    const match = brokerUrl.match(/^(wss?):\/\/([^:\/]+):?(\d+)?/);
    if (match) {
      storage.devConf.mqtt.protocol = match[1] || 'ws';
      storage.devConf.mqtt.server = match[2] || 'broker.emqx.io';
      storage.devConf.mqtt.port = match[3] || '8083';
    } else {
      storage.devConf.mqtt.protocol = 'ws';
      storage.devConf.mqtt.server = 'broker.emqx.io';
      storage.devConf.mqtt.port = '8083';
    }
    delete storage.devConf.mqtt.brokerUrl;
  }

  // 如果是AC方式 且 不是MQTT模式，则更新token
  // MQTT 模式不需要 AC token，跳过获取
  let _devConf = storage.devConf;
  if (storage.devConf.controlStyle === libEnum.controlStyle.AC && 
      storage.devConf.transportType !== libEnum.transportType.MQTT) {
    return new Promise(function(resolve, reject) {
      apiModule.getAccessToken(_devConf.baseURI, _devConf.acDevKey, _devConf.acDevSecret, false).then(function(data) {
        storage.accessToken = data.access_token;
        resolve();
      }).catch(function(error) {
        reject(error);
      });
    });
  }
}

function listAddOrUpdate(array, filterObj, arrayItem) {
  let item = _.find(array, filterObj);
  if (!item) array.push(arrayItem);
  else {
    _.forEach(arrayItem, (v, k) => {
      item[k] = v;
    });
  }
}

export default {
  save,
  get,
  saveDevConf,
  saveDevConfImmediately,
  setOnSaveError,
  getDevConf,
  storage,
  cache,
  loadStorage,
  getCache,
  getStorage,
  getDevConfDisplayVars,
  listAddOrUpdate,
  checkAndClearPhyParams,
}