import globalData from './globalData'
import {advertiseStop} from './advertise'
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
		<fieldset class="layui-elem-field layui-field-title">
			<legend i18n="description">Description</legend>
		</fieldset>
		<div class="layui-form-item layui-form-text" style="padding: 0 20px 20px 20px">
			<div class="descriptors">
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
						<td i18n="adChip">使用芯片</td>
						<td i18n="adChipDesc">广播使用的芯片，0-芯片0，1-芯片1，注意使用的网关是否有多个芯片</td>
					</tr>
				</tbody>
			</table>
			</div>
		</div>
	</form>`;
	return temp
}

function advertiseStopTips(layer, form, $dom) {
  function dos(layer, form) {
		let adChip = $("#adChip").val();
    advertiseStop(adChip);
	}
	let info = globalData.lang === 'cn' ? '停止广播' : 'Stop Advertise';
  dialog(layer, htmlString, $dom, dos, form, info)
	form.render()
	$('#adChip').val(globalData.saved.adChip || '0');
}



export {
  advertiseStopTips
}