const _ = require('lodash');
import libEnum from '../lib/enum.js';
import dbModule from './db.js';
import apiModule from './api.js';
import tplCurl from './api_code/curl.js';
import tplNodejs from './api_code/nodejs.js';
import tplMqtt from './api_code/mqtt.js';
import tplMosquitto from './api_code/mosquitto.js';
import demoTplNodejs from './demo_code/nodejs.js';
import demoTplMqtt from './demo_code/mqtt_nodejs.js';

const tpl = {
  curl: tplCurl,
  nodejs: tplNodejs,
  mqtt: tplMqtt,
  mosquitto: tplMosquitto,
};

const demoTpl = {
  nodejs: demoTplNodejs,
  mqtt: demoTplMqtt,
};

const apiUrlGetter = {
  [libEnum.apiType.AUTH]: function (apiParams) {
    const devConf = dbModule.getDevConf();
    return apiModule.getOauth2UrlByDevConf(devConf);
  },
  [libEnum.apiType.SCAN]: function (apiParams) {
    const devConf = dbModule.getDevConf();
    let _devConf = _.cloneDeep(devConf);
    _.forEach(apiParams, (v, k) => { // 更新为自定义的api参数配置
      if (v !== undefined && v !== null) _devConf[k] = v;
    });
    return apiModule.getScanUrlByDevConf(_devConf);
  },
  [libEnum.apiType.CONNECT]: function(apiParams) {
    const devConf = dbModule.getDevConf();
    return apiModule.getConnectUrlByDevConf(devConf, apiParams.deviceMac, apiParams.chip);
  },
  [libEnum.apiType.READ]: function(apiParams) {
    const devConf = dbModule.getDevConf();
    return apiModule.getReadUrlByDevConf(devConf, apiParams.deviceMac, apiParams.handle);
  },
  [libEnum.apiType.READ_PHY]: function(apiParams) {
    const devConf = dbModule.getDevConf();
    return apiModule.getReadPhyUrlByDevConf(devConf, apiParams.deviceMac, apiParams.handle);
  },
  [libEnum.apiType.UPDATE_PHY]: function(apiParams) {
    const devConf = dbModule.getDevConf();
    return apiModule.getUpdatePhyUrlByDevConf(devConf, apiParams.deviceMac, apiParams.handle);
  },
  [libEnum.apiType.WRITE]: function(apiParams) {
    const devConf = dbModule.getDevConf();
    return apiModule.getWriteUrlByDevConf(devConf, apiParams.deviceMac, apiParams.handle, apiParams.value, apiParams.noresponse);
  },
  [libEnum.apiType.DISCONNECT]: function(apiParams) {
    const devConf = dbModule.getDevConf();
    return apiModule.getDisconnectUrlByDevConf(devConf, apiParams.deviceMac);
  },
  [libEnum.apiType.CONNECT_LIST]: function(apiParams) {
    const devConf = dbModule.getDevConf();
    return apiModule.getConnectListUrlByDevConf(devConf);
  },
  [libEnum.apiType.DISCOVER]: function(apiParams) {
    const devConf = dbModule.getDevConf();
    return apiModule.getDiscoverUrlByDevConf(devConf, apiParams.deviceMac);
  },
  [libEnum.apiType.CONNECT_STATUS]: function(apiParams) {
    const devConf = dbModule.getDevConf();
    return apiModule.getConnectStatusUrlByDevConf(devConf);
  },
  [libEnum.apiType.NOTIFY]: function(apiParams) {
    const devConf = dbModule.getDevConf();
    let _devConf = _.cloneDeep(devConf);
    _.forEach(apiParams, (v, k) => { // 更新为自定义的api参数配置
      if (v !== undefined && v !== null) _devConf[k] = v;
    });
    return apiModule.getNotifyUrlByDevConf(_devConf);
  },
  [libEnum.apiType.PAIR]: function(apiParams) {
    const devConf = dbModule.getDevConf();
    return apiModule.getPairUrlByDevConf(devConf, apiParams.deviceMac);
  },
  [libEnum.apiType.PAIR_INPUT]: function(apiParams) {
    const devConf = dbModule.getDevConf();
    return apiModule.getPairInputUrlByDevConf(devConf, apiParams.deviceMac);
  },
  [libEnum.apiType.UNPAIR]: function(apiParams) {
    const devConf = dbModule.getDevConf();
    return apiModule.getUnpairUrlByDevConf(devConf, apiParams.deviceMac);
  }
};

