<template>
  <div class="bluetoothInfo">
    <div class="content">
      <label for="routerIp">Router IP: </label>
      <input v-model="routerIP" type="text" >

      <label for="routerIp">Rssi >=  </label>
      <input type="text" v-model="rssi">

      <label for="deviceType">Device Type: </label>
      <select name="deviceType" class="deviceType" v-model="selectedDeviceType">
        <option v-for="(deviceItem, index) of deviceGroup" :key="index" :value="deviceItem.type">{{deviceItem.name}}</option>
      </select>

      <button @click="start">开始</button>
      <button @click="stop">停止</button>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <label for="targetUrl">结果发送到：</label>
      <input v-model="targetUrl" type="text" class="targetUrl">
      <button @click="report">发送</button>
    </div>
  </div>
</template>

<script>
import profileSDK from '../ProfileSDK'
import api from '../api'
import Store from '../Store'
import $ from 'jquery'
import typograph from '../typograph'
export default {
  name: 'BluetoothInfo',
  data () {
    return {
      routerIP: Store.fetch().routerIP || null,
      rssi: Store.fetch().rssi || -300,
      deviceGroup: profileSDK.deviceGroup || [{type: 'I6IA', name: '埃微手环'}, {type: 'HW330', name: '酷思手环'}],
      selectedDeviceType: Store.fetch().selectedDeviceType || 'I6IA',
      lastConnect: 1,
      isWorking: false,
      msgBindDeviceMac: {},
      idx: 0,
      successNum: 0,
      infoScreenMsg: null,
      targetUrl: Store.fetch().targetUrl || ''
    }
  },
  computed: {
    store () {
      return {
        routerIP: this.routerIP,
        rssi: this.rssi,
        selectedDeviceType: this.selectedDeviceType,
        targetUrl: this.targetUrl
      }
    }
  },
  methods: {
    start () {
      const self = this
      if (!self.routerIP) {
        alert('请设置 Router IP')
        return false
      }
      console.log(this.store)
      Store.save(this.store)
      this.$emit('start', function (data) {
        console.log('over 兄弟元素接收到了数据', data)
        if (!data.length) {
          alert('请导入要写入的数据')
          return false
        }
        self.infoScreenMsg = data
        // console.log('cess', typograph(data[0].msg2))
        api.use({ server: self.routerIP, hub: '' }).scan({}).on('scan', scan2conn)
      })

      function scan2conn (routerMac, scanData) {
        // console.log(routerMac, scanData)
        let _scanData = JSON.parse(scanData)
        if (self.rssi > _scanData.rssi) {
          return false
        }
        if (!profileSDK.profiles[self.selectedDeviceType].filter(_scanData)) {
          return false
        }
        const deviceMac = _scanData.bdaddrs[0].bdaddr
        const deviceType = _scanData.bdaddrs[0].bdaddrType
        if (self.idx < self.infoScreenMsg.length && !self.msgBindDeviceMac[deviceMac]) {
          self.msgBindDeviceMac[deviceMac] = {
            msg: self.infoScreenMsg[self.idx],
            status: false,
            index: self.idx
          }
          self.idx++
        }
        const date = Date.now()
        if (self.isWorking || date - self.lastConnect < 5000 || !self.msgBindDeviceMac[deviceMac] || self.msgBindDeviceMac[deviceMac].status) {
          return false
        }
        self.isWorking = true
        self.lastConnect = date
        console.log('zhe shi yi ge ce shi', String(self.msgBindDeviceMac[deviceMac].msg.msg2).split('\r\n'))
        const option = {
          deviceMac,
          deviceType,
          msg1: self.msgBindDeviceMac[deviceMac].msg.msg1,
          msg2: typograph(self.msgBindDeviceMac[deviceMac].msg.msg2)
        }
        self.$emit('infoScreenChange', {
          deviceMac: deviceMac,
          status: 'running',
          index: self.msgBindDeviceMac[deviceMac].index
        })
        profileSDK.profiles[self.selectedDeviceType].infoScreen(option, function (result) {
          console.log(result)
          self.isWorking = false
          if (result.status === 'success') {
            self.msgBindDeviceMac[result.deviceMac].status = true
            self.successNum++
            self.$emit('infoScreenChange', {
              deviceMac: result.deviceMac,
              status: result.status,
              index: self.msgBindDeviceMac[result.deviceMac].index
            })
            if (self.infoScreenMsg.length === self.successNum) {
              api.scan.close()
              alert('全部写入完成')
            }
          }
        })
      }
    },
    stop () {
      console.log('stop')
      api.scan.close()
    },
    report () {
      const self = this
      // console.log('report target URL:', this.targetUrl)
      if (!Object.keys(self.msgBindDeviceMac).length) {
        return alert('数据为空，不能发送！')
      }
      const data = Object.keys(self.msgBindDeviceMac).map(el => {
        return {
          id: self.msgBindDeviceMac[el].msg.id,
          deviceMac: el
        }
      })
      console.log('send data is:', data)
      $.ajax({
        type: 'post',
        url: self.targetUrl,
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify(data),
        success (data) {
          console.log('report send ok', data)
          let n = 0
          JSON.parse(data).forEach(({deviceMac, code, message}) => {
            if (code !== 1) {
              n++
              self.msgBindDeviceMac[deviceMac].status = false
            }
            self.$emit('infoScreenChange', {
              deviceMac: deviceMac,
              status: null,
              index: self.msgBindDeviceMac[deviceMac].index,
              saveStatus: code,
              saveResMsg: message
            })
          })
          if (!n) {
            alert('服务器全部写入成功！')
          } else {
            alert(`服务器收到请求，但是有${n}条数据写入失败！`)
          }
        },
        error (err) {
          console.log('report send error', err)
          alert('发送失败，请检查网络和URL是否正确！')
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.bluetoothInfo {
  position: absolute;
  top: 40px;
  right: 0;
  left: 0;
  height: 50px;
  padding-top: 10px;
}
.content {
  width: 1226px;
  margin: 0 auto;
}
.deviceType {
  height: 24px;
}
button {
  cursor: pointer;
}
.targetUrl {
  width: 240px;
}
</style>
