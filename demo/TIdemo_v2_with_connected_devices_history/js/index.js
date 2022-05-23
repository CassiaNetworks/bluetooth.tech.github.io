/**
 *      Created by guangyan on 2017/6/9.
 *      2016/12/27 16:49
 *      guangyan@cassianetworks.com
 *      Cleaned up by Kevin Yang 2019/3/4.
 *      kevin@cassianetworks.us
 *
 *      Example reading data using the TI Sensortag GATT profile.
 *      BLE Payload Data: dadf095efe1f027001290994ef52ff76ff65fe
 *      
 *      ATT Opcode: da
 *      Data read: df-09-5e-fe-1f-02-70-01-29-09-94-ef-52-ff-76-ff-65-fe
 *      Data is read in little-endian-like format.
 *      
 *      Gyro is bytes(字节) 0-5
 *      GyroX : 09df
 *      GyroY : fe5e
 *      GyroZ : 021f
 *
 *      Acc is bytes(字节) 6-11
 *      AccX : 0170
 *      AccY : 0929
 *      AccZ : ef94
 *
 *      Mag is bytes(字节) 7-12
 *      MagX : 2901
 *      MagY : ff76
 *      MagZ : fe65  
 *      
 */

$(document).ready(function() {
  $('#local-control').on('change', function() {
    let useway; // String of the router mode (local or remote).
    if ($(this).val() === 'local') {
      useway = 'local';
      $('#remote-crl').hide();
      $('#local-crl').show();
    } else {
      useway = 'remote';
      $('#remote-crl').show();
      $('#local-crl').hide();
    }
    mystorage.set('useway', useway);
    location.reload();
  });

  handle_value = {
    // 37: "0100",
    // 39: "01",
    45: "0100",
    47: "01",
    53: "0100",
    55: "01",
    69: "0100",
    71: "01",
    61: "0100",
    63: "ff00"
  };

  var host, username, password, APmac, token, isconnect = false;
  var connectNum = 0; // Number of connected devices (连接device的数量).
  var ref = "64"; // Code for collecting default data. (采集数据默认值)
  var refArr = { // Keys of this object are handles.
    // 41: ref,
    49: ref,
    57: ref,
    73: ref
  };

  const disconnFunct = function() {
    let useway = mystorage.get('useway') || 'local';
    if (useway === 'local') {
      api
        .use({
          server: $("#ap-ip").val(),
          hub: '',
          local: true
        })
        .devices({
          server: $("#ap-ip").val(),
          hub: '',
          success: function(data) {
            if (!data.nodes.forEach) {
              location.reload();
              return;
            }
            data.nodes.forEach(item => {
              api.disconn({
                node: item.id,
                success: function() {
                  location.reload();
                }
              });
            });
          }
        });
    } else {
      api
        .use({
          server: $("#acaddress").val(),
          hub: $("#apmac").val() || '',
          developer: $("#username").val() || 'tester',
          key: $("#password").val() || "10b83f9a2e823c47",
          local: false
        }).oauth2({
          success: function() {
            api.devices({
              hub: $("#apmac").val() || '',
              success: function(data) {
                if (!data.nodes.forEach) {
                  location.reload();
                  return;
                }
                data.nodes.forEach(item => {
                  api.disconn({
                    node: item.id,
                    success: function() {
                      location.reload();
                    }
                  });
                });
              }
            });
          }
        });
    }
  }

  let disconn_without_refresh = function() {
    let useway = mystorage.get('useway') || 'local';
    if (useway === 'local') {
      api
        .use({
          server: $("#ap-ip").val(),
          hub: '',
          local: true
        })
        .devices({
          server: $("#ap-ip").val(),
          hub: '',
          success: function(data) {
            if (!data.nodes.forEach) {
              console.log("There are no devices to disconnect.s");
              return;
            }
            data.nodes.forEach(item => {
              api.disconn({
                node: item.id,
                success: function() {
                  console.log("Device " + item.id + " has been disconnected.");
                }
              });
            });
          }
        });
    } else {
      api
        .use({
          server: $("#acaddress").val(),
          hub: $("#apmac").val() || '',
          developer: $("#username").val() || 'tester',
          key: $("#password").val() || "10b83f9a2e823c47",
          local: false
        }).oauth2({
          success: function() {
            api.devices({
              hub: $("#apmac").val() || '',
              success: function(data) {
                if (!data.nodes.forEach) {
                    console.log("There are no devices to disconnect.");
                  return;
                }
                data.nodes.forEach(item => {
                  api.disconn({
                    node: item.id,
                    success: function() {
                      console.log("Device " + item.id + " has been disconnected.");
                    }
                  });
                });
              }
            });
          }
        });
    }
  };

  disconn_without_refresh();

  // Disconnect button action (断开连接).
  $(".disconbtn").on('click', function() {
    let useway = mystorage.get('useway') || 'local';
    if (useway === 'local') {
      api
        .use({
          server: $("#ap-ip").val(),
          hub: '',
          local: true
        })
        .devices({
          server: $("#ap-ip").val(),
          hub: '',
          success: function(data) {
            if (!data.nodes.forEach) {
              location.reload();
              return;
            }
            data.nodes.forEach(item => {
              api.disconn({
                node: item.id,
                success: function() {
                  location.reload();
                }
              });
            });
          }
        });
    } else {
      api
        .use({
          server: $("#acaddress").val(),
          hub: $("#apmac").val() || '',
          developer: $("#username").val() || 'tester',
          key: $("#password").val() || "10b83f9a2e823c47",
          local: false
        }).oauth2({
          success: function() {
            api.devices({
              hub: $("#apmac").val() || '',
              success: function(data) {
                if (!data.nodes.forEach) {
                  location.reload();
                  return;
                }
                data.nodes.forEach(item => {
                  api.disconn({
                    node: item.id,
                    success: function() {
                      location.reload();
                    }
                  });
                });
              }
            });
          }
        });
    }
  });

  setInterval(function() {
    let num = 0;
    for (let mac in device.real) {
      if (device.real[mac].notifyWork) {
        num++;
      }
      device.real[mac].notifyWork = false;
    }
    $('#_work').html(num);
  }, 6 * 1000);


  // Connect button action (开始连接).
  $(".conbtn").on('click', function() {
    let useway = mystorage.get('useway') || 'local';
    console.log('start:', useway);
    if (useway === 'local') {
      api
        .use({
          server: $("#ap-ip").val(),
          hub: '',
          local: true
        })
        .on('notify', notification)
        .scan({})
        .on('scan', scan2conn);
    } else {
      api
        .use({
          server: $("#acaddress").val().trim(),
          hub: $("#apmac").val().trim() || '',
          developer: $("#username").val().trim() || 'tester',
          key: $("#password").val().trim() || "10b83f9a2e823c47",
          local: false
        })
        .oauth2({
          success: function() {
            api
              .on('notify', notification)
              .scan({})
              .on('scan', scan2conn);
          }
        });
    }
  });

  /* Handler for the Sampling Frequency slider.
   * #ref is the slider value.
   * #refTime is the frequency shown in seconds on the UI.
   */  
  $("#ref").on("change", function() {
    $("#refTime").html("(" + $(this).val() / 100 + "s)");
    ref = parseInt($(this).val(), 10).toString(16);
    refArr = {
      41: ref,
      49: ref,
      57: ref,
      73: ref
    }
  });



  let connectedDeviceCount = function(device) {
    let n = 0;
    for (let i in device.real) {
      if (device.real[i].connect && !device.real[i].virtual) {
        n++;
      }
    }
    return n;
  }

  var isWork = false;
  var lastWork = 1;

  function scan2conn(hubMac, scanData) {
    let data = JSON.parse(scanData);
    let mac = data.bdaddrs[0].bdaddr;
    let type = data.bdaddrs[0].bdaddrType;
    let deviceName = data.name;
    if (!deviceName || !deviceName.match("CC2650")) return;
    if (!device.real[mac]) {
      device.real[mac] = {
        name: data.name,
        type: type,
        connect: false,
        created: false,
        lastConnect: 1,
        notifyWork: false
      };
      if (connectNum === 0) {
        $.extend(true, device.real[mac], device.real.temp);
        delete device.real.temp;
      }
      $.extend(true, device.real[mac], deviceDataInit);
    }
    if (isWork || (Date.now() - lastWork) < 2000) return;
    lastWork = Date.now();
    isWork = true;
    //console.log('正在连接', mac);
    api.conn({
      node: mac,
      type: device.real[mac].type,
      success: function(hub, deviceMac, data) {
        device.real[mac].connect = true;
        isWork = false;
        connectNum = connectedDeviceCount(device);
        if (connectNum === 1) {
          $('#graphic .message').eq(0).children('#initmac').html(`MAC: ${mac}`);
          $('#graphic .chart')[0].dataset.mac = deviceMac;
          // $('#graphic .name')[0].innerHTML = device.real[i].name;
        } else {
          !device.real[mac].created && createChart(connectNum, device.real[deviceMac].name, mac);
        }
        device.real[mac].created = true;

        writeVale(deviceMac);

        var m = new Date();
        var dateString =
            m.getUTCFullYear() + "/" +
            ("0" + (m.getUTCMonth()+1)).slice(-2) + "/" +
            ("0" + m.getUTCDate()).slice(-2) + " " +
            ("0" + m.getUTCHours()).slice(-2) + ":" +
            ("0" + m.getUTCMinutes()).slice(-2) + ":" +
            ("0" + m.getUTCSeconds()).slice(-2);

        $("#pastDevs").append("<p>" + dateString + '&nbsp;&nbsp;&nbsp;&nbsp;<b>' + deviceMac + "</b></p>");
      },
      error: function(err) {
        isWork = false;
      }
    });
  }

  function writeVale(mac) {
    co(function*() {
      try {
        for (let key in handle_value) {
          //console.log(handle_value[key]);
          yield api.write({
            node: mac,
            handle: key,
            value: handle_value[key]
          }).catch(function() {
            throw "guale";
          });
        }
        device.real[mac].connect = true;
        for (let k in refArr) {
          //console.log(refArr[k]);
          yield api.write({
            node: mac,
            handle: k,
            value: refArr[k]
          });
        }
      } catch (e) {
        //console.log('TI-写入指令失败', e);
        api.disconn({
          node: mac
        });
      }
    });
  }

  function notification(hubMac, notifyData) {

    //console.log(notifyData)
    let data = JSON.parse(notifyData);
    let mac = data.id;
    let handle = data.handle;
    let value = data.value;

    if (!device.real[mac]) return;
    device.real[mac].notifyWork = true;
    let date = new Date();
    let dateStr = [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');

    switch (handle) {
      // case 36:
      //   let temp = sensorTmp007Convert(value);
      //   let temperatureData = device.real[mac].temperatureData,
      //     temperatureDate = device.real[mac].temperatureDate;
      //   temperatureData.push(temp);
      //   temperatureDate.push(dateStr);
      //   if (temperatureData.length >= 12) {
      //     temperatureData.shift();
      //     temperatureDate.shift();
      //   }

      //   device.real[mac].temperatureChart.setOption({
      //     xAxis: {
      //       data: temperatureDate
      //     },
      //     series: [{
      //       data: temperatureData
      //     }]
      //   });

      //   break;

      case 44:
        //console.log('##############',device.real[mac]);
        let hum = sensorHdc1000Convert(value);
        let humData = device.real[mac].humData,
          humDate = device.real[mac].humDate;
        humData.push(hum);
        humDate.push(dateStr);


        if (humData.length >= 12) {
          humData.shift();
          humDate.shift();
        }
        device.real[mac].humChart.setOption({
          xAxis: {
            data: humDate
          },
          series: [{
            data: humData
          }]
        });
        break;
      case 52:
        let pressure = calcBmp280(value);
        let pressureData = device.real[mac].pressureData,
          pressureDate = device.real[mac].pressureDate;
        pressureData.push(pressure);
        pressureDate.push(dateStr);
        if (pressureData.length >= 12) {
          pressureData.shift();
          pressureDate.shift();
        }

        device.real[mac].pressureChart.setOption({
          xAxis: {
            data: pressureDate
          },
          series: [{
            data: pressureData
          }]
        });

        break;
      case 68: //光
        let light = SensorOpt3001_convert(value);
        let lightData = device.real[mac].lightData,
          lightDate = device.real[mac].lightDate;
        //console.log(68,value,light)
        lightData.push(light);
        lightDate.push(dateStr);
        if (lightData.length >= 12) {
          lightData.shift();
          lightDate.shift();
        }

        device.real[mac].lightChart.setOption({
          xAxis: {
            data: lightDate
          },
          series: [{
            data: lightData
          }]
        });

        break;
      case 60: //运动demo
        // console.log(value);
        let gyroarr = gyro(value);
        let accarr = acc(value);
        let magarr = mag(value);
        let accxData = device.real[mac].accxData,
          accyData = device.real[mac].accyData,
          acczData = device.real[mac].acczData,
          accDate = device.real[mac].accDate,
          gyroxData = device.real[mac].gyroxData,
          gyroyData = device.real[mac].gyroyData,
          gyrozData = device.real[mac].gyrozData,
          gyroDate = device.real[mac].gyroDate,
          magneticDate = device.real[mac].magneticDate,
          magneticxData = device.real[mac].magneticxData,
          magneticyData = device.real[mac].magneticyData,
          magneticzData = device.real[mac].magneticzData;
        // magnetometerRData = device.real[mac].magnetometerRData;

        accxData.push(accarr[0]);
        accyData.push(accarr[1]);
        acczData.push(accarr[2]);
        accDate.push(dateStr);
        gyroxData.push(gyroarr[0]);
        gyroyData.push(gyroarr[1]);
        gyrozData.push(gyroarr[2]);
        gyroDate.push(dateStr);
        magneticxData.push(magarr[0]);
        magneticyData.push(magarr[1]);
        magneticzData.push(magarr[2]);
        magneticDate.push(dateStr);
        if (accxData.length >= 12) {
          accxData.shift();
          accyData.shift();
          acczData.shift();
          accDate.shift();
          gyroxData.shift();
          gyroyData.shift();
          gyrozData.shift();
          gyroDate.shift();
          magneticxData.shift();
          magneticyData.shift();
          magneticzData.shift();
        }

        device.real[mac].accChart.setOption({
          xAxis: {
            data: accDate
          },
          series: [{
            data: accxData
          }, {
            data: accyData
          }, {
            data: acczData
          }]
        });
        device.real[mac].gyroChart.setOption({
          xAxis: {
            data: gyroDate
          },
          series: [{
            data: gyroxData
          }, {
            data: gyroyData
          }, {
            data: gyrozData
          }]
        });
        device.real[mac].magneticChart.setOption({
          xAxis: {
            data: magneticDate
          },
          series: [{
            data: magneticxData
          }, {
            data: magneticyData
          }, {
            data: magneticzData
          }, ]
        });
        break;
    }
  }
  let device = {
    real: {
      temp: {}
    },
    real2: [], //真实的mac
    virtualSensor: [], //添加的chart的virtual Mac会在这里
    virtualMacArr: false, //总的virtual MAC 会shift头mac
    macRouterMap: {},
    newItem: false
  };

  var chartInit = function(n, mac) {
    let _mac = mac || 'temp',
      _n = n - 1
    device.real[_mac].accChart = echarts.init($('.acc')[_n]);
    device.real[_mac].gyroChart = echarts.init($('.gyro')[_n]);
    device.real[_mac].magneticChart = echarts.init($('.magnetic')[_n]);
    device.real[_mac].lightChart = echarts.init($('.light')[_n]);
    // device.real[_mac].temperatureChart = echarts.init($('.temperature')[_n]);
    device.real[_mac].humChart = echarts.init($('.hum')[_n]);
    device.real[_mac].pressureChart = echarts.init($('.pressure')[_n]);

    let tooltip = {
      trigger: 'axis',
      // formatter: function (params) {
      //     params = params[0];
      //     let date = new Date(params.name);
      //     return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '</br>' ;
      // },
    };
    let xAxis = {
      nameLocation: 'middle',
      name: 'Time(Seconds)',
      type: 'category',
      boundaryGap: false,
      data: [],
      nameGap: 20
    }
    let grid = {
      left: '3%',
      right: '0%',
      bottom: '6%',
      containLabel: true
    };

    device.real[_mac].accChart.setOption({
      title: {
        text: lang[lang.useLang].Accelerometer
      },
      tooltip: {
        trigger: 'axis',
      },
      /*
                  legend: {
                      data: ['x', 'y', 'z']
                  },*/
      xAxis: xAxis,
      yAxis: {
        name: 'm/s²'
      },
      grid: grid,
      series: [{
        name: 'x',
        type: 'line',
        sampling: 'average'
      }, {
        name: 'y',
        type: 'line',
        sampling: 'average'
      }, {
        name: 'z',
        type: 'line',
        sampling: 'average'
      }]
    });

    device.real[_mac].gyroChart.setOption({
      title: {
        text: lang[lang.useLang].Gyroscope
      },
      tooltip: tooltip,
      xAxis: xAxis,
      yAxis: {
        name: '°/S'
      },
      grid: grid,
      series: [{
        name: 'x',
        type: 'line',
        sampling: 'average',
      }, {
        name: 'y',
        type: 'line',
        sampling: 'average',
      }, {
        name: 'z',
        type: 'line',
        sampling: 'average',
      }]
    });
    device.real[_mac].magneticChart.setOption({
      title: {
        text: lang[lang.useLang].Magneto
      },
      tooltip: tooltip,
      xAxis: xAxis,
      yAxis: {
        name: 'uT'
      },
      grid: grid,
      series: [{
          name: 'x',
          type: 'line',
          sampling: 'average'
        }, {
          name: 'y',
          type: 'line',
          sampling: 'average'
        }, {
          name: 'z',
          type: 'line',
          sampling: 'average'
        },
        /*{
                       name: 'r',
                       type: 'line',
                       sampling: 'average'
                   }*/
      ]
    })
    device.real[_mac].lightChart.setOption({
      title: {
        text: lang[lang.useLang].Digitlight
      },
      tooltip: tooltip,
      xAxis: xAxis,
      yAxis: {
        name: 'lux'
      },
      grid: grid,
      series: [{
        name: lang[lang.useLang].Digitlight,
        type: 'line',
        sampling: 'average'
      }]
    });

    // device.real[_mac].temperatureChart.setOption({
    //   title: {
    //     text: lang[lang.useLang].Temperature
    //   },
    //   tooltip: tooltip,
    //   xAxis: xAxis,
    //   yAxis: {
    //     name: '℃'
    //   },
    //   grid: grid,
    //   series: [{
    //     name: lang[lang.useLang].Temperature,
    //     type: 'line',
    //     sampling: 'average'
    //   }]
    // });

    device.real[_mac].humChart.setOption({
      title: {
        text: lang[lang.useLang].Humidity
      },
      tooltip: tooltip,
      xAxis: xAxis,
      yAxis: {
        name: 'rh%'
      },
      grid: grid,
      series: [{
        name: lang[lang.useLang].Humidity,
        type: 'line',
        sampling: 'average'
      }]
    });
    device.real[_mac].pressureChart.setOption({
      title: {
        text: lang[lang.useLang].Pressure
      },
      tooltip: tooltip,
      xAxis: xAxis,
      yAxis: {
        name: 'kPa'
      },
      grid: grid,
      series: [{
        name: lang[lang.useLang].Pressure,
        type: 'line',
        sampling: 'average'
      }]
    });
    mac === 'temp' ? device.real[_mac].created = true : 0;
  };
  chartInit(1);

  let deviceDataInit = {
    accxData: [],
    accyData: [],
    acczData: [],
    accDate: [],
    gyroxData: [],
    gyroyData: [],
    gyrozData: [],
    gyroDate: [],
    lightData: [],
    lightDate: [],
    noiseData: [],
    noiseDate: [],
    // temperatureData: [],
    // temperatureDate: [],
    humData: [],
    humDate: [],
    pressureData: [],
    pressureDate: [],
    magneticDate: [],
    magneticxData: [],
    magneticyData: [],
    magneticzData: [],
    magnetometerRData: []
  };

  function createChart(n, name, mac) {
    let chartHtmlStr = function() {
      return `<hr class="chart-separator-line">
            <div class="chart" data-mac='${mac}'>
            <div class="content-header">
                <span class="in-line-block bold-text device-font">Device #${n}</span>
                <span class="name"></span>
                <span id="` + mac + `" class="in-line-block-margin-padding bold-text"><b>MAC：` + mac + `</b></span>
                <span class="hidden">状态:</span>
                <span class="status hidden">在线</span>
            </div>
            <div class="row">
              <div class="col-md-4"><div class="hum pic"></div></div>
              <div class="col-md-4"><div class="light pic"></div></div>
              <div class="col-md-4"><div class="pressure pic"></div></div>
            </div>
            <div class="row">
             <div class="col-md-4"> <div class="gyro pic"></div></div>
              <div class="col-md-4"><div class="acc pic"></div></div>
              <div class="col-md-4"><div class="magnetic pic"></div></div>`;
    };
    let chartList = $('#graphic .chart');
    if (chartList[0].dataset.mac === '') {
      chartList[0].dataset.mac = mac;
      //$(chartList[0]).find('span')[0].innerHTML = name;
      device.real[mac].created = true;
    } else {
      $('#graphic').append(chartHtmlStr());
      chartInit(n, mac);
      // $('#graphic .message').eq(n-1).children('b').html(`Mac:${mac}`);
      //id_mac_str = "#" + mac;
      $('#graphic .chart:eq(1)').find('b').html(`MAC: ${mac}`);
      $('#graphic .chart')[n - 1].dataset.mac = mac;
    }
  }
});