/**
 * 构建 MQTT Broker URL (用于浏览器 WebSocket 连接)
 * 从分离的配置字段 (protocol, server, port, path) 拼接完整 URL
 */
function buildMqttBrokerUrl(mqttConfig) {
  const protocol = mqttConfig.protocol || 'ws';
  const server = mqttConfig.server || 'broker.emqx.io';
  const port = mqttConfig.port || '8083';
  let path = mqttConfig.path || 'mqtt';
  if (!server) return '';
  let url = protocol + '://' + server + ':' + port;
  if (path) {
    path = path.replace(/^\/+/, ''); // 去掉前导斜杠
    url += '/' + path;
  }
  return url;
}

/**
 * 构建 MQTT TCP Broker URL (用于 Node.js 代码生成)
 * 使用 TCP 方式连接，端口默认为 1883
 */
function buildMqttTcpBrokerUrl(mqttConfig) {
  const server = mqttConfig.server || 'broker.emqx.io';
  const tcpPort = mqttConfig.tcpPort || '1883';
  if (!server) return '';
  return 'mqtt://' + server + ':' + tcpPort;
}

function genCode(apiType, codeType, apiParams) {
  if (!tpl[codeType]) {
    return console.log('no code type support:', codeType);
  }
  if (!tpl[codeType][apiType]) {
    return console.log('no api type support:', codeType);
  }
  
  // MQTT 代码生成需要 mqttConfig
  if (codeType === libEnum.codeType.MQTT) {
    const devConf = dbModule.getDevConf();
    const mqttConfig = devConf.mqtt || {};
    // 使用 TCP 方式的 brokerUrl（Node.js 代码使用 TCP，不是 WebSocket）
    const mqttConfigWithUrl = _.assign({}, mqttConfig, {
      brokerUrl: buildMqttTcpBrokerUrl(mqttConfig)
    });
    return _.template(tpl[codeType][apiType])({mqttConfig: mqttConfigWithUrl, apiParams: apiParams});
  }
  
  // MOSQUITTO 命令生成需要 mqttConfig、requestId 和 timestamp
  if (codeType === libEnum.codeType.MOSQUITTO) {
    const devConf = dbModule.getDevConf();
    const mqttConfig = devConf.mqtt || {};
    const requestId = Math.random().toString(16).substring(2, 10);
    const timestamp = Date.now();
    if (apiType === libEnum.apiType.PAIR_INPUT) {
      return _.template(tpl[codeType][apiType][apiParams.inputType])({
        mqttConfig: mqttConfig,
        apiParams: apiParams,
        requestId: requestId,
        timestamp: timestamp
      });
    }
    return _.template(tpl[codeType][apiType])({
      mqttConfig: mqttConfig,
      apiParams: apiParams,
      requestId: requestId,
      timestamp: timestamp
    });
  }
  
  const url = apiUrlGetter[apiType](apiParams);
  if (apiType === libEnum.apiType.PAIR_INPUT) { // pairInput特殊处理
    return _.template(tpl[codeType][apiType][apiParams.inputType])({url, apiParams});
  } else {
    return _.template(tpl[codeType][apiType])({url, apiParams});
  }
}

