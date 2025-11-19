const _ = require('lodash');
import { Buffer } from 'buffer';
import libLogger from '../lib/logger.js';
import libEnum from '../lib/enum.js';
import config from '../config/config.js';
import dbModule from './db.js';
import main from '../main.js';

const logger = libLogger.genModuleLogger('api');

axios.defaults.headers['Content-Type'] = 'application/json';

function obj2QueryStr(obj) {
  let arr = [];
  _.forEach(obj, (value, key) => {
    if (_.isArray(value)) value = value.join(',');
    arr.push(`${key}=${value}`);
  })
  return arr.join('&');
}

function isValidValue(value) {
  if (value === undefined || value === null) return false;
  if (_.isArray(value) && value.length === 0) return false;
  return true;
}

function getFields(devConf, fields, withToken=true) {
  let param = {};
  _.forEach(devConf, (value, key) => {
    if (_.includes(fields, key) && isValidValue(value)) param[key] = value;
  });
  if (devConf.controlStyle === libEnum.controlStyle.AC) {
    param.mac = devConf.mac;
    if (withToken) param.access_token = dbModule.getStorage().accessToken;
  }
  return param;
}

// 请求accessToken
function getAccessToken(baseURI, devKey, devSecret, isAddApiLog=true) {
  const url = `${baseURI}/oauth2/token`;
  const body = {grant_type: 'client_credentials'};
  const headers = {
    Authorization: 'Basic ' + Buffer.from(`${devKey}:${devSecret}`).toString('base64'),
  };
  const instance = axios.create({
    timeout: config.http.requestTimeout,
    headers: headers,
  });
  if (isAddApiLog) addApiLogItem(main.getGlobalVue().$i18n.t('message.apiGetToken'), 'POST', url, {}, body, {}, headers);
  return new Promise((resolve, reject) => {
    instance.post(url, body).then(function(response) {
      logger.info('get access token success:', response);
      resolve(response.data);
    }).catch(function(error) {
      logger.error('get access token error:', error);
      reject(error);
    });
  });
}

function scanSseMessageHandler(message) {
  // logger.info('scan sse message:', message);
}

function scanSseErrorHandler(error) {
  logger.error('scan sse error:', error);
}

function getScanUrl(baseURI, params) {
  return `${baseURI}/gap/nodes?${obj2QueryStr(params)}`;
}

function getNotifyUrl(baseURI, params) {
  return `${baseURI}/gatt/nodes?${obj2QueryStr(params)}`;
}

function getConnectUrl(baseURI, deviceMac, params) {
  return `${baseURI}/gap/nodes/${deviceMac}/connection?${obj2QueryStr(params)}`;
}

function getConnectListUrl(baseURI, params) {
  return `${baseURI}/gap/nodes?${obj2QueryStr(params)}&connection_state=connected`;
}

function getAsyncConnectUrl(baseURI, params) {
  return `${baseURI}/gap/batch-connect?${obj2QueryStr(params)}`;
}

function getReadUrl(baseURI, deviceMac, handle, params) {
  return `${baseURI}/gatt/nodes/${deviceMac}/handle/${handle}/value?${obj2QueryStr(params)}`;
}

function getReadPhyUrl(baseURI, deviceMac, params) {
  return `${baseURI}/gap/nodes/${deviceMac}/phy?${obj2QueryStr(params)}`;
}

function getUpdatePhyUrl(baseURI, deviceMac, params) {
  return `${baseURI}/gap/nodes/${deviceMac}/phy?${obj2QueryStr(params)}`;
}

function getWriteUrl(baseURI, deviceMac, handle, value, params) {
  return `${baseURI}/gatt/nodes/${deviceMac}/handle/${handle}/value/${value}?${obj2QueryStr(params)}`;
}

function getDisconnectUrl(baseURI, deviceMac, params) {
  return `${baseURI}/gap/nodes/${deviceMac}/connection?${obj2QueryStr(params)}`;
}

function getPairUrl(baseURI, deviceMac, params) {
  return `${baseURI}/management/nodes/${deviceMac}/pair/?${obj2QueryStr(params)}`;
}

function getUnpairUrl(baseURI, deviceMac, params) {
  return `${baseURI}/management/nodes/${deviceMac}/bond/?${obj2QueryStr(params)}`;
}

