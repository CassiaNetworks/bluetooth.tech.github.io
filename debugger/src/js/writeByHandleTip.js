import globalData from './globalData'

import writeByHandleDeferAndFill from './writeByHandleDeferAndFill'

function htmlString() {
  let temp = `<form class="layui-form  write-tip tip" action="#">
  <div class="layui-form-item">
    <label class="layui-form-label">Write by handle：GET</label>
  </div>
  <fieldset class="layui-elem-field layui-field-title">
    <legend i18n='arguments'>参数</legend>
  </fieldset>
  <div class="layui-form-item">
    <label class="layui-form-label" >deviceMac:</label>
    <div class="layui-input-inline">
      <input type="text" name="deviceMac"  placeholder="CC:1B:E0:E0:10:C1" value="${globalData.saved.deviceMac?globalData.saved.deviceMac:''}" lay-verify='deviceMac'  class="layui-input">
    </div>
    <div class="layui-form-mid layui-word-aux" i18n='required'>(必填)</div>
  </div>
   <div class="layui-form-item">
    <label class="layui-form-label" style="width:auto">handle & value</label>
    <div class="layui-form-mid layui-word-aux" i18n='required'>(必填)</div>
    <div class="">
    <textarea placeholder="25:55AA101E\n27:55AA00FF"  class="layui-textarea" lay-verify="valueHandleArr">${globalData.saved.commond?globalData.saved.commond:''}</textarea>
    </div>
  </div>

<fieldset class="layui-elem-field layui-field-title">
  <legend i18n='description'>描述</legend>
</fieldset>
<div class="layui-form-item layui-form-text">
  <div class="descriptors connect-des">
    <p><b>接口URL：</b>调用接口后，此URL会自动生成在下面的”API接口”的窗口中。</p>
    <p><b>接口描述：</b>本接口是负责与设备通讯的主要接口，具体负责向蓝牙设备写入指令以及打开蓝牙设备的notification/indication，下面会具体讲解两个功能分别如何实现。</p>
    <p><b>1、对蓝牙设备写入指令：</b>当需要往蓝牙设备指定的characteristic写入指令时，先调用“发现服务”的接口，当返回蓝牙设备服务信息的树形列表后，寻找指定的characteristic所对应的valueHandle（characteristic内包含handle、valueHandle、properties、descriptors等属性），然后调用此接口时，handle对应的值是characteristic的valueHandle，value对应的值是需要写入的指令内容（将指令的每个byte顺序拼在一起写成一个字符串）。</p>
    <p><b>2、打开蓝牙设备的notification/indication：</b>当需要接收蓝牙设备发来的数据时，需要先打开蓝牙设备的notification或者indication（打开的过程在本质上也是对蓝牙设备下发的一个指令），当需要打开指定characteristic的notification或者indication时，也是先调用“发现服务”的方法，找到指定的characteristic所对应的descriptors，打开descriptors，找到uuid包含“00002902”所对应的handle，然后调用此接口，接口中的handle就是上面descriptor的handle，如果是打开notification，value对应的是“0100”，如果是打开indication，value对应的是“0200”，如果是关闭notification/indication，value对应的是“0000”。</p>
    <p><b>参数解释： deviceMac：</b>要写入指令的设备的MAC地址。</p>
    <p><b>handle：</b>通过“发现服务接口”所找到的characteristic所对应的valueHandle或者handle。</p>
    <p><b>value：</b>要写入的指令的值，或者“0100”（打开notification）、“0200”（打开indication）、“0000”（关闭notification和indication）。</p>
    <p><b>handle & value输入格式</b>
    <p>单条指令格式 handle:value1,type</p>
    <p>handle为要写入的handle如20</p>
    <p>value1 为要写入的值（十六进制）</p>
    <p>type为写入类型，0代表write without response，1代表write with response</p>
    <p>多条语句之间用回车键换行</p>
  </div>
</div>
<div class="layui-form-item">
  <div class="layui-input-block">
    <button class="layui-btn" lay-submit lay-filter="write">do</button>
  </div>
</div>
</form>`
  return temp
}

// <textarea placeholder="25:55AA101E,interval:3000,0\n10:55AA112A,1,400"  value="20:23,1,20\n20:21,0\n20:23,interval:23,0" class="layui-textarea" lay-verify="valueHandleArr"></textarea>
// <p>单条指令格式 handle:value1,interval:value2,type,deferral</p>
// <p>handle为要写入的handle如20</p>
// <p>value1 为该要写入的值（十六进制）</p>
// <p>interval 为重复写入某条指令，忽略代表单次写入</p>
// <p>value2 为重复写入时间隔时间，毫秒</p>
// <p>type为写入类型，0代表write without response，1代表write with response</p>
// <p>deferral 为本条指令写入延迟时间，单位为毫秒，忽略代表不延迟</p>
// <p>deferral和interval不能同时设置</p>
// <p>重复执行的指令会一直执行下去直到网页刷新</p>
// <p>多条语句之间用回车键换行</p>

function writeByHnadleTip(layer, form, $dom) {
  form.verify({
    valueHandleArr: function(value) {
      let temp = value.split('\n').map(item => item.trim()),
        errMsg = ''
      temp = temp.filter(item => item)

      if (temp.length === 0)
        return '请输入正确的指令'
      temp.forEach((item, index) => {
        if (item.indexOf('interval') > -1) {
          if (!/^[\u0030-\u0039]+\:[\u0030-\u0039\u0041-\u0046]+\,interval\:[\u0030-\u0039]+\,[\u0030-\u0039]+$/gi.test(item.trim())) {
            errMsg += `第${index+1}条指令错误</br>`
          }
        } else {
          if (!/^[\u0030-\u0039]+\:[\u0030-\u0039\u0041-\u0046]+\,[\u0030-\u0039](\,[\u0030-\u0039]+)?$/gi.test(item.trim())) {
            errMsg += `第${index+1}条指令错误</br>`
          }
        }
      })
      if (errMsg) {
        return errMsg
      }
    },
    deviceMac: function(value) {
      if (!/^([0-9a-f]{2}:){5}[0-9a-f]{2}$/gi.test(value)) {
        return '请输入正确的MAC地址'
      }
    }
  });

  function dos(layer, form) {
    form.on('submit(write)', function(data) {
      const textareaValue = $('form.write-tip textarea').val()
      globalData.saved.commond = textareaValue
      const arr = textareaValue.split('\n').filter(item => item.trim()),
        deviceMac = $('form.write-tip input').val()
      globalData.saved.deviceMac = deviceMac
      writeByHandleDeferAndFill(arr, deviceMac)
      layer.closeAll('tips');
      return false
    });
  }
  tip(layer, htmlString, $dom, dos, form)
  form.render()
}
import tip from './tips'

export default writeByHnadleTip