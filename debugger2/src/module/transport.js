/**
 * 通信适配器模块
 * 统一封装 HTTP 和 MQTT 两种通信方式，根据配置自动选择
 * 
 * 使用方式：
 * import transportModule from './transport.js';
 * transportModule.connect(deviceMac, addrType, options);
 */

const _ = require('lodash');
import libLogger from '../lib/logger.js';
import libEnum from '../lib/enum.js';
import dbModule from './db.js';
import apiModule from './api.js';
import mqttModule from './mqtt.js';
import main from '../main.js';

const logger = libLogger.genModuleLogger('transport');

/**
 * 判断当前是否使用 MQTT 模式
 */
function isMqttMode() {
  const devConf = dbModule.getDevConf();
  return devConf.transportType === libEnum.transportType.MQTT;
}

/**
 * 判断当前是否使用 HTTP 模式
 */
function isHttpMode() {
  return !isMqttMode();
}

/**
 * 获取当前网关 MAC
 */
function getGatewayMac() {
  const devConf = dbModule.getDevConf();
  if (isMqttMode()) {
    return devConf.mqtt.gateway;
  }
  return devConf.mac;
}

/**
 * 连接设备
 */
function connect(deviceMac, addrType, options) {
  options = options || {};
  const devConf = dbModule.getDevConf();
  
  if (isMqttMode()) {
    const gateway = devConf.mqtt.gateway;
    const url = '/gap/nodes/' + deviceMac + '/connection';
    
    // 如果没有传入 addrType，从扫描结果列表中查找（与 HTTP 模式保持一致）
    if (!addrType) {
      const scanDisplayResultList = dbModule.getCache().scanDisplayResultList;
      const item = _.find(scanDisplayResultList, { mac: deviceMac });
      if (!item) {
        return Promise.reject(new Error('can not get addr type'));
      }
      addrType = item.bdaddrType;
    }
    
    const body = { type: addrType };
    
    if (options.chip !== undefined) body.chip = options.chip;
    if (options.timeout) body.timeout = options.timeout;
    if (options.discovergatt !== undefined) body.discovergatt = options.discovergatt;
    if (options.phy) body.phy = options.phy;
    if (options.secondaryPhy) body.secondaryPhy = options.secondaryPhy;
    
    return mqttModule.sendApiRequest(gateway, url, 'POST', body);
  } else {
    return apiModule.connectByDevConf(devConf, deviceMac, addrType, options.chip, options);
  }
}

/**
 * 断开设备连接
 */
function disconnect(deviceMac) {
  const devConf = dbModule.getDevConf();
  
  if (isMqttMode()) {
    const gateway = devConf.mqtt.gateway;
    const url = '/gap/nodes/' + deviceMac + '/connection';
    return mqttModule.sendApiRequest(gateway, url, 'DELETE', {});
  } else {
    return apiModule.disconnectByDevConf(devConf, deviceMac);
  }
}

/**
 * 获取连接列表
 */
function getConnectedList() {
  const devConf = dbModule.getDevConf();
  
  if (isMqttMode()) {
    const gateway = devConf.mqtt.gateway;
    const url = '/gap/nodes?connection_state=connected';
    return mqttModule.sendApiRequest(gateway, url, 'GET', {});
  } else {
    return apiModule.getConnectedListByDevConf(devConf);
  }
}

/**
 * 获取设备服务列表
 */
function getDeviceServiceList(deviceMac) {
  const devConf = dbModule.getDevConf();
  
  if (isMqttMode()) {
    const gateway = devConf.mqtt.gateway;
    const url = '/gatt/nodes/' + deviceMac + '/services/characteristics/descriptors';
    return mqttModule.sendApiRequest(gateway, url, 'GET', {});
  } else {
    return apiModule.getDeviceServiceListByDevConf(devConf, deviceMac);
  }
}

/**
 * 读取数据
 */
function readByHandle(deviceMac, handle) {
  const devConf = dbModule.getDevConf();
  
  if (isMqttMode()) {
    const gateway = devConf.mqtt.gateway;
    const url = '/gatt/nodes/' + deviceMac + '/handle/' + handle + '/value';
    return mqttModule.sendApiRequest(gateway, url, 'GET', {});
  } else {
    return apiModule.readByHandleByDevConf(devConf, deviceMac, handle);
  }
}

/**
 * 写入数据
 */
function writeByHandle(deviceMac, handle, value, noresponse) {
  const devConf = dbModule.getDevConf();
  
  if (isMqttMode()) {
    const gateway = devConf.mqtt.gateway;
    let url = '/gatt/nodes/' + deviceMac + '/handle/' + handle + '/value/' + value;
    if (noresponse) url += '?noresponse=1';
    return mqttModule.sendApiRequest(gateway, url, 'GET', {});
  } else {
    return apiModule.writeByHandleByDevConf(devConf, deviceMac, handle, value, noresponse);
  }
}

