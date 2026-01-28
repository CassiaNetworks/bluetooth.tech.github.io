/**
 * MQTT 客户端模块
 * 实现 MQTT WebSocket 连接、消息收发、心跳响应等功能
 * 
 * 运行环境: Browser (通过 MQTT.js WebSocket)
 * 依赖版本: mqtt@4.3.8
 */

const _ = require('lodash');
import mqtt from 'mqtt';
import libLogger from '../lib/logger.js';
import libEnum from '../lib/enum.js';
import dbModule from './db.js';
import main from '../main.js';

const logger = libLogger.genModuleLogger('mqtt');

// MQTT 客户端实例
let client = null;

// 请求超时时间 (毫秒) - 需要覆盖最大BLE连接超时(20s) + 缓冲时间
const REQUEST_TIMEOUT = 30000;

// 心跳超时检测间隔 (毫秒)
const HEARTBEAT_CHECK_INTERVAL = 30000;

// 心跳超时阈值 (毫秒) - 2分钟无心跳视为警告
const HEARTBEAT_TIMEOUT = 2 * 60 * 1000;

// 待处理请求映射表
const pendingRequests = new Map(); // id -> { resolve, reject, timeout }

// 回调函数列表
const scanDataCallbacks = [];
const notificationCallbacks = [];
const connectionStateCallbacks = [];
const gatewayStatusCallbacks = [];
const gatewayOfflineCallbacks = [];

// 心跳检测定时器
let heartbeatCheckTimer = null;

// 是否已触发过离线回调（避免重复触发）
let gatewayOfflineTriggered = false;

/**
 * 生成唯一请求ID
 */
function generateUniqueId() {
  return Math.random().toString(16).substring(2, 10);
}

/**
 * 获取MQTT运行时缓存
 */
function getMqttCache() {
  return dbModule.getCache().mqtt;
}

/**
 * 更新MQTT状态
 */
function updateMqttStatus(status) {
  const cache = getMqttCache();
  if (cache) {
    cache.status = status;
  }
}

/**
 * 更新最后心跳时间
 */
function updateLastHeartbeat() {
  const cache = getMqttCache();
  if (cache) {
    cache.lastHeartbeat = Date.now();
  }
  // 收到心跳后重置离线触发标记，允许下次超时时再次触发
  gatewayOfflineTriggered = false;
}

/**
 * 更新网关信息
 */
function updateGatewayInfo(info) {
  const cache = getMqttCache();
  if (cache) {
    cache.gatewayInfo = {
      model: info.model || '',
      version: info.version || '',
      uptime: info.uptime || 0,
      uplink: info.uplink || '',
      private_ip: info.private_ip || ''
    };
  }
}

/**
 * 更新最后错误信息
 */
function updateLastError(error) {
  const cache = getMqttCache();
  if (cache) {
    cache.lastError = error;
  }
}

/**
 * 格式化心跳时间显示
 */
function formatLastHeartbeat() {
  const cache = getMqttCache();
  if (!cache || !cache.lastHeartbeat) {
    return main.getGlobalVue().$i18n.t('message.mqttNoHeartbeat');
  }
  
  const seconds = Math.floor((Date.now() - cache.lastHeartbeat) / 1000);
  if (seconds < 60) {
    return seconds + main.getGlobalVue().$i18n.t('message.mqttSecondsAgo');
  }
  if (seconds < 3600) {
    return Math.floor(seconds / 60) + main.getGlobalVue().$i18n.t('message.mqttMinutesAgo');
  }
  return Math.floor(seconds / 3600) + main.getGlobalVue().$i18n.t('message.mqttHoursAgo');
}

/**
 * 处理心跳请求 - 网关发送，我们响应
 */
function handleHeartbeat(message) {
  logger.info('Received heartbeat:', message);
  
  // 记录上行消息日志
  const topic = 'up/' + message.gateway + '/heartbeat';
  addMqttUpstreamLog('Heartbeat', message, topic);
  
  // 更新最后心跳时间
  updateLastHeartbeat();
  
  // 发送心跳响应
  const reply = {
    id: message.id,
    action: 'heartbeat_reply',
    timestamp: Date.now(),
    gateway: message.gateway,
    data: {}
  };
  
  if (client && client.connected) {
    const replyTopic = 'down/' + message.gateway + '/heartbeat_reply';
    client.publish(replyTopic, JSON.stringify(reply), { qos: 0 });
    logger.info('Sent heartbeat reply to:', replyTopic);
  }
}

