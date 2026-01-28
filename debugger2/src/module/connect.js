const _ = require('lodash');
import libEnum from '../lib/enum.js';
import libLogger from '../lib/logger.js';
import apiModule from './api.js';
import dbModule from './db.js';
import vueModule from './vue.js';
import mqttModule from './mqtt.js';
import transportModule from './transport.js';
import main from '../main.js';

const logger = libLogger.genModuleLogger('connect');

let sse = null;

/**
 * 判断当前是否使用 MQTT 模式
 */
function isMqttMode() {
  const devConf = dbModule.getDevConf();
  return devConf.transportType === libEnum.transportType.MQTT;
}

function loadConnectedList() {
  // 记录发起请求时的模式，用于错误处理时判断是否需要显示错误
  const requestMode = isMqttMode() ? 'MQTT' : 'HTTP';
  
  // 使用 transport 适配器，自动选择 HTTP 或 MQTT
  transportModule.getConnectedList().then(function(data) {
    const cache = dbModule.getCache();
    let nodes = data.nodes || data;
    if (!Array.isArray(nodes)) nodes = [];
    
    // 获取新列表中的所有 MAC 地址
    const newMacs = nodes.map(function(item) {
      return item.id || item.mac;
    });
    
    // 移除不在新列表中的设备（同步清理，解决网关重启后 UI 残留问题）
    for (let i = cache.connectedList.length - 1; i >= 0; i--) {
      if (!newMacs.includes(cache.connectedList[i].mac)) {
        logger.info('Removing stale device from connected list:', cache.connectedList[i].mac);
        cache.connectedList.splice(i, 1);
      }
    }
    
    // 添加或更新存在的设备
    _.forEach(nodes, function(item) {
      const mac = item.id || item.mac;
      const connectItem = _.find(cache.connectedList, {mac: mac});
      const chipValue = item.chipId ?? item.chip ?? 0;
      if (connectItem) {
        connectItem.chip = chipValue;
      } else {
        cache.connectedList.push({
          name: item.name || '(unknown)',
          mac: mac, 
          bdaddrType: item.type || item.bdaddrType, 
          chip: chipValue
        });
      }
    });
    
    // 更新 currentConnectedTab，确保指向有效的设备
    if (cache.connectedList.length === 0) {
      cache.currentConnectedTab = 'connectTab0';
    } else if (!_.find(cache.connectedList, {mac: cache.currentConnectedTab})) {
      // 当前选中的设备已不存在，切换到第一个设备
      cache.currentConnectedTab = cache.connectedList[0].mac;
    }
  }).catch(function(err) {
    logger.error('Failed to load connected list:', err);
    // 检查当前模式是否与请求时一致，如果模式已切换则忽略错误
    // 避免竞态条件导致的误报（例如 HTTP 请求还在进行中时用户切换到了 MQTT 模式）
    const currentMode = isMqttMode() ? 'MQTT' : 'HTTP';
    if (currentMode !== requestMode) {
      logger.info('Mode changed from', requestMode, 'to', currentMode, ', ignoring error');
      return;
    }
    const errorMsg = err.message || err.error || JSON.stringify(err);
    vueModule.notify(
      main.getGlobalVue().$i18n.t('message.getConnectListFail') + ': ' + errorMsg,
      main.getGlobalVue().$i18n.t('message.operationFail'),
      libEnum.messageType.ERROR
    );
  });
}

function connectVuxTableForceResize() {
  const cache = dbModule.getCache();
  let data = cache.connectedList.pop();
  if (data) cache.connectedList.push(data);
}

// 更新扫描结果
// {handle: "CB:76:B8:B2:65:6E", chipId: 0, connectionState: "connected"}
// 兼容性说明：某些旧固件的 connectionStatus 消息可能没有 chip/chipId 字段
function connectStatusSseMessageHandler(message) {
  const cache = dbModule.getCache();
  const data = JSON.parse(message.data);
  const chipId = data.chipId ?? data.chip ?? 0; // 兼容不同固件版本
  if (data.connectionState === 'connected') { // 更新连接信息里面的chip
    dbModule.listAddOrUpdate(dbModule.getCache().connectedList, {mac: data.handle}, {
      mac: data.handle,
      chip: chipId
    });
    cache.currentConnectedTab = data.handle; // 自动切换到新连接的设备tab
    vueModule.notify(`[SSE] ${main.getGlobalVue().$i18n.t('message.connectDeviceOk')}: chip${chipId} ${data.handle}`, `${main.getGlobalVue().$i18n.t('message.alert')}`, libEnum.messageType.SUCCESS);
  } else if (data.connectionState === 'disconnected') { 
    let index = _.findIndex(cache.connectedList, {mac: data.handle});
    if (index === -1) return; 
    cache.connectedList.splice(index, 1); // 删除此设备
    let activeItem = cache.connectedList[index] || cache.connectedList[index-1];
    let activeItemName = activeItem ? activeItem.mac : 'connectTab0';
    cache.currentConnectedTab = activeItemName;
    connectVuxTableForceResize();
    vueModule.notify(`[SSE] ${main.getGlobalVue().$i18n.t('message.apiDisconnect')}: ${data.handle}`, `${main.getGlobalVue().$i18n.t('message.alert')}`, libEnum.messageType.WARNING);
  }
}

function connectStatusSseErrorHandler(error) {
  logger.error('connect status sse error:', error);
  vueModule.notify(`${main.getGlobalVue().$i18n.t('message.closeConnectStatusSSE')}: ${error.message || JSON.stringify(error)}`, `${main.getGlobalVue().$i18n.t('message.alert')}`, libEnum.messageType.ERROR);
  sse.close();
  sse = null;
}

