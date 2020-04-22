const _ = require('lodash');
import libEnum from '../lib/enum.js';
import libLogger from '../lib/logger.js';
import apiModule from './api.js';
import dbModule from './db.js';
import vueModule from './vue.js';
import main from '../main.js';

const logger = libLogger.genModuleLogger('connect');

let sse = null;

function loadConnectedList() {
  const devConf = dbModule.getDevConf();
  // const cache = dbModule.getCache();
  // cache.connectedList.splice(0); // 清空连接列表
  apiModule.getConnectedListByDevConf(devConf).then((data) => {
    const cache = dbModule.getCache();
    _.forEach(data.nodes, item => {
      let connectItem = _.find(cache.connectedList, {mac: item.id});
      if (connectItem) { // 已存在则更新连接的chip
        connectItem.chip = item.chipId;
      } else { // 不存在的则追加
        cache.connectedList.push({
          name: item.name || '(unknown)',
          mac: item.id, 
          bdaddrType: item.type, 
          chip: item.chipId
        });
      }
    });
  });
}

function connectVuxTableForceResize() {
  const cache = dbModule.getCache();
  let data = cache.connectedList.pop();
  if (data) cache.connectedList.push(data);
}

// 更新扫描结果
// {handle: "CB:76:B8:B2:65:6E", chipId: 0, connectionState: "connected"}
function connectStatusSseMessageHandler(message) {
  const cache = dbModule.getCache();
  const data = JSON.parse(message.data);
  if (data.connectionState === 'connected') { // 更新连接信息里面的chip
    dbModule.listAddOrUpdate(dbModule.getCache().connectedList, {mac: data.handle}, {
      mac: data.handle,
      chip: data.chipId
    });
    vueModule.notify(`[SSE] ${main.getGlobalVue().$i18n.t('message.connectDeviceOk')}: chip${data.chipId} ${data.handle}`, `${main.getGlobalVue().$i18n.t('message.alert')}`, libEnum.messageType.SUCCESS);
  } else if (data.connectionState === 'disconnected') { 
    let index = _.findIndex(cache.connectedList, {mac: data.handle});
    if (index === -1) return; 
    cache.connectedList.splice(index, 1); // 删除此设备
    let activeItem = cache.connectedList[index] || cache.connectedList[index-1];
    let activeItemName = activeItem ? activeItem.mac : '0';
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
  const devConf = dbModule.getDevConf();
  sse = apiModule.openConnectStatusSseByDevConf(devConf, connectStatusSseMessageHandler, connectStatusSseErrorHandler);
}

function closeConnectStatusSse() {
  if (sse) {
    sse.close();
    sse = null;
  }
}

function reopenConnectStatusSse() {
  closeConnectStatusSse();
  openConnectStatusSse();
}

export default {
  loadConnectedList,
  openConnectStatusSse,
  closeConnectStatusSse,
  reopenConnectStatusSse
}