/**
 * 处理网关状态上报
 */
function handleGatewayStatus(message) {
  logger.info('Received gateway status:', message);
  
  // 记录上行消息日志
  const topic = 'up/' + message.gateway + '/gateway_status';
  addMqttUpstreamLog('Gateway Status', message, topic);
  
  // 更新网关信息
  if (message.data) {
    updateGatewayInfo(message.data);
  }
  
  // 同时更新心跳时间
  updateLastHeartbeat();
  
  // 通知回调
  gatewayStatusCallbacks.forEach(function(callback) {
    try {
      callback(message.data);
    } catch (e) {
      logger.error('Gateway status callback error:', e);
    }
  });
}

/**
 * 处理 API 响应
 */
function handleApiReply(message) {
  logger.info('Received API reply:', message);
  
  // 记录上行消息日志
  const topic = 'up/' + message.gateway + '/api_reply';
  addMqttUpstreamLog('API Reply', message, topic);
  
  const id = message.id;
  const data = message.data;
  const pending = pendingRequests.get(id);
  
  if (!pending) {
    logger.warn('No pending request found for id:', id);
    return;
  }
  
  clearTimeout(pending.timeout);
  pendingRequests.delete(id);
  
  if (data.code === 200) {
    pending.resolve(data.body);
  } else {
    const errorMsg = (data.body && data.body.result) ? data.body.result : 'API request failed';
    pending.reject({ code: data.code, message: errorMsg });
  }
}

/**
 * 处理扫描数据
 */
function handleScanData(message) {
  // message.data 是数组格式
  const scanItems = message.data || [];
  scanItems.forEach(function(item) {
    scanDataCallbacks.forEach(function(callback) {
      try {
        callback(item);
      } catch (e) {
        logger.error('Scan data callback error:', e);
      }
    });
  });
}

/**
 * 处理通知数据
 */
function handleNotification(message) {
  // 记录上行消息日志
  const topic = 'up/' + message.gateway + '/notification';
  addMqttUpstreamLog('Notification', message, topic);
  
  const notifyItems = message.data || [];
  notifyItems.forEach(function(item) {
    notificationCallbacks.forEach(function(callback) {
      try {
        callback(item);
      } catch (e) {
        logger.error('Notification callback error:', e);
      }
    });
  });
}

/**
 * 处理连接状态事件
 */
function handleConnectionState(message) {
  // 记录上行消息日志
  const topic = 'up/' + message.gateway + '/connection_state';
  addMqttUpstreamLog('Connection State', message, topic);
  
  const stateItems = message.data || [];
  stateItems.forEach(function(item) {
    connectionStateCallbacks.forEach(function(callback) {
      try {
        callback(item);
      } catch (e) {
        logger.error('Connection state callback error:', e);
      }
    });
  });
}

/**
 * 消息路由 - 根据 action 分发消息
 */
function routeMessage(topic, message) {
  const action = message.action;
  
  switch (action) {
    case 'heartbeat':
      handleHeartbeat(message);
      break;
    case 'gateway_status':
      handleGatewayStatus(message);
      break;
    case 'api_reply':
      handleApiReply(message);
      break;
    case 'data.scan':
      handleScanData(message);
      break;
    case 'data.notification':
      handleNotification(message);
      break;
    case 'data.connection_state':
      handleConnectionState(message);
      break;
    default:
      logger.warn('Unknown action:', action, 'topic:', topic);
  }
}

/**
 * 开始心跳超时检测
 */
