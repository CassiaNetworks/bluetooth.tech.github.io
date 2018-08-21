<template>
  <div id="app">
    <topbar @save="save"></topbar>
    <bluetooth-info @start="start" @infoScreenChange="infoScreenChange" ref="bluetoothInfo"></bluetooth-info>
    <operating-xlsx ref="operatingxlsx"></operating-xlsx>
  </div>
</template>

<script>
import Topbar from './components/Topbar'
import BluetoothInfo from './components/BluetoothInfo'
import OperatingXLSX from './components/OperatingXLSX'
export default {
  name: 'App',
  components: {
    'topbar': Topbar,
    'bluetooth-info': BluetoothInfo,
    'operating-xlsx': OperatingXLSX
  },
  methods: {
    start (fn) {
      fn && fn(this.$refs.operatingxlsx.items)
      // console.log('点击start button 程序启动', this.$refs.operatingxlsx.items[0].msg1)
    },
    infoScreenChange (result) {
      // console.log('执行结果 ', this.$refs.operatingxlsx.listen)
      this.$refs.operatingxlsx.listen(result)
    },
    save (fn) {
      fn && fn(this.$refs.bluetoothInfo.msgBindDeviceMac)
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
