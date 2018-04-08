$(document).ready(function() {
  var buffer = {};
  var nodearr = {};
  var state = {};
  var buffer_interval_time = 1000;
  var buffer_interval;
  var vpt = -74; //信号阈值
  var PositionVpt = -75;
  var win = 7; //时间窗口
  var xiaonei = 1;
  var xiaowai = 2;
  var hubs;
  // var auxHub = '10.0.12.234';
  // var mainHub = '10.0.12.46';
  // var entryAndExitResult = {
  //  'DB:90:E5:29:6C:99': {
  //    timestamp: Date.now(),
  //    status:1
  //  }
  // };
  /*
    ---------------------结束的点击事件-------------
   */
  $("#end").on("click", function() {
    buffer_interval && clearInterval(buffer_interval);
    alert("已停止");
    for (let es of scanEsArr) {
      es.close();
    }
    state = null;
    state = {};
    buffer = null;
    buffer = {};
    nodearr = null;
    nodearr = {};
  });

  //----------------开始工作-------------------------

  $("#start").on("click", function() {
    console.log(deviceMacArr, hubinArr, huboutArr, 'sad');
    if ($.isEmptyObject(deviceMacArr)) {
      alert("先添加几个手环吧");
      return;
    }
    if (hubinArr.length == 0) {
      alert("请添加校内路由器");
      return;
    }
    if (huboutArr.length == 0) {
      alert("请添加校外路由器");
      return;
    }
    for (let i = 0; i < hubinArr.length; i++) {
      scan(hubinArr[i], scan2buffer);
    }
    for (let i = 0; i < huboutArr.length; i++) {
      scan(huboutArr[i], scan2buffer);
    }
    hubs = init();
    //-------------------------------定时将buffer中的数据存到nodeArr中----------------------------------------------
    buffer_interval && clearInterval(buffer_interval);
    buffer_interval = setInterval(function() {
      buffer2nodearr(); // 将buffer的数据存入 nodearr对象
      $.each(nodearr, function(index, obj) {
        let node = obj.node;
        //console.log(node);
        judgebuffer(node);
        judgeposition(obj.value, node);
        //console.log("position::",status,"deviceMac::",node);
        //ReportedPosition(status,nodearr,node);
      });
      buffer = null;
      buffer = {};

    }, buffer_interval_time);
    //------------------------------------------------------------------------------------

  });

  //---------------------scan2buffer   将扫描到的数据存入buffer对象
  function scan2buffer(scanData, APIP) {
    let data = JSON.parse(scanData);
    let deviceMac = data.bdaddrs[0].bdaddr;
    let rssi = data.rssi;
    if (!deviceMacArr[deviceMac]) return;
    if (rssi < PositionVpt) return;
    //console.log(deviceMac);
    if (!buffer[deviceMac]) {
      buffer[deviceMac] = {
        data: {},
        deviceMac: deviceMac
      };
      buffer[deviceMac].data[APIP] = [rssi];
    } else {
      try {
        if (!buffer[deviceMac].data[APIP]) {
          buffer[deviceMac].data[APIP] = [];
        }
        buffer[deviceMac].data[APIP].push(rssi);
        //console.log(buffer);
      } catch (e) {};
    }
  }

  // 将buffer中的数据 存入nodearr
  function buffer2nodearr() {
    $.each(buffer, function(index, obj) {
      //  console.log(obj)
      let node = obj.deviceMac; //buffer对象中存储的deviceMac对象 
      let data = obj.data;
      let value = {};
      for (var i = 0; i < hubinArr.length; i++) {
        value[hubinArr[i]] = null;
      }
      for (var i = 0; i < huboutArr.length; i++) {
        value[huboutArr[i]] = null;
      }
      for (var key in data) {
        value[key] = pingjun(data[key]);
      }
      //console.log(value);
      if (!nodearr[node]) {
        nodearr[node] = {
          'node': node,
          'position': null,
          'value': [value],
          'location': null,
          't':null
        };
      } else {
        if (nodearr[node].value.length > win) nodearr[node].value.shift();
        nodearr[node].value.push(value);
        //console.log(nodearr);
      }
    });
  }

  //---------------------如果buffer 不包含nodearr中的数据   就写入空
  function judgebuffer(node) {
    if (!buffer[node]) {
      let value = {};
      for (var i = 0; i < hubinArr.length; i++) {
        value[hubinArr[i]] = null;
      }
      for (var i = 0; i < huboutArr.length; i++) {
        value[huboutArr[i]] = null;
      }
      if (nodearr[node].value.length > win) nodearr[node].value.shift();
      nodearr[node].value.push(value);
    }
  }

  /*
  valueArr：[
    {hub1:-10,hub2:-20,hub3:null},
    {hub1:-30,hub2:-10,hub3:null}
  ]

   */
  //比较路由器的信号大小
  function sortPosition(allHubs) {
    let maxRssi = 0;
    let position = null;
    //console.log(JSON.stringify(allHubs));
    for (let hubMac in allHubs) {
      let ave = allHubs[hubMac].sum / allHubs[hubMac].n;
      allHubs[hubMac].ave = ave;
      if ((maxRssi === 0 || maxRssi < ave) && ave > -75) {
        maxRssi = ave;
        position = hubMac;
      }
    }
    return position;
  }
  //  获取手环的位置  离那个路由器近
  function judgeposition(valueArr, node) {
    let positionValues = valueArr.slice(-7) || [];
    let positionObj = {};
    let allHubs = {};
    let _node = nodearr[node];
    // console.log(valueArr);
    $.each(positionValues, function(index, obj) {
      for (let hubMac in obj) {
        if (obj[hubMac] !== null) {
          if (!positionObj[hubMac]) {
            positionObj[hubMac] = {
              sum: obj[hubMac],
              n: 1
            };
          } else {
            positionObj[hubMac].sum += obj[hubMac];
            positionObj[hubMac].n++;
          }
        }
      }
    });
    // $.each(valueArr, function (index, obj){
    //  for(let hubMac in obj){
    //    if(obj[hubMac] !== null){
    //      allHubs[hubMac] = true;
    //    }
    //  }
    // })
    let position = sortPosition(positionObj);
    //console.log(JSON.stringify(allHubs), position); 
    if ($.isEmptyObject(allHubs) && _node.position) {
      _node.t && clearTimeout(_node.t);
      ReportedPosition(node);
    }
    // if(position === auxHub && positionObj[position].n > 1){
    //  if(!positionObj[mainHub]){
    //    delete positionObj[position];
    //    position = sortPosition(positionObj);
    //    console.log(node, 'nnnnnnnnnnnn定位到新增路由器，但是校内路由器不满足业务逻辑,校内路由器历史7秒数据：',JSON.stringify(positionObj[mainHub]));
    //  }else{
    //    console.log(node, 'yyyyyyyyyyyy定位到新增路由器，校内路由器满足业务逻辑,校内路由器历史7秒数据：',JSON.stringify(positionObj[mainHub]))
    //  }
    // }
    if (position && position !== _node.position) {
      if (positionObj[position].n < 2) reutrn;
      console.log(node, '定位到：', position);
      _node.position = position;
      if (hubs[position] !== _node.location) {
        _node.location = hubs[position].location;
        clearTimeout(_node.t);
        _node.t = setTimeout(function(){
          ReportedPosition(node);
        },1000 * 20);
      };
    }
  }

  //---------------对返回的位置进行处理和上报

  function ReportedPosition(node) {
    let nodeID = node.replace(/:/g, '');
    if (nodearr[node].location === 'in') {
      //console.log(state[node]);
      if (!state[node] || state[node] != xiaonei) {
        console.log(node, "进入学校", nodearr[node]);
        state[node] = xiaonei;
        $("#" + nodeID).find("input").css("background", "#5cb85c");
        var mydate = new Date();
        $("tbody").prepend(`<tr class="success"><td>` + deviceMacArr[node] +
          `</td><td>进入学校</td><td>` + mydate.getHours() + ":" + mydate.getMinutes() + `</td></tr>`);
        // entryAndExitResult[node] = {
        //  status: 1,
        //  timestamp: Date.now()
        // };
      }
    }
    if (nodearr[node].location === 'out') {
      if (!state[node] || state[node] != xiaowai) {
        console.log(node, "离开学校", nodearr[node]);
        state[node] = xiaowai;
        $("#" + nodeID).find("input").css("background", "#d9534f");
        var mydate = new Date();
        $("tbody").prepend(`<tr class="danger"><td>` + deviceMacArr[node] +
          `</td><td>离开学校</td><td>` + mydate.getHours() + ":" + mydate.getMinutes() + `</td></tr>`);
      }
      /*    entryAndExitResult[node] = {
            status: 2,
            timestamp: Date.now()
          };*/
    }
    //console.log("state:::",state);
  }
  function init() {
  let temp = {};
  for (let i of hubinArr) {
    temp[i] = {
      id: 1,
      location: 'in'
    };
  }
  for (let o of huboutArr) {
    temp[i] = {
      id: 2,
      location: 'out'
    };
  }
  return temp;
}
});