function startHeartbeatCheck() {
  stopHeartbeatCheck();
  
  // 重置离线触发标记
  gatewayOfflineTriggered = false;
  
  heartbeatCheckTimer = setInterval(function() {
    const cache = getMqttCache();
    if (!cache || cache.status !== libEnum.mqttStatus.CONNECTED) {
      return;  // 未连接，不检测
    }
    
    const now = Date.now();
    let isTimeout = false;
    
    if (cache.lastHeartbeat) {
      // 有收到过心跳，检查是否超时
      isTimeout = (now - cache.lastHeartbeat > HEARTBEAT_TIMEOUT);
    } else if (cache.connectedAt) {
      // 从未收到心跳，检查连接时间是否超过阈值
      isTimeout = (now - cache.connectedAt > HEARTBEAT_TIMEOUT);
    }
    
    if (isTimeout) {
      logger.warn('Heartbeat timeout detected - gateway may be offline');
      
      // 只触发一次离线回调，避免重复通知
      if (!gatewayOfflineTriggered) {
        gatewayOfflineTriggered = true;
        
        // 通知所有注册的回调
        gatewayOfflineCallbacks.forEach(function(callback) {
          try {
            callback();
          } catch (e) {
            logger.error('Gateway offline callback error:', e);
          }
        });
      }
    }
  }, HEARTBEAT_CHECK_INTERVAL);
}

/**
 * 停止心跳超时检测
 */
function stopHeartbeatCheck() {
  if (heartbeatCheckTimer) {
    clearInterval(heartbeatCheckTimer);
    heartbeatCheckTimer = null;
  }
}

/**
 * 订阅网关相关的所有 Topic
 */
function subscribeGatewayTopics(gateway) {
  if (!client || !client.connected) {
    logger.error('Cannot subscribe: client not connected');
    return;
  }
  
  // scan 使用 QoS 0（高频数据，丢失可接受）
  // 其他 topic 使用 QoS 1（确保至少送达一次）
  const topicsWithQos = [
    { topic: 'up/' + gateway + '/heartbeat', qos: 1 },
    { topic: 'up/' + gateway + '/gateway_status', qos: 1 },
    { topic: 'up/' + gateway + '/api_reply', qos: 1 },
    { topic: 'up/' + gateway + '/scan', qos: 0 },
    { topic: 'up/' + gateway + '/notification', qos: 1 },
    { topic: 'up/' + gateway + '/connection_state', qos: 1 }
  ];
  
  topicsWithQos.forEach(function(item) {
    client.subscribe(item.topic, { qos: item.qos }, function(err) {
      if (err) {
        logger.error('Subscribe error for topic:', item.topic, err);
      } else {
        logger.info('Subscribed to topic:', item.topic, 'qos:', item.qos);
      }
    });
  });
}

/**
 * 连接到 MQTT Broker
 */