function getPairInputUrl(baseURI, deviceMac, params) {
  return `${baseURI}/management/nodes/${deviceMac}/pair-input/?${obj2QueryStr(params)}`;
}

function getDiscoverUrl(baseURI, deviceMac, params) {
  return `${baseURI}/gatt/nodes/${deviceMac}/services/characteristics/descriptors?${obj2QueryStr(params)}`;
}

function getConnectStatusUrl(baseURI, params) {
  return `${baseURI}/management/nodes/connection-state?${obj2QueryStr(params)}`;
}

// params -> {chip: 0, filter_mac: '1,2', phy: '1M,2M,CODED', filter_name: '2,3', filter_rssi: -75, mac: 'aa', access_token: 'bac'}
function startScan(url, messageHandler, errorHandler) {
  let sse = new EventSource(url);
  sse.onmessage = messageHandler || scanSseMessageHandler;
  sse.onerror = errorHandler || scanSseErrorHandler;
  logger.info('open scan sse:', url);
  return sse;
}

function connectStatusSseMessageHandler(message) {
  logger.info('connect status sse message:', message);
}

function connectStatusSseErrorHandler(error) {
  logger.error('connect status sse error:', error);
}

function connectStatusSse(url, messageHandler, errorHandler) {
  let sse = new EventSource(url);
  sse.onmessage = messageHandler || connectStatusSseMessageHandler;
  sse.onerror = errorHandler || connectStatusSseErrorHandler;
  logger.info('connect status sse:', url);
  return sse;
}

function notifySseMessageHandler(message) {
  logger.info('notify sse message:', message);
}

function notifySseErrorHandler(error) {
  logger.error('notify sse error:', error);
}

// query -> {chip: 0, filter_mac: '1,2', phy: '1M,2M,CODED', filter_name: '2,3', filter_rssi: -75, mac: 'aa', access_token: 'bac'}
function openNotifySse(baseURI, query, messageHandler, errorHandler) {
  const url = `${baseURI}/gatt/nodes?${obj2QueryStr(query)}`;
  addApiLogItem(main.getGlobalVue().$i18n.t('message.apiOpenNotify'), 'GET/SSE', url, query);
  let sse = new EventSource(url);
  sse.onmessage = messageHandler || notifySseMessageHandler;
  sse.onerror = errorHandler || notifySseErrorHandler;
  logger.info('open notify sse:', url);
  return sse;
}

// 取消配对
function unpair(baseURI, query, deviceMac) {
  const url = `${baseURI}/management/nodes/${deviceMac}/bond/?${obj2QueryStr(query)}`;
  addApiLogItem(main.getGlobalVue().$i18n.t('message.apiUnpair'), 'POST', url, query, {deviceMac});
  return new Promise((resolve, reject) => {
    axios.delete(url).then(function(response) {
      logger.info('unpair device success:', deviceMac, response);
      resolve(response.data);
    }).catch(function(error) {
      let info = error.response ? error.response.data : error;
      logger.error('unpair device error:', info);
      reject(info);
    });
  });
}

// 重启ap
function info(baseURI, query) {
  const url = `${baseURI}/cassia/info/?${obj2QueryStr(query)}`;
  addApiLogItem(main.getGlobalVue().$i18n.t('message.apiInfo'), 'GET', url, query);
  return new Promise((resolve, reject) => {
    axios.get(url).then(function(response) {
      logger.info('get ap info success:', response);
      resolve(response.data);
    }).catch(function(error) {
      let info = error.response ? error.response.data : error;
      logger.error('get ap info error:', info);
      reject(info);
    });
  });
}

// 重启ap
function reboot(baseURI, query) {
  const url = `${baseURI}/cassia/reboot/?${obj2QueryStr(query)}`;
  addApiLogItem(main.getGlobalVue().$i18n.t('message.apiReboot'), 'GET', url, query);
  return new Promise((resolve, reject) => {
    axios.get(url).then(function(response) {
      logger.info('reboot ap success:', response);
      resolve(response.data);
    }).catch(function(error) {
      let info = error.response ? error.response.data : error;
      logger.error('reboot error:', info);
      reject(info);
    });
  });
}

