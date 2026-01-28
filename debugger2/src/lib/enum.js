const controlStyle = {
  AC: 'AC',
  AP: 'AP'
}

const operation = {
  BROADCASTS: 'BROADCASTS',
  READ: 'READ',
  WRITE_NO_RES: 'WRITE NO RES',
  WRITE: 'WRITE',
  NOTIFY: 'NOTIFY',
  INDICATE: 'INDICATE',
  AUTHEN: 'AUTHEN',
  EXTENDED: 'EXTENDED',
}

// char通知按钮状态
const notifyStatus = {
  ON: 'on',
  OFF: 'off'
};

// element message类型
const messageType = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
};

// 写入设备指令格式
const writeDataType = {
  HEX: 'hex',
  TEXT: 'text'
};

const apiType = {
  AUTH: 'auth',
  SCAN: 'scan',
  CONNECT: 'connect',
  READ: 'read',
  WRITE: 'write',
  DISCONNECT: 'disconnect',
  CONNECT_LIST: 'connectList',
  DISCOVER: 'discover',
  NOTIFY: 'notify',
  CONNECT_STATUS: 'connectStatus',
  PAIR: 'pair',
  PAIR_INPUT: 'pairInput',
  UNPAIR: 'unpair',
  READ_PHY: 'readPhy',
  UPDATE_PHY: 'updatePhy',
}

const codeType = {
  CURL: 'curl',
  NODEJS: 'nodejs',
  MQTT: 'mqtt',  // MQTT Node.js 代码
  MOSQUITTO: 'mosquitto'  // mosquitto_pub/sub 命令
};

const deviceAddrType = {
  PUBLIC: 'public',
  RANDOM: 'random'
};

const pairingStatusCode = {
  FAILED: 0,
  SUCCESS: 1,
  ABORTED: 2,
  LE_LEGACY_OOB_EXPECTED: 3,
  LE_SECURE_OOB_EXPECTED: 4,
  PASSKEY_INPUT_EXPECTED: 5,
  PASSKEY_DISPLAY_EXPECTED: 6,
  NUM_CMP_EXPECTED: 7,
};

const language = {
  CN: 'cn',
  EN: 'en',
  JA: 'ja', // 日语
  RO: 'ro', // 罗马尼亚语
  RU: 'ru', // 俄语
  MO: 'mo', // 罗马尼亚语(摩尔多瓦)
};

// 通信模式
const transportType = {
  HTTP: 'HTTP',
  MQTT: 'MQTT'
};

// MQTT连接状态
const mqttStatus = {
  DISCONNECTED: 'disconnected',   // 未连接 - 灰色
  CONNECTING: 'connecting',       // 连接中 - 黄色
  CONNECTED: 'connected',         // 已连接 - 绿色
  RECONNECTING: 'reconnecting',   // 重连中 - 橙色
  ERROR: 'error'                  // 错误 - 红色
};

export default {
  operation,
  controlStyle,
  notifyStatus,
  messageType,
  writeDataType,
  apiType,
  codeType,
  deviceAddrType,
  pairingStatusCode,
  language,
  transportType,
  mqttStatus
}