function connect(config) {
  return new Promise(function(resolve, reject) {
    if (client && client.connected) {
      logger.warn('MQTT client already connected');
      resolve();
      return;
    }
    
    updateMqttStatus(libEnum.mqttStatus.CONNECTING);
    
    const options = {
      clientId: config.clientId || ('debugger_' + generateUniqueId()),
      username: config.username || undefined,
      password: config.password || undefined,
      keepalive: config.keepalive || 60,
      clean: config.cleanSession !== false,
      reconnectPeriod: 0,     // 禁用自动重连（调试工具不需要自动重连）
      connectTimeout: 10000   // 10秒连接超时
    };
    
    logger.info('Connecting to MQTT broker:', config.brokerUrl, options);
    
    try {
      // 解析 brokerUrl 并使用对象形式传递参数，避免 URL 解析问题
      const urlMatch = config.brokerUrl.match(/^(wss?):\/\/([^:\/]+):?(\d+)?(\/.*)?$/);
      if (urlMatch) {
        const connectOpts = {
          protocol: urlMatch[1],
          hostname: urlMatch[2],
          port: parseInt(urlMatch[3]) || (urlMatch[1] === 'wss' ? 443 : 80),
          path: urlMatch[4] || '/',
          clientId: options.clientId,
          username: options.username,
          password: options.password,
          keepalive: options.keepalive,
          clean: options.clean,
          reconnectPeriod: options.reconnectPeriod,
          connectTimeout: options.connectTimeout
        };
        logger.info('MQTT connect options:', connectOpts);
        client = mqtt.connect(connectOpts);
      } else {
        logger.info('Using URL string directly:', config.brokerUrl);
        client = mqtt.connect(config.brokerUrl, options);
      }
    } catch (e) {
      logger.error('MQTT connect error:', e);
      updateMqttStatus(libEnum.mqttStatus.ERROR);
      updateLastError(e.message || 'Connection error');
      reject(e);
      return;
    }
    
    let resolved = false;
    
    client.on('connect', function() {
      logger.info('MQTT connected');
      updateMqttStatus(libEnum.mqttStatus.CONNECTED);
      updateLastError('');
      
      // 记录连接成功时间（用于判断从未收到心跳的情况）
      const cache = getMqttCache();
      if (cache) {
        cache.connectedAt = Date.now();
        cache.lastHeartbeat = null;  // 重置心跳时间
      }
      
      // 订阅网关 Topics
      if (config.gateway) {
        subscribeGatewayTopics(config.gateway);
      }
      
      // 开始心跳检测
      startHeartbeatCheck();
      
      if (!resolved) {
        resolved = true;
        resolve();
      }
    });
    
    client.on('reconnect', function() {
      logger.info('MQTT reconnecting');
      updateMqttStatus(libEnum.mqttStatus.RECONNECTING);
    });
    
    client.on('close', function() {
      logger.info('MQTT connection closed');
      updateMqttStatus(libEnum.mqttStatus.DISCONNECTED);
      
      // 如果还没有 resolve，说明是连接失败（WebSocket 连接失败时可能只触发 close 事件）
      if (!resolved) {
        resolved = true;
        const mqttCache = getMqttCache();
        const lastErr = (mqttCache && mqttCache.lastError) || 'Connection closed';
        reject(new Error(lastErr));
      }
    });
    
    client.on('error', function(error) {
      logger.error('MQTT error:', error);
      updateMqttStatus(libEnum.mqttStatus.ERROR);
      updateLastError(error.message || 'Connection error');
      
      if (!resolved) {
        resolved = true;
        reject(error);
      }
    });
    
    client.on('offline', function() {
      logger.info('MQTT offline');
      updateMqttStatus(libEnum.mqttStatus.DISCONNECTED);
      
      // 如果还没有 resolve，说明是连接失败
      if (!resolved) {
        resolved = true;
        reject(new Error('Connection went offline'));
      }
    });
    
    // 调试：监听底层流事件
    client.on('packetsend', function(packet) {
      logger.info('MQTT packet sent:', packet.cmd);
    });
    
    client.on('packetreceive', function(packet) {
      logger.info('MQTT packet received:', packet.cmd);
    });
    
    client.on('message', function(topic, payload) {
      try {
        const message = JSON.parse(payload.toString());
        routeMessage(topic, message);
      } catch (e) {
        logger.error('Failed to parse MQTT message:', e, 'payload:', payload.toString());
      }
    });
  });
}

/**
 * 断开 MQTT 连接
 */
function disconnect() {
  return new Promise(function(resolve) {
    stopHeartbeatCheck();
    
    // 清理所有待处理请求
    pendingRequests.forEach(function(pending, id) {
      clearTimeout(pending.timeout);
      pending.reject(new Error('MQTT disconnected'));
    });
    pendingRequests.clear();
    
    if (client) {
      client.end(true, {}, function() {
        logger.info('MQTT disconnected');
        updateMqttStatus(libEnum.mqttStatus.DISCONNECTED);
        client = null;
        resolve();
      });
    } else {
      updateMqttStatus(libEnum.mqttStatus.DISCONNECTED);
      resolve();
    }
  });
}

/**
 * 发送 API 请求并等待响应
 */
/**
 * 添加 MQTT API 日志（下行请求，支持 replay）
 */