// 配对
function pair(baseURI, query, deviceMac, body={}) {
  const url = `${baseURI}/management/nodes/${deviceMac}/pair/?${obj2QueryStr(query)}`;
  if (!body.iocapability) body.iocapability = 'KeyboardDisplay';
  addApiLogItem(main.getGlobalVue().$i18n.t('message.apiPair'), 'POST', url, query, {deviceMac});
  return new Promise((resolve, reject) => {
    axios.post(url, body).then(function(response) {
      logger.info('pair device success:', response);
      resolve(response.data);
    }).catch(function(error) {
      let info = error.response ? error.response.data : error;
      logger.error('pair device error:', info);
      reject(info);
    });
  });
}

function updatePhy(baseURI, query, deviceMac, body={}) {
  const url = `${baseURI}/gap/nodes/${deviceMac}/phy?${obj2QueryStr(query)}`;
  addApiLogItem(main.getGlobalVue().$i18n.t('message.apiUpdatePhy'), 'POST', url, query, body);
  return new Promise((resolve, reject) => {
    axios.post(url, body).then(function(response) {
      logger.info('update phy success:', response);
      resolve(response.data);
    }).catch(function(error) {
      let info = error.response ? error.response.data : error;
      logger.error('update phy error:', info);
      reject(info);
    });
  });
}

// 配对输入
function pairInput(baseURI, query, deviceMac, body) {
  const url = `${baseURI}/management/nodes/${deviceMac}/pair-input/?${obj2QueryStr(query)}`;
  addApiLogItem(main.getGlobalVue().$i18n.t('message.apiPairInput'), 'POST', url, query, body, {deviceMac});
  return new Promise((resolve, reject) => {
    axios.post(url, body).then(function(response) {
      logger.info('pair input device success:', response);
      resolve(response.data);
    }).catch(function(error) {
      let info = error.response ? error.response.data : error;
      logger.error('pair input device error:', info);
      reject(info);
    });
  });
}

// 通过输入配对
function pairByPasskey(baseURI, query, deviceMac, passkey) {
  return pairInput(baseURI, query, deviceMac, {passkey}).then(() => {
    logger.info('pair by passkey device success:', deviceMac, passkey);
  }).catch(ex => {
    logger.error('pair by passkey device error:', deviceMac, passkey, ex);
    throw(ex);
  });
}

// Legacy Pairing OOB
function pairByLegacyOOB(baseURI, query, deviceMac, tk) {
  return pairInput(baseURI, query, deviceMac, {tk}).then(() => {
    logger.info('pair by legacy pairing OOB device success:', deviceMac, tk);
  }).catch(ex => {
    logger.error('pair by legacy pairing OOB device error:', deviceMac, tk, ex);
    throw(ex);
  });
}

// Numeric Comparison
function pairByNumbericComparison(baseURI, query, deviceMac, passkey=1) {
  return pairInput(baseURI, query, deviceMac, {passkey}).then(() => {
    logger.info('pair by numberic comparison device success:', deviceMac);
  }).catch(ex => {
    logger.error('pair by numberic comparison device error:', deviceMac, ex);
  });
}

// Security OOB
function pairBySecurityOOB(baseURI, query, deviceMac, rand, confirm) {
  return pair(baseURI, query, deviceMac, {rand, confirm}).then(() => {
    logger.info('pair by security OOB device success:', deviceMac, rand, confirm);
  }).catch(ex => {
    logger.error('pair by security OOB device error:', deviceMac, rand, confirm, ex);
  });
}

// 获取优选开关状态
function getAutoSelectionStatus(baseURI, query) {
  const url = `${baseURI}/aps/ap-select-switch?${obj2QueryStr(query)}`;
  // TODO: 增加API日志
  return new Promise((resolve, reject) => {
    axios.get(url).then(function(response) {
      logger.info('get auto select flag success:', response);
      resolve(response.data);
    }).catch(function(error) {
      let info = _.get(error, 'response.data.error') || _.get(error, 'response.data') || error;
      logger.error('get auto select flag error:', info);
      reject(info);
    });
  });
}

