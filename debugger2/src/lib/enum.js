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
  UNPAIR: 'unpair'
}

const codeType = {
  CURL: 'curl',
  NODEJS: 'nodejs'
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
  language
}