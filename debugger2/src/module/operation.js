import Buffer from 'buffer';
import libEnum from '../lib/enum.js';
import libLogger from '../lib/logger.js';
import libCharReadParser from '../lib/characteristics_read_parser.js';
import apiModule from './api.js';
import transportModule from './transport.js';
import dbModule from './db.js';
import vueModule from './vue.js';
import connectModule from './connect.js';
import main from '../main';

const logger = libLogger.genModuleLogger('operation');

/**
 * 从错误对象中提取错误消息
 * 支持: Error对象、MQTT返回的{code, message}对象、HTTP返回的{error: "..."}对象、字符串等
 */
function getErrorMessage(ex) {
  if (!ex) return 'Unknown error';
  if (typeof ex === 'string') return ex;
  if (ex.message) return ex.message;  // Error对象、MQTT {code, message}
  if (ex.error) return ex.error;      // HTTP {error: "..."} 格式
  if (ex.result) return ex.result;    // MQTT body.result 格式
  if (typeof ex === 'object') return JSON.stringify(ex);
  return String(ex);
}

const operationsHandler = {
  [libEnum.operation.READ]: readHander,
  [libEnum.operation.NOTIFY]: notifyHandler,
  [libEnum.operation.INDICATE]: indicateHandler,
  [libEnum.operation.WRITE_NO_RES]: writeWithoutResHandler,
  [libEnum.operation.WRITE]: writeWithResHandler,  
};

function indicateHandler(operation, deviceMac, char) {
  const handle = char.notifyHandle || char.handle;
  const notifyStatus = char.notifyStatus;
  let value = (notifyStatus === libEnum.notifyStatus.ON ? '0000' : '0200');
  transportModule.writeByHandle(deviceMac, handle, value, false).then(function() {
    if (char.notifyStatus === libEnum.notifyStatus.ON) char.notifyStatus = libEnum.notifyStatus.OFF;
    else if (char.notifyStatus === libEnum.notifyStatus.OFF) char.notifyStatus = libEnum.notifyStatus.ON;
    vueModule.notify(`${main.getGlobalVue().$i18n.t('message.sendNotifyOk')}: ${deviceMac}, handle ${handle} `, `${main.getGlobalVue().$i18n.t('message.operationOk')}`, libEnum.messageType.SUCCESS);
  }).catch(function(ex) {
    vueModule.notify(`${main.getGlobalVue().$i18n.t('message.sendNotifyFail')}: ${deviceMac}, handle ${handle}, ${getErrorMessage(ex)}`, `${main.getGlobalVue().$i18n.t('message.operationFail')}`, libEnum.messageType.ERROR);
    connectModule.removeDeviceIfNotFound(deviceMac, ex);
  });
}

function notifyHandler(operation, deviceMac, char) {
  const handle = char.notifyHandle || char.handle;
  const notifyStatus = char.notifyStatus;
  let value = (notifyStatus === libEnum.notifyStatus.ON ? '0000' : '0100');
  transportModule.writeByHandle(deviceMac, handle, value, false).then(function() {
    if (char.notifyStatus === libEnum.notifyStatus.ON) char.notifyStatus = libEnum.notifyStatus.OFF;
    else if (char.notifyStatus === libEnum.notifyStatus.OFF) char.notifyStatus = libEnum.notifyStatus.ON;
    vueModule.notify(`${main.getGlobalVue().$i18n.t('message.sendNotifyOk')}: ${deviceMac}, handle ${handle} `, `${main.getGlobalVue().$i18n.t('message.operationOk')}`, libEnum.messageType.SUCCESS);
  }).catch(function(ex) {
    vueModule.notify(`${main.getGlobalVue().$i18n.t('message.sendNotifyFail')}: ${deviceMac}, handle ${handle}, ${getErrorMessage(ex)}`, `${main.getGlobalVue().$i18n.t('message.operationFail')}`, libEnum.messageType.ERROR);
    connectModule.removeDeviceIfNotFound(deviceMac, ex);
  });
}

function trimHexValue(value) {
  return value.trim().split(/\s+/).join('');
}

function textToHex(text) {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    let hex = text.charCodeAt(i).toString(16);
    if (hex.length < 2) hex = '0' + hex;
    result += hex;
  }
  return result;
}

function writeWithResHandler(operation, deviceMac, char) {
  const handle = char.handle;
  let value = char.writeValue;
  if (char.writeValueType === libEnum.writeDataType.TEXT) {
    value = textToHex(value);
  }
  value = trimHexValue(value);
  transportModule.writeByHandle(deviceMac, handle, value, false).then(function(data) {
    vueModule.notify(`${main.getGlobalVue().$i18n.t('message.writeDataOk')}: ${deviceMac}, handle ${handle}, ${value}`, `${main.getGlobalVue().$i18n.t('message.operationOk')}`, libEnum.messageType.SUCCESS);
  }).catch(function(ex) {
    vueModule.notify(`${main.getGlobalVue().$i18n.t('message.writeDataFail')}: ${deviceMac}, handle ${handle}, ${value}, ${getErrorMessage(ex)}`, `${main.getGlobalVue().$i18n.t('message.operationFail')}`, libEnum.messageType.ERROR);
    connectModule.removeDeviceIfNotFound(deviceMac, ex);
  });
}

function writeWithoutResHandler(operation, deviceMac, char) {
  const handle = char.handle;
  let value = char.writeValue;
  if (char.writeValueType === libEnum.writeDataType.TEXT) {
    value = Buffer.from(value).toString('hex');
  }
  value = trimHexValue(value);
  transportModule.writeByHandle(deviceMac, handle, value, true).then(function(data) {
    vueModule.notify(`${main.getGlobalVue().$i18n.t('message.writeDataOk')}: ${deviceMac}, handle ${handle}, ${value}`, `${main.getGlobalVue().$i18n.t('message.operationOk')}`, libEnum.messageType.SUCCESS);
  }).catch(function(ex) {
    vueModule.notify(`${main.getGlobalVue().$i18n.t('message.writeDataFail')}: ${deviceMac}, handle ${handle}, ${value}, ${getErrorMessage(ex)}`, `${main.getGlobalVue().$i18n.t('message.operationFail')}`, libEnum.messageType.ERROR);
    connectModule.removeDeviceIfNotFound(deviceMac, ex);
  });
}

function readHander(operation, deviceMac, char) {
  const handle = char.handle;
  transportModule.readByHandle(deviceMac, handle).then(function(data) {
    char.readValue = data.value || 'No Data';
    char.parsedReadValues = libCharReadParser.getParsedValues(char.name, char.readValue);
    vueModule.notify(`${main.getGlobalVue().$i18n.t('message.readDataOk')}: ${deviceMac}, handle ${handle}`, `${main.getGlobalVue().$i18n.t('message.operationOk')}`, libEnum.messageType.SUCCESS);
  }).catch(function(ex) {
    char.readValue = '';
    char.parsedReadValues = [];
    vueModule.notify(`${main.getGlobalVue().$i18n.t('message.readDataFail')}: ${deviceMac}, handle ${handle}, ${getErrorMessage(ex)}`, `${main.getGlobalVue().$i18n.t('message.operationFail')}`, libEnum.messageType.ERROR);
    connectModule.removeDeviceIfNotFound(deviceMac, ex);
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