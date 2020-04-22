// https://www.bluetooth.com/specifications/gatt/characteristics/
import { Buffer } from 'buffer';
import libLogger from './logger.js';

const logger = libLogger.genModuleLogger('characteristic-parser');

// TODO: 增加写入支持

// TODO: 与characteristic统一特征名称
const parsers = {
  'Device Name': deviceName,
  'Appearance': appearance,
  'Peripheral Preferred Connection Parameters': peripheralPreferredConnectionParameters,
  'Service Changed': serviceChanged,
  'Model Number String': modelNumberString,
  'Serial Number String': serialNumberString,
  'Hardware Revision String': hardwareRevisionString,
  'Firmware Revision String': firmwareRevisionString,
  'Software Revision String': softwareRevisionString,
  'System ID': systemID,
  'PnP ID': pnpID,
  'New Alert': newAlert,
  'Alert Notification Control Point': alertNotificationControlPoint,
  'Current Time': currentTime,
  'Date Time': dateTime,
  'Day Date Time': dayDateTime,
  'Day of Week': dayofWeek,
  'Exact Time 256': exactTime256,
  'Manufacturer Name String': manufacturerNameString,
  'IEEE 11073-20601 Regulatory Certification Data List': iEEE1107320601RegulatoryCertificationDataList,
  'Body Sensor Location': bodySensorLocation,
  'Battery Level': batteryLevel,
  'Alert Level': alertLevel,
};

const alertLevelEnum = {
  '0': 'No Alert',
  '1': 'Mild Alert',
  '2': 'High Alert'
};

function alertLevel(readCharValue) {
  let result = [];
  try {
    const _buffer = Buffer.from(readCharValue, 'hex');
    const level = _buffer.readUInt8(0);
    result.push({
      name: 'Level',
      raw: _buffer.slice(0, 1).toString('hex'),
      parsed: alertLevelEnum[level] || `Reserved`,
    });
  } catch (ex) {
    logger.error(ex);
  }
  return result;
}

function batteryLevel(readCharValue) {
  let result = [];
  try {
    const _buffer = Buffer.from(readCharValue, 'hex');
    const level = _buffer.readUInt8(0);
    result.push({
      name: 'Level',
      raw: _buffer.slice(0, 1).toString('hex'),
      parsed: `${level}%, [0, 100]`,
    });
  } catch (ex) {
    logger.error(ex);
  }
  return result;
}

const bodySensorLocationEnum = {
  '0': 'Other',
  '1': 'Chest',
  '2': 'Wrist',
  '3': 'Finger',
  '4': 'Hand',
  '5': 'Ear Lobe',
  '6': 'Foot'
};

function getBodySensorLocationStr(value) {
  if (value >= 7 && value <= 255) return 'ReservedForFutureUse';
  return bodySensorLocationEnum[value] || value;
}

function bodySensorLocation(readCharValue) {
  let result = [];
  try {
    const _buffer = Buffer.from(readCharValue, 'hex');
    const location = _buffer.readUInt8(0);
    result.push({
      name: 'Body Sensor Location',
      raw: _buffer.slice(0, 1).toString('hex'),
      parsed: getBodySensorLocationStr(location),
    });
  } catch (ex) {
    logger.error(ex);
  }
  return result;
}

function iEEE1107320601RegulatoryCertificationDataList(readCharValue) {
  let result = [];
  try {
    const _buffer = Buffer.from(readCharValue, 'hex');
    // result.push({
    //   name: 'Manufacturer Name',
    //   raw: readCharValue,
    //   parsed: _buffer.toString(),
    // });
  } catch (ex) {
    logger.error(ex);
  }
  return result;
}

function manufacturerNameString(readCharValue) {
  let result = [];
  try {
    const _buffer = Buffer.from(readCharValue, 'hex');
    result.push({
      name: 'Manufacturer Name',
      raw: readCharValue,
      parsed: _buffer.toString(),
    });
  } catch (ex) {
    logger.error(ex);
  }
  return result;
}

