const _ = require('lodash');
import apiModule from './api.js';
import scanModule from './scan.js';
import serviceModule from './service.js';
import operationModule from './operation.js';
import dbModule from './db.js';
import codeModule from './code.js';
import libLogger from '../lib/logger.js';
import libEnum from '../lib/enum.js';
import notifyModule from './notify.js';
import connectModule from './connect.js';
import mqttModule from './mqtt.js';
import transportModule from './transport.js';
import main from '../main.js';

const logger = libLogger.genModuleLogger('vue');

function createVueData(vue) {
  return function () {
    return {
      chartOptions: createRssiChart(),
      store: dbModule.getStorage(),
      cache: dbModule.getCache(),
    }
  };
}

function initHighlightingRefresh() {
  document.querySelectorAll('pre code').forEach((block) => {
    hljs.highlightBlock(block);
  });
}

function message(message, type = libEnum.messageType.INFO) {
  main.getGlobalVue().$message({ message, type, showClose: true });
}

function notify(message, title = '', type = libEnum.messageType.INFO, autoclose = true) {
  const data = { title, message, type };
  if (!autoclose) data.duration = 0;
  main.getGlobalVue().$notify(data);
}

/**
 * 从错误对象中提取错误消息
 * 支持: Error对象、MQTT返回的{code, message}对象、HTTP返回的{error: "..."}对象、字符串、其他对象
 */
function getErrorMessage(ex) {
  if (!ex) return 'Unknown error';
  if (typeof ex === 'string') return ex;
  if (ex.message) return ex.message;  // Error对象、MQTT {code, message}、axios错误
  if (ex.error) return ex.error;      // HTTP {error: "..."} 格式
  if (typeof ex === 'object') return JSON.stringify(ex);
  return String(ex);
}

/**
 * 生成唯一请求 ID（8位十六进制字符串）
 */
function generateMqttId() {
  return Math.random().toString(16).substring(2, 10);
}

// 当前调试请求的 ID，用于关联请求和响应日志
let currentDebugRequestId = null;

/**
 * 构建 MQTT 模式下的请求日志
 * @param {string} gateway - 网关 MAC
 * @param {string} url - API URL
 * @param {string} method - HTTP 方法
 * @param {object} body - 请求体
 * @returns {string} 格式化的日志字符串
 */
function buildMqttRequestLog(gateway, url, method, body) {
  // 生成新的请求 ID 并保存，用于后续响应日志
  currentDebugRequestId = generateMqttId();
  const topic = 'down/' + gateway + '/api';
  const message = {
    id: currentDebugRequestId,
    action: 'api',
    timestamp: Date.now(),
    gateway: gateway,
    data: {
      url: url,
      method: method,
      body: body || {}
    }
  };
  return `${topic} ${JSON.stringify(message, null, 2)}`;
}

/**
 * 构建 MQTT 模式下的响应日志（收到对端响应）
 * @param {string} gateway - 网关 MAC
 * @param {object} data - 响应数据
 * @returns {string} 格式化的日志字符串
 */
function buildMqttResponseLog(gateway, data) {
  const topic = 'up/' + gateway + '/api_reply';
  const message = {
    id: currentDebugRequestId || generateMqttId(),
    action: 'api_reply',
    timestamp: Date.now(),
    gateway: gateway,
    data: data
  };
  return `${topic} ${JSON.stringify(message, null, 2)}`;
}

/**
 * 构建 MQTT 模式下的本地错误日志（本地超时/连接错误等，非对端响应）
 * @param {string} errorMessage - 错误消息
 * @returns {string} 格式化的日志字符串
 */
function buildMqttLocalErrorLog(errorMessage) {
  return `[Local Error] ${errorMessage}`;
}

function rssiChartXaxisData() {
  let data = [];
  const devConfDisplayVars = dbModule.getDevConfDisplayVars();
  devConfDisplayVars.rssiChartDataCount = devConfDisplayVars.rssiChartPeriod * 1000 / devConfDisplayVars.rssiChartDataSpan;
  for (let index = 0; index < devConfDisplayVars.rssiChartDataCount; index++) {
    data.push((index * devConfDisplayVars.rssiChartDataSpan).toString());
  }
  return data;
}

function createRssiChart() {
  let xAxisData = rssiChartXaxisData();
  return {
    title: {
      show: false
    },
    autoresize: true,
    grid: {
      // right: '20%' 
    },
    legend: {
      type: 'scroll',
      // orient: 'vertical',
      // x: 'right',
      // y: 'center',
    },
    // tooltip: {
    //   trigger: 'axis',
    //   axisPointer: {
    //       animation: true
    //   }
    // },
    xAxis: {
      type: 'category',
      name: 'Time Span',
      nameLocation: 'middle',
      data: xAxisData,
      // showSymbol: true,
      // axisPointer: {
      //   show: true,
      //   snap: true,
      // },
      axisLabel: {
        show: true,
        rotate: 45,
        interval: 0,//使x轴横坐标全部显示
        formatter: function (value, index) {
          return '';
        },
        // interval: xAxisData.length > 20 ? 9 : xAxisData.length
      }
    },
    yAxis: {
      type: 'value',
      name: 'RSSI',
      nameLocation: 'start',
      min: -100,
      max: -10,
      splitNumber: 10, // 每10dbm1个间隔
      inverse: true
    },
    series: []
  };
}

