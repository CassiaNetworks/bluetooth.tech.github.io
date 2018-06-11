// req.data = {
//   mac:req.mac,
//   name: data.name,
//   rssi: data.rssi,
//   scanData: data.scanData || '',
//   adData: data.adData || '',
//   node: data.bdaddrs[0].bdaddr,
//   type: data.bdaddrs[0].bdaddrType
// }

const pad = '21ff';
let devices = {
  'd1': {
    'sleepHistory': {
      data: [{
        'seq': 7,
        'type': '00',
        'date': '2017-7-26',
        'startTime2': '2:28',
        'endTime2': '2:56',
        'startTime': 1501007280000,
        'endTime': 1501008960000,
        'duration': 28,
        'status': '04'
      }],
      lastData: ''
    }
  }
};
// 获取历史睡眠数据
'21ff0A0100';
var sleepHistory = function() {
  let res = {
    notifyTimeout: 4,
    data: [{
      'handle': '42',
      'value': '0200'
    }, {
      'handle': '39',
      'value': '21ff4e0401030101'
    }]
  };

  return res;
};

function encodeUtf8(data) {
  // return encodeURI(data).split('%').join("")
  let val = '';
  for (let i = 0; i < data.length; i++) {
    let char = data[i];
    if (isChineseChar(char) || isFullwidthChar(char)) {
      if (val === '') {
        val = encodeURI(char).split('%').join(',');
      } else {
        val += encodeURI(char).split('%').join(',');
      }
    } else {
      if (val === '') {
        val = data.charCodeAt(i).toString(16);
      } else {
        val += ',' + data.charCodeAt(i).toString(16);
      }
    }
  }
  // console.log(val.split(',').join(''));
  return val.split(',').join('');
}

// 是否含有中文（也包含日文和韩文）
function isChineseChar(str) {
  let reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
  return reg.test(str);
}
// 同理，是否含有全角符号的函数
function isFullwidthChar(str) {
  let reg = /[\uFF00-\uFFEF]/;
  return reg.test(str);
}
// 校时
var clockSync = function() {
  let timeStr = getTimeStr();
  let res = pad + '10' + numToHex(timeStr.length / 2) + timeStr;

  return [{
    'handle': '39',
    'value': res
  }];
};

function sendMsg(msg) {
  let _msg = String(msg);
  let convertedData = encodeUtf8(_msg);
  console.log(convertedData);
  let packets = packetData(convertedData);
  let res = [];

  for (let i of packets) {
    res.push({
      'handle': '39',
      'value': i
    });
  }
  console.log('MMMMMMMMMMMMMMM', res);
  return res;
};
var baseName = 'iw';
var filter = function(req) {
  const data = req.data;

  // if (data.baseName === var baseName) {
  //   return true;
  // }

  if (data.name.startsWith('Bracel')) {
    // data.baseName = var baseName;
    return true;
  }
};
// var filter.baseName = var baseName;

var adHandle = function(data) {
  const scanData = data.scanData;

  if (!scanData) {
    return;
  }
  const d = {
    'model': 'iw',
    'rssi': data.rssi,
    // 'position': data.position,
    'routerMac': data.mac,
    'node': data.node,
    'step': utils.parseInt16To10(scanData.slice(38, 40) + scanData.slice(36, 38) + scanData.slice(34, 36)),
    'calorie': utils.parseInt16To10(scanData.slice(42, 44) + scanData.slice(40, 42)),
    'heartrate': utils.parseInt16To10(scanData.slice(44, 46)),
    'battery': utils.parseInt16To10(scanData.slice(46, 48)),
    'sportType': utils.parseInt16To10(scanData.slice(48, 50))
  };

  return d;
};
var notifyHandle = function(data) {
  let tag = data.tag;
  let d;

  switch (tag) {
    case 'sleepHistory':
      d = sleepHistoryParse(data);

      break;
    default:
  };

  return d;
};