function exactTime256(readCharValue) {
  let result = [];
  try {
    const _buffer = Buffer.from(readCharValue, 'hex');
    const dayDateTimeResult = dayDateTime(_buffer.slice(0, 8).toString('hex'));
    result.splice(0, dayDateTimeResult.length, ...dayDateTimeResult);
    const fractions256 = _buffer.readUInt8(8, 9);
    result.push({
      name: 'Fractions256',
      raw: _buffer.slice(8, 9).toString('hex'),
      parsed: `${fractions256}, [0, 255]`,
    });
  } catch (ex) {
    logger.error(ex);
  }
  return result;
}

const weekEnum = {
  '0': 'Day of week is not known',
  '1': 'Monday',
  '2': 'Tuesday',
  '3': 'Wednesday',
  '4': 'Thursday',
  '5': 'Friday',
  '6': 'Saturday',
  '7': 'Sunday'
};

function dayofWeek(readCharValue) {
  let result = [];
  try {
    const _buffer = Buffer.from(readCharValue, 'hex');
    let week = _buffer.readUInt8();
    result.push({
      name: 'Day of Week',
      raw: _buffer.slice(0, 1).toString('hex'),
      parsed: weekEnum[week],
    });
  } catch (ex) {
    logger.error(ex);
  }
  return result;
}

function dayDateTime(readCharValue) {
  let result = [];
  try {
    const _buffer = Buffer.from(readCharValue, 'hex');
    let dateTimeResult = dateTime(_buffer.slice(0, 7).toString('hex'));
    result.splice(0, dateTimeResult.length, ...dateTimeResult);
    let weekResult = dayofWeek(_buffer.slice(7, 8).toString('hex'));
    result.splice(result.length, weekResult.length, ...weekResult);
  } catch (ex) {
    logger.error(ex);
  }
  return result;
}

const monthEnum = {
  '0': 'Month is not known',
  '1': 'January',
  '2': 'February',
  '3': 'March',
  '4': 'April',
  '5': 'May',
  '6': 'June',
  '7': 'July',
  '8': 'August',
  '9': 'September',
  '10': 'October',
  '11': 'November',
  '12': 'December'
};

function dateTime(readCharValue) {
  let result = [];
  try {
    const _buffer = Buffer.from(readCharValue, 'hex');
    const year = _buffer.readUInt16LE(0, 2);
    result.push({
      name: 'Year',
      raw: _buffer.slice(0, 2).toString('hex'),
      parsed: year === 0 ? 'Year is not known' : `${year}, [1582, 9999]`,
    });
    const month = _buffer.readUInt8(2);
    result.push({
      name: 'Month',
      raw: _buffer.slice(2, 3).toString('hex'),
      parsed: monthEnum[month],
    });
    const day = _buffer.readUInt8(3);
    result.push({
      name: 'Day',
      raw: _buffer.slice(3, 4).toString('hex'),
      parsed: day === 0 ? 'Day of Month is not known' : day,
    });
    const hour = _buffer.readUInt8(4);
    result.push({
      name: 'Hours',
      raw: _buffer.slice(4, 5).toString('hex'),
      parsed: hour,
    });
    const minute = _buffer.readUInt8(5);
    result.push({
      name: 'Minutes',
      raw: _buffer.slice(5, 6).toString('hex'),
      parsed: minute,
    });
    const second = _buffer.readUInt8(6);
    result.push({
      name: 'Seconds',
      raw: _buffer.slice(6, 7).toString('hex'),
      parsed: second,
    });
  } catch (ex) {
    logger.error(ex);
  }
  return result;
}

function currentTime(readCharValue) {
  let result = [];
  try {
    const _buffer = Buffer.from(readCharValue, 'hex');
    const exactTime256Result = exactTime256(_buffer.slice(0, 9).toString('hex'));
    result.splice(0, exactTime256Result.length, ...exactTime256Result);
    // TODO: other field
  } catch (ex) {
    logger.error(ex);
  }
  return result;
}