function connectByAutoSelection(baseURI, query, deviceMac, bodyParams) {
  const url = `${baseURI}/aps/connections/connect?${obj2QueryStr(query)}`;
  let body = {devices: [deviceMac]};
  if (_.get(bodyParams, 'aps').includes('*')) bodyParams.aps = '*';
  body = _.merge(body, bodyParams);
  // TODO: 增加API日志
  return new Promise((resolve, reject) => {
    axios.post(url, body).then(function(response) {
      logger.info('connect device success by auto selection:', response);
      resolve(response.data);
    }).catch(function(error) {
      let info = _.get(error, 'response.data.error') || _.get(error, 'response.data') || error;
      logger.error('connect device error by auto selection:', info);
      reject(info);
    });
  });
}

function connect(baseURI, query, deviceMac, addrType, bodyParams) {
  const url = `${baseURI}/gap/nodes/${deviceMac}/connection/?${obj2QueryStr(query)}`;
  let body = {type: addrType};
  body = _.merge(body, bodyParams);
  addApiLogItem(main.getGlobalVue().$i18n.t('message.apiConnect'), 'POST', url, query, body, {deviceMac});
  return new Promise((resolve, reject) => {
    axios.post(url, body).then(function(response) {
      logger.info('connect device success:', response);
      resolve(response.data);
    }).catch(function(error) {
      let info = error.response ? error.response.data : error;
      logger.error('connect device error:', info);
      reject(info);
    });
  });
}

function disconnect(baseURI, query, deviceMac) {
  const url = `${baseURI}/gap/nodes/${deviceMac}/connection/?${obj2QueryStr(query)}`;
  addApiLogItem(main.getGlobalVue().$i18n.t('message.apiDisconnect'), 'DELETE', url, query, {}, {deviceMac});
  return new Promise((resolve, reject) => {
    axios.delete(url).then(function(response) {
      logger.info('disconnect device success:', response);
      resolve(response.data);
    }).catch(function(error) {
      let info = error.response ? error.response.data : error;
      logger.error('disconnect device error:', info);
      reject(info);
    });
  });
}

function getConnectedList(baseURI, query) {
  const url = `${baseURI}/gap/nodes?${obj2QueryStr(query)}&connection_state=connected`;
  addApiLogItem(main.getGlobalVue().$i18n.t('message.apiConnectList'), 'GET', url, query);
  return new Promise((resolve, reject) => {
    axios.get(url).then(function(response) {
      logger.info('get connected list success:', response);
      resolve(response.data);
    }).catch(function(error) {
      let info = error.response ? error.response.data : error;
      logger.error('get connected list error:', info);
      reject(info);
    });
  });
}

function getDeviceServiceList(baseURI, query, deviceMac) {
  const url = `${baseURI}/gatt/nodes/${deviceMac}/services/characteristics/descriptors?${obj2QueryStr(query)}`;
  addApiLogItem(main.getGlobalVue().$i18n.t('message.apiServiceList'), 'GET', url, query, {}, {deviceMac});
  return new Promise((resolve, reject) => {
    axios.get(url).then(function(response) {
      logger.info('get device service list success:', response);
      resolve(response.data);
    }).catch(function(error) {
      let info = error.response ? error.response.data : error;
      logger.error('get device service list error:', info);
      reject(info);
    });
  });
}

function readByHandle(baseURI, query, deviceMac, handle) {
  const url = `${baseURI}/gatt/nodes/${deviceMac}/handle/${handle}/value?${obj2QueryStr(query)}`;
  addApiLogItem(main.getGlobalVue().$i18n.t('message.apiRead'), 'GET', url, query, {}, {deviceMac});
  return new Promise((resolve, reject) => {
    axios.get(url).then(function(response) {
      logger.info('read handle success:', response);
      resolve(response.data);
    }).catch(function(error) {
      let info = error.response ? error.response.data : error;
      logger.error('read handle error:', info);
      reject(info);
    });
  });
}

function writeByHandle(baseURI, query, deviceMac, handle, value, noresponse=false) {
  if (noresponse) query.noresponse = 1;
  let url = `${baseURI}/gatt/nodes/${deviceMac}/handle/${handle}/value/${value}?${obj2QueryStr(query)}`;
  addApiLogItem(main.getGlobalVue().$i18n.t('message.apiWrite'), 'GET', url, query, {}, {deviceMac, handle, value});
  return new Promise((resolve, reject) => {
    axios.get(url).then(function(response) {
      logger.info('write handle success:', response);
      resolve(response.data);
    }).catch(function(error) {
      let info = error.response ? error.response.data : error;
      logger.error('write handle error:', info);
      reject(info);
    });
  });
}

