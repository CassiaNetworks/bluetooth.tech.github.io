<template>
  <div class="operatingXLSX">
    <div class="content">
      <div class="xlsx-header">
        <span class="xlsxTitle">编辑</span>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <b>总数:</b>
        <span>{{sum}}</span>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <b>已完成:</b>
        <span>{{progress}}</span>
        <!-- &nbsp;&nbsp;&nbsp;&nbsp;
        <b>满足信号阈值:</b>
        <span>{{rssiNum}}</span> -->
        <!-- <button class="_import" @click="_import">导入</button> -->
        <input class="_import" type="file" name="xlf" id="xlf" @change="fileChange">
      </div>

      <table class="infoWindow">
        <tr class="infoWindow-title">
          <th @click="addItem">添加</th>
          <th>ID</th>
          <th>首屏文字</th>
          <th>二屏文字</th>
          <th>状态</th>
          <th>Device MAC</th>
          <th>保存结果</th>
        </tr>
        <tr v-for="(item, index) of items" :key="index" class="infoWindow-item" :class="{ saveFailed: item.saveStatus !== 1, success: item.status === 'success'}">
          <td @click="deleteItem(index)">删除</td>
          <td><input v-model="item.id" type="text"></td>
          <td><input v-model="item.msg1" type="text"></td>
          <td><textarea rows="3" v-model="item.msg2"/></td>
          <td>{{item.status}}</td>
          <td>{{item.deviceMac}}</td>
          <td>{{item.saveResMsg}}</td>
        </tr>
      </table>
    </div>

  </div>
</template>

<script>
import {
  doFile
} from '../dofile'
export default {
  name: 'OperatingXLSX',
  data () {
    return {
      items: [
        // {
        //   msg1: '张三',
        //   msg2: '23',
        //   status: 'waiting',
        //   routerMac: 'null'
        // }
      ],
      progress: 0
    }
  },
  computed: {
    sum () {
      return this.items.length
    }
  },
  methods: {
    fileChange (event) {
      const self = this
      doFile(event.target.files, 'json', function (result) {
        console.log('OperatingXLSX import ', result)
        Object.keys(result).forEach(sheet => {
          result[sheet].forEach(el => {
            self.items.push({
              id: el[0] || '',
              msg1: el[1] || '',
              msg2: el[2] || '',
              status: 'waiting',
              deviceMac: 'null',
              saveStatus: 1,
              saveResMsg: 'null'
            })
          })
        })
      })
    },
    deleteItem (index) {
      this.items.splice(index, 1)
      console.log(this.items)
    },
    addItem () {
      this.items.push(
        {
          id: '',
          msg1: '',
          msg2: '',
          status: 'waiting',
          deviceMac: 'null',
          saveStatus: 1,
          saveResMsg: 'null'
        }
      )
    },
    listen ({deviceMac, status, index, saveStatus, saveResMsg}) {
      // console.log('接收到就能回家了：', result)
      if (status) {
        this.items[index].status = status
      }
      if (status === 'success') {
        this.progress++
      }
      if (saveStatus) {
        this.items[index].saveStatus = saveStatus
        this.items[index].saveResMsg = saveResMsg
      }
      this.items[index].deviceMac = deviceMac
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.operatingXLSX {
  position: absolute;
  top: 100px;
  right: 0;
  left: 0;
  bottom: 0;
  padding-top: 10px;
}
.content {
  width: 1226px;
  margin: 0 auto;
}

.xlsx-header {
  position: absolute;
  top: 0;
  height: 40px;
  width: 1226px;
}
.xlsx-header ._import {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
}
.xlsx-header .xlsxTitle {
  font-weight: bold;
  height: 40px;
  line-height: 40px;
}

.infoWindow {
  margin: 0;
  padding: 0;
  position: absolute;
  top: 40px;
  bottom: 0;
  background-color: #f0f0f0;
  width: 1226px;
  overflow-y: auto;
}
.infoWindow input[type="text"] {
  width: 88%;
  color: black;
}

.infoWindow th {
  height: 30px;
  line-height: 30px;
  width: 16%;
}
.infoWindow-title th:first-child {
  width: 4%;
  cursor: pointer;
  background-color: #E5E5E5;
}
.infoWindow-title th:first-child:hover {
  background-color: rgba(230, 230, 250, 1)
}
.infoWindow td {
  text-align: center;
  width: 16%;
  background-color: rgba(95,158,160,.75);
  padding: 3px 0;
  color: #fff
}
.infoWindow-item td:first-child {
  width: 4%;
  cursor: pointer;
  color: #fff;
}
.infoWindow-item td:last-child {
  font-size: 12px;
}
.infoWindow-item td:first-child:hover {
  background-color: rgba(95,158,160,1);
}
.success td {
  background-color: #42b983;
}
.saveFailed td {
  background-color: #d9534f;
}
textarea {
  width: 88%;
  resize:vertical
}

</style>