const alertCommandIdEnum = {
  '0': 'Enable New Incoming Alert Notification',
  '1': 'Enable Unread Category Status Notification',
  '2': 'Disable New Incoming Alert Notification',
  '3': 'Disable Unread Category Status Notification',
  '4': 'Notify New Incoming Alert immediately',
  '5': 'Notify Unread Category Status immediately',
};

function getAlertCommandIdStr(id) {
  if (id >= 6 && id <= 255) return `ReservedForFutureUse`;
  return alertCommandIdEnum[id] || id;
}

function alertNotificationControlPoint(readCharValue) {
  let result = [];
  try {
    const _buffer = Buffer.from(readCharValue, 'hex');
    const commandId = _buffer.readUInt8();
    result.push({
      name: 'Command ID',
      raw: _buffer.slice(0, 1).toString('hex'),
      parsed: getAlertCommandIdStr(commandId)
    });
    const categoryId = _buffer.readUInt8(1);
    result.push({
      name: 'Category ID',
      raw: _buffer.slice(1, 2).toString('hex'),
      parsed: getAlertCategoryIDStr(categoryId)
    });
  } catch (ex) {
    logger.error(ex);
  }
  return result;
}

const alertCategoryID = {
  '0': 'Simple Alert: General text alert or non-text alert',
  '1': 'Email: Alert when Email messages arrives',
  '2': 'News: News feeds such as RSS, Atom',
  '3': 'Call: Incoming call',
  '4': 'Missed call: Missed Call',
  '5': 'SMS/MMS: SMS/MMS message arrives',
  '6': 'Voice mail: Voice mail',
  '7': 'Schedule: Alert occurred on calendar, planner',
  '8': 'High Prioritized Alert: Alert that should be handled as high priority',
  '9': 'Instant Message: Alert for incoming instant messages',
};

function getAlertCategoryIDStr(categoryID) {
  if (categoryID >= 10 && categoryID <= 250) return `ReservedForFutureUse`;
  else if (categoryID >= 251 && categoryID <= 255) return `DefinedByServiceSpecification`;
  else return alertCategoryID[categoryID];
}

function newAlert(readCharValue) {
  let result = [];
  try {
    const _buffer = Buffer.from(readCharValue, 'hex');
    const categoryID = _buffer.readUInt8();
    result.push({
      name: 'Category ID',
      raw: _buffer.slice(0, 1).toString('hex'),
      parsed: getAlertCategoryIDStr(categoryID),
    });
    const number = _buffer.readUInt8(1);
    result.push({
      name: 'Number of New Alert',
      raw: _buffer.slice(1, 2),
      parsed: `${number}, [0, 255]`,
    });
    const textBuffer = _buffer.slice(2);
    result.push({
      name: 'Text String Information',
      raw: textBuffer.toString('hex'),
      parsed: textBuffer.toString()
    });
  } catch (ex) {
    logger.error(ex);
  };
  return result;
}

const vendorIdSource = {
  '1': 'Bluetooth SIG assigned Company Identifier value from the Assigned Numbers document',
  '2': 'USB Implementer’s Forum assigned Vendor ID value',
};
function pnpID(readCharValue) {
  let result = [];
  try {
    const _buffer = Buffer.from(readCharValue, 'hex');
    const vendorSource = _buffer.readUInt8(0);
    result.push({
      name: 'Vendor ID Source',
      raw: _buffer.slice(0, 1).toString('hex'),
      parsed: vendorIdSource[vendorSource] || `${vendorSource}, [1, 2]`,
    });
    const vendorId = _buffer.readUInt16LE(1);
    result.push({
      name: 'Vendor ID',
      raw: _buffer.slice(1, 3).toString('hex'),
      parsed: vendorId,
    });
    const productId = _buffer.readUInt16LE(3);
    result.push({
      name: 'Product ID',
      raw: _buffer.slice(3, 5).toString('hex'),
      parsed: productId,
    });
    const productVersion = _buffer.readUInt16LE(5);
    result.push({
      name: 'Product Version',
      raw: _buffer.slice(5, 7).toString('hex'),
      parsed: productVersion,
    });
  } catch (ex) {
    logger.error(ex);
  }
  return result;
}