/**
 * 读取 PHY
 */
function readPhy(deviceMac) {
  const devConf = dbModule.getDevConf();
  
  if (isMqttMode()) {
    const gateway = devConf.mqtt.gateway;
    const url = '/gap/nodes/' + deviceMac + '/phy';
    return mqttModule.sendApiRequest(gateway, url, 'GET', {});
  } else {
    return apiModule.readPhyByDevConf(devConf, deviceMac);
  }
}

/**
 * 更新 PHY
 */
function updatePhy(deviceMac, bodyParam) {
  const devConf = dbModule.getDevConf();
  
  if (isMqttMode()) {
    const gateway = devConf.mqtt.gateway;
    const url = '/gap/nodes/' + deviceMac + '/phy';
    return mqttModule.sendApiRequest(gateway, url, 'POST', bodyParam);
  } else {
    return apiModule.updatePhyByDevConf(devConf, deviceMac, bodyParam);
  }
}

/**
 * 配对
 */
function pair(deviceMac, bodyParam) {
  const devConf = dbModule.getDevConf();
  
  if (isMqttMode()) {
    const gateway = devConf.mqtt.gateway;
    const url = '/management/nodes/' + deviceMac + '/pair';
    return mqttModule.sendApiRequest(gateway, url, 'POST', bodyParam);
  } else {
    return apiModule.pairByDevConf(devConf, deviceMac, bodyParam);
  }
}

/**
 * 取消配对
 */
function unpair(deviceMac) {
  const devConf = dbModule.getDevConf();
  
  if (isMqttMode()) {
    const gateway = devConf.mqtt.gateway;
    const url = '/management/nodes/' + deviceMac + '/bond';
    return mqttModule.sendApiRequest(gateway, url, 'DELETE', {});
  } else {
    return apiModule.unpairByDevConf(devConf, deviceMac);
  }
}

/**
 * 配对输入 - Passkey
 */
function pairByPasskey(deviceMac, passkey) {
  const devConf = dbModule.getDevConf();
  
  if (isMqttMode()) {
    const gateway = devConf.mqtt.gateway;
    const url = '/management/nodes/' + deviceMac + '/pair-input';
    return mqttModule.sendApiRequest(gateway, url, 'POST', { passkey: passkey });
  } else {
    return apiModule.pairByPasskeyByDevConf(devConf, deviceMac, passkey);
  }
}

/**
 * 配对输入 - Legacy OOB
 */
function pairByLegacyOOB(deviceMac, tk) {
  const devConf = dbModule.getDevConf();
  
  if (isMqttMode()) {
    const gateway = devConf.mqtt.gateway;
    const url = '/management/nodes/' + deviceMac + '/pair-input';
    return mqttModule.sendApiRequest(gateway, url, 'POST', { tk: tk });
  } else {
    return apiModule.pairByLegacyOOBByDevConf(devConf, deviceMac, tk);
  }
}

/**
 * 配对输入 - Numeric Comparison
 */
function pairByNumericComparison(deviceMac, passkey) {
  passkey = passkey || 1;
  const devConf = dbModule.getDevConf();
  
  if (isMqttMode()) {
    const gateway = devConf.mqtt.gateway;
    const url = '/management/nodes/' + deviceMac + '/pair-input';
    return mqttModule.sendApiRequest(gateway, url, 'POST', { passkey: passkey });
  } else {
    return apiModule.pairByNumbericComparisonByDevConf(devConf, deviceMac, passkey);
  }
}

/**
 * 配对输入 - Security OOB
 */
function pairBySecurityOOB(deviceMac, rand, confirm) {
  const devConf = dbModule.getDevConf();
  
  if (isMqttMode()) {
    const gateway = devConf.mqtt.gateway;
    const url = '/management/nodes/' + deviceMac + '/pair';
    return mqttModule.sendApiRequest(gateway, url, 'POST', { rand: rand, confirm: confirm });
  } else {
    return apiModule.pairBySecurityOOBByDevConf(devConf, deviceMac, rand, confirm);
  }
}

/**
 * 重启网关
 */
function reboot() {
  const devConf = dbModule.getDevConf();
  
  if (isMqttMode()) {
    const gateway = devConf.mqtt.gateway;
    const url = '/cassia/reboot';
    return mqttModule.sendApiRequest(gateway, url, 'GET', {});
  } else {
    return apiModule.rebootByDevConf(devConf);
  }
}

/**
 * 获取网关信息
 */
