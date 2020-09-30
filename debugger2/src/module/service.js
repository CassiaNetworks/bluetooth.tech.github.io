const _ = require('lodash');
import libEnum from '../lib/enum.js';
import serviceLib from '../lib/service.js';
import charLib from '../lib/characteristics.js';
import apiModule from './api.js';
import vueModule from './vue.js';
import dbModule from './db.js';
import main from '../main.js'

// 根据整型属性获取
function properties2Str(properties) {
  const operations = [
    libEnum.operation.BROADCASTS,
    libEnum.operation.READ,
    libEnum.operation.WRITE_NO_RES,
    libEnum.operation.WRITE,
    libEnum.operation.NOTIFY,
    libEnum.operation.INDICATE,
    libEnum.operation.AUTHEN,
    libEnum.operation.EXTENDED,
  ];
  let result = [];
  _.forEach(operations, (operation, index) => {
    if ((0x01 << index) & properties) result.push(operation);
  });
  return result;
}

function procDeviceServiceList(data) {
  _.forEach(data, service => {
    service.name = serviceLib.getNameByUuid(service.uuid);
    _.forEach(service.characteristics, char => {
      char.name = charLib.getNameByUuid(char.uuid);
      char.propertiesStr = properties2Str(char.properties);
      if (_.includes(char.propertiesStr, libEnum.operation.NOTIFY) || _.includes(char.propertiesStr, libEnum.operation.INDICATE)) {
        const descriptor = _.find(char.descriptors, d => d.uuid.startsWith('00002902'));
        if (descriptor) char.notifyHandle = descriptor.handle;
      }
      char.readValue = ''; // 辅助前端页面缓存读取的value
      char.writeValue = ''; // 辅助前端页面缓存写入的value
      char.notifyStatus = libEnum.notifyStatus.OFF; // 辅助前端页面缓存notify开关状态
      char.writeValueType = libEnum.writeDataType.HEX; // 辅助前端页面缓存选择写入的value类型
    })
  });
  return data;
}

function getDeviceServiceList(deviceMac) {
  const devConf = dbModule.getDevConf();
  const cache = dbModule.getCache();
  return new Promise((resovle, reject) => {
    apiModule.getDeviceServiceListByDevConf(devConf, deviceMac).then(data => {
      const _data = _.cloneDeep(data);
      // 对象实例的动态添加属性，直接赋值不会动态变化，必须使用$set方法动态设置
      main.setObjProperty(cache.devicesServiceList, deviceMac, procDeviceServiceList(data));
      resovle(_data);
    }).catch(ex => reject(ex));
  });
}

// 根据handle获取对应的char
function getCharByHandle(deviceMac, handle) {
  const cache = dbModule.getCache();
  const serviceList = cache.devicesServiceList[deviceMac];
  for (let si = 0; si < serviceList.length; si++) {
    let service = serviceList[si];
    service.characteristics = service.characteristics || [];
    for (let ci = 0; ci < service.characteristics.length; ci++) {
      let char = service.characteristics[ci];
      if (char.handle === handle) return char;
    }
  }
  return null;
}

export default {
  getCharByHandle,
  getDeviceServiceList
}
