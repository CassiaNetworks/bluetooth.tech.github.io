$(function() {
  var IP = '';

  let device = {};
  $('#send').on('click', function() {
    console.log('send');
    $('#msgResult').html('XXX');
    let deviceMac = $('#dMac').val().trim();
    if (IP !== $('#rIP').val().trim()) {
      IP = $('#rIP').val().trim();
      api.use({
          server: IP,
          hub: ''
        })
        .scan({})
        .on('scan', scan2Res);
    }
    if (!device[deviceMac]) {
      device[deviceMac] = {
        isWork: false,
        lastConn: 1,
        id: 0,
        res: {},
        isRes: false
      };
    }
    if (device[deviceMac].isWork) {
      return alert('working');
    }

    device[deviceMac].isWork = true;
    setTimeout(function() {
      api.conn({
        node: deviceMac,
        type: 'public',
        success: function(hub, deviceMac, data) {
          device[deviceMac].isWork = false;
          write(deviceMac);
        },
        error: function(err, deviceMac) {
          device[deviceMac].isWork = false;
        }
      });
    }, 1000);
  });

  function write(deviceMac) {
    const randomId = random(deviceMac);
    let hexId = randomId.toString(16);
    if(hexId.length === 1){hexId = '0' + hexId};

    device[deviceMac].id = randomId;
    device[deviceMac].isRes = false;
    device[deviceMac].res[randomId] = {
      '2': $('#option1').val().trim(),
      '1': $('#option2').val().trim()
    };
    const o = {
      id: hexId,
      msg: $('#msg').val().trim(),
      option1: $('#option1').val().trim(),
      option2: $('#option2').val().trim(),
      shake: true
    };

    let writeValue = SMS(o);

    console.log(JSON.stringify(writeValue));

    co(function*() {
      try {
        for (let item of writeValue) {
          yield api.write({
            node: deviceMac,
            handle: item.handle,
            value: item.value
          });

        }
        api.disconn({
          node: deviceMac
        })
      } catch (e) {
        alert('通知失败');
      }
    });


  }

  function random(deviceMac) {
    const randomId = Math.ceil(Math.random() * 30);
    if (device[deviceMac].id === randomId) {
      return random(deviceMac);
    }
    return randomId;
  }

  function scan2Res(hub, data) {
    let _data = JSON.parse(data);
    let deviceMac = _data.bdaddrs[0].bdaddr;
    let adData = _data.adData
    if (!device[deviceMac] || !adData) {
      return;
    };
    let d = device[deviceMac];
    if (device[deviceMac].isRes) {
      return;
    }
    let res = parseInt(adData.slice(42, 44), 16).toString(2);
    res = strFill(res);
    let resId = parseInt(res.slice(0, 5), 2);
    let resOption = parseInt(res.slice(-3), 2);
    console.log(d.id, resId, resOption, res);
    if (d.id === resId) {
      d.isRes = true;

      console.log('手环回复：', resOption, d.res[resId][resOption]);
      $('#msgResult').html(d.res[resId][resOption]);
      delete d.res[resId];
    }
  }

  function strFill(str) {
    while (str.length < 8) {
      str = '0' + str;
    }
    return str;
  }


});