// https://www.bluetooth.com/wp-content/uploads/Sitecore-Media-Library/Gatt/Xml/Characteristics/org.bluetooth.characteristic.system_id.xml
function systemID(readCharValue) {
  const _buffer = Buffer.from(readCharValue, 'hex');
  // TODO: add parse
  return [
    // {
    //   name: 'Manufacturer Identifier',
    //   raw: readCharValue,
    //   parsed: Buffer.from(readCharValue, 'hex').toString()
    // },
    // {
    //   name: 'Organizationally Unique Identifier',
    //   raw: readCharValue,
    //   parsed: Buffer.from(readCharValue, 'hex').toString()
    // }
  ];
}

function softwareRevisionString(readCharValue) {
  return [
    {
      name: 'Software Revision',
      raw: readCharValue,
      parsed: Buffer.from(readCharValue, 'hex').toString()
    }
  ];
}

function firmwareRevisionString(readCharValue) {
  return [
    {
      name: 'Firmware Revision',
      raw: readCharValue,
      parsed: Buffer.from(readCharValue, 'hex').toString()
    }
  ];
}

function hardwareRevisionString(readCharValue) {
  return [
    {
      name: 'Hardware Revision',
      raw: readCharValue,
      parsed: Buffer.from(readCharValue, 'hex').toString()
    }
  ];
}

function serialNumberString(readCharValue) {
  return [
    {
      name: 'Serial Number',
      raw: readCharValue,
      parsed: Buffer.from(readCharValue, 'hex').toString()
    }
  ];
}

function modelNumberString(readCharValue) {
  return [
    {
      name: 'Model Number',
      raw: readCharValue,
      parsed: Buffer.from(readCharValue, 'hex').toString()
    }
  ];
}

function deviceName(readCharValue) {
  return [
    {
      name: 'Name',
      raw: readCharValue,
      parsed: Buffer.from(readCharValue, 'hex').toString()
    }
  ];
}

const appearanceCategoryEnum = {
  '0': 'Unknown',
  '64': 'Generic Phone',
  '128': 'Generic Computer',
  '192': 'Generic Watch',
  '193': 'Watch: Sports Watch',
  '256': 'Generic Clock',
  '320': 'Generic Display',
  '384': 'Generic Remote Control',
  '448': 'Generic Eye-glasses',
  '512': 'Generic Tag',
  '576': 'Generic Keyring',
  '640': 'Generic Media Player',
  '704': 'Generic Barcode Scanner',
  '768': 'Generic Thermometer',
  '769': 'Thermometer: Ear',
  '832': 'Generic Heart rate Sensor',
  '833': 'Heart Rate Sensor: Heart Rate Belt',

  // Added Blood pressure support on December 09, 2011
  '896': 'Generic Blood Pressure',
  '897': 'Blood Pressure: Arm',
  '898': 'Blood Pressure: Wrist',

  // Added HID Related appearance values on January 03, 2012 approved by BARB 
  '960': 'Human Interface Device (HID)',
  '961': 'Keyboard',
  '962': 'Mouse',
  '963': 'Joystick',
  '964': 'Gamepad',
  '965': 'Digitizer Tablet',
  '966': 'Card Reader',
  '967': 'Digital Pen',
  '968': 'Barcode Scanner',

  // Added Generic Glucose Meter value on May 10, 2012 approved by BARB 
  '1024': 'Generic Glucose Meter',

  // Added additional appearance values on June 26th, 2012 approved by BARB 
  '1088': 'Generic: Running Walking Sensor',
  '1089': 'Running Walking Sensor: In-Shoe',
  '1090': 'Running Walking Sensor: On-Shoe',
  '1091': 'Running Walking Sensor: On-Hip',
  '1152': 'Generic: Cycling',
  '1153': 'Cycling: Cycling Computer',
  '1154': 'Cycling: Speed Sensor',
  '1155': 'Cycling: Cadence Sensor',
  '1156': 'Cycling: Power Sensor',
  '1157': 'Cycling: Speed and Cadence Sensor',

  // Added appearance values for Pulse Oximeter on July 30th, 2013 approved by BARB 
  '3136': 'Generic: Pulse Oximeter',
  '3137': 'Fingertip',
  '3138': 'Wrist Worn',

  // Added appearance values for Generic Weight Scale on May 21, 2014 approved by BARB
  '3200': 'Generic: Weight Scale',
  
  // Added additional appearance values on October 2nd, 2016 approved by BARB 
  '3264': 'Generic Personal Mobility Device',
  '3265': 'Powered Wheelchair',
  '3266': 'Mobility Scooter',
  '3328': 'Generic Continuous Glucose Monitor',

  // Added additional appearance values on February 1st, 2018 approved by BARB 
  '3392': 'Generic Insulin Pump',
  '3393': 'Insulin Pump, durable pump',
  '3396': 'Insulin Pump, patch pump',
  '3400': 'Insulin Pen',
  '3456': 'Generic Medication Delivery',

  // Added appearance values for L&N on July 30th, 2013 approved by BARB 
  '5184': 'Generic: Outdoor Sports Activity',
  '5185': 'Location Display Device',
  '5186': 'Location and Navigation Display Device',
  '5187': 'Location Pod',
  '5188': 'Location and Navigation Pod'
};

