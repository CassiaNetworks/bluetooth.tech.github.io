import globalData from './globalData'
import {
	advertiseStart
} from './advertise'
import dialog from './dialog'


var htmlString = function() {
	let temp = `
	<form class="layui-form" action="#" style="padding-top: 15px; padding-right: 15px;">
		<div class="layui-form-item" class="adData">
			<label class="layui-form-label" i18n="chip">Chip:</label>
			<div class="layui-input-block">
				<select name="adChip" lay-filter="adType" id="adChip">
					<option value="0">0</option>
					<option value="1">1</option>
				</select>  
			</div>
		</div>
		<div class="layui-form-item">
			<label class="layui-form-label" i18n="adType">Adv Type:</label>
			<div class="layui-input-block">
				<select name="adType" lay-filter="adType" id="adType">
					<option value="0">ADV_IND</option> <!-- 可被连接，可被扫描 -->
					<option value="1">ADV_DIRECT_IND</option> <!-- 可被指定的设备连接，不可被扫描 -->
					<option value="2">ADV_SCAN_IND</option> <!-- 不可以被连接，可以被扫描 -->
					<option value="3">ADV_NONCONN_IND</option> <!-- 不可以被连接，不可以被扫描 -->
					<option value="4">SCAN_RSP</option> <!-- 扫描响应 -->
				</select>  
			</div>
		</div>
		<div class="layui-form-item" class="adData">
			<label class="layui-form-label" i18n="adData">Adv Data:</label>
			<div class="layui-input-block">
				<input type="text" lay-verify="adData" value="${globalData.saved.adData}"  class="layui-input" id="adData" placeholder="">
			</div>
		</div>
		<div class="layui-form-item" class="adRespData">
			<label class="layui-form-label" i18n="adRespData">Resp Data:</label>
			<div class="layui-input-block">
				<input type="text" lay-verify="adRespData" value="${globalData.saved.adRespData}"  class="layui-input" id="adRespData" placeholder="">
			</div>
		</div>
		<div class="layui-form-item" class="adChannelmap">
			<label class="layui-form-label" i18n="adChannelmap">Channel:</label>
			<div class="layui-input-block">
				<input type="text" value="${globalData.saved.adChannelmap}"  class="layui-input" id="adChannelmap" placeholder="">
			</div>
		</div>
		<div class="layui-form-item" class="adInterval">
			<label class="layui-form-label" i18n="adInterval">Adv Interval:</label>
			<div class="layui-input-block">
				<input type="text" value="${globalData.saved.adInterval}"  class="layui-input" id="adInterval" placeholder="">
			</div>
		</div>
		<fieldset class="layui-elem-field layui-field-title">
			<legend i18n="description">Description</legend>
		</fieldset>
		<div class="layui-form-item layui-form-text">
			<div style="margin-top: -10px; padding: 0px 20px 10px 20px">
			<table class="layui-table">
				<colgroup>
					<col width="150">
					<col>
				</colgroup>
				<thead>
					<tr>
						<th>Parameter</th>
						<th>Description</th>
					</tr> 
				</thead>
				<tbody>
					<tr>
						<td i18n="adType">广播类型</td>
						<td i18n="adTypeDesc">默认值为不可连接，无定向；ADV_IND-可连接、无定向，ADV_DIRECT_IND-可连接、定向，ADV_SCAN_IND-可扫描、无定向，ADV_NONCONN_IND-不可连接、无定向，SCAN_RSP-扫描响应</td>
					</tr>
					<tr>
						<td i18n="adData">广播数据</td>
						<td i18n="adDataDesc">广播包，数据类型为字符串</td>
					</tr>
					<tr>
						<td i18n="adRespData">扫描数据</td>
						<td i18n="adRespDataDesc">扫描响应包，数据类型是字符串，要发送扫描数据时，请设置广播类型为ADV_IND</td>
					</tr>
					<tr>
						<td i18n="adChannelmap">广播信道</td>
						<td i18n="adChannelmapDesc">广播使用的信道，默认值为7</td>
					</tr>
					<tr>
						<td i18n="adInterval">广播间隔</td>
						<td i18n="adIntervalDesc">广播间隔（以毫秒为单位），预设值500ms</td>
					</tr>
				</tbody>
			</table>
			</div>
		</div>
	</form>`;
	return temp
}

function advertiseStartTips(layer, form, $dom) {
  function dos(layer, form) {
		let adChip = $("#adChip").val();
    let adType = $("#adType").val();
    let adData = $('#adData').val();
    let adRespData = $('#adRespData').val();
    let adChannelmap = +$('#adChannelmap').val();
		let adInterval = +$('#adInterval').val();
    advertiseStart(adChip, adType, adData, adRespData, adChannelmap, adInterval);
	}
	let info = globalData.lang === 'cn' ? '开启广播' : 'Start Advertise';
  dialog(layer, htmlString, $dom, dos, form, info)
	form.render()
	$('#adType').val(globalData.saved.adType || '0');
	$('#adChip').val(globalData.saved.adChip || '0');
}



export {
  advertiseStartTips
}