import globalData from './globalData'
import pairDevice from './pair'
import tip from './tips'

function htmlString() {
  let temp = `<form class="layui-form  pair-tip tip" action="#">
  <div class="layui-form-item">
    <label class="layui-form-label">pair a device：GET</label>
  </div>
  <fieldset class="layui-elem-field layui-field-title">
    <legend  i18n='arguments'>参数</legend>
  </fieldset>
  <div class="layui-form-item">
    <label class="layui-form-label">deviceMac:</label>
    <div class="layui-input-inline">
      <input type="text" name="deviceMac"  placeholder="CC:1B:E0:E0:10:C1" value="${globalData.saved.deviceMac?globalData.saved.deviceMac:''}" lay-verify='deviceMac'  class="layui-input">
    </div>
    <div class="layui-form-mid layui-word-aux" i18n = 'required'>(必填)</div>
  </div>
  
  
  <fieldset class="layui-elem-field layui-field-title">
    <legend i18n = 'description'>描述</legend>
  </fieldset>
  <div class="layui-form-item layui-form-text">
    <div class="descriptors pair-des">
      <p i18n="pair-Tip-p2"><b>deviceMac：</b>要配对的设备的MAC地址。</p>
    </div>
  </div>
  <div class="layui-form-item">
    <div class="layui-input-block">
      <button class="layui-btn" lay-submit lay-filter="pair">do</button>
    </div>
  </div>
</form>`
  return temp
}

function pairTips(layer, form, $dom) {
  form.verify({
    deviceMac: [/^([0-9a-f]{2}:){5}[0-9a-f]{2}$/gi, '请输入正确的mac地址'],
  });

  function dos(layer, form) {
    form.on('submit(pair)', function(data) {
      globalData.saved.deviceMac = data.field.deviceMac
      const deviceMac = data.field.deviceMac
      pairDevice(deviceMac)
      layer.closeAll('tips');
      return false
    });
  }
  tip(layer, htmlString, $dom, dos, form)
  form.render()
}



export {
  pairTips
}