function addMqttApiLog(apiName, message, topic) {
  const now = Date.now();
  const gateway = message.gateway;
  const url = message.data.url;
  const method = message.data.method;
  const body = message.data.body;
  const mqttUrl = 'mqtt://' + gateway + url;
  
  const apiContent = {
    url: mqttUrl,
    method: 'MQTT/' + method,
    transportType: 'mqtt',  // 用于回放时区分类型
    data: {
      gateway: gateway,
      body: body
    }
  };
  
  // apiContentJson 显示完整的MQTT消息payload
  const apiContentJson = JSON.stringify(message, null, 2);
  
  dbModule.getCache().apiLogResultList.push({
    timestamp: now,
    timeStr: new Date(now).toISOString(),
    apiName: apiName,
    topic: topic,  // MQTT topic
    apiContent: apiContent,
    apiContentJson: apiContentJson,
    replayable: true  // 下行请求支持 replay
  });
}

/**
 * 添加 MQTT 上行消息日志（不支持 replay）
 */
function addMqttUpstreamLog(apiName, message, topic) {
  const now = Date.now();
  
  // apiContentJson 显示完整的MQTT消息payload
  const apiContentJson = JSON.stringify(message, null, 2);
  
  dbModule.getCache().apiLogResultList.push({
    timestamp: now,
    timeStr: new Date(now).toISOString(),
    apiName: apiName,
    topic: topic,  // MQTT topic
    apiContent: {
      transportType: 'mqtt',
      upstream: true  // 标记为上行消息
    },
    apiContentJson: apiContentJson,
    replayable: false  // 上行消息不支持 replay
  });
}

/**
 * 根据 URL 获取 API 名称
 */
function getApiNameFromUrl(url, method) {
  if (url.includes('/gap/nodes') && url.includes('/connection') && method === 'POST') {
    return 'Connect';
  }
  if (url.includes('/gap/nodes') && url.includes('/connection') && method === 'DELETE') {
    return 'Disconnect';
  }
  if (url.includes('/gap/nodes') && url.includes('connection_state=connected')) {
    return 'Connections';
  }
  if (url.includes('/gatt/nodes') && url.includes('/handle') && url.includes('/value') && method === 'GET') {
    if (url.includes('/value/')) {
      return 'Write';
    }
    return 'Read';
  }
  if (url.includes('/gatt/nodes') && url.includes('/services')) {
    return 'Services';
  }
  if (url.includes('/gap/nodes') && url.includes('/phy') && method === 'GET') {
    return 'Read PHY';
  }
  if (url.includes('/gap/nodes') && url.includes('/phy') && method === 'POST') {
    return 'Update PHY';
  }
  if (url.includes('/management/nodes') && url.includes('/pair') && method === 'POST') {
    return 'Pair';
  }
  if (url.includes('/management/nodes') && url.includes('/bond') && method === 'DELETE') {
    return 'Unpair';
  }
  if (url.includes('/cassia/reboot')) {
    return 'Reboot';
  }
  if (url.includes('/cassia/info')) {
    return 'Info';
  }
  return 'API';
}

function sendApiRequest(gateway, url, method, body) {
  body = body || {};
  
  return new Promise(function(resolve, reject) {
    if (!client || !client.connected) {
      reject(new Error('MQTT not connected'));
      return;
    }
    
    const id = generateUniqueId();
    const message = {
      id: id,
      action: 'api',
      timestamp: Date.now(),
      gateway: gateway,
      data: {
        url: url,
        method: method,
        body: body
      }
    };
    
    // 记录 API 日志
    const apiName = getApiNameFromUrl(url, method);
    const topic = 'down/' + gateway + '/api';
    addMqttApiLog(apiName, message, topic);
    
    // 设置超时定时器
    const timeout = setTimeout(function() {
      pendingRequests.delete(id);
      reject(new Error(main.getGlobalVue().$i18n.t('message.mqttRequestTimeout')));
    }, REQUEST_TIMEOUT);
    
    // 存储待处理请求
    pendingRequests.set(id, { resolve: resolve, reject: reject, timeout: timeout });
    
    // 发布到下行 Topic
    client.publish(topic, JSON.stringify(message), { qos: 1 }, function(err) {
      if (err) {
        pendingRequests.delete(id);
        clearTimeout(timeout);
        reject(err);
      } else {
        logger.info('API request sent:', method, url, 'id:', id, 'message:', JSON.stringify(message));
      }
    });
  });
}

