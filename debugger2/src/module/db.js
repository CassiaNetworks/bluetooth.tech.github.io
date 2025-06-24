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
    discovergatt: 1, // 是否开启，默认开启，与API默认参数保持一致
    connTimeout: 15, // 连接超时时间，单位秒，默认为10秒
    connPhy: '',
    secondaryPhy: '',
    connParams: '', // 连接接口其他参数
    autoSelectionOn: 'off', // 是否开启优选，默认不开启
    aps: [], // 优选选择的网关列表
  },
  devConfDisplayVars: {
    oldVersionUrl: '#', // 老版本debugger链接
    leftConfWidth: '326px', // 左侧配置栏宽度
    leftConfLabelWidth: '85px', // 左侧label宽度
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
    apiDebuggerParams: { // 调试工具参数
      [libEnum.apiType.AUTH]: {},
      [libEnum.apiType.SCAN]: {chip: 0, filter_name: [], filter_mac: [], phy: [], filter_rssi: -65},
      [libEnum.apiType.CONNECT]: {
        chip: 0, 
        deviceMac: 'C0:00:5B:D1:AA:BC', 
        addrType: libEnum.deviceAddrType.PUBLIC, 
        discovergatt: 1, 
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
      [libEnum.apiType.NOTIFY]: {},
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

  clientHeight: 0, // dom高度, 响应动态变化
  vxeGridHeight: 0, // vxe表格高度, 响应动态变化
  currentConnectedTab: 'connectTab0',
  scanDisplayFilterContent: '',
  connectDisplayFilterContent: '',
  notifyDisplayFilterContent: '',
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
        [libEnum.codeType.NODEJS]: ''
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
        [libEnum.codeType.NODEJS]: ''
      }
    },
    [libEnum.apiType.CONNECT]: {
      resultList: [],
      code: {
        [libEnum.codeType.CURL]: '',
        [libEnum.codeType.NODEJS]: ''
      }
    },
    [libEnum.apiType.READ]: {
      resultList: [],
      code: {
        [libEnum.codeType.CURL]: '',
        [libEnum.codeType.NODEJS]: ''
      }
    },
    [libEnum.apiType.READ_PHY]: {
      resultList: [],
      code: {
        [libEnum.codeType.CURL]: '',
        [libEnum.codeType.NODEJS]: ''
      }
    },
    [libEnum.apiType.UPDATE_PHY]: {
      resultList: [],
      code: {
        [libEnum.codeType.CURL]: '',
        [libEnum.codeType.NODEJS]: ''
      }
    },
    [libEnum.apiType.WRITE]: {
      resultList: [],
      code: {
        [libEnum.codeType.CURL]: '',
        [libEnum.codeType.NODEJS]: ''
      }
    },
    [libEnum.apiType.DISCONNECT]: {
      resultList: [],
      code: {
        [libEnum.codeType.CURL]: '',
        [libEnum.codeType.NODEJS]: ''
      }
    },
    [libEnum.apiType.CONNECT_LIST]: {
      resultList: [],
      code: {
        [libEnum.codeType.CURL]: '',
        [libEnum.codeType.NODEJS]: ''
      }
    },
    [libEnum.apiType.DISCOVER]: {
      resultList: [],
      code: {
        [libEnum.codeType.CURL]: '',
        [libEnum.codeType.NODEJS]: ''
      }
    },
    [libEnum.apiType.NOTIFY]: {
      resultList: [],
      code: {
        [libEnum.codeType.CURL]: '',
        [libEnum.codeType.NODEJS]: ''
      }
    },
    [libEnum.apiType.CONNECT_STATUS]: {
      resultList: [],
      code: {
        [libEnum.codeType.CURL]: '',
        [libEnum.codeType.NODEJS]: ''
      }
    },
    [libEnum.apiType.PAIR]: {
      resultList: [],
      code: {
        [libEnum.codeType.CURL]: '',
        [libEnum.codeType.NODEJS]: ''
      }
    },
    [libEnum.apiType.PAIR_INPUT]: {
      resultList: [],
      code: {
        [libEnum.codeType.CURL]: '',
        [libEnum.codeType.NODEJS]: ''
      }
    },
    [libEnum.apiType.UNPAIR]: {
      resultList: [],
      code: {
        [libEnum.codeType.CURL]: '',
        [libEnum.codeType.NODEJS]: ''
      }
    }
  },
  scanResultList: [ // 扫描结果缓存池，mac为唯一key，重复的只更新rssi值，显示列表从这取数据，TODO: 待优化查找
    // {name: 'UNKNOWN', mac: 'CC:1B:E0:E0:DD:70', bdaddrType: 'public', rssi: -75, adData: '0201061BFF5701006BFCA25D5ED51C0B3E60820178B901BE01D40B59A1259C'},
    // {name: 'MI BAND 3', mac: 'CC:1B:E0:E0:DD:71', bdaddrType: 'random', rssi: -75, adData: '0201061BFF5701006BFCA25D5ED51C0B3E60820178B901BE01D40B59A1259C'},
  ],
  deviceScanDetail: { // 设备扫描数据详情，点击detail -> 打开dialog -> 开启SSE -> 记录数据 -> 关闭dialog -> 关闭SSE -> 释放数据
    visiable: false,
    deviceMac: '',
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

// 更新接口地址
function saveAcDevConf(_devConf) {
  _devConf.baseURI = getBaseURI(_devConf);

  // XSS过滤
  _.forEach(_devConf, (v, k) => {
    if (_.isString(v)) _devConf[k] = filterXSS(v);
  });
  storage.devConf = _devConf;
  
  // TODO: 优化定时获取token
  return new Promise(function(resolve, reject) {
    apiModule.getAccessToken(_devConf.baseURI, _devConf.acDevKey, _devConf.acDevSecret).then(function(data) {
      storage.accessToken = data.access_token;
      save(storageKey, JSON.stringify(storage.devConf)); // 只保存配置，其他缓存不保存
      resolve();
    }).catch(function(error) {
      reject(error);
    });
  });
}

function saveDevConf(_devConf) {
  clearTimeout(storage.devConfSaveTimer);
  storage.devConfSaveTimer = setTimeout(function() {
    logger.info('save dev conf:', _devConf);
    if (_devConf.controlStyle === libEnum.controlStyle.AC) {
      return saveAcDevConf(_devConf);
    }
    return saveApDevConf(_devConf);
  }, 1000); // 1秒防止抖动
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
  if (!_.has(storage.devConf, 'discovergatt')) storage.devConf.discovergatt = 1;
  if (!_.has(storage.devConf, 'connTimeout')) storage.devConf.connTimeout = 15;
  if (!_.has(storage.devConf, 'connParams')) storage.devConf.connParams = '';
  if (!_.has(storage.devConf, 'scanParams')) storage.devConf.scanParams = '';
  if (!_.has(storage.devConf, 'autoSelectionOn')) storage.devConf.autoSelectionOn = 'off';
  if (!_.has(storage.devConf, 'aps')) storage.devConf.aps = storage.devConf.mac || ['*'];

  // 如果是AC方式，则更新token
  let _devConf = storage.devConf;
  if (storage.devConf.controlStyle === libEnum.controlStyle.AC) {
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
  getDevConf,
  storage,
  cache,
  loadStorage,
  getCache,
  getStorage,
  getDevConfDisplayVars,
  listAddOrUpdate
}