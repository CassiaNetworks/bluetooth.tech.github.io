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
          notify(`${this.$i18n.t('message.getAcRouterListFail')} ${ex}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
        }).finally(() => {
          this.cache.isGettingAcRouterList = false;
        });
    },
    getAcRouterList(keyword) {
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
        }).catch(ex => {
          notify(`${this.$i18n.t('message.getAcRouterListFail')} ${ex}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
        }).finally(() => {
          this.cache.isGettingAcRouterList = false;
        });
    },
    replayApi(row) {
      apiModule.replayApi(row.apiContent).then((data) => {
        notify(`${this.$i18n.t('message.replayApiOk')}: ${JSON.stringify(data)}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
      }).catch(ex => {
        notify(`${this.$i18n.t('message.replayApiFail')} ${ex}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
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
      apiModule.infoByDevConf(this.store.devConf).then(() => {
        notify(this.$i18n.t('message.getApInfoOk'), this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
      }).catch(ex => {
        notify(`${this.$i18n.t('message.getApInfoFail')} ${ex}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
      });
    },
    reboot() {
      if (this.store.devConf.controlStyle === libEnum.controlStyle.AP) {
        return notify(this.$i18n.t('message.noSupportByAp'), this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
      }
      apiModule.rebootByDevConf(this.store.devConf).then(() => {
        notify(this.$i18n.t('message.rebootApOk'), this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
      }).catch(ex => {
        notify(`${this.$i18n.t('message.rebootApFail')} ${ex}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
      });
    },
    unpair(deviceMac) {
      apiModule.unpairByDevConf(this.store.devConf, deviceMac).then(() => {
        notify(`${this.$i18n.t('message.unpairOk')} ${deviceMac}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
      }).catch(ex => {
        notify(`${this.$i18n.t('message.unpairFail')} ${deviceMac} ${ex}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
      });
    },
    pairByLegacyOOB() {
      const deviceMac = this.store.devConfDisplayVars.pairByLegacyOOB.deviceMac;
      const tk = this.store.devConfDisplayVars.pairByLegacyOOB.tk;
      apiModule.pairByLegacyOOBByDevConf(this.store.devConf, deviceMac, tk).then(() => {
        notify(`${this.$i18n.t('message.pairOk')} ${deviceMac}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
        this.store.devConfDisplayVars.pairByPasskey.visible = false;
      }).catch(ex => {
        notify(`${this.$i18n.t('message.pairFail')} ${deviceMac} ${ex}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
      });
    },
    pairBySecurityOOB() {
      const deviceMac = this.store.devConfDisplayVars.pairBySecurityOOB.deviceMac;
      const rand = this.store.devConfDisplayVars.pairBySecurityOOB.rand;
      const confirm = this.store.devConfDisplayVars.pairBySecurityOOB.confirm;
      apiModule.pairBySecurityOOBByDevConf(this.store.devConf, deviceMac, rand, confirm).then(() => {
        notify(`${this.$i18n.t('message.pairOk')} ${deviceMac}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
        this.store.devConfDisplayVars.pairByPasskey.visible = false;
      }).catch(ex => {
        notify(`${this.$i18n.t('message.pairFail')} ${deviceMac} ${ex}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
      });
    },
    pairByPasskey() {
      const deviceMac = this.store.devConfDisplayVars.pairByPasskey.deviceMac;
      const passkey = this.store.devConfDisplayVars.pairByPasskey.passkey;
      apiModule.pairByPasskeyByDevConf(this.store.devConf, deviceMac, passkey).then(() => {
        notify(`${this.$i18n.t('message.pairOk')} ${deviceMac}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
        this.store.devConfDisplayVars.pairByPasskey.visible = false;
      }).catch(ex => {
        notify(`${this.$i18n.t('message.pairFail')} ${deviceMac} ${ex}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
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

      apiModule.updatePhyByDevConf(this.store.devConf, deviceMac, bodyParam).then((rawBody) => {
        notify(rawBody, `${this.$i18n.t('message.updatePhyOK')}`, libEnum.messageType.SUCCESS);
      }).catch(function (ex) {
        notify(`${this.$i18n.t('message.updatePhyFail')}: ${deviceMac}, ${ex}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
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
      apiModule.pairByDevConf(this.store.devConf, deviceMac, bodyParam).then((x) => {
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
          apiModule.pairByNumbericComparisonByDevConf(this.store.devConf, deviceMac, x.display).then(() => {
            notify(`${this.$i18n.t('message.pairOk')} ${deviceMac}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
          }).catch(ex => {
            notify(`${this.$i18n.t('message.pairFail')} ${deviceMac} ${ex}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
          });
        }
      }).finally(() => {
        this.store.devConfDisplayVars.pair.visible = false;
      });
    },
    disconnectAll() { // 断连所有
      let all = _.map(this.cache.connectedList, item => {
        apiModule.disconnectByDevConf(this.store.devConf, item.mac).catch(ex => {
          notify(`${this.$i18n.t('message.disconnectFail')} ${item.mac} ${ex}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
        });
      });
      Promise.all(all).catch(ex => {
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
      const scanParams = this.store.devConfDisplayVars.apiDemoParams.scanConnectWriteNotify.scan;
      let sse = apiModule.startScanByUserParams(this.store.devConf, scanParams.chip, scanParams.filter_mac, scanParams.phy, scanParams.filter_name, scanParams.filter_rssi, '', () => {
        notify(`${this.$i18n.t('message.testScanOk')}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
        sse.close();
      }, (error) => {
        notify(`${this.$i18n.t('message.testScanFail')}: ${error}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
      });
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
      const writeParams = this.store.devConfDisplayVars.apiDemoParams.connectWriteNotify.write;
      const connectParams = this.store.devConfDisplayVars.apiDemoParams.connectWriteNotify.connect;
      apiModule.writeByHandleByDevConf(this.store.devConf, connectParams.deviceMac, writeParams.handle, writeParams.value, writeParams.noresponse).then(() => {
        notify(`${this.$i18n.t('message.testWriteOk')}: ${connectParams.deviceMac}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
      }).catch(ex => {
        notify(`${this.$i18n.t('message.testWriteFail')}: ${connectParams.deviceMac}, ${ex}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
      });
    },
    apiDemoConnectTest() {
      const connectParams = this.store.devConfDisplayVars.apiDemoParams.connectWriteNotify.connect;
      apiModule.connectByDevConf(this.store.devConf, connectParams.deviceMac, connectParams.addrType, connectParams.chip).then(() => {
        notify(`${main.getGlobalVue().$i18n.t('message.connectDeviceOk')}`, `${main.getGlobalVue().$i18n.t('message.operationOk')}`, libEnum.messageType.SUCCESS);
      }).catch(ex => {
        notify(`${this.$i18n.t('message.testConnectFail')}: ${connectParams.deviceMac}, ${ex}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
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
      const filterName = XEUtils.toString(this.cache.apiLogDisplayFilterContent).trim().toLowerCase();
      if (filterName) {
        const filterRE = new RegExp(filterName, 'gi');
        const searchProps = ['apiName', 'method', 'url', 'data'];
        const rest = this.cache.apiLogResultList.filter(item => {
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
      return this.cache.apiLogResultList;
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
      const apiResult = this.cache.apiDebuggerResult[apiType];
      if (apiType === libEnum.apiType.AUTH) {
        apiModule.getAccessToken(this.store.devConf.baseURI, this.store.devConf.acDevKey, this.store.devConf.acDevSecret).then((data) => {
          apiResult.resultList.push(`${new Date().toISOString()}: ${this.$i18n.t('message.getAccessTokenOk')}, ${JSON.stringify(apiParams)}, ${JSON.stringify(data)}`);
          notify(`${this.$i18n.t('message.getAccessTokenOk')}: ${data.access_token}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
        }).catch(ex => {
          notify(`${this.$i18n.t('message.getAccessTokenFail')}: ${ex}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
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
          discovergatt: _.get(apiParams, 'discovergatt') || 1,
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

        apiModule.connectByDevConf(this.store.devConf, apiParams.deviceMac, apiParams.addrType, apiParams.chip, params).then(() => {
          // notify(`连接设备 ${deviceMac} 成功`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
          apiResult.resultList.push(`${new Date().toISOString()}: ${this.$i18n.t('message.connectDeviceOk')}, ${JSON.stringify(apiParams)}`);
        }).catch(ex => {
          notify(`${this.$i18n.t('message.connectDeviceFail')}: ${apiParams.deviceMac}, ${ex}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
          apiResult.resultList.push(`${new Date().toISOString()}: ${this.$i18n.t('message.connectDeviceFail')}, ${JSON.stringify({ apiParams, ex })}`);
        });
      } else if (apiType === libEnum.apiType.READ) {
        apiModule.readByHandleByDevConf(this.store.devConf, apiParams.deviceMac, apiParams.handle).then((body) => {
          notify(`${this.$i18n.t('message.readDataOk')}: ${apiParams.deviceMac}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
          apiResult.resultList.push(`${new Date().toISOString()}: ${this.$i18n.t('message.readDataOk')}, ${JSON.stringify(body)}`);
        }).catch(ex => {
          notify(`${this.$i18n.t('message.readDataFail')}: ${apiParams.deviceMac}, ${ex}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
          apiResult.resultList.push(`${new Date().toISOString()}: ${this.$i18n.t('message.readDataFail')}, ${JSON.stringify({ apiParams, ex })}`);
        });
      } else if (apiType === libEnum.apiType.READ_PHY) {
        apiModule.readPhyByDevConf(this.store.devConf, apiParams.deviceMac).then((body) => {
          notify(`${this.$i18n.t('message.readPhyOK')}: ${apiParams.deviceMac}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
          apiResult.resultList.push(`${new Date().toISOString()}: ${this.$i18n.t('message.readPhyOK')}, ${JSON.stringify(body)}`);
        }).catch(ex => {
          notify(`${this.$i18n.t('message.readPhyFail')}: ${apiParams.deviceMac}, ${ex}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
          apiResult.resultList.push(`${new Date().toISOString()}: ${this.$i18n.t('message.readPhyFail')}, ${JSON.stringify({ apiParams, ex })}`);
        });
      } else if (apiType === libEnum.apiType.UPDATE_PHY) {
        let bodyParam = {
          tx: apiParams.tx.join(','),
          rx: apiParams.rx.join(','),
        };

        if (bodyParam.tx.includes('CODED')) {
          bodyParam.coded_option = apiParams.codedOption;
        }
        
        apiModule.updatePhyByDevConf(this.store.devConf, apiParams.deviceMac, bodyParam).then((body) => {
          notify(`${this.$i18n.t('message.updatePhyOK')}: ${apiParams.deviceMac}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
          apiResult.resultList.push(`${new Date().toISOString()}: ${this.$i18n.t('message.updatePhyOK')}, ${JSON.stringify(bodyParam)}, ${JSON.stringify(body)}`);
        }).catch(ex => {
          notify(`${this.$i18n.t('message.updatePhyFail')}: ${apiParams.deviceMac}, ${ex}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
          apiResult.resultList.push(`${new Date().toISOString()}: ${this.$i18n.t('message.updatePhyFail')}, ${JSON.stringify(bodyParam)}, ${JSON.stringify({ ex })}`);
        });
      } else if (apiType === libEnum.apiType.WRITE) {
        apiModule.writeByHandleByDevConf(this.store.devConf, apiParams.deviceMac, apiParams.handle, apiParams.value, apiParams.noresponse).then(() => {
          notify(`${this.$i18n.t('message.writeDataOk')}: ${apiParams.deviceMac}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
          apiResult.resultList.push(`${new Date().toISOString()}: ${this.$i18n.t('message.writeDataOk')}, ${JSON.stringify(apiParams)}`);
        }).catch(ex => {
          notify(`${this.$i18n.t('message.writeDataFail')}: ${apiParams.deviceMac}, ${ex}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
          apiResult.resultList.push(`${new Date().toISOString()}: ${this.$i18n.t('message.writeDataFail')}, ${JSON.stringify({ apiParams, ex })}`);
        });
      } else if (apiType === libEnum.apiType.DISCONNECT) {
        apiModule.disconnectByDevConf(this.store.devConf, apiParams.deviceMac).then(() => {
          notify(`${this.$i18n.t('message.disconnectDeviceOk')}: ${apiParams.deviceMac}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
          apiResult.resultList.push(`${new Date().toISOString()}: ${this.$i18n.t('message.disconnectDeviceOk')}, ${JSON.stringify(apiParams)}`);
        }).catch(ex => {
          notify(`${this.$i18n.t('message.disconnectDeviceFail')}: ${apiParams.deviceMac}, ${ex}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
          apiResult.resultList.push(`${new Date().toISOString()}: ${this.$i18n.t('message.disconnectDeviceFail')}, ${JSON.stringify({ apiParams, ex })}`);
        });
      } else if (apiType === libEnum.apiType.CONNECT_LIST) {
        apiModule.getConnectedListByDevConf(this.store.devConf).then((data) => {
          notify(`${this.$i18n.t('message.getConnectListOk')}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
          apiResult.resultList.push(`${new Date().toISOString()}: ${this.$i18n.t('message.getConnectListOk')}, ${JSON.stringify(data)}`);
        }).catch(ex => {
          notify(`${this.$i18n.t('message.getConnectListFail')}: ${ex}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
          apiResult.resultList.push(`${new Date().toISOString()}: ${this.$i18n.t('message.getConnectListFail')}, ${JSON.stringify({ ex })}`);
        });
      } else if (apiType === libEnum.apiType.DISCOVER) {
        apiModule.getDeviceServiceListByDevConf(this.store.devConf, apiParams.deviceMac).then((data) => {
          notify(`${this.$i18n.t('message.getDeviceServiceListOk')}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
          apiResult.resultList.push(`${new Date().toISOString()}: ${this.$i18n.t('message.getDeviceServiceListOk')}, ${JSON.stringify(data)}`);
        }).catch(ex => {
          notify(`${this.$i18n.t('message.getDeviceServiceListFail')}: ${ex}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
          apiResult.resultList.push(`${new Date().toISOString()}: ${this.$i18n.t('message.getDeviceServiceListFail')}, ${JSON.stringify({ ex })}`);
        });
      } else if (apiType === libEnum.apiType.NOTIFY) {
        apiResult.sse = apiModule.startNotifyByDevConf(this.store.devConf, (message) => {
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
        apiResult.sse = apiModule.openConnectStatusSseByDevConf(this.store.devConf, (message) => {
          this.cache.apiDebuggerResult[libEnum.apiType.CONNECT_STATUS].resultList.push(`${new Date().toISOString()}: ${message.data}`);
        }, err => {
          notify(`${this.$i18n.t('message.openConnectStatusFail')}`, this.$i18n.t('message.operationFail'), libEnum.messageType.SUCCESS);
          this.cache.apiDebuggerResult[libEnum.apiType.CONNECT_STATUS].resultList.push(`${new Date().toISOString()}: ${JSON.stringify(err)}`);
        });
        notify(`${this.$i18n.t('message.openConnectStatusOk')}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
      } else if (apiType === libEnum.apiType.PAIR) {
        apiModule.pairByDevConf(this.store.devConf, apiParams.deviceMac, {}).then((data) => {
          notify(`${this.$i18n.t('message.pairOk')}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
          apiResult.resultList.push(`${new Date().toISOString()}: ${this.$i18n.t('message.pairOk')}, ${JSON.stringify(data)}`);
        }).catch(ex => {
          notify(`${this.$i18n.t('message.pairFail')}: ${ex}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
          apiResult.resultList.push(`${new Date().toISOString()}: ${this.$i18n.t('message.pairFail')}, ${JSON.stringify({ ex })}`);
        });
      } else if (apiType === libEnum.apiType.PAIR_INPUT) {
        if (apiParams.inputType === 'Passkey') {
          apiModule.pairByPasskeyByDevConf(this.store.devConf, apiParams.deviceMac, apiParams.passkey).then((data) => {
            notify(`${this.$i18n.t('message.pairOk')}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
            apiResult.resultList.push(`${new Date().toISOString()}: ${this.$i18n.t('message.pairOk')}, ${JSON.stringify(data)}`);
          }).catch(ex => {
            notify(`${this.$i18n.t('message.pairFail')}: ${ex}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
            apiResult.resultList.push(`${new Date().toISOString()}: ${this.$i18n.t('message.pairFail')}, ${JSON.stringify({ ex })}`);
          });
        } else if (apiParams.inputType === 'LegacyOOB') {
          apiModule.pairByLegacyOOBByDevConf(this.store.devConf, apiParams.deviceMac, tk).then((data) => {
            notify(`${this.$i18n.t('message.pairOk')}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
            apiResult.resultList.push(`${new Date().toISOString()}: ${this.$i18n.t('message.pairOk')}, ${JSON.stringify(data)}`);
          }).catch(ex => {
            notify(`${this.$i18n.t('message.pairFail')}: ${ex}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
            apiResult.resultList.push(`${new Date().toISOString()}: ${this.$i18n.t('message.pairFail')}, ${JSON.stringify({ ex })}`);
          });
        } else if (apiParams.inputType === 'LegacyOOB') {
          apiModule.pairByLegacyOOBByDevConf(this.store.devConf, apiParams.deviceMac, tk).then((data) => {
            notify(`${this.$i18n.t('message.pairOk')}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
            apiResult.resultList.push(`${new Date().toISOString()}: ${this.$i18n.t('message.pairOk')}, ${JSON.stringify(data)}`);
          }).catch(ex => {
            notify(`${this.$i18n.t('message.pairFail')}: ${ex}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
            apiResult.resultList.push(`${new Date().toISOString()}: ${this.$i18n.t('message.pairFail')}, ${JSON.stringify({ ex })}`);
          });
        }
      } else if (apiType === libEnum.apiType.UNPAIR) {
        apiModule.unpairByDevConf(this.store.devConf, apiParams.deviceMac).then((data) => {
          notify(`${this.$i18n.t('message.unpairOk')}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
          apiResult.resultList.push(`${new Date().toISOString()}: ${this.$i18n.t('message.unpairOk')}, ${JSON.stringify(data)}`);
        }).catch(ex => {
          notify(`${this.$i18n.t('message.unpairFail')}: ${ex}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
          apiResult.resultList.push(`${new Date().toISOString()}: ${this.$i18n.t('message.unpairFail')}, ${JSON.stringify({ ex })}`);
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
    clearNotify() {
      this.cache.notifyResultList.splice(0);
      this.cache.notifyDisplayResultList.splice(0);
      notify(`${this.$i18n.t('message.clearNotifyOk')}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
    },
    openNotify() {
      notifyModule.openNotifySse();
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
      if (apiType === libEnum.apiType.AUTH) { // auth base64
        apiParams.base64 = Buffer.from(`${this.store.devConf.acDevKey}:${this.store.devConf.acDevSecret}`).toString('base64');
      }
      apiResult.code[libEnum.codeType.CURL] = codeModule.genCode(apiType, libEnum.codeType.CURL, apiParams);
      apiResult.code[libEnum.codeType.NODEJS] = codeModule.genCode(apiType, libEnum.codeType.NODEJS, apiParams);
      this.store.devConfDisplayVars.activeApiDebugOutputMenuItem = libEnum.codeType.CURL;
      this.$refs.apiDebuggerOutputMenu.activeIndex = libEnum.codeType.CURL;
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
        connectModule.loadConnectedList();
        connectModule.reopenConnectStatusSse();
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
    },
    readDevicePhy(deviceMac) {
      apiModule.readPhyByDevConf(this.store.devConf, deviceMac).then((rawBody) => {
        notify(rawBody, `${this.$i18n.t('message.readPhyOK')}`, libEnum.messageType.SUCCESS);
      }).catch(function (ex) {
        notify(`${this.$i18n.t('message.readPhyFail')}: ${deviceMac}, ${ex}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
      });
    },
    getDeviceServices(deviceMac) {
      serviceModule.getDeviceServiceList(deviceMac).then(() => {
        this.cache.currentConnectedTab = deviceMac; // 点击服务激活此设备tab页面
      }).catch(ex => {
        notify(`${this.$i18n.t('message.getDeviceServiceListFail')}: ${JSON.stringify(ex)}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
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
    stopApiScan() {
      const apiType = this.store.devConfDisplayVars.activeApiDebugMenuItem;
      const apiResult = this.cache.apiDebuggerResult[apiType];
      if (!apiResult.sse) return;
      apiResult.sse.close();
      apiResult.sse = null;
      this.store.devConfDisplayVars.isApiScanning = false;
      notify(`${this.$i18n.t('message.alreadyStopScan')}`, this.$i18n.t('message.operationOk'), libEnum.messageType.SUCCESS);
    },
    stopScan() {
      scanModule.stopScan();
      if (this.store.devConfDisplayVars.rssiChartSwitch) { // 如果当前开启了rssi图表，停止
        this.stopRssiChart();
      }
      this.store.devConfDisplayVars.isScanning = false;
    },
    // 获取url参数对象
    getUrlVars(queryStr) {
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
    },
    connectDeviceByRow(row, deviceMac) { // notify通过连接状态SSE通知
      main.setObjProperty(this.cache.devicesConnectLoading, deviceMac, true);
      let params = {
        discovergatt: _.get(this.store.devConf, 'discovergatt') || 1, // 优选和普通方式都支持
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

      let otherParams = this.getUrlVars(_.get(this.store.devConf, 'connParams')); // 自定义输入，用户自己保证支持
      params = _.merge(params, otherParams);
      apiModule.connectByDevConf(this.store.devConf, deviceMac, null, this.store.devConf.connChip || this.store.devConf.chip, params).then(() => {
        // notify(`连接设备 ${deviceMac} 成功`, '设备连接成功', libEnum.messageType.SUCCESS);
        _.remove(this.cache.scanResultList, { mac: deviceMac });
        let removedList = _.remove(this.cache.scanDisplayResultList, { mac: deviceMac }); // 连接成功从扫描列表中移除
        this.$refs.refScanDisplayResultGrid.remove([row]);
        this.$refs.refScanDisplayResultGrid.refreshData();
        this.$refs.refScanDisplayResultGrid.recalculate();
        this.$refs.refScanDisplayResultGrid.refreshScroll();
        if (removedList.length > 0) {
          dbModule.listAddOrUpdate(this.cache.connectedList, { mac: removedList[0].mac }, { // 连接成功移到连接列表
            mac: removedList[0].mac,
            name: removedList[0].name,
            bdaddrType: removedList[0].bdaddrType,
          });
        }
      }).catch(ex => {
        notify(`${this.$i18n.t('message.connectDeviceFail')}: ${deviceMac}, ${ex}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
      }).then(() => {
        main.setObjProperty(this.cache.devicesConnectLoading, deviceMac, false);
      });
    },
    disconnectDevice(deviceMac) {
      apiModule.disconnectByDevConf(this.store.devConf, deviceMac).then(() => {
        let index = _.findIndex(this.cache.connectedList, { mac: deviceMac });
        if (index === -1) return;
        this.cache.connectedList.splice(index, 1); // 删除此设备
        let activeItem = this.cache.connectedList[index] || this.cache.connectedList[index - 1];
        let activeItemName = activeItem ? activeItem.mac : 'connectTab0';
        this.cache.currentConnectedTab = activeItemName;
        this.connectVuxTableForceResize();
        // CAUTION: 目前通过连接状态SSE发送通知，暂时不考虑SSE失败的情况
        // notify(`设备 ${deviceMac} 断开连接`, `操作成功`, libEnum.messageType.SUCCESS);
      }).catch(function (ex) {
        notify(`${this.$i18n.t('message.disconnectFail')}: ${deviceMac}, ${ex}`, this.$i18n.t('message.operationFail'), libEnum.messageType.ERROR);
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
    }
  };
}

function createComputed() {
  return {
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
      return this.cache.notifyDisplayResultList
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
      this.store.devConfDisplayVars.language = this.$i18n.locale;
      this.cache.clientHeight = document.documentElement.clientHeight;
      this.cache.vxeGridHeight = this.cache.clientHeight - 240;
      window.onresize = () => {
        this.cache.clientHeight = `${document.documentElement.clientHeight}`;
        this.cache.vxeGridHeight = this.cache.clientHeight - 240;
      };
      // 设置老版本链接
      this.store.devConfDisplayVars.oldVersionUrl = window.location.href.replace('debugger2', 'debugger');

      // 初始化AC过来的参数列表
      // devKey=cassia&devSecret=cassia&lang=en&control=remote&hubMac=CC:1B:E0:E0:E1:90
      let url = window.location.href;
      let idx = url.indexOf('?');
      url = idx === -1 ? '' : url.substr(idx);
      let params = this.getUrlVars(url);
      if (params.control === 'remote') {
        // 调用AC接口获取settings
        let settingUrl = `${window.location.protocol}//${window.location.host}/setting`;
        let that = this;
        axios.get(settingUrl).then(function (response) {
          logger.info('get ac setting success:', response);
          that.store.devConf.controlStyle = 'AC';
          let oauthUser = _.get(response, 'data.oauth-user') || '';
          if (oauthUser === '********') oauthUser = ''; // readonly传过来的为空
          let oauthSecret = _.get(response, 'data.oauth-secret') || '';
          if (oauthSecret === '********') oauthSecret = ''; // readonly传过来的为空
          that.store.devConf.acDevKey = oauthUser || params.devKey;
          that.store.devConf.acDevSecret = oauthSecret || params.devSecret;
          that.store.devConf.mac = params.hubMac;
          that.store.devConf.acServerURI = `${window.location.protocol}//${window.location.host}`;
          dbModule.saveDevConf(that.store.devConf);
          that.store.devConfDisplayVars.language = params.lang || 'en';
          that.changeLanguage();
        }).catch(function (error) { // 获取ac配置失败, 保持key+secret为空
          let info = error.response ? error.response.data : error;
          logger.error('get ac setting error:', info);
          that.store.devConf.controlStyle = 'AC';
          that.store.devConf.acDevKey = params.devKey || '';
          that.store.devConf.acDevSecret = params.devSecret || '';
          that.store.devConf.mac = params.hubMac;
          that.store.devConf.acServerURI = `${window.location.protocol}//${window.location.host}`;
          dbModule.saveDevConf(that.store.devConf);
          that.store.devConfDisplayVars.language = params.lang || 'en';
          that.changeLanguage();
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
