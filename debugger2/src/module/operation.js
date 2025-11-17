import Buffer from 'buffer';
import libEnum from '../lib/enum.js';
import libLogger from '../lib/logger.js';
import libCharReadParser from '../lib/characteristics_read_parser.js';
import apiModule from './api.js';
import dbModule from './db.js';
import vueModule from './vue.js';
import main from '../main';

const logger = libLogger.genModuleLogger('operation');

const operationsHandler = {
  [libEnum.operation.READ]: readHander,
  [libEnum.operation.NOTIFY]: notifyHandler,
  [libEnum.operation.INDICATE]: indicateHandler,
  [libEnum.operation.WRITE_NO_RES]: writeWithoutResHandler,
  [libEnum.operation.WRITE]: writeWithResHandler,  
};

function indicateHandler(operation, deviceMac, char) {
  const devConf = dbModule.getDevConf();
  const handle = char.notifyHandle || char.handle;
  const notifyStatus = char.notifyStatus;
  let value = (notifyStatus === libEnum.notifyStatus.ON ? '0000' : '0200');
  apiModule.writeByHandleByDevConf(devConf, deviceMac, handle, value, false).then(() => {
    if (char.notifyStatus === libEnum.notifyStatus.ON) char.notifyStatus = libEnum.notifyStatus.OFF;
    else if (char.notifyStatus === libEnum.notifyStatus.OFF) char.notifyStatus = libEnum.notifyStatus.ON;
    vueModule.notify(`${main.getGlobalVue().$i18n.t('message.sendNotifyOk')}: ${deviceMac}, handle ${handle} `, `${main.getGlobalVue().$i18n.t('message.operationOk')}`, libEnum.messageType.SUCCESS);
  }).catch(ex => {
    vueModule.notify(`${main.getGlobalVue().$i18n.t('message.sendNotifyFail')}: ${deviceMac}, handle ${handle}, ${ex}`, `${main.getGlobalVue().$i18n.t('message.operationFail')}`, libEnum.messageType.ERROR);
  });
}

function notifyHandler(operation, deviceMac, char) {
  const devConf = dbModule.getDevConf();
  const handle = char.notifyHandle || char.handle;
  const notifyStatus = char.notifyStatus;
  let value = (notifyStatus === libEnum.notifyStatus.ON ? '0000' : '0100');
  apiModule.writeByHandleByDevConf(devConf, deviceMac, handle, value, false).then(() => {
    if (char.notifyStatus === libEnum.notifyStatus.ON) char.notifyStatus = libEnum.notifyStatus.OFF;
    else if (char.notifyStatus === libEnum.notifyStatus.OFF) char.notifyStatus = libEnum.notifyStatus.ON;
    vueModule.notify(`${main.getGlobalVue().$i18n.t('message.sendNotifyOk')}: ${deviceMac}, handle ${handle} `, `${main.getGlobalVue().$i18n.t('message.operationOk')}`, libEnum.messageType.SUCCESS);
  }).catch(ex => {
    vueModule.notify(`${main.getGlobalVue().$i18n.t('message.sendNotifyFail')}: ${deviceMac}, handle ${handle}, ${ex}`, `${main.getGlobalVue().$i18n.t('message.operationFail')}`, libEnum.messageType.ERROR);
  });
}

function trimHexValue(value) {
  return value.trim().split(/\s+/).join('');
}

function writeWithResHandler(operation, deviceMac, char) {
  const devConf = dbModule.getDevConf();
  const handle = char.handle;
  let value = char.writeValue;
  if (char.writeValueType === libEnum.writeDataType.TEXT) {
    value = textToHex(value);
  }
  value = trimHexValue(value);
  apiModule.writeByHandleByDevConf(devConf, deviceMac, handle, value, false).then((data) => {
    vueModule.notify(`${main.getGlobalVue().$i18n.t('message.writeDataOk')}: ${deviceMac}, handle ${handle}, ${value}`, `${main.getGlobalVue().$i18n.t('message.operationOk')}`, libEnum.messageType.SUCCESS);
  }).catch(ex => {
    vueModule.notify(`${main.getGlobalVue().$i18n.t('message.writeDataFail')}: ${deviceMac}, handle ${handle}, ${value}, ${ex}`, `${main.getGlobalVue().$i18n.t('message.operationFail')}`, libEnum.messageType.ERROR);
  });
}

function writeWithoutResHandler(operation, deviceMac, char) {
  const devConf = dbModule.getDevConf();
  const handle = char.handle;
  let value = char.writeValue;
  if (char.writeValueType === libEnum.writeDataType.TEXT) {
    value = Buffer.from(value).toString('hex');
  }
  value = trimHexValue(value);
  apiModule.writeByHandleByDevConf(devConf, deviceMac, handle, value, true).then((data) => {
    vueModule.notify(`${main.getGlobalVue().$i18n.t('message.writeDataOk')}: ${deviceMac}, handle ${handle}, ${value}`, `${main.getGlobalVue().$i18n.t('message.operationOk')}`, libEnum.messageType.SUCCESS);
  }).catch(ex => {
    vueModule.notify(`${main.getGlobalVue().$i18n.t('message.writeDataFail')}: ${deviceMac}, handle ${handle}, ${value}, ${ex}`, `${main.getGlobalVue().$i18n.t('message.operationFail')}`, libEnum.messageType.ERROR);
  });
}

function readHander(operation, deviceMac, char) {
  const devConf = dbModule.getDevConf();
  const handle = char.handle;
  apiModule.readByHandleByDevConf(devConf, deviceMac, handle).then((data) => { // 成功了更新显示值
    char.readValue = data.value || 'No Data'; // CAUTION: 有时候返回的结果没有value字段
    char.parsedReadValues = libCharReadParser.getParsedValues(char.name, char.readValue);
    vueModule.notify(`${main.getGlobalVue().$i18n.t('message.readDataOk')}: ${deviceMac}, handle ${handle}`, `${main.getGlobalVue().$i18n.t('message.operationOk')}`, libEnum.messageType.SUCCESS);
  }).catch(ex => {
    char.readValue = '';
    char.parsedReadValues = [];
    vueModule.notify(`${main.getGlobalVue().$i18n.t('message.readDataFail')}: ${deviceMac}, handle ${handle}, ${ex}`, `${main.getGlobalVue().$i18n.t('message.operationFail')}`, libEnum.messageType.ERROR);
    logger.error(ex);
  });
}

function defaultHandler(operation, deviceMac, char) {
  const error = `no support operation: ${operation}, ${deviceMac}, ${JSON.stringify(char)}`;
  logger.warn(error);
  return Promise.reject(error);
}

function dispatch(operation, deviceMac, char) {
  const handler = operationsHandler[operation] || defaultHandler;
  return handler(operation, deviceMac, char);
}

export default {
  dispatch,
}