function getReadUrlByDevConf(devConf, deviceMac, handle) {
  const fields = [];
  const params = getFields(devConf, fields);
  return getReadUrl(devConf.baseURI, deviceMac, handle, params);
}

function getReadPhyUrlByDevConf(devConf, deviceMac) {
  const fields = [];
  const params = getFields(devConf, fields);
  return getReadPhyUrl(devConf.baseURI, deviceMac, params);
}

function getUpdatePhyUrlByDevConf(devConf, deviceMac) {
  const fields = [];
  const params = getFields(devConf, fields);
  return getUpdatePhyUrl(devConf.baseURI, deviceMac, params);
}

function getDisconnectUrlByDevConf(devConf, deviceMac, withToken=true) {
  const fields = [];
  const params = getFields(devConf, fields, withToken);
  return getDisconnectUrl(devConf.baseURI, deviceMac, params);
}

function getPairUrlByDevConf(devConf, deviceMac, withToken=true) {
  const fields = [];
  const params = getFields(devConf, fields, withToken);
  return getPairUrl(devConf.baseURI, deviceMac, params);
}

function getUnpairUrlByDevConf(devConf, deviceMac, withToken=true) {
  const fields = [];
  const params = getFields(devConf, fields, withToken);
  return getUnpairUrl(devConf.baseURI, deviceMac, params);
}

function getPairInputUrlByDevConf(devConf, deviceMac, withToken=true) {
  const fields = [];
  const params = getFields(devConf, fields, withToken);
  return getPairInputUrl(devConf.baseURI, deviceMac, params);
}

function getDiscoverUrlByDevConf(devConf, deviceMac, withToken=true) {
  const fields = [];
  const params = getFields(devConf, fields, withToken);
  return getDiscoverUrl(devConf.baseURI, deviceMac, params);
}

function getWriteUrlByDevConf(devConf, deviceMac, handle, value, noresponse, withToken=true) {
  const fields = [];
  const params = getFields(devConf, fields, withToken);
  if (noresponse) params.noresponse = 1;
  return getWriteUrl(devConf.baseURI, deviceMac, handle, value, params);
}

function getConnectUrlByDevConf(devConf, deviceMac, chip, withToken=true) {
  const fields = [];
  const params = getFields(devConf, fields, withToken);
  if (+chip === 0 || +chip === 1) params.chip = chip;
  return getConnectUrl(devConf.baseURI, deviceMac, params);
} 

function getConnectListUrlByDevConf(devConf, withToken=true) {
  const fields = [];
  const params = getFields(devConf, fields, withToken);
  return getConnectListUrl(devConf.baseURI, params);
}

function getAsyncConnectUrlByDevConf(devConf, withToken=true) {
  const fields = [];
  const params = getFields(devConf, fields, withToken);
  return getAsyncConnectUrl(devConf.baseURI, params);
}

function getScanUrlByDevConf(devConf) {
  const fields = ['chip', 'filter_mac', 'phy', 'filter_name', 'filter_rssi', 'timestamp'];
  const params = getFields(devConf, fields);
  params.active = 1;
  params.event = 1;
  return getScanUrl(devConf.baseURI, params);
}

function getScanUrlByUserParams(devConf, chip, filter_mac, phy, filter_name, filter_rssi, withToken=true) {
  const _devConf = _.cloneDeep(devConf);
  _devConf.chip = chip;
  _devConf.filter_mac = filter_mac;
  _devConf.phy = phy;
  _devConf.filter_name = filter_name;
  _devConf.filter_rssi = filter_rssi;
  const fields = ['chip', 'filter_mac', 'phy', 'filter_name', 'filter_rssi'];
  const params = getFields(_devConf, fields, withToken);
  params.active = 1;
  params.event = 1;
  return getScanUrl(devConf.baseURI, params);
}

function getNotificationUrlByUserParams(devConf, timestamp, sequence, withToken=true) {
  const _devConf = _.cloneDeep(devConf);
  _devConf.timestamp = timestamp;
  _devConf.sequence = sequence;
  const fields = ['timestamp', 'sequence'];
  const params = getFields(_devConf, fields, withToken);
  params.event = 1;
  return getNotifyUrl(devConf.baseURI, params);
}

