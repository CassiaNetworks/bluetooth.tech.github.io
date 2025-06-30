const cn = {
  // header
  title: 'Cassia 蓝牙调试工具 v2',
  
  // left
  configConnectParams: '接入配置',
  connectStyle: '接入方式',
  serviceURI: '服务URL',
  devKey: '开发账号',
  devSecret: '开发密码',
  apMac: '网关MAC',
  configScanParams: '扫描配置',
  useChip: '使用芯片',
  filterName: '过滤名称',
  filterMac: '过滤MAC',
  fitlerRSSI: '过滤RSSI',
  restartAP: '重启网关',
  startScan: '开始扫描',
  stopScan: '停止扫描',
  
  configConnParams: '连接配置',
  discovergatt: '发现GATT',
  connTimeout: '超时时间(s)',
  others: '其他参数',

  // menu
  configParams: '配置参数',
  scanList: '扫描列表',
  connectList: '连接列表',
  notifyList: '通知列表',
  apiLogList: '接口日志',
  apiDebugger: '接口调试',
  apiDemo: '场景示例',
  tools: '常用工具',
  resources: '相关资源',

  // scan result tab
  scanResult: '扫描结果',
  devicesCount: '设备数量',
  searchMacOrName: '搜索mac或name',
  export: '导出',
  clear: '清空',
  name: '名称',
  addr: '地址',
  type: '类型',
  signal: '信号',
  operation: '操作',
  connect: '连接',

  // rssi chart tab
  rssiChart: 'RSSI图表',
  statsCycle: '统计周期',
  seconds60: '60秒',
  statsInterval: '统计间隔',
  millseconds200: '200毫秒',
  millseconds500: '500毫秒',
  seconds1: '1秒',
  seconds2: '2秒',
  seconds5: '5秒',
  seconds10: '10秒',
  seconds30: '30秒',
  open: '开启',
  stop: '暂停',
  continue: '继续',
  close: '关闭',

  // connect list tab
  connectedDevices: '已连接设备',
  disconnectAll: '全部断连',
  chip: '芯片',
  services: '服务',
  disconnect: '断连',
  pair: '设备配对',
  unpair: '取消配对',
  noParser: '暂未添加解析',
  field: '字段',
  parse: '解析',

  // notify list tab
  receivedNotifys: '收到通知',
  searchMac: '搜索mac',
  timestamp: '时间戳',

  // api log tab
  logsCount: '日志条数',
  search: '搜索',
  time: '时间',
  apiName: '接口名称',
  reqContent: '请求内容',

  // api debugger
  auth: '获取Token',

  scanDevices: '扫描设备',
  scanDevicesInfo: '此接口是SSE长连接，调用接口后，蓝牙路由器会扫描周边的设备，并将蓝牙设备的MAC地址(bdaddr)、地址类型（bdaddrType）、广播报数据（adData/scanData）、设备名称（name）、信号强度（rssi）等信息以http response的形式返回。',
  more: '更多参考',
  chip0: '芯片0',
  chip1: '芯片1',
  chipAll: 'Both',
  startDebug: '开始调试',
  genCode: '生成代码',
  
  connectDevice: '连接设备',
  connectDeviceInfo: '此接口为同步连接接口，调用接口后，蓝牙路由器会与指定的设备建立连接，并返回连接结果。',
  addrType: '地址类型',
  deviceAddr: '设备地址',

  readData: '读取数据',
  readDataInfo: '本接口是负责与设备通讯的主要接口，具体负责从蓝牙设备指定服务读取数据。',

  writeData: '写入数据',
  writeDataInfo: '本接口是负责与设备通讯的主要接口，具体负责向蓝牙设备指定服务写入数据。',
  writeStyle: '写入方式',
  wait: '等待',
  noWait: '不等待',

  disConnect: '断开连接',
  disConnectInfo: '此接口是DELETE请求，调用接口后，蓝牙路由器会与指定MAC地址的蓝牙设备断连。',
  
  connectListInfo: '此接口是GET请求，调用接口后，蓝牙路由器会将目前连接的设备的列表返回。',

  deviceServices: '设备服务',
  deivceServicesInfo: '此接口是GET请求，调用接口后，蓝牙路由器会向指定的蓝牙设备请求其服务的树形列表，调用次接口的主要目的是为对蓝牙设备进行读写操作时，获取蓝牙设备的characteristic所对应的valueHandle或者handle。',

  openNotify: '打开通知',
  openNotifyInfo: '此接口是SSE长连接，当打开蓝牙设备的notification/indication后，蓝牙设备会将通知消息上报到蓝牙路由器。',

  connectStatus: '连接状态',
  connectStatusInfo: '此接口是SSE长连接，当蓝牙路由器上的蓝牙设备的连接状态发生改变时（连接成功或者发生断连），会通过此接口将消息通知到pc端。',

  pairInfo: '通过此接口可以与蓝牙设备建立配对。',
  ioCap: '输入能力',

  pairInput: '配对输入',
  pairInputInfo: '通过此接口可以与蓝牙设备完成配对输入操作。',
  inputType: '输入类型',

  unpairInfo: '此接口是DELETE请求，调用接口后，蓝牙路由器会与指定MAC地址的蓝牙设备取消配对。',

  debugResult: '调试结果',
  connectWriteNotify: '[单设备]建连->写入->通知',
  test: '测试',
  historyApi: '历史接口',

  writeCmd: '写入指令',

  receiveNotify: '接收通知',
  receiveDataBySSE: '通过SSE接收数据',

  clearData: '清空数据',

  scanConnectWriteNotify: '[多设备]扫描->建连->写入',
  connectScannedDevices: '连接扫描到的设备',

  binaryConversion: '进制转换',
  jsonFormatter: 'JSON格式化',

  cancel: '取 消',
  ok: '确 定',

  router: '路由器',
  noData: '无数据',
  pleaseSelect: '请选择',
  pleaseInput: '请输入',
  noMatchData: '无匹配数据',

  // vue.js
  noSupportByAp: '暂时不支持，请使用AC方式操作',
  operationFail: '操作失败',
  operationOk: '操作成功',
  getApInfoOk: '获取AP信息成功',
  getApInfoFail: '获取AP信息失败',
  rebootApOk: '重启AP成功',
  rebootApFail: '重启AP失败',
  unpairOk: '取消配对成功',
  unpairFail: '取消配对失败',
  pairOk: '配对成功',
  pairFail: '配对失败',
  pairAbort: '配对终止',
  disconnectFail: '断连失败',
  testScanOk: '测试扫描成功',
  testScanFail: '测试扫描失败',
  testWriteOk: '测试写入数据成功',
  testWriteFail: '测试写入数据失败',
  testConnectFail: '测试连接设备失败',
  alreadyStopScan: '已自动停止API扫描',
  debuggerScanAlert: '调试API扫描到结果就主动停止，正常的SSE会一直收到数据',
  connectDeviceOk: '连接设备成功',
  connectDeviceFail: '连接设备失败',
  readDataOk: '读取数据成功',
  readDataFail: '读取数据失败',
  writeDataOk: '写入数据成功',
  writeDataFail: '写入数据失败',
  disconnectDeviceOk: '断连设备成功',
  disconnectDeviceFail: '断连设备失败',
  getConnectListOk: '获取连接列表成功',
  getConnectListFail: '获取连接列表失败',
  getDeviceServiceListOk: '获取设备服务列表成功',
  getDeviceServiceListFail: '获取设备服务列表失败',
  alreadyStopNotify: '已自动停止API通知',
  openNotifyFail: '开启通知失败',
  debuggerNotifyAlert: '调试API开启通知后收到结果就主动停止，正常的SSE会一直收到数据',
  openConnectStatusFail: '开启连接状态失败',
  openConnectStatusOk: '开启连接状态成功',
  openApiResultOk: '开启API结果成功',
  closeApiResultOk: '关闭API结果成功',
  functionToBeAdd: '功能待添加',
  clearApiResultOk: '清除API结果成功',
  clearNotifyOk: '清除Notify成功',
  openNotifyOk: '开启Notify成功',
  closeNotifyOk: '关闭Notify成功',
  alert: '提示',
  openRssiChartOk: '开启RSSI图表成功',
  openScanOk: '开启扫描成功',
  tooManyDeviceScannedAlert: '当前扫描设备数量超过5个，已自动关闭rssi图表，请配置合适的扫描过滤参数，防止卡顿',

  // connect.js
  closeConnectStatusSSE: '关闭连接状态SSE，SSE异常',

  // operation.js
  sendNotifyOk: '下发设备通知成功',
  sendNotifyFail: '下发设备通知失败',

  // scan.js
  closeScanSSE: '停止扫描，扫描SSE异常',
  stopScanOk: '停止扫描成功',

  // api, 暂时统一为en
  // apiGetToken: '请求令牌',
  // apiOpenNotify: '打开通知',
  // apiUnpair: '取消配对',
  // apiInfo: '获取AP信息',
  // apiReboot: '重启AP',
  // apiPair: '设备配对',
  // apiPairInput: '配对输入',
  // apiConnect: '连接设备',
  // apiDisconnect: '断开连接',
  // apiConnectList: '连接列表',
  // apiServiceList: '服务列表',
  // apiRead: '读取数据',
  // apiWrite: '写入数据',
  // apiScan: '扫描设备',
  // apiConnectEvent: '连接事件',
  apiGetToken: 'Get Token',
  apiOpenNotify: 'Open Notify',
  apiUnpair: 'Unpair',
  apiInfo: 'Info',
  apiReboot: 'Reboot',
  apiPair: 'Pair',
  apiPairInput: 'Pair Input',
  apiConnect: 'Connect',
  apiDisconnect: 'Disconnect',
  apiConnectList: 'Connections',
  apiServiceList: 'Services',
  apiRead: 'Read',
  apiWrite: 'Write',
  apiScan: 'Scan',
  apiConnectEvent: 'Connection Event',
  
  replayApiOperation: '执行',
  replayApiOk: '执行成功',
  replayApiFail: '执行失败',

  getAcRouterListFail: '获取AC路由列表失败，请检查相关接入参数',

  apiDescription: '接口描述',
  apiDemoDescription: '示例描述',
  demo1Info: '此示例为操作单个设备，用于连接设备、写入指令、接收设备Notify的示例',
  demo2Info: '此示例为操作多个设备，每当扫描到配置的合适条件的设备后，连接设备，写入指令',

  demo1: '示例1',
  demo2: '示例2',

  getAccessTokenOk: '获取token成功',
  getAccessTokenFail: '获取token失败',
  authInfo: '此接口为使用AC方式调试时，通过开发者key和开发者secret进行认证，获取access_token，后续每次接口调用都需要携带此token',

  add2RssiChart: '加入图表',
  removeFromRssiChart: '图表移除',

  apConfigInfo: '请检查 <span style="color: red; font-weight: bold;">网关地址、Allow Origin、API开关</span> 配置！<br>是否跳转至网关配置页面？',
  acConfigInfo: '请检查 <span style="color: red; font-weight: bold;">AC地址、开发者账号配置、Allow Origin、网关状态</span> 配置！<br>是否跳转至AC配置页面？',

  configOrigin: '从v2.0.3版本开始，默认情况下，AC和路由器上的CORS被禁用。使用此蓝牙调试工具时，请在控制台设置中设置“Access Control Allow Origin”。请参考<a target="_blank" style="color: #2897ff; text-decoration: none;" href="https://www.cassianetworks.com/download/docs/Cassia_User_Manual.pdf">《Cassia用户手册》</a>了解详细说明。',

  autoSelectionOn: '优选功能',
  on: '开启',
  off: '关闭',
  aps: '网关列表',
  configAutoSelection: '请确保AC配置页面已打开优选功能，默认优选功能关闭',

  oldVersion: '老版本',

  phy: 'PHY',
  secondaryPhy: 'Secondary PHY',
  readPhy: '获取PHY',
  updatePhy: '更新PHY',
  moreArgs: '更多参数',
  readPhyFail: '读取PHY失败',
  readPhyOK: '读取PHY成功',
  updatePhyFail: '更新PHY失败',
  updatePhyOK: '更新PHY成功',
  apiReadPhy: 'Read PHY',
  apiUpdatePhy: 'Update PHY',
  
  deviceScanData: '扫描数据',
  filterDuplicate: 'Filter Duplicates',
  deviceScanDataRealTime: '实时数据',
  scanDetailInfo: '为了防止页面卡顿，周期10毫秒更新数据，最多支持2000条数据。获取实时数据，请【实时数据】',

  apiReadPhyInfo: '此接口是GET请求，调用接口，蓝牙网关会获取指定MAC的PHY信息，主要用于BLE5场景',
  apiUpdatePhyInfo: '此接口是POST请求，调用接口，蓝牙网关会更新指定MAC的PHY信息，主要用于BLE5场景',
  notificationDetailInfo: '为了防止页面卡顿，周期500毫秒更新数据。获取实时数据，请【实时数据】',
  timestampInfo: '开启时使用数据中的时间信息，未开启使用页面收到数据时间',
  
  notificationSequence: '包序号',
  notificationSequenceInfo: '开启时使用数据中的seqNum，未开启使用页面计数',
};

export default {
  message: cn,
};