function sleepHistoryParse(data) {
  let value = data.value;
  let deviceMac = data.node;

  if (!devices[deviceMac]) {
    devices[deviceMac] = {
      sleepHistory: {
        data: '',
        lastData: ''
      }
    };
  }
  //  console.log('#######', data);
  let sleep = devices[deviceMac].sleepHistory;

  if (value.length === 32 && value.slice(0, 6) === 'FFFFFF') {
    return {
      isTag: true,
      next: 'end',
      writeValue: [],
      data: null
    };
  }
  if (value.length === 32 && value.slice(6, 8) === '00') {
    let tempObj = {};
    sleep.lastData = value;
    let year = 2000 + parseInt(value.slice(0, 2), 16);
    let month = 1 + parseInt(value.slice(2, 4), 16);
    let day = 1 + parseInt(value.slice(4, 6), 16);
    let date = [year, month, day];
    let baseTime = (new Date(date.join(','))).getTime();

    tempObj.type = '00';
    let startTime = parseInt(reverse(value.slice(8, 12)), 16);
    let endTime = parseInt(reverse(value.slice(12, 16)), 16);
    let duration = parseInt(reverse(value.slice(16, 20)), 16);

    tempObj.startTime = baseTime + startTime * 60 * 1e3;
    tempObj.endTime = baseTime + endTime * 60 * 1e3;
    tempObj.status = parseInt(value.slice(20, 22), 16);
    return {
      isTag: true,
      next: '',
      writeValue: [],
      data: tempObj
    };

  } else {
    return {
      isTag: false,
      next: '',
      writeValue: [],
      data: null
    };
  }
  // 头   cmd len seq  yy MM dd type str  end  con  c    step
  // 23ff 28  12  0000 12 00 15 01   6f04 7a04 0100 0200 0900
  // 23ff 28  12  0600 ff ff ff ff   ffffffffffffffffffff
  // ffff
  // 23ff 28  12  1600 12 00 1d 01   ee04f904010009001f00
  //                   12 00 1d 00   9e05 9e05 0000 01 029e058601
  //                   12 00 1d 00   9e05 9f05 0100 03 029e058601
  //                   12 00 1d 00   9f05 4f00 5000 04 029e058601
  //                   12 00 1e 00   4f00 5500 0600 03 029e058601
  //                   12 00 1e 00   5500 bd00 6800 04 029e058601
  //                   12 00 1e 00   bd00 d400 1700 03 029e058601
  //                   12 00 1e 00   d400 2501 5100 04 029e058601
  //                   12 00 1e 00   2501 3401 0f00 03 029e058601
  //                   12 00 1e 00   3401 8601 5200 04 029e058601
  //                   12 00 1d 00   9e05 8601 8801 02 029e058601
  //                   12 00 1e 00   9001 9001 0000 01 029001d201
  //                   12 00 1e 00   9001 d201 4200 04 029001d201
  //                   ff ff ff ff   ffff ffff ffff ff ffffffffff

}

function numToHex(num) {
  const t = parseInt(num, 10).toString(16);

  return t.length === 2 ? t : 0 + t;
}

function getTimeStr() {
  const time = new Date();
  const timeArr = [];

  timeArr.push(time.getFullYear() - 2000);
  timeArr.push(time.getMonth());
  timeArr.push(time.getDate() - 1);
  timeArr.push(time.getHours());
  timeArr.push(time.getMinutes());
  timeArr.push(time.getSeconds());
  return timeArr.map(e =>
    numToHex(e)
  ).join('');
}

function packetData(data) {
  let dataLength = data.length / 2;
  let totalLen = (2 + dataLength).toString(16);

  totalLen.length === 1 ? totalLen = ('0' + totalLen).toString(16) : totalLen = totalLen.toString(16);
  if (dataLength < 15) {
    let packet = '21ff31' + totalLen + '02ff' + data;

    return [packet];
  } else {
    let packets = [];
    let firstPacket = data.slice(0, 28);
    let packet = '21ff31' + totalLen + '02ff' + firstPacket;

    packets.push(packet);
    let otherPacket = data.slice(28);

    for (let i = 0, len = otherPacket.length; i < len; i = i + 40) {
      packets.push(otherPacket.slice(i, i + 40));
    }
    return packets;
  }
}

function reverse(str) {
  if (str.length % 2 !== 0) {
    return '';
  }
  let temp = '';

  for (let i = 0; i < str.length; i = i + 2) {
    temp = str.substr(i, 2) + temp;
  }
  return temp;
};



