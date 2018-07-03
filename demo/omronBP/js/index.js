$(function() {

  $('#control').on('change', function() {
    let useway = $(this).val() || 'local'
    console.log(useway);
    if (useway === 'local') {
      $('#remote-crl').hide();
      $('#local-crl').show();
    } else {
      console.log(123132);
      $('#remote-crl').show();
      $('#local-crl').hide();
    }
    mystorage.set('useway', useway);
    location.reload();
  });


  // 准备的点击事件
  $("#start").on("click", function() {
    let useway = mystorage.get('useway') || 'local';
    console.log(useway);
    if (useway === 'local') {
      api
        .use({
          server: $('#ip').val().trim(),
          hub: ''
        })
        .scan({})
        .on('scan', scan2conn)
        .on('notify', notification);
    }
    if (useway === 'remote') {
      api
        .use({
          server: $('#acAddress').val().trim(),
          hub: $('#ap-mac').val().trim(),
          developer: $("#username").val() || 'tester',
          key: $("#password").val() || "10b83f9a2e823c47"
        })
        .oauth2({
          success: function() {
            api
              .scan({})
              .on('scan', scan2conn)
              .on('notify', notification);
          }
        });
    }
  });

  $('#stop').on('click', function () {
    location.reload();
  });


  function notification(hubMac, data) {
    console.log('notification', data);
    let notifyData = JSON.parse(data);
    // let notifyData = data;
    if (notifyData.handle == 1041) {
      BP(notifyData.value);
    }
    if (notifyData.handle == 1297) {
      battery(notifyData.value);
    }
  };

  let isWork = false;
  let lastConn = 1;
  let deviceObj = {};

  function scan2conn(hub, data) {
    let _data = JSON.parse(data);
    let mac = _data.bdaddrs[0].bdaddr;
    let type = _data.bdaddrs[0].bdaddrType;
    if (mac !== $('#devices').val().trim() || isWork || Date.now() - lastConn < 5000) return;
    lastConn = Date.now();
    isWork = true;
    if (devices[mac] && devices[mac].isWork) {
      return
    };
    if (!deviceObj[mac]) {
      deviceObj[mac] = {};
    }
    deviceObj[mac] = {
      'step': 1,
      'hubMac': hub,
      'type': type,
      'mac': mac,
      'isWork': true
    };
    dispatch(deviceObj[mac]);
  };
  let writeArr = [
    {'handle': '1298','value': '0100'}, 
    {'handle': '1042','value': '0200'}
  ];

  function dispatch(obj) {
    // console.log('dispatch 0 ', obj);
    switch (obj.step) {
      case 1:
        _conn(obj);
        break;
      case 2:
        _pair(obj);
        break;
      case 3:
        _pairInput(obj);
        break;
      case 4:
        _write(obj);
        break;
      case 5:
        _disConn(obj);
        break;
    }
  }

  function _conn(obj) {
    console.log('_conn step: 1', obj);
    api.conn({
      node: obj.mac,
      type: obj.type,
      success: function(hub, deviceMac, data) {
        obj.step = 2;
        isWork = false;
        dispatch(obj);
      },
      error: function(err, deviceMac) {
        isWork = false;
        obj.step = 5;
        dispatch(obj);
      }
    });
  }

  function _pair(obj) {
    console.log('_pair step: 2', obj);
    api.pair({
      node: obj.mac,
      success: function(data) {
        if (data.pairingStatus === "Passkey Input Expected") {
          obj.step = 3;
        }
        if (data.pairingStatus === 'Pairing Successful') {
          obj.step = 4;
        }
        dispatch(obj);
      },
      error: function(err) {
        console.log('fffffffffffffff', err);
        obj.step = 5;
        dispatch(obj);
      }
    });
  }

  function _pairInput(obj) {
    console.log('_pairInput step: 3', obj);
    api.pairInput({
      node: obj.mac,
      passkey: $('#pairCode').val().trim(),
      success: function(data) {
        obj.step = 4;
        dispatch(obj);
      },
      error: function(err) {
        obj.step = 5
        dispatch(obj);
      }
    });
  }

  function _write(obj) {
    console.log('_write step: 4', obj);
      co(function*() {
        try {
          for (let item of writeArr) {
            yield api.write({
              node: obj.mac,
              handle: item.handle,
              value: item.value
            });
          }
          obj.isWork = false;
        } catch (e) {
          obj.step = 5;
          dispatch(obj);
        }
      });
  }
function _disConn(obj){
  console.log('disconn step: 5', obj);
  api.disconn({
    node:obj.mac,
    success:function(data){
      obj.isWork = false;
    },
    error:function(err){
      obj.isWork = false;
    }
  });
}


  function reverse(str) {
    if (str.length % 2 !== 0) {
      return '';
    }
    let temp = '';

    for (let i = 0; i < str.length; i = i + 2) {
      temp = str.substr(i, 2) + temp;
    }
    return temp;
  };

  function BP(value) {
    let index = 0;
    let flag = parseInt(value.slice(index, index + 2), 16).toString(2);
    index += 2;
    let unitFlag = flag.slice(-1) > 0;
    let timestampFlag = flag.slice(-2, -1) > 0;
    let pulseRateFlag = flag.slice(-3, -2) > 0;
    let userIdFlag = flag.slice(-4, -3) > 0;
    let measurementStatusFlag = flag.slice(-5, -4) > 0;
    // console.log(unitFlag, timestampFlag, pulseRateFlag, userIdFlag, measurementStatusFlag)
    let unit;
    unitFlag ? unit = 'kPa' : unit = 'mmHg';
    let systolicVal = parseInt(reverse(value.slice(index, index + 4)), 16);
    index += 4;
    let diastolicVal = parseInt(reverse(value.slice(index, index + 4)), 16);
    index += 4;
    let meanApVal = parseInt(reverse(value.slice(index, index + 4)), 16);
    index += 4;
    console.log("systolicValue:" + systolicVal + " " + unit);
    console.log("diastolicValue:" + diastolicVal + " " + unit);
    console.log("meanApValue:" + meanApVal + " " + unit);
    $('#systolic').html(systolicVal.toFixed(1) + " " + unit);
    $('#diastolic').html(diastolicVal.toFixed(1) + " " + unit);
    $('#meanAp').html(meanApVal.toFixed(1) + " " + unit);

    let timestamp;
    if (timestampFlag) {
      let year = supplement(parseInt(reverse(value.slice(index, index + 4)), 16));
      index += 4;
      let month = supplement(parseInt(reverse(value.slice(index, index + 2)), 16));
      index += 2;
      let day = supplement(parseInt(reverse(value.slice(index, index + 2)), 16));
      index += 2;
      let hour = supplement(parseInt(reverse(value.slice(index, index + 2)), 16));
      index += 2;
      let min = supplement(parseInt(reverse(value.slice(index, index + 2)), 16));
      index += 2;
      let sec = supplement(parseInt(reverse(value.slice(index, index + 2)), 16));
      index += 2;
      timestamp = year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
      console.log(timestamp);
      $('#timestamp').html(timestamp);
    }
    let pulseRateVal = 0;
    if (pulseRateFlag) {
      pulseRateVal = parseInt(reverse(value.slice(index, index + 2)), 16);
      index += 2;
      console.log("PulseRate Data:" + pulseRateVal);
      $('#pulseRate').html(pulseRateVal);
    }
    let usrIDVal;
    if (userIdFlag) {
      usrIDVal = parseInt(reverse(value.slice(index, index + 2)), 16);
      index += 2;
    }
    let bodyMovement, cuffFit, irregularPulse, rateRange, MovementPosition;
    if (measurementStatusFlag) {
      let status = {
        "00": "脉率在该范围内",
        "01": "脉率超过上限",
        "10": "脉率低于下限",
        "11": "保留以供将来使用"
      };
      let measurementStatus = parseInt(value.slice(index, index + 4), 16).toString(2);
      if (measurementStatus.length < 6) {
        measurementStatus = '00000' + measurementStatus;
      }
      index += 4;
      bodyMovement = measurementStatus.slice(-1) > 0;
      cuffFit = measurementStatus.slice(-2, -1) > 0;
      irregularPulse = measurementStatus.slice(-3, -2) > 0;
      rateRange = measurementStatus.slice(-5, -3);
      MovementPosition = measurementStatus.slice(-6, -5) > 0;
      console.log(measurementStatus);
      console.log(bodyMovement ? '身体移动' : '身体没移动');
      console.log(cuffFit ? '袖口合适' : '袖口太松');
      console.log(irregularPulse ? '检测到不规则脉冲' : '没有检测到不规则脉冲');
      console.log(rateRange, status[rateRange]);
      console.log(MovementPosition ? '正确的测量位置' : '不正确的测量位置');
      let bodyMovementFlag, irregularPulseFlag;
      bodyMovement ? bodyMovementFlag = 'YES' : bodyMovementFlag = 'NO';
      irregularPulse ? irregularPulseFlag = 'YES' : irregularPulseFlag = 'NO';
      $('#bodyMovement').html(bodyMovementFlag);
      $('#irregular').html(irregularPulseFlag);
    }
  }

  function battery(value) {
    let battery = parseInt(value, 16);
    $('#battery').html(battery);
  }

  function supplement(x) {
    let _x = String(x);
    if (_x.length === 1) {
      _x = '0' + _x;
    }
    return _x;
  }

});