const _ = require('lodash');
import libEnum from '../lib/enum.js';
import libLogger from '../lib/logger.js';
import api from './api.js';
import dbModule from './db.js';
import vueModule from './vue.js';
import mqttModule from './mqtt.js';
import main from '../main.js';

const logger = libLogger.genModuleLogger('notify');

let sse = null;
let globalSeq = 0;

/**
 * 判断当前是否使用 MQTT 模式
 */
function isMqttMode() {
  var devConf = dbModule.getDevConf();
  return devConf.transportType === libEnum.transportType.MQTT;
}

// 更新notify结果
function notifySseMessageHandler(message) {
  const data = JSON.parse(message.data);
  logger.info('notify sse message:', message);
  const cache = dbModule.getCache();
  cache.notifyResultList.push({seqNum: data.seqNum || ++globalSeq, time: data.timestamp || Date.now(), mac: data.id, handle: data.handle, value: data.value});
}

function notifySseErrorHandler(error) {
  logger.error('notify sse error:', error);
  vueModule.notify(`关闭设备通知SSE，SSE异常: ${error.message || JSON.stringify(error)}`, '服务异常', libEnum.messageType.ERROR);
  sse.close();
  sse = null;
  globalSeq = 0;
}

// 保存配置 -> 启动扫描
function openNotifySse(timestamp='', sequence='') {
  if (sse) return sse;
  const devConf = _.cloneDeep(dbModule.getDevConf());
  devConf.timestamp = timestamp;
  devConf.sequence = sequence;
  sse = api.startNotifyByDevConf(devConf, notifySseMessageHandler, notifySseErrorHandler);
}

function closeNotifySse() {
  if (sse) {
    sse.close();
    sse = null;
  }
  globalSeq = 0;
}

function reopenNotifySse() {
  closeNotifySse();
  openNotifySse();
}

/**
 * MQTT 通知数据处理函数
 */
function mqttNotificationHandler(data) {
  const cache = dbModule.getCache();
  logger.info('MQTT notification data:', data);
  
  cache.notifyResultList.push({
    seqNum: data.seqNum || ++globalSeq,
    time: data.timestamp || Date.now(),
    mac: data.id || data.mac,
    handle: data.handle,
    value: data.value
  });
}

/**
 * MQTT 模式：开始接收通知数据
 */
function startReceivingMqttNotification() {
  mqttModule.onNotification(mqttNotificationHandler);
  logger.info('Started receiving MQTT notifications');
}

/**
 * MQTT 模式：停止接收通知数据
 */
function stopReceivingMqttNotification() {
  mqttModule.offNotification(mqttNotificationHandler);
  globalSeq = 0;
  logger.info('Stopped receiving MQTT notifications');
}

export default {
  openNotifySse,
  closeNotifySse,
  reopenNotifySse,
  isMqttMode,
  startReceivingMqttNotification,
  stopReceivingMqttNotification
}