/**
 * 出入校算法：
 * 
 * 1--开启校内外所有路由器的扫描API，将扫描到的数据存入buffer中
 * buffer = {
 *    "a1:b1:c1:d1:e1:f1":{
 *      deviceMac : "a1:b1:c1:d1:e1:f1",
 *      data : {
 *        "CC:1B:E0:E0:22:60":[-50,-30,-40],
 *        "CC:1B:E0:E0:22:64":[-20,-30,-40],
 *      }   
 *     },
 *     "a2:b2:c2:d2:e2:f2":{
 *      deviceMac : "a2:b2:c2:d2:e2:f2",
 *      data : {
 *        "CC:1B:E0:E0:22:60":[-50,-30,-40],
 *        "CC:1B:E0:E0:22:64":[-20,-30,-40],
 *      }   
 *     }
 * }
 * 2--每过一个单位时间就把buffer中数据存入nodearr中,每次point加1，当point大于时间窗口后point=0
 * nodearr：{
    "a1:b1:c1:d1:e1:f1" : {
      "node" : "a1:b1:c1:d1:e1:f1",
      "position" : "", hub1/hub2,
      "point" : 0,
      value = [{"CC:1B:E0:E0:22:60":-40,"CC:1B:E0:E0:22:64":-30},
        {"CC:1B:E0:E0:22:60":null,"CC:1B:E0:E0:22:64":-30},
        {"CC:1B:E0:E0:22:60":null,"CC:1B:E0:E0:22:64":-30}]
    }
  }

  3--定位设备在那台路由器 valueArr = nodearr.value；
  positionObj = {
  "CC:1B:E0:E0:22:60" : {
    n:1,
    sum:-40,
    arr:[-40]
  },
  "CC:1B:E0:E0:22:64" : {
    n:3,
    sum:-90,
    arr:[-30,-30-30]
  }
  }；
  function judgeposition(valueArr,vpt){
    let allHubs = {};
    //console.log(valueArr);
    $.each(valueArr, function (index, obj) {
      for(let key in obj){
        if(allHubs[key]){
          allHubs[key].sum += obj[key];

          if(obj[key] !== null){ allHubs[key].arr.push(obj[key]);allHubs[key].n++;}
        }else{
          if(obj[key] !== null) allHubs[key] = {sum:obj[key],n:1,arr:[obj[key]]};
        }
      }
    });
    console.log(allHubs);
    let max = 0;
    let position;
    for(let key in allHubs){
      let avg = allHubs[key].sum/allHubs[key].n;
      if(max == 0){
        max = avg;
        position = key;
      } 
      if(max < avg){
        max = avg;
        position = key;
      }
    }
    let flag = true;
    if(position){
      for(let rssi in allHubs[position].arr){
        if(rssi > PositionVpt){
          flag = false;
        };
      };
    }
    //console.log(max);
    if( $.isEmptyObject(allHubs)|| flag ){
      return "back";
    }

    if(position && allHubs[position].n > 1 && max > PositionVpt) return position;
  }

 
 *
 *
 *
 *
 * 
 */



/*

buffer:{
  deviceMac:{
    deviceMac:deviceMac,
    hub1:[rssi,rssi,rssi..],
    bub2:[rssi,rssi,rssi..],
    hub...
  }
}


  // 将buffer 中的 deviceMac、每个路由器扫描的rssi 存在 一个nodearr对象中
  
  nodearr:{
    node:{
      node:node;
      position:"";
      point:0;
      value = [
        {hub1:rssi,hub2:rss1,..}
      ];
    },
    node:{
    },
    ...
  allHubs:{
    hub1:{
      sum:-100,
      n:2,
      arr:[]
    }
  }
  }*/