function getOauth2UrlByDevConf(devConf) {
  const url = `${devConf.baseURI}/oauth2/token`;
  return url;
}

function getNotifyUrlByDevConf(devConf, withToken=true) {
  const fields = ['timestamp', 'sequence'];
  const params = getFields(devConf, fields, withToken);
  params.event = 1;
  return getNotifyUrl(devConf.baseURI, params);
}

function getConnectStatusUrlByDevConf(devConf, withToken=true) {
  const fields = [];
  const params = getFields(devConf, fields, withToken);
  return getConnectStatusUrl(devConf.baseURI, params);
}

function addApiLogItem(apiName, method, url, query = {}, body = {}, params = {}, headers = {}) {
  const now = Date.now();
  const apiContent = {url, method, data: {}};
  if (!_.isEmpty(headers)) apiContent.headers = headers;
  if (!_.isEmpty(query)) apiContent.data.query = query;
  if (!_.isEmpty(body)) apiContent.data.body = body;
  if (!_.isEmpty(params)) apiContent.data.params = params;
  const apiContentJson = _.cloneDeep(apiContent);
  apiContentJson.url = `<a href=${apiContentJson.url} target='_blank'>${apiContentJson.url}</a>`;
  dbModule.cache.apiLogResultList.push({
    timestamp: now,
    timeStr: new Date(now).toISOString(),
    apiName,
    apiContent: apiContent,
    apiContentJson: JSON.stringify(apiContentJson)
  });
}

function getUrlVars(queryStr) {
  if (!queryStr) return {};
  var paramArray = queryStr.split("&");
  var len = paramArray.length;
  var paramObj = {};
  var arr = [];
  for (var i = 0; i < len; i++) {
      arr = paramArray[i].split("=");
      if (arr[0] && arr[1]) paramObj[arr[0]] = arr[1];
  }
  return paramObj;
}

function startScanByDevConf(devConf, messageHandler, errorHandler) {
  const fields = ['chip', 'filter_mac', 'phy', 'filter_name', 'filter_rssi'];
  let query = getFields(devConf, fields);
  query.active = 1;
  query.event = 1;
  let scanParams = getUrlVars(devConf.scanParams);
  query = _.merge(query, scanParams)
  let url = `${devConf.baseURI}/gap/nodes?${obj2QueryStr(query)}`;
  if (url && !url.includes('access_token')) {
    url += '&access_token=';
  }
  addApiLogItem(main.getGlobalVue().$i18n.t('message.apiScan'), 'GET/SSE', url, query);
  return startScan(url, messageHandler, errorHandler);
}

function startScanByUserParams(devConf, chip, filter_mac, phy, filter_name, filter_rssi, scanParams, messageHandler, errorHandler) {
  const _devConf = _.cloneDeep(devConf);
  _devConf.chip = chip;
  _devConf.filter_mac = filter_mac;
  _devConf.phy = phy;
  _devConf.filter_name = filter_name;
  _devConf.filter_rssi = filter_rssi;
  _devConf.scanParams = scanParams;
  return startScanByDevConf(_devConf, messageHandler, errorHandler);
}

function openConnectStatusSseByDevConf(devConf, messageHandler, errorHandler) {
  const url = getConnectStatusUrlByDevConf(devConf);
  addApiLogItem(main.getGlobalVue().$i18n.t('message.apiConnectEvent'), 'GET/SSE', url, '');
  return connectStatusSse(url, messageHandler, errorHandler);
}

function startNotifyByDevConf(devConf, messageHandler, errorHandler) {
  const fields = ['timestamp', 'sequence'];
  const params = getFields(devConf, fields);
  params.event = 1;
  return openNotifySse(devConf.baseURI, params, messageHandler, errorHandler);
}

// 普通方式建连
function connectByDevConfNormal(devConf, deviceMac, addrType, chip=0, bodyParams) {
  const params = getFields(devConf, []);
  const scanDisplayResultList = dbModule.getCache().scanDisplayResultList;
  if (!addrType) { // 没有传入则从扫描结果里面找设备地址类型
    const item = _.find(scanDisplayResultList, {mac: deviceMac});
    if (!item) return Promise.reject('can not get addr type');
    addrType = item.bdaddrType;
  }
  if (+chip === 0 || +chip === 1) params.chip = chip;
  return connect(devConf.baseURI, params, deviceMac, addrType, bodyParams);
}