// 是否含有中文（也包含日文和韩文）
function isChineseChar(str) {
  let reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
  return reg.test(str);
}
// 同理，是否含有全角符号的函数
function isFullwidthChar(str) {
  let reg = /[\uFF00-\uFFEF]/;
  return reg.test(str);
}
// ip屏幕1行可以显示: 9个阿拉伯数字、4个汉字、9个 ‘-’、16个空格、5个"："、9个英文
// 16个空格和一个数字
// 16个空格和一个中文
function infoScreen(data, page, show) {
  page === '01' ? page = '08' : page = '05';
  let convertedData = encodeUtf8(String(data));
  let totalLen = (4 + convertedData.length / 2).toString(16);
  totalLen.length === 1 ? totalLen = '0' + totalLen : 0;
  let dataLen = (1 + convertedData.length / 2).toString(16);
  dataLen.length === 1 ? dataLen = '0' + dataLen : 0;

  let value = '21FF4E' + totalLen + '01' + page + dataLen + show + convertedData;
  let packets = [];
  for (let i = 0, len = value.length; i < len; i = i + 40) {
    packets.push({
      'handle': '39',
      'value': value.slice(i, i + 40)
    });
  }
  console.log(packets);
  return packets;
}
// let o = {
//   id: '02',
//   msg: '春眠不觉晓处处闻啼鸟夜来风雨声花落知多少床前明月光疑是地上霜举头望明月低头思故乡离离原上草一岁一枯荣野火烧不尽春风吹又生赵钱孙李',
//   option1:'韭菜盒子',
//   option2:'芒果布丁',
//   shake: true
// }

function SMS(o) {
  let shake = "01";
  let _msg = encodeUtf8(String(o.msg));
  let _option1 = encodeUtf8(String(o.option1));
  let _option2 = encodeUtf8(String(o.option2));
  _option1 = smsFill(_option1.slice(0, 24));
  _option2 = smsFill(_option2.slice(0, 24));
  let totalLen = (3 + _msg.length / 2 + _option1.length / 2 + _option2.length / 2 + 2).toString(16);
  let dataLen = (_msg.length / 2 + _option1.length / 2 + _option2.length / 2 + 2).toString(16);
  if (!o.shake) {
    shake = "00"
  }
  // if(_option1.length < 24){
  //   for(let i = 0, len = _option1; i < len; i += 2){}
  // }
  let value = '21FF4E' + totalLen + '0107' + dataLen + o.id + shake + _option1 + _option2 + _msg;
  // console.log('fuck',value);
  let packets = [];
  for (let i = 0, len = value.length; i < len; i = i + 40) {
    packets.push({
      'handle': '39',
      'value': value.slice(i, i + 40)
    });
  }
  // console.log(packets);
  return packets;
}

function smsFill(str) {
  while (str.length / 2 < 12){
    str += '20'
  }
  return str
}

// SMS(o)

// infoScreen('    姓名      荆广言                      班级      3年12班');
// infoScreen('一二三四二二三四三二三四四二三四五二三四六二三四七二三四');
// infoScreen('','02',"00");

