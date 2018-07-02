/*

02-01-06-0E-16- F4-FD - 01 -20-63-DC-DE-A0-3F-00-01-9B-97
               UUID  包的类型
02 01 06 0E 16 F4FD  01    1D315CB77897000500B6
 */

// data: {"bdaddrs":[{"bdaddr":"00:0B:57:1C:3D:C1","bdaddrType":"public"}],"adData":"0201060E16F4FD011D315CB77897000500B6","name":"(unknown)","evt_type":0,"rssi":-62}
$(function(){
  let devices = {};
  let deviceMacArr = [];
  $('#start').on('click', function() {
    let acAddress = $('#acAddress').val().trim();
    let userName = $('#username').val().trim();
    let password = $('#password').val().trim();
    deviceMacArr = $('#devMac').val().trim().split(',');
    let routerMac = $('#apmac').val().trim().split(',');

    for(let mac of deviceMacArr){
      devInit(mac);
    }
    api
    .use({
        server: 'http://' + acAddress || 'http://api1.cassianetworks.com',
        hub: routerMac || 'CC:1B:E0:E0:02:74',
        developer: userName || 'tester',
        key: password || '10b83f9a2e823c47'
    })
    .oauth2({
      success: function () {
        api
        .scan({})
        .on('scan', scanParse);
      } 
    });
    
  });



function scanParse(hubMac, scanData){
  if(scanData.match&&scanData.match("keep")) return;
  let data = JSON.parse(scanData),
  deviceMac = data.bdaddrs[0].bdaddr;
  if(deviceMacArr.indexOf(deviceMac) === -1 || !data.adData) return;

  let value = HexToB(data.adData.slice(-20));
    
  if(value.length !== 80) return;
  paint(deviceMac, value);

}

// 16进制转换成2进制
function HexToB(str){
  let tempStr = '';
  for(let i = 0,len = str.length;i<len;i = i + 2){
      let num = parseInt(str.slice(i,i+2),16).toString(2).toString();
      if(num.length < 8){
          for(let j = 0,len2 = 8-num.length; j < len2; j++){
              num = "0" + num;
          }
      } 
      tempStr += num;
  }
  return tempStr;
}
// 画图
function paint(deviceMac, value){
  let batteryFlag = parseInt(value.slice(0, 1), 2);
  let configID = parseInt(value.slice(1, 5), 2);
  let transmissinID = parseInt(value.slice(5, 18), 2);
  let serialNumber = parseInt(value.slice(18, 48), 2);
  let cumulativeMachineHours = parseInt(value.slice(48), 2);
  let dom = $(".content1 ul[name='"+deviceMac.toUpperCase()+"']");
//  console.log(dom.find('BatteryFlag'));
  dom.find(".BatteryFlag").html(batteryFlag);
  dom.find(".ConfigID").html(configID);
  dom.find(".TransmissinID").html(transmissinID);
  dom.find(".SerialNumber").html(serialNumber);
  dom.find(".CumulativeMachineHours").html(cumulativeMachineHours);
         
}
// device画图初始化
function devInit(deviceMac){
  let list = 
    ` <p>`+deviceMac.toUpperCase()+`</p>
      <ul class='date' name="`+deviceMac.toUpperCase()+`">
        <li>
          <span>Battery Flag :</span>
          <span class='BatteryFlag'></span>
        </li>
        <li>
          <span>Config ID : </span>
          <span class='ConfigID'></span>
        </li>
        <li>
          <span>Transmissin ID：</span>
          <span class='TransmissinID'></span>
        </li>
        <li>
          <span>Serial Number：</span>
          <span class='SerialNumber'></span>
        </li>
        <li>
          <span>Cumulative Machine Hours：</span>
          <span class='CumulativeMachineHours'></span>
        </li>
      </ul>`;
  $('#content1').append(list);
}



});