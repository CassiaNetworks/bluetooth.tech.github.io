import api from '../api.js'
import co from 'co'
import {encodeUtf8} from '../utils'

//  建联以后，在反向通知或者校时之前要写入的值
let baseValue = [
  {'handle': '17', 'value': '0100'},
  {'handle': '19', 'value': 'ff2006000227'}
]
const protocol = {
  sendMsg: {
    // 反向通知
    cmd: '02',
    key: '02',
    ack: '01'
  },
  clockSycn: {
    // 校时
    cmd: '01',
    key: '08',
    ack: '01'
  },
  showInfo: {
    // 是否在屏幕上显示用户信息
    cmd: '01',
    key: '15',
    ack: '01'
  },
  setInfo: {
    // 设置用户信息
    cmd: '01',
    key: '16',
    ack: '01'
  },
  timingHeartrate: {
    // 是否开启定时采集心率功能
    cmd: '01',
    key: '13',
    ack: '01'
  },
  setHeartrateInterval: {
    // 设置定时采集心率的时间间隔
    cmd: '01',
    key: '14',
    ack: '01'
  },
  sleepHistory: {
    // 获取历史睡眠数据
    cmd: '04',
    key: '05',
    ack: '02'
  }
}

// 计算包的长度
function getTotalLength (datalen) {
  let len = (1 + 1 + 1 + datalen / 2 + 1).toString(16)
  len = len.length < 2 ? '0' + len : len
  return len
};

// 组包
function packetData (data, PacketSeq, packets, cmd, key, ack) {
  let dataLength = data.length / 2
  if (dataLength < 10) {
    let totalLen = 11 + dataLength
    totalLen.toString(16).length === 1 ? (totalLen = '0' + totalLen.toString(16)) : (totalLen = totalLen.toString(16))
    let packet = 'FF00' + totalLen + getPacketSequence(PacketSeq) + cmd + '10' + key + ack + '0' + dataLength.toString(16) + data
    packet = packet + checkSum(packet)
    packets.push(packet)
  } else {
    // 多包
    setOfPackets(data, PacketSeq, data.length, 0, packets, cmd, key, ack)
  }
}
// 多包拼包
function setOfPackets (data, PacketSeq, remainder, sequence, packets, cmd, key, ack) {
  if (sequence >= 0) {
    let x = 0b10000000 + sequence
    let identifier = x.toString(16)
    let packetHeader = 'FF'
    if (sequence === 0) {
      let content = data.slice(0, 18)
      let contentLen = (remainder / 2).toString(16)
      contentLen = contentLen.length < 2 ? '0' + contentLen : contentLen
      let packet = packetHeader + identifier + '14' + getPacketSequence(PacketSeq) + cmd + '10' + key + ack + contentLen + content
      packet = packet + checkSum(packet)
      remainder -= 18
      sequence += 1
      packets.push(packet)
    } else {
      let content
      if (remainder <= 32) {
        x = 0b11000000 + sequence
        identifier = x.toString(16)
        content = data.substr((sequence - 1) * 32 + 18, 32)
        sequence = -1
      } else {
        remainder -= 32
        content = data.substr((sequence - 1) * 32 + 18, 32)
        sequence += 1
      }
      let packet = packetHeader + identifier + getTotalLength(content.length).toString(16) + content
      // console.log(sequence);
      packet = packet + checkSum(packet)
      packets.push(packet)
    }
    setOfPackets(data, PacketSeq, remainder, sequence, packets, cmd, key, ack)
  }
}

// 给value 加上 handle
function addHandle (arr) {
  let tempArr = []
  for (let i of arr) {
    tempArr.push({'handle': '19', 'value': i})
  }
  return tempArr
}
// 计算校验和
function checkSum (str) {
  let sum = 0
  for (let i = 0, len = str.length; i < len; i += 2) {
    sum += parseInt(str.slice(i, i + 2), 16)
  }
  sum = (sum % 256).toString(16)
  if (sum.length === 1) {
    sum = '0' + sum
  }
  return sum
}
// 包的序列号
function getPacketSequence (packetSeq) {
  let packetSeqS
  if (packetSeq <= 15) {
    packetSeqS = '000' + packetSeq.toString(16)
  } else if (packetSeq >= 16 && packetSeq <= 255) {
    packetSeqS = '00' + packetSeq.toString(16)
  } else if (packetSeq >= 256 && packetSeq <= 4095) {
    packetSeqS = '0' + packetSeq.toString(16)
  } else {
    packetSeqS = packetSeq.toString(16)
  }
  return packetSeqS
}

// 开启或关闭屏幕
function showInfo (seq, show) {
  // let data = 'FF000C'+ seq+'0110160101' + show;
  let packets = []
  packetData(show, seq, packets, protocol.showInfo.cmd, protocol.showInfo.key, protocol.showInfo.ack)
  let res = addHandle(packets)
  return res
}
// 设置屏显文字
function setInfo (seq, page, data) {
  let packets = []
  if (data === '') {
    data = ' '
  }
  let convertedData = page + encodeUtf8(data)
  packetData(convertedData, seq, packets, protocol.setInfo.cmd, protocol.setInfo.key, protocol.setInfo.ack)
  let res = addHandle(packets)
  return res
}
class HW330 {
  constructor () {
    this.type = 'HW330'
    this.name = 'HW330'
  }
  infoScreenMsg2HEX (info) {
    let valueArr = []
    let seq = 4

    if (info.show) {
      let show = info.show.toUpperCase()
      switch (show) {
        case 'FF':
          show = '03'
          break
        case '01':
          show = '02'
          break
        case '02':
          show = '01'
          break
      }
      let value = showInfo(seq, show)
      valueArr = valueArr.concat(value)
      seq += 2
    } else {
      let show = '00'
      if (info.msg1) {
        show = '02'
      }
      if (info.msg2) {
        show = '01'
      }
      if (info.msg1 && info.msg2) {
        show = '03'
      }
      let value = showInfo(seq, show)
      valueArr = valueArr.concat(value)
      seq += 2
    }

    if (info.msg2 || info.msg2 === '') {
      let value = setInfo(seq, '01', info.msg2)

      valueArr = valueArr.concat(value)
      seq += 2
    }
    if (info.msg1 || info.msg1 === '') {
      let value = setInfo(seq, '02', info.msg1)

      valueArr = valueArr.concat(value)
    }
    let res = baseValue.concat(valueArr)

    return res
  }
  infoScreen (option, fn) {
    const writeValue = this.infoScreenMsg2HEX(option)
    console.log('HW330 infoScreen', option, writeValue)
    co(function*() {
      try {
        yield api.conn({ node: option.deviceMac, type: option.deviceType })
        for (const { handle, value } of writeValue) {
          console.log(handle, value)
          yield api.write({
            node: option.deviceMac,
            handle,
            value
          })
        }
        yield api.disconn({ node: option.deviceMac })
        fn && fn({ deviceMac: option.deviceMac, status: 'success' })
      } catch (e) {
        yield api.disconn({ node: option.deviceMac })
        fn && fn({ deviceMac: option.deviceMac, status: 'fail' })
      }
    })
  }
  filter (scanData) {
    if (scanData.name.match('HW')) {
      return true
    }
  }
}

export default new HW330()