function notification(hubMac, data) {
  console.log('noooooooooooooooooooooooo', data);
  let notifyData = JSON.parse(data);
  let value = notifyData.value;
  //  16 6d00 4b00 5600 e207 02 1a 10 04 07 45 00 00 00
  //  166d004b005600e207021a10040745000000
  // 10110 
  // 109
  // 75
  // 69
  let index = 0;
  let flag = parseInt(value.slice(index, index + 2), 16).toString(2);
  index += 2;
  let unitFlag = flag.slice(-1) > 0;
  let timestampFlag = flag.slice(-2, -1) > 0;
  let pulseRateFlag = flag.slice(-3, -2) > 0;
  let userIdFlag = flag.slice(-4, -3) > 0;
  let measurementStatusFlag = flag.slice(-5, -4) > 0;
  // console.log(unitFlag, timestampFlag, pulseRateFlag, userIdFlag, measurementStatusFlag)
  let unit;
  unitFlag ? unit = 'kPa' : unit = 'mmHg';
  let systolicVal = parseInt(reverse(value.slice(index, index + 4)), 16);
  index += 4;
  let diastolicVal = parseInt(reverse(value.slice(index, index + 4)), 16);
  index += 4;
  let meanApVal = parseInt(reverse(value.slice(index, index + 4)), 16);
  index += 4;
  console.log("systolicValue:" + systolicVal + " " + unit);
  console.log("diastolicValue:" + diastolicVal + " " + unit);
  console.log("meanApValue:" + meanApVal + " " + unit);

  let timestamp;
  if (timestampFlag) {
    let year = parseInt(reverse(value.slice(index, index + 4)), 16);
    index += 4;
    let month = parseInt(reverse(value.slice(index, index + 2)), 16);
    index += 2;
    let day = parseInt(reverse(value.slice(index, index + 2)), 16);
    index += 2;
    let hour = parseInt(reverse(value.slice(index, index + 2)), 16);
    index += 2;
    let min = parseInt(reverse(value.slice(index, index + 2)), 16);
    index += 2;
    let sec = parseInt(reverse(value.slice(index, index + 2)), 16);
    index += 2;
    console.log("Timestamp Data:" + year + '年' + month + '月' + day + '日 -- ' + hour + ':' + min + ':' + sec);
  }
  let pulseRateVal = 0;
  if (pulseRateFlag) {
    pulseRateVal = parseInt(reverse(value.slice(index, index + 2)), 16);
    index += 2;
    console.log("PulseRate Data:" + pulseRateVal);
  }
  let usrIDVal;
  if (userIdFlag) {
    usrIDVal = parseInt(reverse(value.slice(index, index + 2)), 16);
    index += 2;
  }
  /*let bodyMovement, cuffFit, irregularPulse, rateRange, MovementPosition;
  if(measurementStatusFlag){
    let status = {
      "0": "脉率在该范围内",
      "1": "脉率超过上限",
      "10": "脉率低于下限",
      "11": "保留以供将来使用"
    }
    let measurementStatus  = parseInt(value.slice(index, index + 4), 16).toString(2); 
    index += 4;
    bodyMovement = measurementStatus.slice(-1) > 0;
    cuffFit = measurementStatus.slice(-2, -1) > 0;
    irregularPulse = measurementStatus.slice(-3, -2) > 0;
    rateRange = measurementStatus.slice(-5, -3);
    MovementPosition = measurementStatus.slice(-6, -5) > 0;
    console.log(measurementStatus);
    console.log(bodyMovement ? '身体移动':'身体没移动');
    console.log(cuffFit ? '袖口合适':'袖口太松');
    console.log(irregularPulse ? '检测到不规则脉冲':'没有检测到不规则脉冲');
    console.log('aaa',rateRange, status[rateRange]);
    console.log(MovementPosition ? '正确的测量位置':'不正确的测量位置');
  }*/

}

function reverse(str) {
  if (str.length % 2 !== 0) {
    return '';
  }
  let temp = '';

  for (let i = 0; i < str.length; i = i + 2) {
    temp = str.substr(i, 2) + temp;
  }
  return temp;
};
// notification('aaa', `{
//   "value": "16750044005400e207021b0a0b0940000000",
//   "handle": 1041,
//   "id": "B0:49:5F:01:38:C4",
//   "dataType": "indication"
// }`)


function setInfo(data, page, show) {

  page === '01' ? page = '08' : page = '05';
  let convertedData = encodeUtf8(String(data));
  let totalLen = (4 + convertedData.length / 2).toString(16);

  totalLen.length === 1 ? totalLen = '0' + totalLen : 0;
  let dataLen = (1 + convertedData.length / 2).toString(16);

  dataLen.length === 1 ? dataLen = '0' + dataLen : 0;

  let value = '21FF4E' + totalLen + '01' + page + dataLen + show + convertedData;
  let packets = [];

  for (let i = 0, len = value.length; i < len; i = i + 40) {
    packets.push({
      'handle': '39',
      'value': value.slice(i, i + 40)
    });
  }
  console.log(packets);
  return packets;
};

var infoScreen2 = function(info) {
  let res = [];
  let show1 = '01';
  let show2 = '01';
  let msg1 = info.msg1 || '';
  let msg2 = info.msg2 || '';
  if (!info.show) {
    if (msg1) {
      res = res.concat(setInfo(msg1, '01', show1));
    }
    if (msg2) {
      res = res.concat(setInfo(msg2, '02', show2));
    }
    return res;
  }
  switch (info.show) {
    case '00':
      show1 = '00';
      show2 = '00';
      break;
    case '01':
      show1 = '01';
      show2 = '00';
      break;
    case '02':
      show1 = '00';
      show2 = '01';
      break;
    case 'FF':
      show1 = '01';
      show2 = '01';
      break;
  }
  res = res.concat(setInfo(msg1, '01', show1));
  res = res.concat(setInfo(msg2, '02', show2));
  return res;
};

// console.log(infoScreen2({"msg2":"小明        3年级6班"}));