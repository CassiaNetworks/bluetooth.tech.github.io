const en = {
  // header
  title: 'Cassia Bluetooth Debug Tool v2',
  
  // left
  configConnectParams: 'Control Setting',
  connectStyle: 'Control',
  serviceURI: 'Server',
  devKey: 'Key',
  devSecret: 'Secret',
  apMac: 'Gateway',
  configScanParams: 'Scan Setting',
  useChip: 'Chip',
  filterName: 'Name Filter',
  filterMac: 'MAC Filter',
  fitlerRSSI: 'RSSI Filter',
  restartAP: 'Reboot Gateway',
  startScan: 'Start Scan',
  stopScan: 'Stop Scan',
  
  configConnParams: 'Connect Setting',
  discovergatt: 'GATT',
  connTimeout: 'Timeout(s)',
  others: 'Other',

  // menu
  configParams: 'Setting',
  scanList: 'Scan Device',
  connectList: 'Connection',
  notifyList: 'Notification',
  apiLogList: 'API Log',
  apiDebugger: 'API Debugger',
  apiDemo: 'API Demo',
  tools: 'Tool',
  resources: 'Resource',

  // scan result tab
  scanResult: 'Scan Result',
  devicesCount: 'Devices Count',
  searchMacOrName: 'Search MAC or Name',
  export: 'Export',
  clear: 'Clear',
  name: 'Name',
  addr: 'Address',
  type: 'Type',
  signal: 'RSSI',
  operation: 'Operation',
  connect: 'Connect',

  // rssi chart tab
  rssiChart: 'RSSI Chart',
  statsCycle: 'Statistical Period',
  seconds60: '60s',
  statsInterval: 'Statistical Interval',
  millseconds200: '200ms',
  millseconds500: '500ms',
  seconds1: '1s',
  seconds2: '2s',
  seconds5: '5s',
  seconds10: '10s',
  seconds30: '30s',
  open: 'Open',
  stop: 'Stop',
  continue: 'Continue',
  close: 'Close',

  // connect list tab
  connectedDevices: 'Connected Device',
  disconnectAll: 'Disconnect All',
  chip: 'Chip',
  services: 'Service',
  disconnect: 'Disconnect',
  pair: 'Pair',
  unpair: 'Unpair',
  noParser: 'No Parser',
  field: 'Field',
  parse: 'Parsed',

  // notify list tab
  receivedNotifys: 'Notification Count',
  searchMac: 'Search MAC',
  timestamp: 'Timestamp',

  // api log tab
  logsCount: 'Logs Count',
  search: 'Search',
  time: 'Time',
  apiName: 'API Name',
  reqContent: 'Request',

  // api debugger
  scanDevices: 'Scan Device',
  scanDevicesInfo: 'This API is a long connection by SSE. After calling the API, the Bluetooth gateway will scan the surrounding devices and set the MAC address (bdaddr), address type (bdaddrType), broadcast data (adData / scanData), and device name (name) of the Bluetooth device, Signal strength (rssi) and other information are returned in the form of http response.',
  more: 'More',
  chip0: 'Chip0',
  chip1: 'Chip1',
  chipAll: 'Both',
  startDebug: 'Debug',
  genCode: 'Code',
  
  connectDevice: 'Connect Device',
  connectDeviceInfo: 'This API is a synchronous connection interface. After calling the API, the Bluetooth gateway will establish a connection with the specified device and return the connection result.',
  addrType: 'Address Type',
  deviceAddr: 'Device MAC',

  readData: 'Read Data',
  readDataInfo: 'This API is the main interface responsible for communication with the device, and is specifically responsible for reading data from the specified service of the Bluetooth device.',

  writeData: 'Write Data',
  writeDataInfo: 'This API is the main interface responsible for communicating with the device, and is specifically responsible for writing data to the Bluetooth device designated service.',
  writeStyle: 'Writing Style',
  wait: 'Wait',
  noWait: 'No Wait',

  disConnect: 'Disconnect',
  disConnectInfo: 'This API is a DELETE request. After calling the interface, the Bluetooth gateway will disconnect from the Bluetooth device with the specified MAC address.',
  
  connectListInfo: 'This API is a GET request. After calling the interface, the Bluetooth gateway will return a list of currently connected devices.',

  deviceServices: 'Device Service',
  deivceServicesInfo: 'This API is a GET request. After calling the interface, the Bluetooth gateway will request a tree list of its services from the specified Bluetooth device. The main purpose of calling the sub-interface is to obtain the characteristic correspondence of the Bluetooth device when reading and writing to the Bluetooth device. ValueHandle or handle.',

  openNotify: 'Open Notification',
  openNotifyInfo: `This API is a SSE long connection. When the Bluetooth device's notification / indication is turned on, the Bluetooth device will report a notification message to the Bluetooth gateway.`,

  connectStatus: 'Connection Status',
  connectStatusInfo: 'This API is a SSE long connection. When the connection status of the Bluetooth device on the Bluetooth gateway changes (successful connection or disconnection occurs), the PC will be notified of the message through this interface.',

  pairInfo: 'Through this interface, you can establish pairing with Bluetooth devices.',
  ioCap: 'IO Capability',

  pairInput: 'Pair Input',
  pairInputInfo: 'Through this API, you can complete the pairing input operation with the Bluetooth device.',
  inputType: 'Input Type',

  unpairInfo: 'This API is a DELETE request. After calling the API, the Bluetooth gateway will unpair with the Bluetooth device with the specified MAC address.',

  debugResult: 'Debug Result',
  connectWriteNotify: '[Single Device] Connect->Write->Receive notification',
  test: 'Test',
  historyApi: 'History API',

  writeCmd: 'Write Cmd',

  receiveNotify: 'Receive Notification',
  receiveDataBySSE: 'Receive Data by SSE',

  clearData: 'Clear Data',

  scanConnectWriteNotify: '[Multiple Devices] Scan->Connect->Write',
  connectScannedDevices: 'Connect Scanned Device',

  binaryConversion: 'Base Conversion',
  jsonFormatter: 'JSON Formatter',

  cancel: 'Cancel',
  ok: 'OK',

  router: 'Gateway',
  noData: 'No Data',
  pleaseSelect: 'Please Select',
  pleaseInput: 'Please Input',
  noMatchData: 'No Matched Data',

  // vue.js
  noSupportByAp: 'Not currently supported, please use AC mode',
  operationFail: 'Operation Failed',
  operationOk: 'Successful Operation',
  getApInfoOk: 'Get AP information succeeded',
  getApInfoFail: 'Failed to obtain AP information',
  rebootApOk: 'AP restarted successfully',
  rebootApFail: 'Failed to restart AP',
  unpairOk: 'Unpaired successfully',
  unpairFail: 'Unpairing failed',
  pairOk: 'Successful pairing',
  pairFail: 'Pairing failed',
  pairAbort: 'Termination of pairing',
  disconnectFail: 'Disconnect failed',
  testScanOk: 'Test scan succeeded',
  testScanFail: 'Test scan failed',
  testWriteOk: 'Test write data success',
  testWriteFail: 'Test write data failed',
  testConnectFail: 'Test connected device failed',
  alreadyStopScan: 'Automatically stopped API scanning',
  debuggerScanAlert: 'When the debugging API scans the result, it stops automatically, and the normal SSE will always receive data.',
  connectDeviceOk: 'Device connected successfully',
  connectDeviceFail: 'Failed to connect device',
  readDataOk: 'Reading data succeeded',
  readDataFail: 'Reading data failed',
  writeDataOk: 'Data written successfully',
  writeDataFail: 'Writing data failed',
  disconnectDeviceOk: 'Device disconnected successfully',
  disconnectDeviceFail: 'Device disconnection failed',
  getConnectListOk: 'Get connection list successfully',
  getConnectListFail: 'Failed to get list of connections',
  getDeviceServiceListOk: 'Successfully getting device service list',
  getDeviceServiceListFail: 'Failed to get device service list',
  alreadyStopNotify: 'API notifications have been automatically stopped',
  openNotifyFail: 'Notification failed',
  debuggerNotifyAlert: 'After the debugging API is turned on, it will automatically stop after receiving the result. Normal SSE will always receive data.',
  openConnectStatusFail: 'Failed to open connection status',
  openConnectStatusOk: 'Successfully opened connection status',
  openApiResultOk: 'API turned on successfully',
  closeApiResultOk: 'API closed successfully',
  functionToBeAdd: 'Features to be added',
  clearApiResultOk: 'Clear API results successfully',
  clearNotifyOk: 'Clear Notify succeeded',
  openNotifyOk: 'Open Notify successfully',
  closeNotifyOk: 'Close Notify successfully',
  alert: 'Alert',
  openRssiChartOk: 'Open RSSI chart successfully',
  openScanOk: 'Open scan successfully',
  tooManyDeviceScannedAlert: 'The current number of scanning devices exceeds 5. The RSSI chart has been automatically closed. Please configure appropriate scanning filter parameters to prevent stuttering.',

  // connect.js
  closeConnectStatusSSE: 'Closed connection state SSE, SSE abnormal',

  // operation.js
  sendNotifyOk: 'Send device notification successfully',
  sendNotifyFail: 'Send device notification failed',

  // scan.js
  closeScanSSE: 'Stop scanning, SSE abnormal',
  stopScanOk: 'Stop scanning successfully',

  // api
  apiGetToken: 'Get Token',
  apiOpenNotify: 'Open Notify',
  apiUnpair: 'Unpair',
  apiInfo: 'Info',
  apiReboot: 'Reboot',
  apiPair: 'Pair',
  apiPairInput: 'Pair Input',
  apiConnect: 'Connect',
  apiDisconnect: 'Disconnect',
  apiConnectList: 'Connection',
  apiServiceList: 'Service',
  apiRead: 'Read',
  apiWrite: 'Write',
  apiScan: 'Scan',
  apiConnectEvent: 'Connection Event',

  replayApiOperation: 'replay',
  replayApiOk: 'API replay successful',
  replayApiFail: 'API replay failed',

  getAcRouterListFail: 'Failed to obtain AC routing list, please check related access parameters',

  apiDescription: 'API Info',
  apiDemoDescription: 'Demo Info',
  demo1Info: 'This is example of connecting a device, writing instructions, and receiving a device Notify',
  demo2Info: 'This example is to operate multiple devices. Whenever a device with suitable conditions is scanned, connect the device and write instructions',

  demo1: 'Demo 1',
  demo2: 'Demo 2',

  getAccessTokenOk: 'Successfully obtained token',
  getAccessTokenFail: 'Failed to get token',
  authInfo: 'When this interface is used for AC debugging, it is authenticated by the developer key and the developer secret to obtain the access_token, and each subsequent interface call needs to carry this token.',

  add2RssiChart: 'Add Chart',
  removeFromRssiChart: 'Chart Remove',

  apConfigInfo: 'Please check the <span style="color: red; font-weight: bold;">Gateway URI, Allow Origin, Local API Switch</span> configuration.<br>Do you want to jump to the Gateway configuration page?',
  acConfigInfo: 'Please check the <span style="color: red; font-weight: bold;">AC URI, developer account, Allow Origin, Gateway Status</span> configuration<br>Do you want to jump to the AC configuration page?',

  configOrigin: 'Starting v2.0.3 release, CORS is disabled by default on AC and Gateway. When using this Bluetooth Debug Tool, please set ‘Access Control Allow Origin’ in the console setting. Please refer to <a target="_blank" style="color: #2897ff; text-decoration: none;" href="https://www.cassianetworks.com/download/docs/Cassia_User_Manual.pdf">Cassia User Manual</a> for detailed instruction. ',

  autoSelectionOn: 'Auto-Selection',
  on: 'ON',
  off: 'OFF',
  aps: 'Gateway',
  configAutoSelection: 'Please make sure that the AC configuration page has opened the Auto-Selection, by default its closed.',

  oldVersion: 'Old Version',
  auth: 'Auth Token',

  phy: 'PHY',
  secondaryPhy: 'Secondary PHY',
  readPhy: 'Read PHY',
  updatePhy: 'Update PHY',
  moreArgs: 'More Parameters',
  scanDetailInfo: 'To prevent page lag, data updates every 10ms with a maximum of 2000 entries. For real-time monitoring data, [Open New Tab]',
  readPhyFail: 'Read PHY failed',
  readPhyOK: 'Read PHY successfully',
  updatePhyFail: 'Update PHY failed',
  updatePhyOK: 'Update PHY successfully',
  apiReadPhy: 'Read PHY',
  apiUpdatePhy: 'Update PHY',

  deviceScanData: 'Scan Data',
  filterDuplicate: 'Filter Duplicates',
  deviceScanDataRealTime: 'Realtime Data',
  scanDetailInfo: 'Data updates every 10ms with up to 2000 entries to avoid lag. See [Realtime Data] for live monitoring.',

  apiReadPhyInfo: 'This is a GET request. When called, the Bluetooth gateway retrieves the PHY information of the specified MAC address, primarily for BLE 5 scenarios.',
  apiUpdatePhyInfo: 'This is a POST request. When called, the Bluetooth gateway updates the PHY information of the specified MAC address, primarily for BLE 5 scenarios.',
  notificationDetailInfo: 'Data updates every 500ms to avoid lag. See [Realtime Data] for live monitoring.',
  timestampInfo: 'When the timestamp is enabled, the time in the data is used. When disabled, the time the page receives the data is used.',

  notificationSequence: 'Seq Num',
  notificationSequenceInfo: 'When enabled, the seqNum in the data is used; when disabled, a page-side counter is used.',
};

export default {
  message: en,
};