function openConnectStatusSse() {
  // MQTT 模式不使用 HTTP SSE，连接状态通过 MQTT 推送
  if (isMqttMode()) {
    logger.info('MQTT mode: skip HTTP SSE for connection-state, using MQTT instead');
    startReceivingMqttConnectionState();
    return;
  }
  const devConf = dbModule.getDevConf();
  sse = apiModule.openConnectStatusSseByDevConf(devConf, connectStatusSseMessageHandler, connectStatusSseErrorHandler);
}

function closeConnectStatusSse() {
  // 无论当前模式，都尝试清理两种连接，避免模式切换时资源泄漏
  // 清理 MQTT 监听
  stopReceivingMqttConnectionState();
  // 清理 HTTP SSE
  if (sse) {
    sse.close();
    sse = null;
  }
}

function reopenConnectStatusSse() {
  closeConnectStatusSse();
  openConnectStatusSse();
}

/**
 * MQTT 连接状态处理函数
 */
function mqttConnectionStateHandler(data) {
  const cache = dbModule.getCache();
  const mac = data.handle || data.mac || data.id;
  const chipId = data.chipId ?? data.chip ?? 0;
  
  if (data.connectionState === 'connected') {
    dbModule.listAddOrUpdate(cache.connectedList, {mac: mac}, {
      mac: mac,
      chip: chipId
    });
    cache.currentConnectedTab = mac; // 自动切换到新连接的设备tab
    vueModule.notify(
      main.getGlobalVue().$i18n.t('message.connectDeviceOk') + ': chip' + chipId + ' ' + mac,
      main.getGlobalVue().$i18n.t('message.alert'),
      libEnum.messageType.SUCCESS
    );
  } else if (data.connectionState === 'disconnected') {
    const index = _.findIndex(cache.connectedList, {mac: mac});
    if (index === -1) return;
    cache.connectedList.splice(index, 1);
    const activeItem = cache.connectedList[index] || cache.connectedList[index - 1];
    const activeItemName = activeItem ? activeItem.mac : 'connectTab0';
    cache.currentConnectedTab = activeItemName;
    connectVuxTableForceResize();
    vueModule.notify(
      main.getGlobalVue().$i18n.t('message.apiDisconnect') + ': ' + mac,
      main.getGlobalVue().$i18n.t('message.alert'),
      libEnum.messageType.WARNING
    );
  }
}

/**
 * MQTT 网关离线处理函数（心跳超时触发）
 */
function handleGatewayOffline() {
  logger.warn('Gateway offline detected via heartbeat timeout');
  const cache = dbModule.getCache();
  
  // 清空连接列表
  if (cache.connectedList.length > 0) {
    logger.info('Clearing connected list due to gateway offline, was:', cache.connectedList.length, 'devices');
    cache.connectedList.length = 0;
    cache.currentConnectedTab = 'connectTab0';
    connectVuxTableForceResize();
    
    // 通知用户
    vueModule.notify(
      main.getGlobalVue().$i18n.t('message.mqttGatewayOffline'),
      main.getGlobalVue().$i18n.t('message.alert'),
      libEnum.messageType.WARNING
    );
  }
}

/**
 * MQTT 模式：开始接收连接状态事件
 */
function startReceivingMqttConnectionState() {
  mqttModule.onConnectionState(mqttConnectionStateHandler);
  mqttModule.onGatewayOffline(handleGatewayOffline);
  logger.info('Started receiving MQTT connection state events');
}

/**
 * MQTT 模式：停止接收连接状态事件
 */
function stopReceivingMqttConnectionState() {
  mqttModule.offConnectionState(mqttConnectionStateHandler);
  mqttModule.offGatewayOffline(handleGatewayOffline);
  logger.info('Stopped receiving MQTT connection state events');
}

/**
 * 检查错误是否表示设备未找到（已断开）
 * @param {*} ex - 错误对象
 * @returns {boolean}
 */
function isDeviceNotFoundError(ex) {
  if (!ex) return false;
  try {
    // 检查错误消息
    // MQTT 模式: { code: 500, message: "device not found" }
    // HTTP 模式: { error: "device not found" } 或字符串
    let errorMsg = ex.message || ex.error || ex.result;
    if (!errorMsg) {
      errorMsg = typeof ex === 'string' ? ex : JSON.stringify(ex);
    }
    errorMsg = (errorMsg || '').toLowerCase();
    return errorMsg.includes('device not found') || errorMsg.includes('not connected');
  } catch (e) {
    logger.warn('isDeviceNotFoundError parse error:', e);
    return false;
  }
}

/**
 * 当设备操作返回 "device not found" 错误时，从连接列表中移除该设备
 * @param {string} deviceMac - 设备 MAC 地址
 * @param {*} ex - 错误对象
 * @returns {boolean} - 是否移除了设备
 */
function removeDeviceIfNotFound(deviceMac, ex) {
  if (!isDeviceNotFoundError(ex)) return false;
  
  const cache = dbModule.getCache();
  const index = _.findIndex(cache.connectedList, { mac: deviceMac });
  if (index === -1) return false;
  
  cache.connectedList.splice(index, 1);
  const activeItem = cache.connectedList[index] || cache.connectedList[index - 1];
  const activeItemName = activeItem ? activeItem.mac : 'connectTab0';
  cache.currentConnectedTab = activeItemName;
  connectVuxTableForceResize();
  
  logger.info('Removed device from connected list due to "device not found" error:', deviceMac);
  return true;
}

export default {
  loadConnectedList,
  openConnectStatusSse,
  closeConnectStatusSse,
  reopenConnectStatusSse,
  isMqttMode,
  startReceivingMqttConnectionState,
  stopReceivingMqttConnectionState,
  removeDeviceIfNotFound
}