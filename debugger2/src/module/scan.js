const _ = require('lodash');
import libEnum from '../lib/enum.js';
import libLogger from '../lib/logger.js';
import api from './api.js';
import dbModule from './db.js';
import vueModule from './vue.js';
import main from '../main.js'

const logger = libLogger.genModuleLogger('scan');

let sse = null;

// 更新扫描结果
function scanSseMessageHandler(message) {
  const cache = dbModule.getCache();
  const store = dbModule.getStorage();
  
  const data = JSON.parse(message.data);
  const deviceAddr = data.bdaddrs[0];
  const deviceMac = deviceAddr.bdaddr;
  const deviceAddrType = deviceAddr.bdaddrType;
  // logger.info('scan sse message:', message);

  // 更新扫描结果
  let result = _.find(cache.scanResultList, {mac: deviceMac});
  if (!result) {
    cache.scanResultList.push({
      mac: deviceMac, 
      name: data.name,
      adData:  data.adData,
      bdaddrType: deviceAddrType,
      rssi: data.rssi,
    });
  } else {
    if (data.name !== '(unknown)') result.name = data.name;
    result.rssi = data.rssi;
  }

  // 记录历史rssi
  if (!store.devConfDisplayVars.rssiChartSwitch) return; // 没有开启rssi图表则不记录数据
  if (cache.scanDevicesRssiHistory[deviceMac]) { // 只记录关注的设备
    cache.scanDevicesRssiHistory[deviceMac].push({time: Date.now(), rssi: data.rssi});
  }
}

function scanSseErrorHandler(error) {
  let devConf = this;
  logger.error('scan sse error:', error);
  // vueModule.notify(`${main.getGlobalVue().$i18n.t('message.closeScanSSE')}: ${error.message || JSON.stringify(error)}`, `${main.getGlobalVue().$i18n.t('message.alert')}`, libEnum.messageType.ERROR);
  sse.close();
  sse = null;

  let i18nKey = (devConf.controlStyle === 'AP' ? 'message.apConfigInfo' : 'message.acConfigInfo');
  let content = main.getGlobalVue().$i18n.t(i18nKey);
  let title = main.getGlobalVue().$i18n.t('message.operationFail');
  let ok = main.getGlobalVue().$i18n.t('message.ok');
  let cancel = main.getGlobalVue().$i18n.t('message.cancel');

  main.getGlobalVue().$confirm(content, title, {
    dangerouslyUseHTMLString: true,
    confirmButtonText: ok,
    cancelButtonText: cancel,
    type: 'warning'
  }).then(() => {
    if (devConf.controlStyle === 'AP') {
      window.open(devConf.baseURI);
    } else {
      // AC跳转到settings页面，非AC版本存在跨域cookie无法携带，需要重新登录
      // http://10.100.144.168:8882/setting?view#develop
      let url = `${devConf.acServerURI}/setting?view#develop`;
      window.open(url);
    }
  }).catch(() => {
    // cancel      
  });
}

// 保存配置 -> 启动扫描
function startScan(devConf) {
  if (sse) return sse;
  sse = api.startScanByDevConf(devConf, scanSseMessageHandler, scanSseErrorHandler.bind(devConf));
  return sse;
}

function stopScan() {
  if (sse) {
    sse.close();
    sse = null;
  }
  vueModule.notify(`${main.getGlobalVue().$i18n.t('message.stopScanOk')}`, `${main.getGlobalVue().$i18n.t('message.operationOk')}`, libEnum.messageType.SUCCESS);
}

export default {
  startScan,
  stopScan,
}