/**
 * 检查是否已连接
 */
function isConnected() {
  return client && client.connected;
}

/**
 * 获取当前连接状态
 */
function getStatus() {
  const cache = getMqttCache();
  return cache ? cache.status : libEnum.mqttStatus.DISCONNECTED;
}

/**
 * 注册扫描数据回调
 */
function onScanData(callback) {
  if (callback && !scanDataCallbacks.includes(callback)) {
    scanDataCallbacks.push(callback);
  }
}

/**
 * 取消扫描数据回调
 */
function offScanData(callback) {
  const index = scanDataCallbacks.indexOf(callback);
  if (index > -1) {
    scanDataCallbacks.splice(index, 1);
  }
}

/**
 * 注册通知数据回调
 */
function onNotification(callback) {
  if (callback && !notificationCallbacks.includes(callback)) {
    notificationCallbacks.push(callback);
  }
}

/**
 * 取消通知数据回调
 */
function offNotification(callback) {
  const index = notificationCallbacks.indexOf(callback);
  if (index > -1) {
    notificationCallbacks.splice(index, 1);
  }
}

/**
 * 注册连接状态回调
 */
function onConnectionState(callback) {
  if (callback && !connectionStateCallbacks.includes(callback)) {
    connectionStateCallbacks.push(callback);
  }
}

/**
 * 取消连接状态回调
 */
function offConnectionState(callback) {
  const index = connectionStateCallbacks.indexOf(callback);
  if (index > -1) {
    connectionStateCallbacks.splice(index, 1);
  }
}

/**
 * 注册网关状态回调
 */
function onGatewayStatus(callback) {
  if (callback && !gatewayStatusCallbacks.includes(callback)) {
    gatewayStatusCallbacks.push(callback);
  }
}

/**
 * 取消网关状态回调
 */
function offGatewayStatus(callback) {
  const index = gatewayStatusCallbacks.indexOf(callback);
  if (index > -1) {
    gatewayStatusCallbacks.splice(index, 1);
  }
}

/**
 * 注册网关离线回调（心跳超时时触发）
 */
function onGatewayOffline(callback) {
  if (callback && !gatewayOfflineCallbacks.includes(callback)) {
    gatewayOfflineCallbacks.push(callback);
  }
}

/**
 * 取消网关离线回调
 */
function offGatewayOffline(callback) {
  const index = gatewayOfflineCallbacks.indexOf(callback);
  if (index > -1) {
    gatewayOfflineCallbacks.splice(index, 1);
  }
}

/**
 * 清空所有回调
 */
function clearAllCallbacks() {
  scanDataCallbacks.length = 0;
  notificationCallbacks.length = 0;
  connectionStateCallbacks.length = 0;
  gatewayStatusCallbacks.length = 0;
  gatewayOfflineCallbacks.length = 0;
}

/**
 * 回放 MQTT API 请求
 */
function replayMqttApi(apiContent) {
  // 从 method 中提取实际的 HTTP 方法 (MQTT/POST -> POST)
  const method = apiContent.method.replace('MQTT/', '');
  const gateway = apiContent.data.gateway;
  const body = apiContent.data.body || {};
  
  // 从 mqtt://gateway/path 中提取 path
  const url = apiContent.url.replace('mqtt://' + gateway, '');
  
  return sendApiRequest(gateway, url, method, body);
}

export default {
  connect: connect,
  disconnect: disconnect,
  sendApiRequest: sendApiRequest,
  replayMqttApi: replayMqttApi,
  isConnected: isConnected,
  getStatus: getStatus,
  formatLastHeartbeat: formatLastHeartbeat,
  onScanData: onScanData,
  offScanData: offScanData,
  onNotification: onNotification,
  offNotification: offNotification,
  onConnectionState: onConnectionState,
  offConnectionState: offConnectionState,
  onGatewayStatus: onGatewayStatus,
  offGatewayStatus: offGatewayStatus,
  onGatewayOffline: onGatewayOffline,
  offGatewayOffline: offGatewayOffline,
  clearAllCallbacks: clearAllCallbacks
}
