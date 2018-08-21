<template>
  <div class="topbar">
    <!-- <img src="../assets/logo.png" alt=""> -->
    <span class="title">信息录入工具</span>
    <button class="save" @click="save">保存</button>
    <a id="a" style="display:none"></a>
  </div>
</template>

<script>
// import X from 'xlsx'
/*
  下载文件的
 */
function download (text, fileName, type) {
  const a = document.getElementById('a')
  // const file = new Blob([text], { type: type })
  // a.href = URL.createObjectURL(file)
  console.log(text)
  a.download = fileName
  text = encodeURIComponent(text)
  a.href = 'data:text/csv;charset=utf-8,\ufeff' + text
  a.dispatchEvent(new MouseEvent('click', { 'bubbles': false, 'cancelable': true }))
}
export default {
  name: 'Topbar',
  data () {
    return {
      logoPath: ''
    }
  },
  methods: {
    save () {
      this.$emit('save', function (data) {
        // if (!Object.keys(data).length) {
        //   return alert('没有可以保存的数据，请先执行程序。')
        // }
        console.log('save data :', data)
        const name = prompt('请输入要保存的名字：', '')
        console.log(name, typeof name)
        if (!name) {
          return alert('取消保存')
        }
        // const text = JSON.stringify()
        // const text = ['a', 'b\n广言', '很帅']
        const text = Object.keys(data).map(el => {
          return [data[el].msg.id, el, data[el].msg.msg1, data[el].msg.msg2]
        })
        let tempStr = ''
        text.forEach(el => {
          // tempStr += (el.toString() + '\n')
          el.forEach((i, idx, arr) => {
            let t = i
            if (i.indexOf(',')) {
              t = `"${i}"`
            }
            if (idx === arr.length - 1) {
              t += '\n'
              tempStr += t
            } else {
              tempStr += (t + ',')
            }
          })
        })
        console.log(tempStr)
        const fileName = `${name}.csv`
        download(tempStr, fileName, 'text/csv;charset=utf-8,\ufeff')
        alert('保存成功')
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.topbar {
  background-color: #42b983;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 40px;
}
.save {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}
.title {
  color: white;
  font-weight: bold;
  height: 40px;
  line-height: 40px;
  margin-left: 20px;
}

</style>
