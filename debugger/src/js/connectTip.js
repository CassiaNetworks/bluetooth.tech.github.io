import globalData from './globalData'
import connectDevice from './connectDevice'
import tip from './tips'

function htmlString() {
  let temp = `<form class="layui-form  connect-tip tip" action="#">
  <div class="layui-form-item">
    <label class="layui-form-label">Connect a device：GET</label>
  </div>
  <fieldset class="layui-elem-field layui-field-title">
    <legend  i18n='arguments'>参数</legend>
  </fieldset>
  <div class="layui-form-item">
    <label class="layui-form-label">chip:</label>
    <div class="layui-input-inline">
      <input type="text" name="chip"  placeholder="0 OR 1" lay-verify='zeroOne'  value="${globalData.saved.chip?globalData.saved.chip:''}" class="layui-input">
    </div>
     <div class="layui-form-mid layui-word-aux" i18n = 'required'>(必填)</div>
  </div>
  <div class="layui-form-item">
    <label class="layui-form-label">deviceMac:</label>
    <div class="layui-input-inline">
      <input type="text" name="deviceMac"  placeholder="CC:1B:E0:E0:10:C1" value="${globalData.saved.deviceMac?globalData.saved.deviceMac:''}" lay-verify='deviceMac'  class="layui-input">
    </div>
    <div class="layui-form-mid layui-word-aux" i18n = 'required'>(必填)</div>
  </div>
  <div class="layui-form-item select">
    <label class="layui-form-label">type:</label>
    <div class="layui-inline">
     <select name="type">
      <option value="public" ${globalData.type==='public'?'selected':null}>public</option>
      <option value="random" ${globalData.type==='random'?'selected':null}>random</option>
     </select>
    </div>
  </div>
  
  <fieldset class="layui-elem-field layui-field-title">
    <legend i18n = 'description'>描述</legend>
  </fieldset>
  <div class="layui-form-item layui-form-text">
    <div class="descriptors connect-des">
      <p><b>chip：</b>蓝牙路由器共有两个芯片，芯片0和芯片1，在调用接口时可以通过添加queryString来选择芯片(?chip=0或者?chip=1)，每个芯片的连接上限是11个设备，如果不填此参数，蓝牙路由器会根据连接数量自动匹配芯片。</p>
      <p><b>deviceMac：</b>要连接的设备的MAC地址。</p>
      <p><b>type：</b>此参数在body中，是必填项。蓝牙设备的MAC地址分为random和public两种，所以在连接设备时，需要指出设备的广播type，广播type可以从扫描数据中获取。</p>
    </div>
  </div>
  <div class="layui-form-item">
    <div class="layui-input-block">
      <button class="layui-btn" lay-submit lay-filter="connect">do</button>
    </div>
  </div>
</form>`
  return temp
}

function connectTips(layer, form, $dom) {
  form.verify({
    deviceMac: [/^([0-9a-f]{2}:){5}[0-9a-f]{2}$/gi, '请输入正确的mac地址'],
    zeroOne: [/^[01]$/, '请输入chip,0或者1']
  });

  function dos(layer, form) {
    form.on('submit(connect)', function(data) {
      globalData.saved.chip = data.field.chip
      globalData.saved.deviceMac = data.field.deviceMac
      globalData.type = data.field.type
      const deviceMac = data.field.deviceMac,
        type = data.field.type,
        chip = data.field.chip
      connectDevice(chip, type, deviceMac)
      layer.closeAll('tips');
      return false
    });
  }
  tip(layer, htmlString, $dom, dos, form)
  form.render()
}



export {
  connectTips
}