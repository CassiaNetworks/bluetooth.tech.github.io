import libEnum from '../lib/enum.js';
import libLogger from '../lib/logger.js';
import api from './api.js';
import dbModule from './db.js';
import vueModule from './vue.js';

const logger = libLogger.genModuleLogger('notify');

let sse = null;

// 更新notify结果
function notifySseMessageHandler(message) {
  const data = JSON.parse(message.data);
  logger.info('notify sse message:', message);
  const cache = dbModule.getCache();
  cache.notifyResultList.push({time: data.timestamp || Date.now(), mac: data.id, handle: data.handle, value: data.value});
}

function notifySseErrorHandler(error) {
  logger.error('notify sse error:', error);
  vueModule.notify(`关闭设备通知SSE，SSE异常: ${error.message || JSON.stringify(error)}`, '服务异常', libEnum.messageType.ERROR);
  sse.close();
  sse = null;
}

// 保存配置 -> 启动扫描
function openNotifySse(timestamp='') {
  if (sse) return sse;
  const devConf = _.cloneDeep(dbModule.getDevConf());
  devConf.timestamp = timestamp;
  sse = api.startNotifyByDevConf(devConf, notifySseMessageHandler, notifySseErrorHandler);
}

function closeNotifySse() {
  if (sse) {
    sse.close();
    sse = null;
  }
}

function reopenNotifySse() {
  closeNotifySse();
  openNotifySse();
}

export default {
  openNotifySse,
  closeNotifySse,
  reopenNotifySse
}