function createVueMethods(vue) {
  return {
    autoSelectionRouterChanged() { // 优选使用的网关列表变化
      if (this.store.devConf.aps.includes('*')) { // 当包含*号时，移除其他选择的网关
        this.store.devConf.aps.splice(0, this.store.devConf.aps.length);
        this.store.devConf.aps.push('*');
      } else if (this.store.devConf.aps.length === 0) { // 当无网关时，默认为扫描使用的网关
        this.store.devConf.aps.push(this.store.devConf.mac);
      }
    },
    getAcRouterListWillAll(keyword) {
      // MQTT 模式下不需要获取 AC 路由列表
      if (this.store.devConf.transportType === libEnum.transportType.MQTT) {
        return;
      }
      this.cache.isGettingAcRouterList = true;
      this.cache.acRouterList = [];
      apiModule.getAccessToken(this.store.devConf.acServerURI + '/api', this.store.devConf.acDevKey, this.store.devConf.acDevSecret)
        .then(data => {
          return apiModule.getAcRouterList(data.access_token);
        }).then(data => {
          if (_.isEmpty(keyword) || !_.isString(keyword)) this.cache.acRouterList = data;
          else {
            keyword = keyword.toLowerCase();
            this.cache.acRouterList = _.filter(data, item => {
              return item.name.toLowerCase().includes(keyword) || item.mac.toLowerCase().includes(keyword);
            });
          }
          this.cache.acRouterList.splice(0, 0, { id: '*', mac: '*', name: 'All Gateways' });
        }).catch(ex => {
          notify(`${this.$i18n.t('message.getAcRouterListFail')} ${getErrorMessage(ex)}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
        }).finally(() => {
          this.cache.isGettingAcRouterList = false;
        });
    },
    getAcRouterList(keyword) {
      // MQTT 模式下不需要获取 AC 路由列表
      if (this.store.devConf.transportType === libEnum.transportType.MQTT) {
        return;
      }
      this.cache.isGettingAcRouterList = true;
      this.cache.acRouterList = [];
      apiModule.getAccessToken(this.store.devConf.acServerURI + '/api', this.store.devConf.acDevKey, this.store.devConf.acDevSecret)
        .then(data => {
          return apiModule.getAcRouterList(data.access_token);
        }).then(data => {
          const gatewayList = data || [];
          const gateway = gatewayList.find(x => x.mac === this.store.mac);
          this.cache.model = _.get(gateway, 'model') || '';
          console.log('cache update model by get gateway list:', this.cache.model);
          dbModule.checkAndClearPhyParams(this.cache.model);

          if (_.isEmpty(keyword) || !_.isString(keyword)) this.cache.acRouterList = data;
          else {
            keyword = keyword.toLowerCase();
            this.cache.acRouterList = _.filter(data, item => {
              return item.name.toLowerCase().includes(keyword) || item.mac.toLowerCase().includes(keyword);
            });
          }
        }).catch(ex => {
          notify(`${this.$i18n.t('message.getAcRouterListFail')} ${getErrorMessage(ex)}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
        }).finally(() => {
          this.cache.isGettingAcRouterList = false;
        });
    },
    replayApi(row) {
      const isMqtt = row.apiContent.transportType === 'mqtt' || 
                     (row.apiContent.method && row.apiContent.method.startsWith('MQTT/'));
      
      const replayPromise = isMqtt 
        ? mqttModule.replayMqttApi(row.apiContent)
        : apiModule.replayApi(row.apiContent);
      
      replayPromise.then((data) => {
        notify(`${this.$i18n.t('message.replayApiOk')}: ${JSON.stringify(data)}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
      }).catch(ex => {
        notify(`${this.$i18n.t('message.replayApiFail')} ${getErrorMessage(ex)}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
      });
    },
    autoSelectionChanged(value) {
      if (value === 'on') {
        this.$alert(this.$i18n.t('message.configAutoSelection'), this.$i18n.t('message.alert'), {
          dangerouslyUseHTMLString: true,
          confirmButtonText: this.$i18n.t('message.ok'),
          callback: action => { }
        });
      }
    },
    changeLanguage() {
      this.$i18n.locale = this.store.devConfDisplayVars.language;
      let noramlWidthLns = ['cn'];
      if (noramlWidthLns.includes(this.store.devConfDisplayVars.language)) {
        this.store.devConfDisplayVars.leftConfWidth = '430px';
        this.store.devConfDisplayVars.leftConfLabelWidth = '125px';
      } else {
        this.store.devConfDisplayVars.leftConfWidth = '430px';
        this.store.devConfDisplayVars.leftConfLabelWidth = '125px';
      }
    },
    apInfo() {
      if (this.store.devConf.controlStyle === libEnum.controlStyle.AP) {
        return notify(this.$i18n.t('message.noSupportByAp'), this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
      }
      transportModule.info().then(() => {
        notify(this.$i18n.t('message.getApInfoOk'), this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
      }).catch(ex => {
        notify(`${this.$i18n.t('message.getApInfoFail')} ${getErrorMessage(ex)}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
      });
    },
    reboot() {
      if (this.store.devConf.controlStyle === libEnum.controlStyle.AP) {
        return notify(this.$i18n.t('message.noSupportByAp'), this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
      }
      transportModule.reboot().then(() => {
        notify(this.$i18n.t('message.rebootApOk'), this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
      }).catch(ex => {
        notify(`${this.$i18n.t('message.rebootApFail')} ${getErrorMessage(ex)}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
      });
    },
    unpair(deviceMac) {
      transportModule.unpair(deviceMac).then(() => {
        notify(`${this.$i18n.t('message.unpairOk')} ${deviceMac}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
      }).catch(ex => {
        notify(`${this.$i18n.t('message.unpairFail')} ${deviceMac} ${getErrorMessage(ex)}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
      });
    },
    pairByLegacyOOB() {
      const deviceMac = this.store.devConfDisplayVars.pairByLegacyOOB.deviceMac;
      const tk = this.store.devConfDisplayVars.pairByLegacyOOB.tk;
      transportModule.pairByLegacyOOB(deviceMac, tk).then(() => {
        notify(`${this.$i18n.t('message.pairOk')} ${deviceMac}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
        this.store.devConfDisplayVars.pairByPasskey.visible = false;
      }).catch(ex => {
        notify(`${this.$i18n.t('message.pairFail')} ${deviceMac} ${getErrorMessage(ex)}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
      });
    },
    pairBySecurityOOB() {
      const deviceMac = this.store.devConfDisplayVars.pairBySecurityOOB.deviceMac;
      const rand = this.store.devConfDisplayVars.pairBySecurityOOB.rand;
      const confirm = this.store.devConfDisplayVars.pairBySecurityOOB.confirm;
      transportModule.pairBySecurityOOB(deviceMac, rand, confirm).then(() => {
        notify(`${this.$i18n.t('message.pairOk')} ${deviceMac}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
        this.store.devConfDisplayVars.pairByPasskey.visible = false;
      }).catch(ex => {
        notify(`${this.$i18n.t('message.pairFail')} ${deviceMac} ${getErrorMessage(ex)}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
      });
    },
    pairByPasskey() {
      const deviceMac = this.store.devConfDisplayVars.pairByPasskey.deviceMac;
      const passkey = this.store.devConfDisplayVars.pairByPasskey.passkey;
      transportModule.pairByPasskey(deviceMac, passkey).then(() => {
        notify(`${this.$i18n.t('message.pairOk')} ${deviceMac}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
        this.store.devConfDisplayVars.pairByPasskey.visible = false;
      }).catch(ex => {
        notify(`${this.$i18n.t('message.pairFail')} ${deviceMac} ${getErrorMessage(ex)}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
      });
    },
    showPairDialog(deviceMac) {
      this.store.devConfDisplayVars.pair.deviceMac = deviceMac;
      this.store.devConfDisplayVars.pair.visible = true;
    },
    showUpdateDevicePhyDialog(deviceMac) {
      this.store.devConfDisplayVars.updatePhy.deviceMac = deviceMac;
      this.store.devConfDisplayVars.updatePhy.visible = true;
    },
    scanDataPushToQueue(msg) {
      const MAX_TOTAL = 2000; // 内存中最大保留条数

      this.cache.deviceScanDetail.updateQueue.push(msg);

      if (!this.cache.deviceScanDetail.updateTimer) {
        this.cache.deviceScanDetail.updateTimer = setInterval(() => {
          if (this.cache.deviceScanDetail.data.length >= MAX_TOTAL) {
            this.cache.deviceScanDetail.data.splice(0, Math.floor(MAX_TOTAL * 0.1));
          }
          const source = this.cache.deviceScanDetail.updateQueue;
          for (let i = 0; i < source.length; i++) {
            this.cache.deviceScanDetail.data.push(source[i]);
          }
          this.cache.deviceScanDetail.updateQueue = [];
        }, 10);
      }
    },
    showDeviceScanDataRealTimeNewTab() {
      let url = apiModule.getScanUrlByUserParams(this.store.devConf, this.store.devConf.chip, '', this.store.devConf.phy, '', '');
      const newWindow = window.open(url, '_blank');

      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        window.location.href = url;
      }
    },
    showDeviceNotificationDataRealTimeNewTab() {
      let url = apiModule.getNotificationUrlByUserParams(this.store.devConf, this.cache.notifyDisplayTimestamp, this.cache.notifyDisplaySequence);
      const newWindow = window.open(url, '_blank');

      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        window.location.href = url;
      }
    },
    openDeviceScanData() {
      this.closeDeviceScanDetail();
      this.store.devConfDisplayVars.deviceScanDataSwitch = true;
      this.cache.deviceScanDetail.data = [];

      // 开启此设备的扫描
      const scanParamsQs = `filter_duplicates=${this.store.devConfDisplayVars.deviceScanDataFilterDuplicate}&timestamp=${this.store.devConfDisplayVars.deviceScanDataTimestamp}`;
      this.cache.deviceScanDetail.sse = apiModule.startScanByUserParams(this.store.devConf, this.store.devConf.chip, this.store.devConf.filter_mac, this.store.devConf.phy, this.store.devConf.filter_name, this.store.devConf.filter_rssi, scanParamsQs, (msg) => {
        // notify(`${this.$i18n.t('message.testScanOk')}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
        let jsonMsg = msg.data;
        this.scanDataPushToQueue(jsonMsg);
      }, (error) => {
        notify(`${this.$i18n.t('message.testScanFail')}: ${error}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
      });
    },
    closeDeviceScanDetail() {
      this.store.devConfDisplayVars.deviceScanDataSwitch = false;
      if (this.cache.deviceScanDetail.sse) {
        this.cache.deviceScanDetail.sse.close();
        this.cache.deviceScanDetail.sse = null;
      }
      if (this.cache.deviceScanDetail.updateTimer) {
        clearInterval(this.cache.deviceScanDetail.updateTimer);
        this.cache.deviceScanDetail.updateTimer = null;
      }

      this.cache.deviceScanDetail.updateQueue = [];
    },
    updatePhy() {
      let deviceMac = this.store.devConfDisplayVars.updatePhy.deviceMac;
      let bodyParam = {
        tx: this.store.devConfDisplayVars.updatePhy.tx.join(','),
        rx: this.store.devConfDisplayVars.updatePhy.rx.join(','),
      };

      if (bodyParam.tx.includes('CODED')) {
        bodyParam.coded_option = this.store.devConfDisplayVars.updatePhy.codedOption;
      }

      transportModule.updatePhy(deviceMac, bodyParam).then((rawBody) => {
        notify(rawBody, `${this.$i18n.t('message.updatePhyOK')}`, libEnum.messageType.SUCCESS);
      }).catch((ex) => {
        notify(`${this.$i18n.t('message.updatePhyFail')}: ${deviceMac}, ${getErrorMessage(ex)}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
        connectModule.removeDeviceIfNotFound(deviceMac, ex);
      }).finally(() => {
        this.store.devConfDisplayVars.updatePhy.visible = false;
      });
    },
    pair() {
      let deviceMac = this.store.devConfDisplayVars.pair.deviceMac;
      let bodyParam = {
        type: null, // 自动从历史中获取
        iocapability: this.store.devConfDisplayVars.pair.iocapability || 'KeyboardDisplay',
        timeout: +(this.store.devConfDisplayVars.pair.timeout || 5) * 1000,
        bond: +(this.store.devConfDisplayVars.pair.bond || 1)
      };
      transportModule.pair(deviceMac, bodyParam).then((x) => {
        if (x.pairingStatusCode === libEnum.pairingStatusCode.SUCCESS) {
          return notify(`${this.$i18n.t('message.pairOk')} ${deviceMac}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
        }
        if (x.pairingStatusCode === libEnum.pairingStatusCode.FAILED) {
          return notify(`${this.$i18n.t('message.pairFail')} ${deviceMac}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
        }
        if (x.pairingStatusCode === libEnum.pairingStatusCode.ABORTED) {
          return notify(`${this.$i18n.t('message.pairAbort')} ${deviceMac}`, this.$i18n.t('message.operationFail'), libEnum.messageType.WARNING);
        }
        if (x.pairingStatusCode === libEnum.pairingStatusCode.LE_LEGACY_OOB_EXPECTED) {
          this.store.devConfDisplayVars.pairByLegacyOOB.deviceMac = deviceMac;
          this.store.devConfDisplayVars.pairByLegacyOOB.visible = true;
          return;
        }
        if (x.pairingStatusCode === libEnum.pairingStatusCode.LE_SECURE_OOB_EXPECTED) {
          this.store.devConfDisplayVars.pairBySecurityOOB.deviceMac = deviceMac;
          this.store.devConfDisplayVars.pairBySecurityOOB.visible = true;
          return;
        }
        if (x.pairingStatusCode === libEnum.pairingStatusCode.PASSKEY_INPUT_EXPECTED) {
          this.store.devConfDisplayVars.pairByPasskey.deviceMac = deviceMac;
          this.store.devConfDisplayVars.pairByPasskey.visible = true;
          return;
        }
        if (x.pairingStatusCode === libEnum.pairingStatusCode.NUM_CMP_EXPECTED) {
          transportModule.pairByNumericComparison(deviceMac, x.display).then(() => {
            notify(`${this.$i18n.t('message.pairOk')} ${deviceMac}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
          }).catch(ex => {
            notify(`${this.$i18n.t('message.pairFail')} ${deviceMac} ${getErrorMessage(ex)}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
          });
        }
      }).finally(() => {
        this.store.devConfDisplayVars.pair.visible = false;
      });
    },
    disconnectAll() { // 断连所有
      const self = this;
      const all = _.map(this.cache.connectedList, function(item) {
        // 使用 transport 适配器
        return transportModule.disconnect(item.mac).catch(function(ex) {
          notify(self.$i18n.t('message.disconnectFail') + ' ' + item.mac + ' ' + ex, self.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
        });
      });
      Promise.all(all).catch(function(ex) {
        logger.warn('disconnect all error:', ex);
      });
    },
    apiDemoScanChanged(apiContentJson) {
      const apiContent = JSON.parse(apiContentJson);
      const apiDemoScan = this.store.devConfDisplayVars.apiDemoParams.scanConnectWriteNotify.scan;
      apiDemoScan.chip = apiContent.data.query.chip;
      if (apiContent.data.query.filter_name) apiDemoScan.filter_name = apiContent.data.query.filter_name;
      if (apiContent.data.query.filter_mac) apiDemoScan.filter_mac = apiContent.data.query.filter_mac;
      if (apiContent.data.query.phy) apiDemoScan.phy = apiContent.data.query.phy;
      apiDemoScan.filter_rssi = apiContent.data.query.filter_rssi;
    },
    apiDemoScanTest() {
      const self = this;
      const devConf = this.store.devConf;
      const scanParams = this.store.devConfDisplayVars.apiDemoParams.scanConnectWriteNotify.scan;
      
      // MQTT 模式下使用 mqtt 模块
      if (devConf.transportType === libEnum.transportType.MQTT) {
        // MQTT 模式：临时订阅扫描数据，收到一条后提示成功
        const scanCallback = function(data) {
          notify(self.$i18n.t('message.testScanOk'), self.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
          mqttModule.offScanData(scanCallback);
        };
        mqttModule.onScanData(scanCallback);
        // 5秒超时
        setTimeout(function() {
          mqttModule.offScanData(scanCallback);
        }, 5000);
      } else {
        // HTTP 模式：使用 SSE
        const sse = apiModule.startScanByUserParams(devConf, scanParams.chip, scanParams.filter_mac, scanParams.phy, scanParams.filter_name, scanParams.filter_rssi, '', function() {
          notify(self.$i18n.t('message.testScanOk'), self.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
          sse.close();
        }, function(error) {
          notify(self.$i18n.t('message.testScanFail') + ': ' + error, self.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
        });
      }
    },
    apiDemo2GenCode() {
      const scanParams = this.store.devConfDisplayVars.apiDemoParams.scanConnectWriteNotify.scan;
      const writeParams = this.store.devConfDisplayVars.apiDemoParams.scanConnectWriteNotify.write;
      const code = codeModule.genDemoCode('demo2', 'nodejs', { scanParams, writeParams });
      this.store.devConfDisplayVars.apiDemoParams.scanConnectWriteNotify.code = code;
    },
    apiDemo1GenCode() {
      const writeParams = this.store.devConfDisplayVars.apiDemoParams.connectWriteNotify.write;
      const connectParams = this.store.devConfDisplayVars.apiDemoParams.connectWriteNotify.connect;
      const code = codeModule.genDemoCode('demo1', 'nodejs', { connectParams, writeParams });
      this.store.devConfDisplayVars.apiDemoParams.connectWriteNotify.code = code;
    },
    apiDemoWriteChanged(apiContentJson) {
      const apiContent = JSON.parse(apiContentJson);
      const apiDemoWrite = this.store.devConfDisplayVars.apiDemoParams.connectWriteNotify.write;
      apiDemoWrite.handle = apiContent.data.params.handle;
      apiDemoWrite.value = apiContent.data.params.value;
      apiDemoWrite.noresponse = (_.get(apiContent, 'data.query.noresponse') === 1 || false);
    },
    apiDemoWriteTest() {
      const self = this;
      const writeParams = this.store.devConfDisplayVars.apiDemoParams.connectWriteNotify.write;
      const connectParams = this.store.devConfDisplayVars.apiDemoParams.connectWriteNotify.connect;
      // 使用 transport 适配器支持 HTTP/MQTT
      transportModule.writeByHandle(connectParams.deviceMac, writeParams.handle, writeParams.value, writeParams.noresponse).then(function() {
        notify(self.$i18n.t('message.testWriteOk') + ': ' + connectParams.deviceMac, self.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
      }).catch(function(ex) {
        notify(self.$i18n.t('message.testWriteFail') + ': ' + connectParams.deviceMac + ', ' + getErrorMessage(ex), self.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
      });
    },
    apiDemoConnectTest() {
      const self = this;
      const connectParams = this.store.devConfDisplayVars.apiDemoParams.connectWriteNotify.connect;
      const params = { chip: connectParams.chip };
      // 使用 transport 适配器支持 HTTP/MQTT
      transportModule.connect(connectParams.deviceMac, connectParams.addrType, params).then(function() {
        notify(main.getGlobalVue().$i18n.t('message.connectDeviceOk'), main.getGlobalVue().$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
      }).catch(function(ex) {
        notify(self.$i18n.t('message.testConnectFail') + ': ' + connectParams.deviceMac + ', ' + getErrorMessage(ex), self.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
      });
    },
    apiDemoConnectChanged(apiContentJson) { // URL改变 -> 找到对应的日志 -> 设置对应的参数
      const apiContent = JSON.parse(apiContentJson);
      const apiDemoConnect = this.store.devConfDisplayVars.apiDemoParams.connectWriteNotify.connect;
      apiDemoConnect.chip = apiContent.data.query.chip;
      apiDemoConnect.deviceMac = apiContent.data.params.deviceMac;
      apiDemoConnect.addrType = apiContent.data.body.type;
    },
    getApiLogListByFilter(filter) {
      return _.filter(this.cache.apiLogResultList, filter);
    },
    getComputedApiLogDisplayResultList() { // 全局搜索扫描列表
      // 根据当前模式过滤日志（HTTP/MQTT分开显示）
      const currentMode = this.store.devConf.transportType;
      const isMqttMode = currentMode === 'MQTT';
      let filteredList = this.cache.apiLogResultList.filter(item => {
        const isItemMqtt = item.apiContent && (
          item.apiContent.transportType === 'mqtt' || 
          (item.apiContent.method && item.apiContent.method.startsWith('MQTT/'))
        );
        return isMqttMode ? isItemMqtt : !isItemMqtt;
      });
      
      const filterName = XEUtils.toString(this.cache.apiLogDisplayFilterContent).trim().toLowerCase();
      if (filterName) {
        const filterRE = new RegExp(filterName, 'gi');
        const searchProps = ['apiName', 'method', 'url', 'data'];
        const rest = filteredList.filter(item => {
          return searchProps.some(key => {
            return XEUtils.toString(item[key]).toLowerCase().indexOf(filterName) > -1;
          });
        });
        return rest.map(row => {
          const item = Object.assign({}, row);
          searchProps.forEach(key => {
            item[key] = XEUtils.toString(item[key]).replace(filterRE, match => `<span class="keyword-lighten">${match}</span>`)
          });
          return item;
        });
      }
      return filteredList;
    },
    getComputedConnectDisplayResultList() { // 全局搜索扫描列表
      const filterName = XEUtils.toString(this.cache.connectDisplayFilterContent).trim().toLowerCase();
      if (filterName) {
        const filterRE = new RegExp(filterName, 'gi');
        const searchProps = ['mac', 'name'];
        const rest = this.cache.connectedList.filter(item => {
          return searchProps.some(key => {
            return XEUtils.toString(item[key]).toLowerCase().indexOf(filterName) > -1;
          });
        });
        return rest.map(row => {
          const item = Object.assign({}, row);
          searchProps.forEach(key => {
            // item[key] = XEUtils.toString(item[key]).replace(filterRE, match => `<span class="keyword-lighten">${match}</span>`)
          });
          return item;
        });
      }
      return this.cache.connectedList;
    },
    connectTabsClick() {
      this.connectVuxTableForceResize();
    },
    scanTabsClick() {
      this.scanVuxTableForceResize();
    },
    scanDisplayResultClear() {
      this.cache.scanDisplayResultList.splice(0);
    },
    notifyDisplayResultClear() {
      this.cache.notifyDisplayResultList.splice(0);
    },
    apiLogDisplayResultClear() {
      this.cache.apiLogResultList.splice(0);
    },
    scanDisplayResultExport() {
      this.$refs.refScanDisplayResultGrid.exportData({ filename: 'scan', type: 'csv' })
    },
    connectDisplayResultExport() {
      this.$refs.refConnectDisplayResultGrid.exportData({ filename: 'connect', type: 'csv' })
    },
    notifyDisplayResultExport() {
      this.$refs.refNotifyDisplayResultGrid.exportData({ filename: 'notify', type: 'csv' })
    },
    apiLogDisplayResultExport() {
      this.$refs.refApiLogDisplayResultGrid.exportData({ filename: 'api_log', type: 'csv' })
    },
    loadNotifyResult() {
      const loadPageSize = 5;
      this.cache.isNotifyLoading = true;
      let pageList = this.cache.notifyResultList.splice(0, loadPageSize);
      let pageJsonList = _.map(pageList, item => `${new Date(item.time).toISOString()}: ${item.data}`);
      if (pageList.length !== 0) {
        let index = this.cache.notifyDisplayResultList.length;
        this.cache.notifyDisplayResultList.splice(index, pageJsonList.length, ...pageJsonList);
        this.cache.isNotifyLoading = false;
      } else {
        setTimeout(function (that) {
          that.cache.isNotifyLoading = false;
          that.loadNotifyResult();
        }, 500, this);
      }
    },
    loadApiDebuggerResult() {
      const apiType = this.store.devConfDisplayVars.activeApiDebugMenuItem;
      if (apiType === libEnum.apiType.SCAN) {
        const loadPageSize = 5;
        this.cache.isApiDebuggerLoading = true;
        let pageList = this.cache.apiDebuggerResult[libEnum.apiType.SCAN].resultList.splice(0, loadPageSize);
        let pageJsonList = _.map(pageList, item => `${new Date(item.time).toISOString()}: ${item.data}`);
        if (pageList.length !== 0) {
          let index = this.cache.apiDebuggerResult[libEnum.apiType.SCAN].displayResultList.length;
          this.cache.apiDebuggerResult[libEnum.apiType.SCAN].displayResultList.splice(index, pageJsonList.length, ...pageJsonList);
          this.cache.isApiDebuggerLoading = false;
        } else {
          setTimeout(function (that) {
            that.cache.isApiDebuggerLoading = false;
            that.loadApiDebuggerResult();
          }, 500, this);
        }
      }
    },
    startDebugApi() {
      const apiType = this.store.devConfDisplayVars.activeApiDebugMenuItem;
      const apiParams = this.store.devConfDisplayVars.apiDebuggerParams[apiType];
      
      // 使用共享的 Device MAC（所有需要 deviceMac 的 API 共用同一个）
      if (apiParams && apiParams.hasOwnProperty('deviceMac')) {
        apiParams.deviceMac = this.store.devConfDisplayVars.apiDebuggerDeviceMac;
      }

      console.log('startDebugApi apiParams before filter xss:', this.store.devConf.mac, JSON.stringify(apiParams));
      _.forEach(apiParams, (v, k) => {
        if (_.isString(v)) apiParams[k] = filterXSS(v);
      });
      this.store.devConf.mac = filterXSS(this.store.devConf.mac);
      console.log('startDebugApi apiParams after filter xss:', this.store.devConf.mac, JSON.stringify(apiParams));

      const apiResult = this.cache.apiDebuggerResult[apiType];
      if (apiType === libEnum.apiType.AUTH) {
        apiModule.getAccessToken(this.store.devConf.baseURI, this.store.devConf.acDevKey, this.store.devConf.acDevSecret).then((data) => {
          apiResult.resultList.push(`${new Date().toISOString()}: ${this.$i18n.t('message.getAccessTokenOk')}, ${JSON.stringify(apiParams)}, ${JSON.stringify(data)}`);
          notify(`${this.$i18n.t('message.getAccessTokenOk')}: ${data.access_token}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
        }).catch(ex => {
          notify(`${this.$i18n.t('message.getAccessTokenFail')}: ${getErrorMessage(ex)}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
          apiResult.resultList.push(`${new Date().toISOString()}: ${this.$i18n.t('message.getAccessTokenFail')}, ${JSON.stringify({ apiParams, ex })}`);
        });
      } else if (apiType === libEnum.apiType.SCAN) {
        let scanParamQs = `timestamp=${apiParams.timestamp}`;
        if (apiParams.scanParams && apiParams.scanParams.startsWith('&')) {
          scanParamQs += apiParams.scanParams;
        } else {
          scanParamQs = scanParamQs + '&' + apiParams.scanParams;
        }
        apiResult.sse = apiModule.startScanByUserParams(this.store.devConf, apiParams.chip, apiParams.filter_mac, apiParams.phy, apiParams.filter_name, apiParams.filter_rssi, scanParamQs, (message) => {
          apiResult.resultList.push(`${new Date().toISOString()}: ${message.data}`);
          if (apiResult.resultList.length < 5) return;
          apiResult.resultList = apiResult.resultList.splice(0);
          if (!apiResult.sse) return;
          apiResult.sse.close();
          apiResult.sse = null;
          this.store.devConfDisplayVars.isApiScanning = false;
          notify(`${this.$i18n.t('message.alreadyStopScan')}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
        });
        this.store.devConfDisplayVars.isApiScanning = true;
        notify(`${this.$i18n.t('message.debuggerScanAlert')}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
      } else if (apiType === libEnum.apiType.CONNECT) {
        let params = {
          discovergatt: _.get(apiParams, 'discovergatt') || '1',
          timeout: _.get(apiParams, 'connTimeout') || 10,
        };

        if (!_.isEmpty(_.get(apiParams, 'connPhy'))) {
          params.phy = _.get(apiParams, 'connPhy').join(',');
        }

        if (!_.isEmpty(_.get(apiParams, 'secondaryPhy'))) {
          params.secondary_phy = _.get(apiParams, 'secondaryPhy').join(',');
        }

        if (params.timeout < 0.2 || params.timeout > 20) params.timeout = 15; // timeout范围处理
        params.timeout = params.timeout * 1000;

        let otherParams = this.getUrlVars(_.get(apiParams, 'connParams')); // 自定义输入，用户自己保证支持
        params = _.merge(params, otherParams);

        // MQTT 模式显示 topic 和真实 payload
        if (this.store.devConf.transportType === 'MQTT') {
          const gateway = this.store.devConf.mqtt.gateway;
          const url = '/gap/nodes/' + apiParams.deviceMac + '/connection';
          const body = { type: apiParams.addrType, chip: apiParams.chip, ...params };
          apiResult.resultList.push(`<- ${new Date().toISOString()} ${buildMqttRequestLog(gateway, url, 'POST', body)}`);
        } else {
          apiResult.resultList.push(`<- ${new Date().toISOString()} ${JSON.stringify(apiParams)}`);
        }
        transportModule.connect(apiParams.deviceMac, apiParams.addrType, { chip: apiParams.chip, ...params }).then((data) => {
          if (this.store.devConf.transportType === 'MQTT') {
            apiResult.resultList.push(`-> ${new Date().toISOString()} ${buildMqttResponseLog(this.store.devConf.mqtt.gateway, { code: 200, body: data || {} })}`);
          } else {
            apiResult.resultList.push(`-> ${new Date().toISOString()} ${this.$i18n.t('message.connectDeviceOk')}, ${JSON.stringify(data || {})}`);
          }
        }).catch(ex => {
          notify(`${this.$i18n.t('message.connectDeviceFail')}: ${apiParams.deviceMac}, ${getErrorMessage(ex)}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
          if (this.store.devConf.transportType === 'MQTT') {
            // 判断是对端响应错误还是本地错误（超时/连接失败等）
            if (ex && typeof ex === 'object' && ex.code !== undefined) {
              apiResult.resultList.push(`-> ${new Date().toISOString()} ${buildMqttResponseLog(this.store.devConf.mqtt.gateway, ex)}`);
            } else {
              apiResult.resultList.push(`-> ${new Date().toISOString()} ${buildMqttLocalErrorLog(getErrorMessage(ex))}`);
            }
          } else {
            apiResult.resultList.push(`-> ${new Date().toISOString()} ${this.$i18n.t('message.connectDeviceFail')}, ${getErrorMessage(ex)}`);
          }
        });
      } else if (apiType === libEnum.apiType.READ) {
        // MQTT 模式显示 topic 和真实 payload
        if (this.store.devConf.transportType === 'MQTT') {
          const gateway = this.store.devConf.mqtt.gateway;
          const url = '/gatt/nodes/' + apiParams.deviceMac + '/handle/' + apiParams.handle + '/value';
          apiResult.resultList.push(`<- ${new Date().toISOString()} ${buildMqttRequestLog(gateway, url, 'GET', {})}`);
        } else {
          apiResult.resultList.push(`<- ${new Date().toISOString()} ${JSON.stringify(apiParams)}`);
        }
        transportModule.readByHandle(apiParams.deviceMac, apiParams.handle).then((body) => {
          notify(`${this.$i18n.t('message.readDataOk')}: ${apiParams.deviceMac}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
          if (this.store.devConf.transportType === 'MQTT') {
            apiResult.resultList.push(`-> ${new Date().toISOString()} ${buildMqttResponseLog(this.store.devConf.mqtt.gateway, { code: 200, body: body })}`);
          } else {
            apiResult.resultList.push(`-> ${new Date().toISOString()} ${this.$i18n.t('message.readDataOk')}, ${JSON.stringify(body)}`);
          }
        }).catch(ex => {
          notify(`${this.$i18n.t('message.readDataFail')}: ${apiParams.deviceMac}, ${getErrorMessage(ex)}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
          if (this.store.devConf.transportType === 'MQTT') {
            if (ex && typeof ex === 'object' && ex.code !== undefined) {
              apiResult.resultList.push(`-> ${new Date().toISOString()} ${buildMqttResponseLog(this.store.devConf.mqtt.gateway, ex)}`);
            } else {
              apiResult.resultList.push(`-> ${new Date().toISOString()} ${buildMqttLocalErrorLog(getErrorMessage(ex))}`);
            }
          } else {
            apiResult.resultList.push(`-> ${new Date().toISOString()} ${this.$i18n.t('message.readDataFail')}, ${getErrorMessage(ex)}`);
          }
        });
      } else if (apiType === libEnum.apiType.READ_PHY) {
        // MQTT 模式显示 topic 和真实 payload
        if (this.store.devConf.transportType === 'MQTT') {
          const gateway = this.store.devConf.mqtt.gateway;
          const url = '/gap/nodes/' + apiParams.deviceMac + '/phy';
          apiResult.resultList.push(`<- ${new Date().toISOString()} ${buildMqttRequestLog(gateway, url, 'GET', {})}`);
        } else {
          apiResult.resultList.push(`<- ${new Date().toISOString()} ${JSON.stringify(apiParams)}`);
        }
        transportModule.readPhy(apiParams.deviceMac).then((body) => {
          notify(`${this.$i18n.t('message.readPhyOK')}: ${apiParams.deviceMac}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
          if (this.store.devConf.transportType === 'MQTT') {
            apiResult.resultList.push(`-> ${new Date().toISOString()} ${buildMqttResponseLog(this.store.devConf.mqtt.gateway, { code: 200, body: body })}`);
          } else {
            apiResult.resultList.push(`-> ${new Date().toISOString()} ${this.$i18n.t('message.readPhyOK')}, ${JSON.stringify(body)}`);
          }
        }).catch(ex => {
          notify(`${this.$i18n.t('message.readPhyFail')}: ${apiParams.deviceMac}, ${getErrorMessage(ex)}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
          if (this.store.devConf.transportType === 'MQTT') {
            if (ex && typeof ex === 'object' && ex.code !== undefined) {
              apiResult.resultList.push(`-> ${new Date().toISOString()} ${buildMqttResponseLog(this.store.devConf.mqtt.gateway, ex)}`);
            } else {
              apiResult.resultList.push(`-> ${new Date().toISOString()} ${buildMqttLocalErrorLog(getErrorMessage(ex))}`);
            }
          } else {
            apiResult.resultList.push(`-> ${new Date().toISOString()} ${this.$i18n.t('message.readPhyFail')}, ${getErrorMessage(ex)}`);
          }
        });
      } else if (apiType === libEnum.apiType.UPDATE_PHY) {
        let bodyParam = {
          tx: apiParams.tx.join(','),
          rx: apiParams.rx.join(','),
        };

        if (bodyParam.tx.includes('CODED')) {
          bodyParam.coded_option = apiParams.codedOption;
        }

        // MQTT 模式显示 topic 和真实 payload
        if (this.store.devConf.transportType === 'MQTT') {
          const gateway = this.store.devConf.mqtt.gateway;
          const url = '/gap/nodes/' + apiParams.deviceMac + '/phy';
          apiResult.resultList.push(`<- ${new Date().toISOString()} ${buildMqttRequestLog(gateway, url, 'POST', bodyParam)}`);
        } else {
          apiResult.resultList.push(`<- ${new Date().toISOString()} ${JSON.stringify({ deviceMac: apiParams.deviceMac, ...bodyParam })}`);
        }
        transportModule.updatePhy(apiParams.deviceMac, bodyParam).then((body) => {
          notify(`${this.$i18n.t('message.updatePhyOK')}: ${apiParams.deviceMac}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
          if (this.store.devConf.transportType === 'MQTT') {
            apiResult.resultList.push(`-> ${new Date().toISOString()} ${buildMqttResponseLog(this.store.devConf.mqtt.gateway, { code: 200, body: body })}`);
          } else {
            apiResult.resultList.push(`-> ${new Date().toISOString()} ${this.$i18n.t('message.updatePhyOK')}, ${JSON.stringify(body)}`);
          }
        }).catch(ex => {
          notify(`${this.$i18n.t('message.updatePhyFail')}: ${apiParams.deviceMac}, ${getErrorMessage(ex)}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
          if (this.store.devConf.transportType === 'MQTT') {
            if (ex && typeof ex === 'object' && ex.code !== undefined) {
              apiResult.resultList.push(`-> ${new Date().toISOString()} ${buildMqttResponseLog(this.store.devConf.mqtt.gateway, ex)}`);
            } else {
              apiResult.resultList.push(`-> ${new Date().toISOString()} ${buildMqttLocalErrorLog(getErrorMessage(ex))}`);
            }
          } else {
            apiResult.resultList.push(`-> ${new Date().toISOString()} ${this.$i18n.t('message.updatePhyFail')}, ${getErrorMessage(ex)}`);
          }
        });
      } else if (apiType === libEnum.apiType.WRITE) {
        // MQTT 模式显示 topic 和真实 payload
        if (this.store.devConf.transportType === 'MQTT') {
          const gateway = this.store.devConf.mqtt.gateway;
          const url = '/gatt/nodes/' + apiParams.deviceMac + '/handle/' + apiParams.handle + '/value/' + apiParams.value;
          const body = apiParams.noresponse ? { noresponse: 1 } : {};
          apiResult.resultList.push(`<- ${new Date().toISOString()} ${buildMqttRequestLog(gateway, url, 'GET', body)}`);
        } else {
          apiResult.resultList.push(`<- ${new Date().toISOString()} ${JSON.stringify(apiParams)}`);
        }
        transportModule.writeByHandle(apiParams.deviceMac, apiParams.handle, apiParams.value, apiParams.noresponse).then((data) => {
          notify(`${this.$i18n.t('message.writeDataOk')}: ${apiParams.deviceMac}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
          if (this.store.devConf.transportType === 'MQTT') {
            apiResult.resultList.push(`-> ${new Date().toISOString()} ${buildMqttResponseLog(this.store.devConf.mqtt.gateway, { code: 200, body: data || {} })}`);
          } else {
            apiResult.resultList.push(`-> ${new Date().toISOString()} ${this.$i18n.t('message.writeDataOk')}, ${JSON.stringify(data || {})}`);
          }
        }).catch(ex => {
          notify(`${this.$i18n.t('message.writeDataFail')}: ${apiParams.deviceMac}, ${getErrorMessage(ex)}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
          if (this.store.devConf.transportType === 'MQTT') {
            if (ex && typeof ex === 'object' && ex.code !== undefined) {
              apiResult.resultList.push(`-> ${new Date().toISOString()} ${buildMqttResponseLog(this.store.devConf.mqtt.gateway, ex)}`);
            } else {
              apiResult.resultList.push(`-> ${new Date().toISOString()} ${buildMqttLocalErrorLog(getErrorMessage(ex))}`);
            }
          } else {
            apiResult.resultList.push(`-> ${new Date().toISOString()} ${this.$i18n.t('message.writeDataFail')}, ${getErrorMessage(ex)}`);
          }
        });
      } else if (apiType === libEnum.apiType.DISCONNECT) {
        // MQTT 模式显示 topic 和真实 payload
        if (this.store.devConf.transportType === 'MQTT') {
          const gateway = this.store.devConf.mqtt.gateway;
          const url = '/gap/nodes/' + apiParams.deviceMac + '/connection';
          apiResult.resultList.push(`<- ${new Date().toISOString()} ${buildMqttRequestLog(gateway, url, 'DELETE', {})}`);
        } else {
          apiResult.resultList.push(`<- ${new Date().toISOString()} ${JSON.stringify(apiParams)}`);
        }
        transportModule.disconnect(apiParams.deviceMac).then((data) => {
          notify(`${this.$i18n.t('message.disconnectDeviceOk')}: ${apiParams.deviceMac}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
          if (this.store.devConf.transportType === 'MQTT') {
            apiResult.resultList.push(`-> ${new Date().toISOString()} ${buildMqttResponseLog(this.store.devConf.mqtt.gateway, { code: 200, body: data || {} })}`);
          } else {
            apiResult.resultList.push(`-> ${new Date().toISOString()} ${this.$i18n.t('message.disconnectDeviceOk')}, ${JSON.stringify(data || {})}`);
          }
        }).catch(ex => {
          notify(`${this.$i18n.t('message.disconnectDeviceFail')}: ${apiParams.deviceMac}, ${getErrorMessage(ex)}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
          if (this.store.devConf.transportType === 'MQTT') {
            if (ex && typeof ex === 'object' && ex.code !== undefined) {
              apiResult.resultList.push(`-> ${new Date().toISOString()} ${buildMqttResponseLog(this.store.devConf.mqtt.gateway, ex)}`);
            } else {
              apiResult.resultList.push(`-> ${new Date().toISOString()} ${buildMqttLocalErrorLog(getErrorMessage(ex))}`);
            }
          } else {
            apiResult.resultList.push(`-> ${new Date().toISOString()} ${this.$i18n.t('message.disconnectDeviceFail')}, ${getErrorMessage(ex)}`);
          }
        });
      } else if (apiType === libEnum.apiType.CONNECT_LIST) {
        // MQTT 模式显示 topic 和真实 payload
        if (this.store.devConf.transportType === 'MQTT') {
          const gateway = this.store.devConf.mqtt.gateway;
          const url = '/gap/nodes?connection_state=connected';
          apiResult.resultList.push(`<- ${new Date().toISOString()} ${buildMqttRequestLog(gateway, url, 'GET', {})}`);
        } else {
          apiResult.resultList.push(`<- ${new Date().toISOString()} getConnectedList`);
        }
        transportModule.getConnectedList().then((data) => {
          notify(`${this.$i18n.t('message.getConnectListOk')}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
          if (this.store.devConf.transportType === 'MQTT') {
            apiResult.resultList.push(`-> ${new Date().toISOString()} ${buildMqttResponseLog(this.store.devConf.mqtt.gateway, { code: 200, body: data })}`);
          } else {
            apiResult.resultList.push(`-> ${new Date().toISOString()} ${this.$i18n.t('message.getConnectListOk')}, ${JSON.stringify(data)}`);
          }
        }).catch(ex => {
          notify(`${this.$i18n.t('message.getConnectListFail')}: ${getErrorMessage(ex)}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
          if (this.store.devConf.transportType === 'MQTT') {
            if (ex && typeof ex === 'object' && ex.code !== undefined) {
              apiResult.resultList.push(`-> ${new Date().toISOString()} ${buildMqttResponseLog(this.store.devConf.mqtt.gateway, ex)}`);
            } else {
              apiResult.resultList.push(`-> ${new Date().toISOString()} ${buildMqttLocalErrorLog(getErrorMessage(ex))}`);
            }
          } else {
            apiResult.resultList.push(`-> ${new Date().toISOString()} ${this.$i18n.t('message.getConnectListFail')}, ${getErrorMessage(ex)}`);
          }
        });
      } else if (apiType === libEnum.apiType.DISCOVER) {
        // MQTT 模式显示 topic 和真实 payload
        if (this.store.devConf.transportType === 'MQTT') {
          const gateway = this.store.devConf.mqtt.gateway;
          const url = '/gatt/nodes/' + apiParams.deviceMac + '/services/characteristics/descriptors';
          apiResult.resultList.push(`<- ${new Date().toISOString()} ${buildMqttRequestLog(gateway, url, 'GET', {})}`);
        } else {
          apiResult.resultList.push(`<- ${new Date().toISOString()} ${JSON.stringify(apiParams)}`);
        }
        transportModule.getDeviceServiceList(apiParams.deviceMac).then((data) => {
          notify(`${this.$i18n.t('message.getDeviceServiceListOk')}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
          if (this.store.devConf.transportType === 'MQTT') {
            apiResult.resultList.push(`-> ${new Date().toISOString()} ${buildMqttResponseLog(this.store.devConf.mqtt.gateway, { code: 200, body: data })}`);
          } else {
            apiResult.resultList.push(`-> ${new Date().toISOString()} ${this.$i18n.t('message.getDeviceServiceListOk')}, ${JSON.stringify(data)}`);
          }
        }).catch(ex => {
          notify(`${this.$i18n.t('message.getDeviceServiceListFail')}: ${getErrorMessage(ex)}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
          if (this.store.devConf.transportType === 'MQTT') {
            if (ex && typeof ex === 'object' && ex.code !== undefined) {
              apiResult.resultList.push(`-> ${new Date().toISOString()} ${buildMqttResponseLog(this.store.devConf.mqtt.gateway, ex)}`);
            } else {
              apiResult.resultList.push(`-> ${new Date().toISOString()} ${buildMqttLocalErrorLog(getErrorMessage(ex))}`);
            }
          } else {
            apiResult.resultList.push(`-> ${new Date().toISOString()} ${this.$i18n.t('message.getDeviceServiceListFail')}, ${getErrorMessage(ex)}`);
          }
        });
      } else if (apiType === libEnum.apiType.NOTIFY) {
        const devConf = _.cloneDeep(this.store.devConf);
        devConf.timestamp = apiParams.timestamp;
        devConf.sequence = apiParams.sequence;
        apiResult.sse = apiModule.startNotifyByDevConf(devConf, (message) => {
          this.cache.apiDebuggerResult[libEnum.apiType.NOTIFY].resultList.push(`${new Date().toISOString()}: ${message.data}`);
          if (!apiResult.sse) return;
          if (apiResult.resultList.length < 5) return;
          apiResult.resultList = apiResult.resultList.splice(0);
          apiResult.sse.close();
          apiResult.sse = null;
          notify(`${this.$i18n.t('message.alreadyStopNotify')}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
        }, err => {
          notify(`${this.$i18n.t('message.openNotifyFail')}`, this.$i18n.t('message.operationFail'), libEnum.messageType.SUCCESS);
          this.cache.apiDebuggerResult[libEnum.apiType.NOTIFY].resultList.push(`${new Date().toISOString()}: ${JSON.stringify(err)}`);
        });
        notify(`${this.$i18n.t('message.debuggerNotifyAlert')}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
      } else if (apiType === libEnum.apiType.CONNECT_STATUS) {
        // MQTT 模式下使用 MQTT 监听连接状态
        if (this.store.devConf.transportType === libEnum.transportType.MQTT) {
          const self = this;
          const mqttConnStatusCallback = function(data) {
            self.cache.apiDebuggerResult[libEnum.apiType.CONNECT_STATUS].resultList.push(new Date().toISOString() + ': ' + JSON.stringify(data));
          };
          mqttModule.onConnectionState(mqttConnStatusCallback);
          apiResult.mqttCallback = mqttConnStatusCallback;
          notify(this.$i18n.t('message.openConnectStatusOk') + ' (MQTT)', this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
        } else {
          apiResult.sse = apiModule.openConnectStatusSseByDevConf(this.store.devConf, (message) => {
            this.cache.apiDebuggerResult[libEnum.apiType.CONNECT_STATUS].resultList.push(`${new Date().toISOString()}: ${message.data}`);
          }, err => {
            notify(`${this.$i18n.t('message.openConnectStatusFail')}`, this.$i18n.t('message.operationFail'), libEnum.messageType.SUCCESS);
            this.cache.apiDebuggerResult[libEnum.apiType.CONNECT_STATUS].resultList.push(`${new Date().toISOString()}: ${JSON.stringify(err)}`);
          });
          notify(`${this.$i18n.t('message.openConnectStatusOk')}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
        }
      } else if (apiType === libEnum.apiType.PAIR) {
        // MQTT 模式显示 topic 和真实 payload
        if (this.store.devConf.transportType === 'MQTT') {
          const gateway = this.store.devConf.mqtt.gateway;
          const url = '/management/nodes/' + apiParams.deviceMac + '/pair';
          apiResult.resultList.push(`<- ${new Date().toISOString()} ${buildMqttRequestLog(gateway, url, 'POST', {})}`);
        } else {
          apiResult.resultList.push(`<- ${new Date().toISOString()} ${JSON.stringify(apiParams)}`);
        }
        transportModule.pair(apiParams.deviceMac, {}).then((data) => {
          notify(`${this.$i18n.t('message.pairOk')}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
          if (this.store.devConf.transportType === 'MQTT') {
            apiResult.resultList.push(`-> ${new Date().toISOString()} ${buildMqttResponseLog(this.store.devConf.mqtt.gateway, { code: 200, body: data })}`);
          } else {
            apiResult.resultList.push(`-> ${new Date().toISOString()} ${this.$i18n.t('message.pairOk')}, ${JSON.stringify(data)}`);
          }
        }).catch(ex => {
          notify(`${this.$i18n.t('message.pairFail')}: ${getErrorMessage(ex)}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
          if (this.store.devConf.transportType === 'MQTT') {
            if (ex && typeof ex === 'object' && ex.code !== undefined) {
              apiResult.resultList.push(`-> ${new Date().toISOString()} ${buildMqttResponseLog(this.store.devConf.mqtt.gateway, ex)}`);
            } else {
              apiResult.resultList.push(`-> ${new Date().toISOString()} ${buildMqttLocalErrorLog(getErrorMessage(ex))}`);
            }
          } else {
            apiResult.resultList.push(`-> ${new Date().toISOString()} ${this.$i18n.t('message.pairFail')}, ${getErrorMessage(ex)}`);
          }
        });
      } else if (apiType === libEnum.apiType.PAIR_INPUT) {
        // MQTT 模式显示 topic 和真实 payload
        if (this.store.devConf.transportType === 'MQTT') {
          const gateway = this.store.devConf.mqtt.gateway;
          const url = '/management/nodes/' + apiParams.deviceMac + '/pair-input';
          const body = apiParams.inputType === 'Passkey' ? { passkey: apiParams.passkey } : { tk: apiParams.tk };
          apiResult.resultList.push(`<- ${new Date().toISOString()} ${buildMqttRequestLog(gateway, url, 'POST', body)}`);
        } else {
          apiResult.resultList.push(`<- ${new Date().toISOString()} ${JSON.stringify(apiParams)}`);
        }
        if (apiParams.inputType === 'Passkey') {
          transportModule.pairByPasskey(apiParams.deviceMac, apiParams.passkey).then((data) => {
            notify(`${this.$i18n.t('message.pairOk')}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
            if (this.store.devConf.transportType === 'MQTT') {
              apiResult.resultList.push(`-> ${new Date().toISOString()} ${buildMqttResponseLog(this.store.devConf.mqtt.gateway, { code: 200, body: data })}`);
            } else {
              apiResult.resultList.push(`-> ${new Date().toISOString()} ${this.$i18n.t('message.pairOk')}, ${JSON.stringify(data)}`);
            }
          }).catch(ex => {
            notify(`${this.$i18n.t('message.pairFail')}: ${getErrorMessage(ex)}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
            if (this.store.devConf.transportType === 'MQTT') {
              if (ex && typeof ex === 'object' && ex.code !== undefined) {
                apiResult.resultList.push(`-> ${new Date().toISOString()} ${buildMqttResponseLog(this.store.devConf.mqtt.gateway, ex)}`);
              } else {
                apiResult.resultList.push(`-> ${new Date().toISOString()} ${buildMqttLocalErrorLog(getErrorMessage(ex))}`);
              }
            } else {
              apiResult.resultList.push(`-> ${new Date().toISOString()} ${this.$i18n.t('message.pairFail')}, ${getErrorMessage(ex)}`);
            }
          });
        } else if (apiParams.inputType === 'LegacyOOB') {
          transportModule.pairByLegacyOOB(apiParams.deviceMac, apiParams.tk).then((data) => {
            notify(`${this.$i18n.t('message.pairOk')}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
            if (this.store.devConf.transportType === 'MQTT') {
              apiResult.resultList.push(`-> ${new Date().toISOString()} ${buildMqttResponseLog(this.store.devConf.mqtt.gateway, { code: 200, body: data })}`);
            } else {
              apiResult.resultList.push(`-> ${new Date().toISOString()} ${this.$i18n.t('message.pairOk')}, ${JSON.stringify(data)}`);
            }
          }).catch(ex => {
            notify(`${this.$i18n.t('message.pairFail')}: ${getErrorMessage(ex)}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
            if (this.store.devConf.transportType === 'MQTT') {
              if (ex && typeof ex === 'object' && ex.code !== undefined) {
                apiResult.resultList.push(`-> ${new Date().toISOString()} ${buildMqttResponseLog(this.store.devConf.mqtt.gateway, ex)}`);
              } else {
                apiResult.resultList.push(`-> ${new Date().toISOString()} ${buildMqttLocalErrorLog(getErrorMessage(ex))}`);
              }
            } else {
              apiResult.resultList.push(`-> ${new Date().toISOString()} ${this.$i18n.t('message.pairFail')}, ${getErrorMessage(ex)}`);
            }
          });
        }
      } else if (apiType === libEnum.apiType.UNPAIR) {
        // MQTT 模式显示 topic 和真实 payload
        if (this.store.devConf.transportType === 'MQTT') {
          const gateway = this.store.devConf.mqtt.gateway;
          const url = '/management/nodes/' + apiParams.deviceMac + '/bond';
          apiResult.resultList.push(`<- ${new Date().toISOString()} ${buildMqttRequestLog(gateway, url, 'DELETE', {})}`);
        } else {
          apiResult.resultList.push(`<- ${new Date().toISOString()} ${JSON.stringify(apiParams)}`);
        }
        transportModule.unpair(apiParams.deviceMac).then((data) => {
          notify(`${this.$i18n.t('message.unpairOk')}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
          if (this.store.devConf.transportType === 'MQTT') {
            apiResult.resultList.push(`-> ${new Date().toISOString()} ${buildMqttResponseLog(this.store.devConf.mqtt.gateway, { code: 200, body: data })}`);
          } else {
            apiResult.resultList.push(`-> ${new Date().toISOString()} ${this.$i18n.t('message.unpairOk')}, ${JSON.stringify(data)}`);
          }
        }).catch(ex => {
          notify(`${this.$i18n.t('message.unpairFail')}: ${getErrorMessage(ex)}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
          if (this.store.devConf.transportType === 'MQTT') {
            if (ex && typeof ex === 'object' && ex.code !== undefined) {
              apiResult.resultList.push(`-> ${new Date().toISOString()} ${buildMqttResponseLog(this.store.devConf.mqtt.gateway, ex)}`);
            } else {
              apiResult.resultList.push(`-> ${new Date().toISOString()} ${buildMqttLocalErrorLog(getErrorMessage(ex))}`);
            }
          } else {
            apiResult.resultList.push(`-> ${new Date().toISOString()} ${this.$i18n.t('message.unpairFail')}, ${getErrorMessage(ex)}`);
          }
        });
      }
      this.store.devConfDisplayVars.activeApiDebugOutputMenuItem = 'output'; // 切换到调试结果页面
      this.$refs.apiDebuggerOutputMenu.activeIndex = 'output';
    },
    exportApiOutputDisplay() {
      notify(`${this.$i18n.t('message.functionToBeAdd')}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
    },
    clearApiOutputDisplay() {
      const apiType = this.store.devConfDisplayVars.activeApiDebugMenuItem;
      if (apiType === libEnum.apiType.SCAN) {
        this.cache.apiDebuggerResult[this.store.devConfDisplayVars.activeApiDebugMenuItem].displayResultList.splice(0);
      }
      this.cache.apiDebuggerResult[this.store.devConfDisplayVars.activeApiDebugMenuItem].resultList.splice(0);
      notify(`${this.$i18n.t('message.clearApiResultOk')}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
    },
    scrollDebugResultToBottom() {
      this.$nextTick(() => {
        const container = this.$refs.debugResultContainer;
        if (container && container.$el) {
          container.$el.scrollTop = container.$el.scrollHeight;
        } else if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },
    clearNotify() {
      this.cache.notifyResultList.splice(0);
      this.cache.notifyDisplayResultList.splice(0);
      notify(`${this.$i18n.t('message.clearNotifyOk')}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
    },
    deviceNotificationDataFilterChange() {
      if (this.store.devConfDisplayVars.isNotifyOn) {
        this.closeNotify();
        this.clearNotify();
        this.openNotify();
      }
    },
    openNotify() {
      const timestamp = this.cache.notifyDisplayTimestamp;
      const sequence = this.cache.notifyDisplaySequence;
      notifyModule.openNotifySse(timestamp, sequence);
      this.store.devConfDisplayVars.isNotifyOn = true;
      notify(`${this.$i18n.t('message.openNotifyOk')}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
    },
    closeNotify() {
      notifyModule.closeNotifySse();
      this.store.devConfDisplayVars.isNotifyOn = false;
      notify(`${this.$i18n.t('message.closeNotifyOk')}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
    },
    stopRssiChart() { // 停止图表
      clearInterval(this.rssiChartUpdateInterval);
      this.rssiChartUpdateInterval = null;
      this.store.devConfDisplayVars.rssiChartStopped = true;
    },
    startRssiChart() {
      this.rssiChartUpdateInterval = createRssiChartUpdateInterval(this);
      this.store.devConfDisplayVars.rssiChartStopped = false;
    },
    destoryRssiChart() {
      clearInterval(this.rssiChartUpdateInterval);
      this.rssiChartUpdateInterval = null;
      this.store.devConfDisplayVars.rssiChartSwitch = false;
    },
    destoryAndCreateRssiChart() { // 销毁重建图表
      if (!this.store.devConfDisplayVars.isScanning) {
        this.startScan();
        this.destoryRssiChart();
        setTimeout(function (that) {
          that.chartOptions = createRssiChart();
          that.startRssiChart();
          notify(`${that.$i18n.t('message.openRssiChartOk')}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
        }, 100, this);
        this.store.devConfDisplayVars.rssiChartSwitch = true;
      } else {
        this.destoryRssiChart();
        setTimeout(function (that) {
          that.chartOptions = createRssiChart();
          that.startRssiChart();
          notify(`${that.$i18n.t('message.openRssiChartOk')}`, that.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
        }, 100, this);
        this.store.devConfDisplayVars.rssiChartSwitch = true;
      }
    },
    add2RssiChart(row, deviceMac) {
      if (!this.cache.scanDevicesRssiHistory[deviceMac]) {
        this.cache.scanDevicesRssiHistory[deviceMac] = [{ time: Date.now(), rssi: row.rssi }];
      }
    },
    removeFromRssiChart(row, deviceMac) {
      delete this.cache.scanDevicesRssiHistory[deviceMac];
      console.log('remove from rssi chart', deviceMac, this.cache.scanDevicesRssiHistory[deviceMac]);
    },
    connectedListTabRemove(deviceMac) {
      if (deviceMac === 'invalidDeviceMac') {
        return;
      }
      this.disconnectDevice(deviceMac);
    },
    rssiChartDataSpanChange() { // 统计间隔变化，重建图表
      if (this.store.devConfDisplayVars.rssiChartSwitch) {
        this.destoryAndCreateRssiChart();
      }
    },
    deviceScanDataFilterChange() {
      if (this.store.devConfDisplayVars.deviceScanDataSwitch) {
        this.openDeviceScanData();
      }
    },
    genCode() {
      let apiType = this.store.devConfDisplayVars.activeApiDebugMenuItem;
      const apiParams = this.store.devConfDisplayVars.apiDebuggerParams[apiType];
      const apiResult = this.cache.apiDebuggerResult[apiType];
      
      // 使用共享的 Device MAC
      if (apiParams && apiParams.hasOwnProperty('deviceMac')) {
        apiParams.deviceMac = this.store.devConfDisplayVars.apiDebuggerDeviceMac;
      }
      
      // 根据通信模式生成对应代码
      if (this.store.devConf.transportType === libEnum.transportType.MQTT) {
        // MQTT 模式：生成 mosquitto 命令和 Node.js 代码
        apiResult.code[libEnum.codeType.MOSQUITTO] = codeModule.genCode(apiType, libEnum.codeType.MOSQUITTO, apiParams) || '';
        apiResult.code[libEnum.codeType.MQTT] = codeModule.genCode(apiType, libEnum.codeType.MQTT, apiParams) || '';
        this.store.devConfDisplayVars.activeApiDebugOutputMenuItem = libEnum.codeType.MOSQUITTO;
        this.$refs.apiDebuggerOutputMenu.activeIndex = libEnum.codeType.MOSQUITTO;
      } else {
        // HTTP 模式
        if (apiType === libEnum.apiType.AUTH) { // auth base64
          apiParams.base64 = Buffer.from(this.store.devConf.acDevKey + ':' + this.store.devConf.acDevSecret).toString('base64');
        }
        apiResult.code[libEnum.codeType.CURL] = codeModule.genCode(apiType, libEnum.codeType.CURL, apiParams);
        apiResult.code[libEnum.codeType.NODEJS] = codeModule.genCode(apiType, libEnum.codeType.NODEJS, apiParams);
        this.store.devConfDisplayVars.activeApiDebugOutputMenuItem = libEnum.codeType.CURL;
        this.$refs.apiDebuggerOutputMenu.activeIndex = libEnum.codeType.CURL;
      }
    },
    apiDebuggerDemoMenuSelect(key, keyPath) {
      this.store.devConfDisplayVars.activeApiDemoMenuItem = key;
    },
    apiDebuggerMenuSelect(key, keyPath) {
      this.store.devConfDisplayVars.activeApiDebugMenuItem = key;
    },
    apiDebuggerOutputMenuSelect(key, keyPath) {
      this.store.devConfDisplayVars.activeApiDebugOutputMenuItem = key;
    },
    menuSelect(key, keyPath) {
      if (key === 'connectListMenuItem') { // 点击连接列表，重新加载连接列表，和连接SSE
        this.store.devConfDisplayVars.activeMenuItem = key;
        // MQTT模式下，只有连接是Active时才自动获取连接列表
        if (this.store.devConf.transportType === libEnum.transportType.MQTT) {
          if (mqttModule.isConnected()) {
            connectModule.loadConnectedList();
          }
        } else {
          connectModule.loadConnectedList();
          connectModule.reopenConnectStatusSse();
        }
        this.connectVuxTableForceResize();
      } else if (key === 'notifyListMenuItem') {
        // notifyModule.reopenNotifySse(); // 手动打开
        this.store.devConfDisplayVars.activeMenuItem = key;
        this.notifyVuxTableForceResize();
      } else if (key === 'scanListMenuItem') {
        this.store.devConfDisplayVars.activeMenuItem = key;
        this.scanVuxTableForceResize();
      } else if (key === 'configMenuItem') {
        if (this.store.devConfDisplayVars.isConfigMenuItemOpen) {
          this.store.devConfDisplayVars.isConfigMenuItemOpen = false;
          this.store.devConfDisplayVars.mainWidth = 24;
        } else {
          this.store.devConfDisplayVars.isConfigMenuItemOpen = true;
          this.store.devConfDisplayVars.mainWidth = 18;
        }
        this.scanVuxTableForceResize();
        this.notifyVuxTableForceResize();
        this.connectVuxTableForceResize();
        this.apiLogVuxTableForceResize();
      } else if (key === 'apiDebuggerMenuItem') {
        this.store.devConfDisplayVars.activeMenuItem = key;
        // MQTT模式下隐藏了scan和auth菜单，如果当前选中的是这些菜单，则切换到connect
        if (this.store.devConf.transportType === libEnum.transportType.MQTT) {
          if (['scan', 'auth'].includes(this.store.devConfDisplayVars.activeApiDebugMenuItem)) {
            this.store.devConfDisplayVars.activeApiDebugMenuItem = 'connect';
          }
        }
        this.$refs.refApiDebuggerMenu.activeIndex = this.store.devConfDisplayVars.activeApiDebugMenuItem;
      } else if (key === 'apiLogListMenuItem') {
        this.store.devConfDisplayVars.activeMenuItem = key;
        this.apiLogVuxTableForceResize();
      } else if (key === 'apiDemoMenuItem') {
        this.store.devConfDisplayVars.activeMenuItem = key;
        this.$refs.apiDebuggerDemoMenu.activeIndex = this.store.devConfDisplayVars.activeApiDemoMenuItem;
      } else if (key === 'toolsMenuItem') {
        this.store.devConfDisplayVars.activeMenuItem = key;
      } else if (key === 'resourcesMenuItem') {
        this.store.devConfDisplayVars.activeMenuItem = key;
      }
    },
    apiLogVuxTableForceResize() {
      let data = this.cache.apiLogResultList.pop();
      if (data) this.cache.apiLogResultList.push(data);
    },
    connectVuxTableForceResize() {
      let data = this.cache.connectedList.pop();
      if (data) this.cache.connectedList.push(data);
    },
    scanVuxTableForceResize() {
      let data = this.cache.scanDisplayResultList.pop();
      if (data) this.cache.scanDisplayResultList.push(data);
    },
    notifyVuxTableForceResize() {
      let data = this.cache.notifyDisplayResultList.pop();
      if (data) this.cache.notifyDisplayResultList.push(data);
    },
    propertyClick(operation, deviceMac, char) {
      operationModule.dispatch(operation, deviceMac, char);
    },
    routerChange(router) { // 当选择网关时，优选自动选择此网关
      this.store.devConf.aps.splice(0, this.store.devConf.aps.length);
      this.store.devConf.aps.push(router);

      let gateway = this.cache.acRouterList.find(x => x.mac === router);
      this.cache.model = _.get(gateway, 'model') || '';
      console.log('cache update model:', this.cache.model);
      dbModule.checkAndClearPhyParams(this.cache.model);
    },
    readDevicePhy(deviceMac) {
      transportModule.readPhy(deviceMac).then((rawBody) => {
        notify(rawBody, `${this.$i18n.t('message.readPhyOK')}`, libEnum.messageType.SUCCESS);
      }).catch((ex) => {
        notify(`${this.$i18n.t('message.readPhyFail')}: ${deviceMac}, ${getErrorMessage(ex)}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
        connectModule.removeDeviceIfNotFound(deviceMac, ex);
      });
    },
    getDeviceServices(deviceMac) {
      serviceModule.getDeviceServiceList(deviceMac).then(() => {
        this.cache.currentConnectedTab = deviceMac; // 点击服务激活此设备tab页面
      }).catch(ex => {
        notify(`${this.$i18n.t('message.getDeviceServiceListFail')}: ${JSON.stringify(ex)}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
        connectModule.removeDeviceIfNotFound(deviceMac, ex);
      });
    },
    exportDeviceServices(deviceMac) {
      serviceModule.getDeviceServiceList(deviceMac).then((data) => {
        data = JSON.stringify(data, null, 2);
        const blob = new Blob([data], { type: 'text/json' });
        const event = document.createEvent('MouseEvents');
        const link = document.createElement('a');
        link.download = `${deviceMac.replace(/:/g, '_')}_service.json`;
        link.href = window.URL.createObjectURL(blob);
        link.dataset.downloadurl = ['text/json', link.download, link.href].join(':');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        link.dispatchEvent(event);
      });
    },
    startScan() {
      this.$refs.refConfig.validate((isOK, failed) => {
        if (!isOK) return console.log('config form check failed:', isOK, failed);
        scanModule.startScan(this.store.devConf);
        this.store.devConfDisplayVars.isScanning = true;
        this.cache.scanResultList.splice(0); // 清空扫描缓存数据
        this.cache.scanDisplayResultList.splice(0); // 清空扫描展示数据
        this.store.devConfDisplayVars.activeMenuItem = 'scanListMenuItem'; // 跳转扫描结果tab页面
        // notify(`${this.$i18n.t('message.openScanOk')}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
      });
    },
    controlStyleChange() {
      console.log('control style changed, stop scan');
      if (this.store.devConfDisplayVars.isScanning) {
        this.stopScan();
      }
      if (this.store.devConf.controlStyle === libEnum.controlStyle.AP) {
        this.store.devConfDisplayVars.leftConfHeight = '100%';
      } else {
        this.store.devConfDisplayVars.leftConfHeight = '100%';
      }
    },
    async controlTabChange(tab) {
      console.log('control tab changed:', tab.name);
      // 同步更新 transportType
      this.store.devConf.transportType = tab.name;
      
      // 1. 停止扫描（同时清理HTTP SSE和MQTT回调）
      if (this.store.devConfDisplayVars.isScanning) {
        this.stopScan();
      }
      scanModule.stopReceivingMqttScanData();  // 确保MQTT回调也被清理
      
      // 2. 清空扫描结果列表
      this.cache.scanResultList.splice(0);
      this.cache.scanDisplayResultList.splice(0);
      
      // 3. 清空已连接设备列表
      this.cache.connectedList.splice(0);
      
      // 4. 关闭连接状态SSE/MQTT监听
      connectModule.closeConnectStatusSse();
      
      // 5. 停止通知监听
      notifyModule.stopReceivingMqttNotification();
      
      // 6. 如果从 MQTT Tab 切换到 HTTP Tab，断开 MQTT 连接并加载 HTTP 连接列表
      if (tab.name === 'HTTP') {
        if (mqttModule.isConnected()) {
          await mqttModule.disconnect();  // 等待断开完成，避免快速切换时的竞态条件
        }
        // P1 修复: HTTP模式下隐藏了mqtt和mosquitto输出Tab，如果当前选中的是这些，则切换到output
        if (['mqtt', 'mosquitto'].includes(this.store.devConfDisplayVars.activeApiDebugOutputMenuItem)) {
          this.store.devConfDisplayVars.activeApiDebugOutputMenuItem = 'output';
          if (this.$refs.apiDebuggerOutputMenu) {
            this.$refs.apiDebuggerOutputMenu.activeIndex = 'output';
          }
        }
        // 切换到 HTTP 后自动加载连接列表
        connectModule.loadConnectedList();
        connectModule.reopenConnectStatusSse();
      }
      
      // 7. 如果切换到 MQTT 模式，检查是否已连接，未连接则提示用户
      if (tab.name === 'MQTT') {
        const self = this;
        // MQTT模式下隐藏了scan和auth菜单，如果当前选中的是这些菜单，则切换到connect
        if (['scan', 'auth'].includes(this.store.devConfDisplayVars.activeApiDebugMenuItem)) {
          this.store.devConfDisplayVars.activeApiDebugMenuItem = 'connect';
        }
        // P1 修复: MQTT模式下隐藏了curl和nodejs输出Tab，如果当前选中的是这些，则切换到output
        if (['curl', 'nodejs'].includes(this.store.devConfDisplayVars.activeApiDebugOutputMenuItem)) {
          this.store.devConfDisplayVars.activeApiDebugOutputMenuItem = 'output';
          if (this.$refs.apiDebuggerOutputMenu) {
            this.$refs.apiDebuggerOutputMenu.activeIndex = 'output';
          }
        }
        if (!mqttModule.isConnected()) {
          this.$confirm(
            this.$i18n.t('message.mqttNotConnectedHint'),
            this.$i18n.t('message.alert'),
            { type: 'warning' }
          ).then(function() {
            self.connectMqtt();  // 自动连接
          }).catch(function() {
            // 用户取消，不做任何操作
          });
        }
      }
    },
    formatGatewayMac(value) {
      // 自动转换为大写
      this.store.devConf.mqtt.gateway = (value || '').toUpperCase();
    },
    connectMqtt() {
      const self = this;
      const mqttConfig = this.store.devConf.mqtt;
      const brokerUrl = this.mqttBrokerUrl;
      
      if (!brokerUrl) {
        notify(this.$i18n.t('message.pleaseInput') + ' Host', this.$i18n.t('message.alert'), libEnum.messageType.WARNING);
        return;
      }
      if (!mqttConfig.gateway) {
        notify(this.$i18n.t('message.pleaseInput') + ' Gateway MAC', this.$i18n.t('message.alert'), libEnum.messageType.WARNING);
        return;
      }
      // 验证 Gateway MAC 格式：大写字母和数字，以冒号分隔，如 CC:1B:E0:E3:CD:CC
      const macPattern = /^([0-9A-F]{2}:){5}[0-9A-F]{2}$/;
      if (!macPattern.test(mqttConfig.gateway)) {
        notify(this.$i18n.t('message.mqttGatewayMacInvalid'), this.$i18n.t('message.alert'), libEnum.messageType.WARNING);
        return;
      }
      
      // 构建完整配置，使用拼接后的 brokerUrl
      const connectConfig = {
        brokerUrl: brokerUrl,
        username: mqttConfig.username,
        password: mqttConfig.password,
        clientId: mqttConfig.clientId,
        gateway: mqttConfig.gateway,
        keepalive: mqttConfig.keepalive,
        cleanSession: mqttConfig.cleanSession
      };
      
      mqttModule.connect(connectConfig).then(function() {
        notify(self.$i18n.t('message.mqttConnectOk'), self.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
        // 开始接收 MQTT 数据（连接成功后自动接收）
        connectModule.startReceivingMqttConnectionState();
        notifyModule.startReceivingMqttNotification();
        scanModule.startReceivingMqttScanData();
        // 加载当前网关的连接列表
        connectModule.loadConnectedList();
      }).catch(function(err) {
        const errorMsg = err.message || JSON.stringify(err);
        notify(self.$i18n.t('message.mqttConnectFail') + ': ' + errorMsg, self.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
      });
    },
    disconnectMqtt() {
      const self = this;
      // 停止接收 MQTT 数据
      if (this.cache.isReceivingMqttScanData) {
        scanModule.stopReceivingMqttScanData();
      }
      connectModule.stopReceivingMqttConnectionState();
      notifyModule.stopReceivingMqttNotification();
      
      mqttModule.disconnect().then(function() {
        notify(self.$i18n.t('message.mqttDisconnectOk'), self.$i18n.t('message.alert'), libEnum.messageType.SUCCESS);
      });
    },
    toggleMqttScanDataReceiving() {
      if (this.cache.isReceivingMqttScanData) {
        scanModule.stopReceivingMqttScanData();
      } else {
        scanModule.startReceivingMqttScanData();
      }
    },
    stopApiScan() {
      const apiType = this.store.devConfDisplayVars.activeApiDebugMenuItem;
      const apiResult = this.cache.apiDebuggerResult[apiType];
      // 处理 MQTT 模式下的回调清理
      if (apiResult.mqttCallback) {
        if (apiType === libEnum.apiType.CONNECT_STATUS) {
          mqttModule.offConnectionState(apiResult.mqttCallback);
        }
        apiResult.mqttCallback = null;
        this.store.devConfDisplayVars.isApiScanning = false;
        notify(`${this.$i18n.t('message.alreadyStopScan')}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
        return;
      }
      // HTTP SSE 模式
      if (!apiResult.sse) return;
      apiResult.sse.close();
      apiResult.sse = null;
      this.store.devConfDisplayVars.isApiScanning = false;
      notify(`${this.$i18n.t('message.alreadyStopScan')}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
    },
    stopScan() {
      // 关闭HTTP SSE
      scanModule.stopScan();
      // 关闭MQTT扫描回调
      scanModule.stopReceivingMqttScanData();
      
      if (this.store.devConfDisplayVars.rssiChartSwitch) { // 如果当前开启了rssi图表，停止
        this.stopRssiChart();
      }
      this.store.devConfDisplayVars.isScanning = false;
    },
    // 获取url参数对象
    getUrlVars(queryStr) {
      if (!queryStr) return {};
      const paramArray = queryStr.split("&");
      const len = paramArray.length;
      const paramObj = {};
      let arr = [];
      for (let i = 0; i < len; i++) {
        arr = paramArray[i].split("=");
        if (arr[0] && arr[1]) paramObj[arr[0]] = arr[1];
      }
      return paramObj;
    },
    connectDeviceByRow(row, deviceMac) { // notify通过连接状态SSE通知
      const self = this;
      main.setObjProperty(this.cache.devicesConnectLoading, deviceMac, true);
      let params = {
        discovergatt: _.get(this.store.devConf, 'discovergatt') || '1', // 优选和普通方式都支持
        timeout: _.get(this.store.devConf, 'connTimeout') || 10, // 优选和普通方式都支持
        aps: _.get(this.store.devConf, 'aps') || '*', // 优选参数
        autoSelectionOn: _.get(this.store.devConf, 'autoSelectionOn') || 'off' // 辅助参数
      };

      // AC Auto Connect不支持BLE5
      if (this.store.devConf.autoSelectionOn === 'off') {
        if (!_.isEmpty(_.get(this.store.devConf, 'connPhy'))) {
          params.phy = _.get(this.store.devConf, 'connPhy').join(',');
        }

        if (!_.isEmpty(_.get(this.store.devConf, 'secondaryPhy'))) {
          params.secondary_phy = _.get(this.store.devConf, 'secondaryPhy').join(',');
        }
      }

      if (params.timeout < 0.2 || params.timeout > 20) params.timeout = 15; // timeout范围处理
      params.timeout = params.timeout * 1000;
      params.chip = this.store.devConf.connChip || this.store.devConf.chip;

      let otherParams = this.getUrlVars(_.get(this.store.devConf, 'connParams')); // 自定义输入，用户自己保证支持
      params = _.merge(params, otherParams);
      
      // 使用 transport 适配器，自动选择 HTTP 或 MQTT
      transportModule.connect(deviceMac, row.bdaddrType, params).then(function() {
        // notify(`连接设备 ${deviceMac} 成功`, '设备连接成功', libEnum.messageType.SUCCESS);
        _.remove(self.cache.scanResultList, { mac: deviceMac });
        const removedList = _.remove(self.cache.scanDisplayResultList, { mac: deviceMac }); // 连接成功从扫描列表中移除
        self.$refs.refScanDisplayResultGrid.remove([row]);
        self.$refs.refScanDisplayResultGrid.refreshData();
        self.$refs.refScanDisplayResultGrid.recalculate();
        self.$refs.refScanDisplayResultGrid.refreshScroll();
        if (removedList.length > 0) {
          dbModule.listAddOrUpdate(self.cache.connectedList, { mac: removedList[0].mac }, { // 连接成功移到连接列表
            mac: removedList[0].mac,
            name: removedList[0].name,
            bdaddrType: removedList[0].bdaddrType,
          });
        }
      }).catch(function(ex) {
        notify(self.$i18n.t('message.connectDeviceFail') + ': ' + deviceMac + ', ' + getErrorMessage(ex), self.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
      }).then(function() {
        main.setObjProperty(self.cache.devicesConnectLoading, deviceMac, false);
      });
    },
    disconnectDevice(deviceMac) {
      const self = this;
      // 使用 transport 适配器
      transportModule.disconnect(deviceMac).then(function() {
        const index = _.findIndex(self.cache.connectedList, { mac: deviceMac });
        if (index === -1) return;
        self.cache.connectedList.splice(index, 1); // 删除此设备
        const activeItem = self.cache.connectedList[index] || self.cache.connectedList[index - 1];
        const activeItemName = activeItem ? activeItem.mac : 'connectTab0';
        self.cache.currentConnectedTab = activeItemName;
        self.connectVuxTableForceResize();
        // CAUTION: 目前通过连接状态SSE发送通知，暂时不考虑SSE失败的情况
        // notify(`设备 ${deviceMac} 断开连接`, `操作成功`, libEnum.messageType.SUCCESS);
      }).catch(function(ex) {
        notify(self.$i18n.t('message.disconnectFail') + ': ' + deviceMac + ', ' + getErrorMessage(ex), self.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
      });
    },
    apiScanFilterNamesHandleClose(tag) {
      const filterName = this.store.devConfDisplayVars.apiDebuggerParams[libEnum.apiType.SCAN].filter_name;
      filterName.splice(filterName.indexOf(tag), 1);
    },
    apiScanFilterNamesShowInput() {
      this.store.devConfDisplayVars.apiScanFilterNamesInputVisible = true;
      this.$nextTick(_ => {
        this.$refs.apiScanFilterNamesSaveTagInput.$refs.input.focus();
      });
    },
    apiScanFilterNamesHandleInputConfirm() {
      let scanFilterNamesInputValue = this.store.devConfDisplayVars.apiScanFilterNamesInputValue;
      if (scanFilterNamesInputValue) {
        this.store.devConfDisplayVars.apiDebuggerParams[libEnum.apiType.SCAN].filter_name.push(scanFilterNamesInputValue);
      }
      this.store.devConfDisplayVars.apiScanFilterNamesInputVisible = false;
      this.store.devConfDisplayVars.apiScanFilterNamesInputValue = '';
    },

    apiScanFilterMacsHandleClose(tag) {
      const filterName = this.store.devConfDisplayVars.apiDebuggerParams[libEnum.apiType.SCAN].filter_mac;
      filterName.splice(filterName.indexOf(tag), 1);
    },
    apiScanFilterMacsShowInput() {
      this.store.devConfDisplayVars.apiScanFilterMacsInputVisible = true;
      this.$nextTick(_ => {
        this.$refs.apiScanFilterMacsSaveTagInput.$refs.input.focus();
      });
    },
    apiScanFilterMacsHandleInputConfirm() {
      let scanFilterMacsInputValue = this.store.devConfDisplayVars.apiScanFilterMacsInputValue;
      if (scanFilterMacsInputValue) {
        this.store.devConfDisplayVars.apiDebuggerParams[libEnum.apiType.SCAN].filter_mac.push(scanFilterMacsInputValue);
      }
      this.store.devConfDisplayVars.apiScanFilterMacsInputVisible = false;
      this.store.devConfDisplayVars.apiScanFilterMacsInputValue = '';
    },

    apiScanPhyHandleClose(tag) {
      const filterName = this.store.devConfDisplayVars.apiDebuggerParams[libEnum.apiType.SCAN].phy;
      filterName.splice(filterName.indexOf(tag), 1);
    },
    apiScanPhyShowInput() {
      this.store.devConfDisplayVars.apiScanPhyInputVisible = true;
      this.$nextTick(_ => {
        this.$refs.apiScanPhySaveTagInput.$refs.input.focus();
      });
    },
    apiScanPhyHandleInputConfirm() {
      let scanPhyInputValue = this.store.devConfDisplayVars.apiScanPhyInputValue;
      if (scanPhyInputValue) {
        this.store.devConfDisplayVars.apiDebuggerParams[libEnum.apiType.SCAN].phy.push(scanPhyInputValue);
      }
      this.store.devConfDisplayVars.apiScanPhyInputVisible = false;
      this.store.devConfDisplayVars.apiScanPhyInputValue = '';
    },

    scanFilterNamesHandleClose(tag) {
      this.store.devConf.filter_name.splice(this.store.devConf.filter_name.indexOf(tag), 1);
    },
    scanFilterNamesShowInput() {
      this.store.devConfDisplayVars.scanFilterNamesInputVisible = true;
      this.$nextTick(_ => {
        this.$refs.scanFilterNamesSaveTagInput.$refs.input.focus();
      });
    },
    scanFilterNamesHandleInputConfirm() {
      let scanFilterNamesInputValue = this.store.devConfDisplayVars.scanFilterNamesInputValue;
      if (scanFilterNamesInputValue) {
        this.store.devConf.filter_name.push(scanFilterNamesInputValue);
      }
      this.store.devConfDisplayVars.scanFilterNamesInputVisible = false;
      this.store.devConfDisplayVars.scanFilterNamesInputValue = '';
    },
    scanFilterMacsHandleClose(tag) {
      this.store.devConf.filter_mac.splice(this.store.devConf.filter_mac.indexOf(tag), 1);
    },
    scanFilterMacsShowInput() {
      this.store.devConfDisplayVars.scanFilterMacsInputVisible = true;
      this.$nextTick(_ => {
        this.$refs.scanFilterMacsSaveTagInput.$refs.input.focus();
      });
    },
    scanFilterMacsHandleInputConfirm() {
      let scanFilterMacsInputValue = this.store.devConfDisplayVars.scanFilterMacsInputValue;
      if (scanFilterMacsInputValue) {
        this.store.devConf.filter_mac.push(scanFilterMacsInputValue);
      }
      this.store.devConfDisplayVars.scanFilterMacsInputVisible = false;
      this.store.devConfDisplayVars.scanFilterMacsInputValue = '';
    },
    scanPhyHandleClose(tag) {
      this.store.devConf.phy.splice(this.store.devConf.phy.indexOf(tag), 1);
    },
    scanPhyShowInput() {
      this.store.devConfDisplayVars.scanPhyInputVisible = true;
      this.$nextTick(_ => {
        this.$refs.scanPhySaveTagInput.$refs.input.focus();
      });
    },
    scanPhyHandleInputConfirm() {
      let scanPhyInputValue = this.store.devConfDisplayVars.scanPhyInputValue;
      if (scanPhyInputValue) {
        this.store.devConf.phy.push(scanPhyInputValue);
      }
      this.store.devConfDisplayVars.scanPhyInputVisible = false;
      this.store.devConfDisplayVars.scanPhyInputValue = '';
    },
    acServerURIBlur() {
      let curUrl = `${window.location.protocol}//${window.location.host}`;
      if (curUrl !== this.store.devConf.acServerURI) {
        this.$alert(this.$i18n.t('message.configOrigin'), this.$i18n.t('message.alert'), {
          dangerouslyUseHTMLString: true,
          confirmButtonText: this.$i18n.t('message.ok'),
          callback: action => { }
        });
      }
      // 触发 token 获取
      this.fetchAcTokenOnBlur();
    },
    /**
     * AC 模式下，当 server/key/secret 输入框失焦时，尝试获取 token
     * 条件：AC 模式 + HTTP 传输 + 三字段均非空
     * 目的：避免输入过程中频繁获取 token 导致多次弹窗
     */
    fetchAcTokenOnBlur() {
      const devConf = this.store.devConf;
      
      // 仅 AC 模式需要获取 token
      if (devConf.controlStyle !== libEnum.controlStyle.AC) {
        return;
      }
      
      // MQTT 模式不需要 AC token
      if (devConf.transportType === libEnum.transportType.MQTT) {
        return;
      }
      
      // 三字段均需非空（trim 后判断）
      const acServerURI = (devConf.acServerURI || '').trim();
      const acDevKey = (devConf.acDevKey || '').trim();
      const acDevSecret = (devConf.acDevSecret || '').trim();
      
      if (!acServerURI || !acDevKey || !acDevSecret) {
        return;
      }
      
      // 构建 baseURI
      const baseURI = acServerURI + '/api';
      
      // 获取 token
      apiModule.getAccessToken(baseURI, acDevKey, acDevSecret).then((data) => {
        dbModule.getStorage().accessToken = data.access_token;
        logger.info('fetchAcTokenOnBlur: token obtained successfully');
        
        // 如果已选择了网关 MAC，获取网关信息更新 model
        if (devConf.mac) {
          apiModule.getAcGateway(data.access_token, devConf.mac).then(gatewayData => {
            this.cache.model = _.get(gatewayData, 'model') || '';
            dbModule.checkAndClearPhyParams(this.cache.model);
            console.log('fetchAcTokenOnBlur: cache update model by get gateway:', this.cache.model);
          }).catch(ex => {
            logger.warn('fetchAcTokenOnBlur: getAcGateway failed:', ex);
          });
        }
      }).catch(ex => {
        logger.warn('fetchAcTokenOnBlur: getAccessToken failed:', ex);
        notify(`${this.$i18n.t('message.getAccessTokenFail')}: ${getErrorMessage(ex)}`, 
               this.$i18n.t('message.operationFail'), 
               libEnum.messageType.ERROR);
      });
    }
  };
}

function scanDataList2RssiChartData(periodStartTime, periodEndTime, vue) {
  let series = [];
  const devConfDisplayVars = dbModule.getDevConfDisplayVars();
  devConfDisplayVars.rssiChartDataCount = devConfDisplayVars.rssiChartPeriod * 1000 / devConfDisplayVars.rssiChartDataSpan;
  let devicesCount = _.keys(dbModule.getCache().scanDevicesRssiHistory).length;
  _.forEach(dbModule.getCache().scanDevicesRssiHistory, (rssiHistory, deviceMac) => {
    let rssiData = new Array(devConfDisplayVars.rssiChartDataCount); // 每100毫秒时为一个时刻点
    _.remove(rssiHistory, rssiItem => { // 移除本周期之前的数据
      return rssiItem.time < periodStartTime;
    });
    _.forEach(rssiHistory, rssiItem => { // 填充到待渲染的数据里面
      if (rssiItem.time >= periodStartTime && rssiItem.time < periodEndTime) {
        let rssiDataIndex = parseInt((rssiItem.time - periodStartTime) / devConfDisplayVars.rssiChartDataSpan);
        rssiData[rssiDataIndex] = rssiItem.rssi;
      }
    });
    series.push({
      name: deviceMac,
      type: 'line',
      showSymbol: true,
      animation: false,
      symbol: 'circle',     //设定为实心点
      // symbolSize: 20,   //设定实心点的大小
      data: rssiData
    });
  });
  return series;
}

// 每5秒更新一次rssi chart, 移除不在本周期内的点，
function createRssiChartUpdateInterval(vue) {
  const devConfDisplayVars = dbModule.getDevConfDisplayVars();
  return setInterval(function (vue) {
    // if (!main.getGlobalVue().rssiChart) return logger.warn('no rssi chart');
    logger.info('update rssi chart by interval');
    let periodEndTime = Date.now();
    let periodStartTime = periodEndTime - devConfDisplayVars.rssiChartPeriod * 1000;
    let seriesData = scanDataList2RssiChartData(periodStartTime, periodEndTime, vue);
    vue.chartOptions.series.splice(0);
    vue.chartOptions.series.splice(0, seriesData.length, ...seriesData);
  }, devConfDisplayVars.rssiChartDataSpan, vue);
}

function createWatch() {
  return {
    'store.devConfDisplayVars.isConfigMenuItemOpen': function (val, oldVal) {
      this.scanVuxTableForceResize();
      this.notifyVuxTableForceResize();
      this.connectVuxTableForceResize();
      this.apiLogVuxTableForceResize();
    },
    'cache.apiDebuggerResult.scanCodeCurl': function (val, oldVal) {
      initHighlightingRefresh();
    },
    'store.devConf': { // 配置变化，重新加载初始化操作，停止扫描
      handler: function (val, oldVal) {
        dbModule.saveDevConf(val);
      },
      deep: true
    },
    'store.devConfDisplayVars.toolsBinaryConversion.type': {
      handler: function (val, oldVal) {
        if (this.store.devConfDisplayVars.toolsBinaryConversion.value) {
          let value = parseInt(this.store.devConfDisplayVars.toolsBinaryConversion.value, oldVal);
          this.store.devConfDisplayVars.toolsBinaryConversion.value = value.toString(val);
        }
      }
    },
    'store.devConfDisplayVars.toolsHexTextConversion.type': {
      handler: function (val, oldVal) {
        let value = this.store.devConfDisplayVars.toolsHexTextConversion.value;
        if (oldVal === 'hex') this.store.devConfDisplayVars.toolsHexTextConversion.value = Buffer.from(value, 'hex').toString();
        else this.store.devConfDisplayVars.toolsHexTextConversion.value = Buffer.from(value).toString('hex');
      }
    },
    'store.devConfDisplayVars.toolsBase64.type': {
      handler: function (val, oldVal) {
        let value = this.store.devConfDisplayVars.toolsBase64.value;
        if (oldVal === 'base64') this.store.devConfDisplayVars.toolsBase64.value = Buffer.from(value, 'base64').toString();
        else this.store.devConfDisplayVars.toolsBase64.value = Buffer.from(value).toString('base64');
      }
    },
    'store.devConfDisplayVars.toolsJsonConversion.inline': {
      handler: function (val, oldVal) {
        if (!val || val.length === 0) {
          this.store.devConfDisplayVars.toolsJsonConversion.format = '';
          return;
        }
        try {
          this.store.devConfDisplayVars.toolsJsonConversion.format = JSON.stringify(JSON.parse(val), null, 2);
        } catch (ex) {
          this.store.devConfDisplayVars.toolsJsonConversion.format = `${ex}\n${val}`;
        }
      }
    },
    'cache.apiDebuggerResult': {
      handler: function (val, oldVal) {
        this.scrollDebugResultToBottom();
      },
      deep: true
    }
  };
}

function createComputed() {
  return {
    // Gateway MAC 格式校验：当输入长度达到完整 MAC 长度但格式不正确时显示错误
    gatewayMacError: function() {
      const gateway = this.store.devConf.mqtt.gateway;
      if (!gateway) return false; // 空值不显示错误
      // 完整 MAC 地址长度为 17 (如 CC:1B:E0:E2:8F:2C)
      // 只有当输入长度 >= 17 时才验证格式，避免输入过程中一直显示错误
      if (gateway.length < 17) return false;
      const macPattern = /^([0-9A-F]{2}:){5}[0-9A-F]{2}$/;
      return !macPattern.test(gateway);
    },
    mqttConnected: function() {
      return this.cache.mqtt && this.cache.mqtt.status === libEnum.mqttStatus.CONNECTED;
    },
    mqttError: function() {
      return this.cache.mqtt && this.cache.mqtt.status === libEnum.mqttStatus.ERROR;
    },
    mqttStatusTagType: function() {
      const status = this.cache.mqtt ? this.cache.mqtt.status : libEnum.mqttStatus.DISCONNECTED;
      switch (status) {
        case libEnum.mqttStatus.CONNECTED:
          return 'success';
        case libEnum.mqttStatus.CONNECTING:
        case libEnum.mqttStatus.RECONNECTING:
          return 'warning';
        case libEnum.mqttStatus.ERROR:
          return 'danger';
        default:
          return 'info';
      }
    },
    mqttStatusText: function() {
      const status = this.cache.mqtt ? this.cache.mqtt.status : libEnum.mqttStatus.DISCONNECTED;
      switch (status) {
        case libEnum.mqttStatus.CONNECTED:
          return this.$i18n.t('message.mqttConnected');
        case libEnum.mqttStatus.CONNECTING:
          return this.$i18n.t('message.mqttConnecting');
        case libEnum.mqttStatus.RECONNECTING:
          return this.$i18n.t('message.mqttReconnecting');
        case libEnum.mqttStatus.ERROR:
          return this.$i18n.t('message.mqttError');
        default:
          return this.$i18n.t('message.mqttDisconnected');
      }
    },
    mqttLastHeartbeatText: function() {
      return mqttModule.formatLastHeartbeat();
    },
    mqttUptimeText: function() {
      const uptime = this.cache.mqtt && this.cache.mqtt.gatewayInfo ? this.cache.mqtt.gatewayInfo.uptime : 0;
      if (!uptime) return '-';
      const days = Math.floor(uptime / 86400);
      const hours = Math.floor((uptime % 86400) / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      if (days > 0) return days + 'd ' + hours + 'h ' + minutes + 'm';
      if (hours > 0) return hours + 'h ' + minutes + 'm';
      return minutes + 'm';
    },
    mqttStatusDotClass: function() {
      const status = this.cache.mqtt ? this.cache.mqtt.status : libEnum.mqttStatus.DISCONNECTED;
      switch (status) {
        case libEnum.mqttStatus.CONNECTED:
          return 'mqtt-status-dot mqtt-status-connected';
        case libEnum.mqttStatus.CONNECTING:
        case libEnum.mqttStatus.RECONNECTING:
          return 'mqtt-status-dot mqtt-status-connecting';
        case libEnum.mqttStatus.ERROR:
          return 'mqtt-status-dot mqtt-status-error';
        default:
          return 'mqtt-status-dot mqtt-status-disconnected';
      }
    },
    // 判断是否正在连接中（用于按钮 loading 状态）
    mqttConnecting: function() {
      const status = this.cache.mqtt ? this.cache.mqtt.status : libEnum.mqttStatus.DISCONNECTED;
      return status === libEnum.mqttStatus.CONNECTING || status === libEnum.mqttStatus.RECONNECTING;
    },
    // Connect 按钮类型（根据状态显示不同颜色）
    mqttConnectButtonType: function() {
      const status = this.cache.mqtt ? this.cache.mqtt.status : libEnum.mqttStatus.DISCONNECTED;
      switch (status) {
        case libEnum.mqttStatus.ERROR:
          return 'danger';  // 错误时显示红色按钮
        case libEnum.mqttStatus.CONNECTING:
        case libEnum.mqttStatus.RECONNECTING:
          return 'warning';  // 连接中显示橙色按钮
        default:
          return 'primary';  // 默认蓝色按钮
      }
    },
    // Connect 按钮内圆点的 CSS 类（未连接不显示，其他状态显示对应颜色）
    mqttConnectButtonDotClass: function() {
      const status = this.cache.mqtt ? this.cache.mqtt.status : libEnum.mqttStatus.DISCONNECTED;
      switch (status) {
        case libEnum.mqttStatus.CONNECTED:
          return 'mqtt-btn-dot mqtt-btn-dot-connected';
        case libEnum.mqttStatus.CONNECTING:
        case libEnum.mqttStatus.RECONNECTING:
          return 'mqtt-btn-dot mqtt-btn-dot-connecting';
        case libEnum.mqttStatus.ERROR:
          return 'mqtt-btn-dot mqtt-btn-dot-error';
        default:
          return '';  // 未连接不显示圆点
      }
    },
    mqttBrokerUrl: function() {
      const mqtt = this.store.devConf.mqtt;
      const protocol = mqtt.protocol || 'ws';
      const server = mqtt.server || 'broker.emqx.io';
      const port = mqtt.port || '8083';
      let path = mqtt.path || 'mqtt';
      if (!server) return '';
      // 构建 URL，如果有 path 则添加（去掉用户可能输入的前导斜杠）
      let url = protocol + '://' + server + ':' + port;
      if (path) {
        path = path.replace(/^\/+/, ''); // 去掉前导斜杠
        url += '/' + path;
      }
      return url;
    },
    // API Debugger 中显示的 Router/Gateway 地址（可编辑，直接复用现有配置字段）
    apiDebuggerRouter: {
      get: function() {
        // MQTT 模式
        if (this.store.devConf.transportType === 'MQTT') {
          return this.store.devConf.mqtt.gateway;
        }
        // HTTP 模式
        if (this.store.devConf.controlStyle === 'AP') {
          return this.store.devConf.apServerURI;
        }
        return this.store.devConf.mac;
      },
      set: function(value) {
        // MQTT 模式
        if (this.store.devConf.transportType === 'MQTT') {
          this.store.devConf.mqtt.gateway = value;
        } else if (this.store.devConf.controlStyle === 'AP') {
          // HTTP AP 模式
          this.store.devConf.apServerURI = value;
        } else {
          // HTTP AC 模式
          this.store.devConf.mac = value;
        }
      }
    },
    getComputedNotifyDisplayResultList() { // 全局搜索扫描列表
      const filterName = XEUtils.toString(this.cache.notifyDisplayFilterContent).trim().toLowerCase();
      if (filterName) {
        const filterRE = new RegExp(filterName, 'gi');
        const searchProps = ['mac', 'name'];
        const rest = this.cache.notifyDisplayResultList.filter(item => searchProps.some(key => XEUtils.toString(item[key]).toLowerCase().indexOf(filterName) > -1));
        return rest.map(row => {
          const item = Object.assign({}, row);
          searchProps.forEach(key => {
            item[key] = XEUtils.toString(item[key]).replace(filterRE, match => `<span class="keyword-lighten">${match}</span>`);
          });
          return item;
        })
      }
      return this.cache.notifyDisplayResultList;
    },
    getComputedScanDisplayResultList() { // 全局搜索扫描列表
      const filterName = XEUtils.toString(this.cache.scanDisplayFilterContent).trim().toLowerCase();
      if (filterName) {
        const filterRE = new RegExp(filterName, 'gi');
        const searchProps = ['mac', 'name'];
        const rest = this.cache.scanDisplayResultList.filter(item => {
          return searchProps.some(key => {
            return XEUtils.toString(item[key]).toLowerCase().indexOf(filterName) > -1;
          });
        });
        return rest.map(row => {
          const item = Object.assign({}, row);
          searchProps.forEach(key => {
            // item[key] = XEUtils.toString(item[key]).replace(filterRE, match => `<span class="keyword-lighten">${match}</span>`)
          });
          return item;
        });
      }
      return this.cache.scanDisplayResultList
    }
  };
}

// 定时从扫描结果池中取出指定数量结果更新到界面上
function createScanResultConsumerTimer() {
  setInterval(function () {
    const pageCount = 20;
    let pageList = dbModule.getCache().scanResultList.splice(0, pageCount);
    if (!pageList || pageList.length <= 0) return;
    _.forEach(pageList, item => {
      let result = _.find(dbModule.getCache().scanDisplayResultList, { mac: item.mac });
      if (!result) {
        dbModule.getCache().scanDisplayResultList.push(item);
      } else {
        result.rssi = item.rssi;
        if (result.name === '(unknown)') {
          result.name = item.name;
        }
      }
    });
  }, 500);
}

// 定时从设备通知列表池中取出指定数量结果更新到界面上
function createNotifyResultConsumerTimer() {
  setInterval(function () {
    const pageCount = 20;
    let pageList = dbModule.getCache().notifyResultList.splice(0, pageCount);
    if (!pageList || pageList.length <= 0) return;
    let index = dbModule.getCache().notifyDisplayResultList.length;
    dbModule.getCache().notifyDisplayResultList.splice(index, pageList.length, ...pageList);
  }, 500);
}

function createVue() {
  createScanResultConsumerTimer();
  createNotifyResultConsumerTimer();
  return {
    data: createVueData(),
    computed: createComputed(),
    methods: createVueMethods(),
    watch: createWatch(),
    beforeCreate() {
      dbModule.loadStorage();
    },
    mounted: function () {
      const self = this;
      this.store.devConfDisplayVars.language = this.$i18n.locale;
      this.cache.clientHeight = document.documentElement.clientHeight;
      this.cache.vxeGridHeight = this.cache.clientHeight - 240;
      window.onresize = () => {
        this.cache.clientHeight = `${document.documentElement.clientHeight}`;
        this.cache.vxeGridHeight = this.cache.clientHeight - 240;
      };
      
      // 设置保存错误回调，当 AC token 获取失败时提示用户（配置仍会保存）
      dbModule.setOnSaveError(function(errorMsg) {
        notify(self.$i18n.t('message.configSavedButTokenFailed') || 'Config saved, but AC token fetch failed: ' + errorMsg, 
               self.$i18n.t('message.alert'), 
               libEnum.messageType.WARNING);
      });
      
      // 页面关闭前立即保存配置，避免防抖导致的配置丢失
      window.addEventListener('beforeunload', function() {
        dbModule.saveDevConfImmediately();
      });
      
      // 只在 HTTP 模式下显示 CORS 配置提示
      if (transportModule.isHttpMode()) {
        this.$alert(this.$i18n.t('message.configOrigin'), this.$i18n.t('message.alert'), {
          dangerouslyUseHTMLString: true,
          confirmButtonText: this.$i18n.t('message.ok'),
          callback: action => {}
        });
      }
    }
  };
}

export default {
  notify,
  createVue,
  message
}
