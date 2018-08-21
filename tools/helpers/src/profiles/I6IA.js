import api from '../api.js'
import co from 'co'
import {encodeUtf8} from '../utils'

function setInfo (data, page, show) {
  page === '01' ? (page = '08') : (page = '05')
  let convertedData = encodeUtf8(String(data))
  let totalLen = (4 + convertedData.length / 2).toString(16)
  if (totalLen.length === 1) {
    totalLen = '0' + totalLen
  }
  let dataLen = (1 + convertedData.length / 2).toString(16)
  if (dataLen.length === 1) {
    dataLen = '0' + dataLen
  }
  let value = '21FF4E' + totalLen + '01' + page + dataLen + show + convertedData
  let packets = []
  for (let i = 0, len = value.length; i < len; i = i + 40) {
    packets.push({ handle: '39', value: value.slice(i, i + 40) })
  }
  return packets
}

class I6IA {
  constructor () {
    this.type = 'I6IA'
    this.name = 'I6IA'
  }
  infoScreenMsg2HEX (info) {
    let res = []
    let show1 = '01'
    let show2 = '01'
    let msg1 = info.msg1 || ''
    let msg2 = info.msg2 || ''
    if (!info.show) {
      if (msg1) {
        res = res.concat(setInfo(msg1, '01', show1))
      }
      if (msg2) {
        res = res.concat(setInfo(msg2, '02', show2))
      }
      return res
    }
    switch (info.show) {
      case '00':
        show1 = '00'
        show2 = '00'
        break
      case '01':
        show1 = '01'
        show2 = '00'
        break
      case '02':
        show1 = '00'
        show2 = '01'
        break
      case 'FF':
        show1 = '01'
        show2 = '01'
        break
    }
    res = res.concat(setInfo(msg1, '01', show1))
    res = res.concat(setInfo(msg2, '02', show2))
    return res
  }
  infoScreen (option, fn) {
    const writeValue = this.infoScreenMsg2HEX(option)
    console.log('I6IA infoScreen', option, writeValue)
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
    if (scanData.name.match('I6IA')) {
      return true
    }
  }
}

export default new I6IA()