// https://www.bluetooth.com/wp-content/uploads/Sitecore-Media-Library/Gatt/Xml/Characteristics/org.bluetooth.characteristic.gap.appearance.xml
function appearance(readCharValue) {
  let result = [];
  try {
    const _buffer = Buffer.from(readCharValue, 'hex');
    const value = _buffer.readUInt16LE(0).toString();
    result.push({
      name: 'Category',
      raw: readCharValue,
      parsed: appearanceCategoryEnum[value]
    });
  } catch (ex) {
    logger.error(ex);
  }
  return result;
}

function peripheralPreferredConnectionParameters(readCharValue) {
  let result = [];
  try {
    const _buffer = Buffer.from(readCharValue, 'hex');
    const minInterval = _buffer.readUInt16LE(0) * 1.25;
    result.push({
      name: 'Minimum Connection Interval',
      raw: _buffer.slice(0, 2).toString('hex'),
      parsed: minInterval === 65535 ? 'no specific minimum' : `${minInterval}ms, [6, 3200]`
    });
    const maxInterval = _buffer.readUInt16LE(2) * 1.25;
    result.push({
      name: 'Maximum Connection Interval',
      raw: _buffer.slice(2, 4).toString('hex'),
      parsed: maxInterval === 65535 ? 'no specific minimum' : `${minInterval}ms, [6, 3200]`
    });
    const latency = _buffer.readUInt16LE(4);
    result.push({
      name: 'Slave Latency',
      raw: _buffer.slice(4, 6).toString('hex'),
      parsed: `${latency}, [0, 1000]`
    });
    const timeout = _buffer.readUInt16LE(6);
    result.push({
      name: 'Minimum Connection Interval',
      raw: _buffer.slice(6, 8).toString('hex'),
      parsed: `${timeout}, [10, 3200]`
    });
  } catch (ex) {
    logger.error(ex);
  }
  return result;
}

function serviceChanged(readCharValue) {
  let result = [];
  try {
    const _buffer = Buffer.from(readCharValue, 'hex');
    const start = _buffer.readUInt16LE(0);
    const end = _buffer.readUInt16LE(2);
    return [
      {
        name: 'Start of Affected Attribute Handle Range',
        raw: _buffer.slice(0, 2).toString('hex'),
        parsed: `${start}, [1, 65535]`
      },
      {
        name: 'End of Affected Attribute Handle Range',
        raw: _buffer.slice(2, 4).toString('hex'),
        parsed: `${end}, [1, 65535]`
      },
    ];
  } catch(ex) {
    console.error(ex);
  }
  return result;
}

function getParsedValues(charName, readCharValue) {
  if (!parsers[charName]) return null;
  return parsers[charName](readCharValue);
}

export default {
  getParsedValues,
};