function checkAutoSelection(baseURI, query, deviceMac, bodyParams) {
  return getAutoSelectionStatus(baseURI, query).then(ret => {
    if (ret.status !== 'success' || ret.flag !== 1) {
      throw(main.getGlobalVue().$i18n.t('message.configAutoSelection'));
    }
    return connectByAutoSelection(baseURI, query, deviceMac, bodyParams);
  });
}

// 优选方式建连
// aps, devices, timeout, discovergatt, 用户自定义输入
function connectByDevConfAutoSelection(devConf, deviceMac, bodyParams) {
  const params = getFields(devConf, []);
  return checkAutoSelection(devConf.baseURI, params, deviceMac, bodyParams);
}

// 是否开启了优选，开启了优选使用优选方式建连
// 否则使用普通方式建连
// 注意，优选方式不支持chip参数，其他的目前都支持
function connectByDevConf(devConf, deviceMac, addrType, chip=0, bodyParams) {
  bodyParams = bodyParams || {};
  let autoSelectionOn = _.get(bodyParams, 'autoSelectionOn');
  delete bodyParams['autoSelectionOn']; // 辅助变量，直接删除
  if (autoSelectionOn === 'on' && devConf.controlStyle === 'AC') {
    return connectByDevConfAutoSelection(devConf, deviceMac, bodyParams);
  } else {
    // 支持chip, timeout, discovergatt, 用户自定义输入
    delete bodyParams['aps'];
    return connectByDevConfNormal(devConf, deviceMac, addrType, chip, bodyParams);
  }
}

function readPhy(baseURI, query, deviceMac) {
  const url = `${baseURI}/gap/nodes/${deviceMac}/phy?${obj2QueryStr(query)}`;
  addApiLogItem(main.getGlobalVue().$i18n.t('message.apiReadPhy'), 'GET', url, query, {}, {deviceMac});
  return new Promise((resolve, reject) => {
    axios.get(url).then(function(response) {
      logger.info('device read phy success:', response);
      resolve(response.data);
    }).catch(function(error) {
      let info = error.response ? error.response.data : error;
      logger.error('device read phy error:', info);
      reject(info);
    });
  });
}

function readPhyByDevConf(devConf, deviceMac) {
  const params = getFields(devConf, []);
  return readPhy(devConf.baseURI, params, deviceMac);
}

function updatePhyByDevConf(devConf, deviceMac, bodyParam) {
  const params = getFields(devConf, []);
  return updatePhy(devConf.baseURI, params, deviceMac, bodyParam);
}

function pairByDevConf(devConf, deviceMac, bodyParam) {
  const params = getFields(devConf, []);
  const connectedList = dbModule.getCache().connectedList;
  if (!bodyParam.type) { // 没有传入则从扫描结果里面找设备地址类型
    const item = _.find(connectedList, {mac: deviceMac});
    if (!item) return Promise.reject('can not get addr type');
    bodyParam.type = item.bdaddrType;
  }
  return pair(devConf.baseURI, params, deviceMac, bodyParam);
}

function rebootByDevConf(devConf) {
  const params = getFields(devConf, []);
  return reboot(devConf.baseURI, params);
}

function infoByDevConf(devConf) {
  const params = getFields(devConf, []);
  return info(devConf.baseURI, params);
}

function unpairByDevConf(devConf, deviceMac) {
  const params = getFields(devConf, []);
  return unpair(devConf.baseURI, params, deviceMac);
}

function pairByPasskeyByDevConf(devConf, deviceMac, passkey) {
  const params = getFields(devConf, []);
  return pairByPasskey(devConf.baseURI, params, deviceMac, passkey);
}

function pairByNumbericComparisonByDevConf(devConf, deviceMac, passkey=1) {
  const params = getFields(devConf, []);
  return pairByNumbericComparison(devConf.baseURI, params, deviceMac, passkey);
}

function pairByLegacyOOBByDevConf(devConf, deviceMac, tk) {
  const params = getFields(devConf, []);
  return pairByLegacyOOB(devConf.baseURI, params, deviceMac, tk);
}

