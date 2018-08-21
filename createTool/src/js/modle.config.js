const config = {};
config.httpServer = {
  id: 1,
  point: '01',
  'inputType': 'auto',
  'inputTypes': ['auto'],
  'outputType': ['http_server'],
  'downstream': [3, 4, 5, 6, 7, 8]
};
config.httpClient = {
  id: 2,
  point: '00',
  'inputType': null,
  'inputTypes': ['auto'],
  'outputType': [''],
  'downstream': []
};
config.charts = {
  id: 9,
  point: '00',
  'inputType:': null,
  'inputTypes': ['auto'],
  'outputType': [''],
  'downstream': []
};
config.scan = {
  id: 3,
  point: 'FF',
  'inputType': 'auto',
  'inputTypes': ['auto', 'http_server'],
  'outputType': ['scan_data'],
  'downstream': [2, 8]
};
config.notification = {
  id: 4,
  point: 'FF',
  'inputType': 'auto',
  'inputTypes': ['auto', 'http_server'],
  'outputType': ['notification_data'],
  'downstream': [2, 7, 8]
};
config.connect = {
  id: 5,
  point: 'FF',
  'inputType': 'auto',
  'inputTypes': ['auto', 'http_server'],
  'outputType': ['status'],
  'downstream': [2, 6, 7]
};
config.write = {
  id: 6,
  point: 'FF',
  'inputType': null,
  'inputTypes': ['status', 'fn_string', 'fn_arr', 'fn_obj', 'fn_bool'],
  'outputType': ['status'],
  'downstream': [2, 7]
};
config.disconnect = {
  id: 7,
  point: 'FF',
  'inputType': null,
  'inputTypes': ['status', 'fn_bool'],
  'outputType': ['status'],
  'downstream': [2]
};
config.function = {
  id: 8,
  point: 'FF',
  'inputType': ['scan_data'],
  'inputTypes': ['scan_data', 'notification_data', 'http_server'],
  'outputType': ['fn_obj', 'fn_string', 'fn_arr', 'fn_bool'],
  'downstream': [2, 6, 7, 9],
  'inputTypes2value': {
    'scan_data': ['routerMac','deviceMac', 'name', 'rssi', 'type','evt_type','adData', 'scan_data', 'store'],
    'notification_data': ['routerMac','deviceMac', 'handle', 'notifyData', 'store'],
    'http_server': ['obj', 'store'],
  }
};
export default config;