const demoParamsGetter = {
  demo1: {
    AP: function(devConf, params) {
      const connectParams = params.connectParams;
      const writeParams = params.writeParams;
      const connectUrl = apiModule.getConnectUrlByDevConf(devConf, connectParams.deviceMac, connectParams.chip);
      const writeUrl = apiModule.getWriteUrlByDevConf(devConf, connectParams.deviceMac, writeParams.handle, writeParams.value, writeParams.noresponse);
      const notifyUrl = apiModule.getNotifyUrlByDevConf(devConf);
      return {devConf: devConf, connectUrl: connectUrl, writeUrl: writeUrl, notifyUrl: notifyUrl, connectParams: connectParams, writeParams: writeParams};
    },
    AC: function(devConf, params) {
      const connectParams = params.connectParams;
      const writeParams = params.writeParams;
      const oauth2Url = apiModule.getOauth2UrlByDevConf(devConf);
      const connectUrl = apiModule.getConnectUrlByDevConf(devConf, connectParams.deviceMac, connectParams.chip, false);
      const writeUrl = apiModule.getWriteUrlByDevConf(devConf, connectParams.deviceMac, writeParams.handle, writeParams.value, writeParams.noresponse, false);
      const notifyUrl = apiModule.getNotifyUrlByDevConf(devConf, false);
      return {devConf: devConf, oauth2Url: oauth2Url, connectUrl: connectUrl, writeUrl: writeUrl, notifyUrl: notifyUrl, connectParams: connectParams, writeParams: writeParams};
    },
    MQTT: function(devConf, params) {
      const connectParams = params.connectParams;
      const writeParams = params.writeParams;
      const mqttConf = devConf.mqtt || {};
      return {
        brokerUrl: buildMqttTcpBrokerUrl(mqttConf),
        gateway: mqttConf.gateway || '',
        username: mqttConf.username || '',
        password: mqttConf.password || '',
        connectParams: connectParams,
        writeParams: writeParams
      };
    }
  },
  demo2: {
    AP: function(devConf, params) {
      const connectUrl = apiModule.getAsyncConnectUrlByDevConf(devConf);
      const connectStatusUrl = apiModule.getConnectStatusUrlByDevConf(devConf);
      const scanParams = params.scanParams;
      const writeParams = params.writeParams;
      const scanUrl = apiModule.getScanUrlByUserParams(devConf, scanParams.chip, scanParams.filter_mac, scanParams.phy, scanParams.filter_name, scanParams.filter_rssi);
      return {devConf: devConf, connectUrl: connectUrl, connectStatusUrl: connectStatusUrl, scanUrl: scanUrl, scanParams: scanParams, writeParams: writeParams};
    },
    AC: function(devConf, params) {
      const oauth2Url = apiModule.getOauth2UrlByDevConf(devConf);
      const connectUrl = apiModule.getAsyncConnectUrlByDevConf(devConf, false);
      const connectStatusUrl = apiModule.getConnectStatusUrlByDevConf(devConf, false);
      const scanParams = params.scanParams;
      const writeParams = params.writeParams;
      const scanUrl = apiModule.getScanUrlByUserParams(devConf, scanParams.chip, scanParams.filter_mac, scanParams.phy, scanParams.filter_name, scanParams.filter_rssi, false);
      return {devConf: devConf, oauth2Url: oauth2Url, connectUrl: connectUrl, connectStatusUrl: connectStatusUrl, scanUrl: scanUrl, scanParams: scanParams, writeParams: writeParams};
    },
    MQTT: function(devConf, params) {
      const scanParams = params.scanParams;
      const writeParams = params.writeParams;
      const mqttConf = devConf.mqtt || {};
      return {
        brokerUrl: buildMqttBrokerUrl(mqttConf),
        gateway: mqttConf.gateway || '',
        username: mqttConf.username || '',
        password: mqttConf.password || '',
        scanParams: scanParams,
        writeParams: writeParams
      };
    }
  }
};

function genDemoCode(demo, codeType, params) {
  try {
    const devConf = dbModule.getDevConf();
    
    // MQTT 模式使用 mqtt 模板
    if (devConf.transportType === libEnum.transportType.MQTT) {
      const mqttParams = demoParamsGetter[demo].MQTT(devConf, params);
      return _.template(demoTpl.mqtt[demo])({params: mqttParams});
    }
    
    // HTTP 模式使用原有逻辑
    const _params = demoParamsGetter[demo][devConf.controlStyle](devConf, params);
    return _.template(demoTpl[codeType][demo][devConf.controlStyle])({params: _params});
  } catch (ex) {
    console.log('gen demo code error:', ex);
    return 'gen demo code error: ' + JSON.stringify(ex);
  }
}

export default {
  genCode,
  genDemoCode
}