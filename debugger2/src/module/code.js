const _ = require('lodash');
import libEnum from '../lib/enum.js';
import dbModule from './db.js';
import apiModule from './api.js';
import tplCurl from './api_code/curl.js';
import tplNodejs from './api_code/nodejs.js';
import demoTplNodejs from './demo_code/nodejs.js';

const tpl = {
  [libEnum.codeType.CURL]: tplCurl,
  [libEnum.codeType.NODEJS]: tplNodejs,
};

const demoTpl = {
  [libEnum.codeType.NODEJS]: demoTplNodejs,
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

function genCode(apiType, codeType, apiParams) {
  if (!tpl[codeType]) {
    return console.log('no code type support:', codeType);
  }
  if (!tpl[codeType][apiType]) {
    return console.log('no api type support:', codeType);
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
      return {devConf, connectUrl, writeUrl, notifyUrl, connectParams, writeParams};
    },
    AC: function(devConf, params) {
      const connectParams = params.connectParams;
      const writeParams = params.writeParams;
      const oauth2Url = apiModule.getOauth2UrlByDevConf(devConf);
      const connectUrl = apiModule.getConnectUrlByDevConf(devConf, connectParams.deviceMac, connectParams.chip, false);
      const writeUrl = apiModule.getWriteUrlByDevConf(devConf, connectParams.deviceMac, writeParams.handle, writeParams.value, writeParams.noresponse, false);
      const notifyUrl = apiModule.getNotifyUrlByDevConf(devConf, false);
      return {devConf, oauth2Url, connectUrl, writeUrl, notifyUrl, connectParams, writeParams};
    }
  },
  demo2: {
    AP: function(devConf, params) {
      const connectUrl = apiModule.getAsyncConnectUrlByDevConf(devConf);
      const connectStatusUrl = apiModule.getConnectStatusUrlByDevConf(devConf);
      const scanParams = params.scanParams;
      const writeParams = params.writeParams;
      const scanUrl = apiModule.getScanUrlByUserParams(devConf, scanParams.chip, scanParams.filter_mac, scanParams.phy, scanParams.filter_name, scanParams.filter_rssi);
      return {devConf, connectUrl, connectStatusUrl, scanUrl, scanParams, writeParams};
    },
    AC: function(devConf, params) {
      const oauth2Url = apiModule.getOauth2UrlByDevConf(devConf);
      const connectUrl = apiModule.getAsyncConnectUrlByDevConf(devConf, false);
      const connectStatusUrl = apiModule.getConnectStatusUrlByDevConf(devConf, false);
      const scanParams = params.scanParams;
      const writeParams = params.writeParams;
      const scanUrl = apiModule.getScanUrlByUserParams(devConf, scanParams.chip, scanParams.filter_mac, scanParams.phy, scanParams.filter_name, scanParams.filter_rssi, false);
      return {devConf, oauth2Url, connectUrl, connectStatusUrl, scanUrl, scanParams, writeParams};
    }
  }
};

function genDemoCode(demo, codeType, params) {
  try {
    const devConf = dbModule.getDevConf();
    const _params = demoParamsGetter[demo][devConf.controlStyle](devConf, params);
    return _.template(demoTpl[codeType][demo][devConf.controlStyle])({params: _params});
  } catch (ex) {
    console.log('gen demo code error:', ex);
    return `gen demo code error: ${JSON.stringify(ex)}`;
  }
}

export default {
  genCode,
  genDemoCode
}