function info() {
  const devConf = dbModule.getDevConf();
  
  if (isMqttMode()) {
    const gateway = devConf.mqtt.gateway;
    const url = '/cassia/info';
    return mqttModule.sendApiRequest(gateway, url, 'GET', {});
  } else {
    return apiModule.infoByDevConf(devConf);
  }
}

/**
 * 开始扫描 (HTTP SSE 模式专用)
 * MQTT 模式下扫描数据由网关主动推送，使用 mqttModule.onScanData()
 */
function startScan(messageHandler, errorHandler) {
  if (isMqttMode()) {
    logger.warn('MQTT mode does not use SSE for scanning. Use mqttModule.onScanData() instead.');
    return null;
  }
  const devConf = dbModule.getDevConf();
  return apiModule.startScanByDevConf(devConf, messageHandler, errorHandler);
}

/**
 * 开始扫描 - 使用用户参数 (HTTP SSE 模式专用)
 */
function startScanByUserParams(chip, filter_mac, phy, filter_name, filter_rssi, scanParams, messageHandler, errorHandler) {
  if (isMqttMode()) {
    logger.warn('MQTT mode does not use SSE for scanning. Use mqttModule.onScanData() instead.');
    return null;
  }
  const devConf = dbModule.getDevConf();
  return apiModule.startScanByUserParams(devConf, chip, filter_mac, phy, filter_name, filter_rssi, scanParams, messageHandler, errorHandler);
}

/**
 * 开始通知 (HTTP SSE 模式专用)
 * MQTT 模式下通知数据由网关主动推送，使用 mqttModule.onNotification()
 */
function startNotify(messageHandler, errorHandler) {
  if (isMqttMode()) {
    logger.warn('MQTT mode does not use SSE for notifications. Use mqttModule.onNotification() instead.');
    return null;
  }
  const devConf = dbModule.getDevConf();
  return apiModule.startNotifyByDevConf(devConf, messageHandler, errorHandler);
}

/**
 * 开启连接状态 SSE (HTTP SSE 模式专用)
 * MQTT 模式下连接状态由网关主动推送，使用 mqttModule.onConnectionState()
 */
function openConnectStatusSse(messageHandler, errorHandler) {
  if (isMqttMode()) {
    logger.warn('MQTT mode does not use SSE for connection status. Use mqttModule.onConnectionState() instead.');
    return null;
  }
  const devConf = dbModule.getDevConf();
  return apiModule.openConnectStatusSseByDevConf(devConf, messageHandler, errorHandler);
}

/**
 * 获取当前通信模式
 */
function getTransportType() {
  const devConf = dbModule.getDevConf();
  return devConf.transportType || libEnum.transportType.HTTP;
}

/**
 * 连接 MQTT Broker (MQTT 模式专用)
 */
function connectMqtt() {
  const devConf = dbModule.getDevConf();
  if (!devConf.mqtt) {
    return Promise.reject(new Error('MQTT config not found'));
  }
  return mqttModule.connect(devConf.mqtt);
}

/**
 * 断开 MQTT 连接 (MQTT 模式专用)
 */
function disconnectMqtt() {
  return mqttModule.disconnect();
}

/**
 * 检查 MQTT 是否已连接
 */
function isMqttConnected() {
  return mqttModule.isConnected();
}

/**
 * 获取 MQTT 状态
 */
function getMqttStatus() {
  return mqttModule.getStatus();
}

export default {
  // 模式判断
  isMqttMode: isMqttMode,
  isHttpMode: isHttpMode,
  getTransportType: getTransportType,
  getGatewayMac: getGatewayMac,
  
  // BLE 操作
  connect: connect,
  disconnect: disconnect,
  getConnectedList: getConnectedList,
  getDeviceServiceList: getDeviceServiceList,
  readByHandle: readByHandle,
  writeByHandle: writeByHandle,
  readPhy: readPhy,
  updatePhy: updatePhy,
  pair: pair,
  unpair: unpair,
  pairByPasskey: pairByPasskey,
  pairByLegacyOOB: pairByLegacyOOB,
  pairByNumericComparison: pairByNumericComparison,
  pairBySecurityOOB: pairBySecurityOOB,
  
  // 网关操作
  reboot: reboot,
  info: info,
  
  // SSE 操作 (HTTP 模式专用)
  startScan: startScan,
  startScanByUserParams: startScanByUserParams,
  startNotify: startNotify,
  openConnectStatusSse: openConnectStatusSse,
  
  // MQTT 连接管理
  connectMqtt: connectMqtt,
  disconnectMqtt: disconnectMqtt,
  isMqttConnected: isMqttConnected,
  getMqttStatus: getMqttStatus
}