function pairBySecurityOOBByDevConf(devConf, deviceMac, rand, confirm) {
  const params = getFields(devConf, []);
  return pairBySecurityOOB(devConf.baseURI, params, deviceMac, rand, confirm);
}

function getConnectedListByDevConf(devConf) {
  const params = getFields(devConf, []);
  return getConnectedList(devConf.baseURI, params);
}

function disconnectByDevConf(devConf, deviceMac) {
  const params = getFields(devConf, []);
  return disconnect(devConf.baseURI, params, deviceMac);
}

function getDeviceServiceListByDevConf(devConf, deviceMac) {
  const params = getFields(devConf, []);
  return getDeviceServiceList(devConf.baseURI, params, deviceMac);
}

function readByHandleByDevConf(devConf, deviceMac, handle) {
  const params = getFields(devConf, []);
  return readByHandle(devConf.baseURI, params, deviceMac, handle);
}

function writeByHandleByDevConf(devConf, deviceMac, handle, value, noresponse) {
  const params = getFields(devConf, []);
  return writeByHandle(devConf.baseURI, params, deviceMac, handle, value, noresponse);
}

function replayApi(apiContent) {
  const supportedMethod = ['GET', 'POST', 'DELETE'];
  if (apiContent.method === 'GET/SSE') {
    return Promise.reject('no support SSE');
  } else if (!_.includes(supportedMethod, apiContent.method)) {
    return Promise.reject(`no support method: ${apiContent.method}`);
  }
  const instance = axios.create({
    timeout: config.http.requestTimeout,
    headers: apiContent.headers,
  });
  return new Promise((resolve, reject) => {
    const action = instance.get;
    if (apiContent.method === 'POST') action = instance.post;
    else if (apiContent.method === 'DELETE') action = instance.delete;
    action(apiContent.url, apiContent.data.body).then(function(response) {
      logger.info('replay api success:', response, apiContent);
      resolve(response.data);
    }).catch(function(error) {
      logger.error('replay api error:', error);
      reject(error);
    });
  });
}

function getAcRouterList(token) {
  const url = `${dbModule.getDevConf().acServerURI}/api/ac/ap?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.get(url).then(function(response) {
      logger.info('get ac gateway list success:', response);
      resolve(response.data);
    }).catch(function(error) {
      let info = error.response ? error.response.data : error;
      logger.error('get ac gateway list error:', info);
      reject(info);
    });
  });
}

function getAcGateway(token, mac) {
  const url = `${dbModule.getDevConf().baseURI}/ac/ap/${mac}?access_token=${token}`;
  return new Promise((resolve, reject) => {
    axios.get(url).then(function(response) {
      logger.info('get ac gateway success:', response);
      resolve(response.data);
    }).catch(function(error) {
      let info = error.response ? error.response.data : error;
      logger.error('get ac gateway error:', info);
      reject(info);
    });
  });
}

export default {
  getAccessToken,
  startScanByDevConf,
  startNotifyByDevConf,
  connectByDevConf,
  disconnectByDevConf,
  getConnectedListByDevConf,
  getDeviceServiceListByDevConf,
  readByHandleByDevConf,
  writeByHandleByDevConf,
  getScanUrlByDevConf,
  openConnectStatusSseByDevConf,
  getConnectUrlByDevConf,
  getReadUrlByDevConf,
  getReadPhyUrlByDevConf,
  getUpdatePhyUrlByDevConf,
  getWriteUrlByDevConf,
  getDisconnectUrlByDevConf,
  startScanByUserParams,
  getNotifyUrlByDevConf,
  getOauth2UrlByDevConf,
  getScanUrlByUserParams,
  getNotificationUrlByUserParams,
  getAsyncConnectUrlByDevConf,
  getConnectStatusUrlByDevConf,
  pairByDevConf,
  pairByPasskeyByDevConf,
  pairByNumbericComparisonByDevConf,
  pairByLegacyOOBByDevConf,
  pairBySecurityOOBByDevConf,
  unpairByDevConf,
  rebootByDevConf,
  infoByDevConf,
  getConnectListUrlByDevConf,
  getDiscoverUrlByDevConf,
  getPairUrlByDevConf,
  getPairInputUrlByDevConf,
  getUnpairUrlByDevConf,
  replayApi,
  getAcRouterList,
  getAcGateway,
  readPhyByDevConf,
  updatePhyByDevConf,
}