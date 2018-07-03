'use strict'
Zepto(function ($) {

	var lang = {
		en: {
			'SamplingFrequency': 'Sampling Frequency',
			'RefreshRate': 'Refresh Rate',
			'connect': 'Connect',
			'disconnectAll': 'DisconnectAll',
			'receivepacket': 'Receive packet',
			'Accelerometer': 'Accelerometer',
			'Gyroscope': 'Gyroscope',
			'Magneto': 'Magneto-meter',
			'Humidity': 'Humidity',
			'Pressure': 'Pressure',
			'Temperature': 'Temperature',
			'Acoustic': 'Acoustic',
			'Digitlight': 'Digit light'

		},
		cn: {
			'SamplingFrequency': '采样频率',
			'RefreshRate': '页面刷新频率',
			'connect': '连接',
			'disconnectAll': '断开所有连接',
			'receivepacket': '收到数据包:',
			'Accelerometer': '加速度',
			'Gyroscope': '陀螺仪',
			'Magneto': '磁感',
			'Humidity': '湿度',
			'Pressure': '压力',
			'Temperature': '温度',
			'Acoustic': '声感',
			'Digitlight': '光照'
		},
		useLang: getCookie('useLang') || 'en'
	}

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
			temperatureData: [],
			temperatureDate: [],
			humData: [],
			humDate: [],
			pressureData: [],
			pressureDate: [],
			magneticDate: [],
			magneticxData: [],
			magneticyData: [],
			magneticzData: [],
			magnetometerRData: []
		},
		connectNum = 0,
		tempIndex = 0

	let device = {
		fre1: '64000000',
		fre2: 1000,
		real: {
			temp: {}
		},
		real2: [], //真实的mac
		virtualSensor: [], //添加的chart的virtual Mac会在这里
		virtualMacArr: false, //总的virtual MAC 会shift头mac
		macRouterMap: {},
		newItem: false
	}

	$('#lang').on('change', function () {
		if (this.value === 'en') {
			lang.useLang = 'en'
		} else {
			lang.useLang = 'cn'
		}
		setCookie('useLang', lang.useLang, 100)
		location.reload()
	})

	$('#frequency').on('change', function () {
		$('#frequencyData').html(this.value)
		let fre = Math.floor(1000 / this.value).toString(16)
		device.fre1 = lsbToMsb(fre, 4)
		// console.log(device.fre1)

	})
	$('#refresh').on('change', function () {
		$('#refreshData').html(this.value)
		device.fre2 = Math.floor(1000 / this.value)
		console.log(device.fre2)

	})
	let lsbToMsb = function (string, totalbyte) {
		let length = string.length,
			_string = string,
			n = 1,
			str = _string
		if (length % 2) {
			_string = '0' + _string
			length++
		}
		if (parseInt(_string, 16) > 256) {
			str = ''
			while (length - 2 * n >= 0) {
				str += _string.substr(length - 2 * n, 2)
				n++
			}
		}
		while (str.length < totalbyte * 2) {
			str = str + '00'
		}
		return str
	}

	function changeSelectLangShow() {
		$('#lang').val(lang.useLang)
	}

	function changeUiLangShow() {
		var text = ''
		$('.i18n').each(function () {
			text = lang[lang.useLang][$(this).attr('i18n')]
			if (text) {
				$(this).html(text)
			}
		})
	}
	changeSelectLangShow()
	changeUiLangShow()

	let chartInit = function (n, mac) {
		let _mac = mac || 'temp',
			_n = n - 1
		device.real[_mac].accChart = echarts.init($('.acc')[_n])
		device.real[_mac].gyroChart = echarts.init($('.gyro')[_n])
		device.real[_mac].lightChart = echarts.init($('.light')[_n])
		device.real[_mac].noiseChart = echarts.init($('.noise')[_n])
		device.real[_mac].temperatureChart = echarts.init($('.temperature')[_n])
		device.real[_mac].humChart = echarts.init($('.hum')[_n])
		device.real[_mac].pressureChart = echarts.init($('.pressure')[_n])
		device.real[_mac].magneticChart = echarts.init($('.magnetic')[_n]);
		(function () {
			let tooltip = {
				trigger: 'axis',
				// formatter: function (params) {
				//     params = params[0];
				//     let date = new Date(params.name);
				//     return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '</br>' ;
				// },
			};

			let grid = {
				left: '3%',
				right: '0%',
				bottom: '3%',
				containLabel: true
			};

			let xAxis = {
				nameLocation: 'middle',
				name: 'time',
				type: 'category',
				boundaryGap: false,
				data: []
			};

			device.real[_mac].accChart.setOption({
				title: {
					text: lang[lang.useLang].Accelerometer
				},
				tooltip: {
					trigger: 'axis',
				},
				legend: {
					data: ['x', 'y', 'z']
				},
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
					sampling: 'average',
				}, {
					name: 'z',
					type: 'line',
					sampling: 'average',
				}]
			});

			device.real[_mac].gyroChart.setOption({
				title: {
					text: lang[lang.useLang].Gyroscope
				},
				tooltip: tooltip,
				xAxis: xAxis,
				yAxis: {
					name: 'm/s²'
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
			device.real[_mac].noiseChart.setOption({
				title: {
					text: lang[lang.useLang].Acoustic
				},
				tooltip: tooltip,
				xAxis: xAxis,
				yAxis: {
					name: 'dB'
				},
				grid: grid,
				series: [{
					name: lang[lang.useLang].Acoustic,
					type: 'line',
					sampling: 'average'
				}]
			});
			device.real[_mac].temperatureChart.setOption({
				title: {
					text: lang[lang.useLang].Temperature
				},
				tooltip: tooltip,
				xAxis: xAxis,
				yAxis: {
					name: '℃'
				},
				grid: grid,
				series: [{
					name: lang[lang.useLang].Temperature,
					type: 'line',
					sampling: 'average'
				}]
			});
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
			device.real[_mac].magneticChart.setOption({
				title: {
					text: lang[lang.useLang].Magneto
				},
				tooltip: tooltip,
				xAxis: xAxis,
				yAxis: {
					name: 'T'
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
				}, {
					name: 'r',
					type: 'line',
					sampling: 'average'
				}]
			})
			_mac === 'temp' ? device.real[_mac].created = true : 0;
		})()
	}

	chartInit(1)



	let createChart = function (n, name, mac) {
		let chartHtmlStr = function () {
			return `<div class="chart clearfix" data-mac='${mac}'>
            <div class="message">
                <h2>XDK${n}&nbsp;</h2>
                <span class="name">${name}</span>
				<b>Mac:${mac}</b>
                <span class="hidden">状态:</span>
                <span class="status hidden">在线</span>
                <i>${lang[lang.useLang].receivepacket}:</i>
                <span class="packNum">0</span>
				<time></time>
            </div>
            <div class="acc pic"></div>
            <div class="gyro pic"></div>
            <div class="light pic"></div>
            <div class="noise pic"></div>
            <div class="temperature pic"></div>
            <div class="hum pic"></div>
            <div class="pressure pic"></div>
            <div class="magnetic pic"></div>
        </div>`
		}

		let chartList = $('#graphic .chart')
		if (chartList[0].dataset.mac === '') {
			chartList[0].dataset.mac = mac
			$(chartList[0]).find('span')[0].innerHTML = name
			device.real[mac].created = true
		} else {
			$('#graphic').append(chartHtmlStr())
			chartInit(n, mac)
		}
	}



	let hubIP = '',
		devicesName = '',
		deviceNameInit = 'BCDS_Virtual_Sensor',
		reg_ip = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/,
		reg_mac = /\w+/i,
		dd, bosch = null

	if (localStorage.bosch) {
		bosch = JSON.parse(localStorage.bosch)
		if (reg_ip.test(bosch[0])) {
			$('#hub_ip').val(bosch[0])
			$('#device_name').val(bosch[1])
		}
	}

	function getIpMac() {
		hubIP = $('#hub_ip').val().trim()
		devicesName = $('#device_name').val().trim()
		if (!reg_ip.test(hubIP)) {
			alert('hubIP Error')
			return false
		}
		localStorage.setItem('bosch', JSON.stringify([hubIP, devicesName]))
		return true
	}
	let nameInit = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M']
	let dataHandle = function (hub, data) {
		if (data !== 'keep-alive') {
			let _data = JSON.parse(data)
			dd = dataParse(_data.value, _data.id)
			notify(dd)
			// virtualSensor(dd, notify, 13, nameInit, 1000)
		}
	}



	/**
	 * api {String }  
	 * args  {Array} [api.hub,event.data]
	 */

	let scanHandle = function (hub, args) {
		if (args !== 'keep-alive') {
			let data = JSON.parse(args),
				mac = data.bdaddrs[0].bdaddr,
				type = data.bdaddrs[0].bdaddrType
			if ((data.name) === devicesName || (data.name) === deviceNameInit) {
				if (!device.real[mac]) {
					device.newItem = true
					device.real[mac] = {
						name: data.name,
						type: type,
						connect: false,
						created: false,
						lastConnect: 1
					}
					if (connectNum === 0) {
						$.extend(true, device.real[mac], device.real.temp)
						delete device.real.temp
					}
				}
			}

		}
		if (device.newItem) {
			// device.newItem = false
			let newConnect = new Date().getTime()
			for (let i in device.real) {
				if (!device.real[i].connect) {
					let lastConnect = device.real[i].lastConnect
					if (lastConnect && (newConnect - lastConnect <= 5000))
						return
					device.real[i].lastConnect = newConnect
					console.log('正在连接', i)
					api.conn({
						node: i,
						type: device.real[i].type,
						success: function (hub, mac, data) {
							//防止连接多次 多次返回连接成功  多次执行本函数
							if (device.real[mac].connect)
								return
							device.real[mac].connect = true
							device.real2.push(mac)
							connectNum = connectedDeviceCount(device)
							if (connectNum === 1) {
								$('#graphic .message').eq(0).children('b').html(`Mac:${mac}`)
								$('#graphic .chart')[0].dataset.mac = i
								$('#graphic .name')[0].innerHTML = device.real[i].name
							} else {
								!device.real[mac].created && createChart(connectNum, device.real[i].name, mac)
							}

							$.extend(true, device.real[mac], deviceDataInit)
							device.real[mac].lastnotify = {}
							device.real[mac].mes = {
								mesCounts: 0,
								counts: $('.packNum')[connectNum - 1]
							}
							writeSpecialValue(mac)
							// debugger
						}
					})
				}
			}
		}
	}

	let connectedDeviceCount = function (device) {
		let n = 0;
		for (let i in device.real) {
			if (device.real[i].connect && !device.real[i].virtual) {
				n++
			}
		}
		console.log('n', n)
		return n
	}



	$('#disconnect').on('click', function () {
		if (!getIpMac()) {
			return
		}
		api
			.use({
				server: hubIP,
				hub: ''
			})
			.devices({
				server: hubIP,
				hub: '',
				success: function (data) {
					if(!data.nodes.forEach){
						location.reload();
						return;
					} 
					data.nodes.forEach(item => {
						item.id
						api.disconn({
							node: item.id,
							success: function () {
								location.reload()
							}
						})
					})
				}
			})
		// .disconn({
		// 	node: devicesMac
		// })
	})


	$('#connect').on('click', function () {
		//此接口用于连接设备
		if (!getIpMac()) {
			return
		}
		api
			.use({
				server: hubIP,
				hub: ''
			})
			.on('notify', dataHandle)
			.scan(0)
			.on('scan', scanHandle)
	})

	function fillData(dataArr, timeArr, data, time) {
		if (dataArr.length > 10 || timeArr.length > 10) {
			dataArr.shift()
			timeArr.shift()
		}
		dataArr.push(data)
		timeArr.push(time)
	}



	function notify(value) {
		// debugger
		let mac = value.id
		if (typeof device.real[mac] === 'undefined')
			return
		device.real[mac].mes.counts.innerHTML = ++device.real[mac].mes.mesCounts
		if (!device.real[mac].lastnotify[value.type]) {
			device.real[mac].lastnotify[value.type] = 0
		}


		if (device.real[mac].lastnotify === 0) {
			let time = 0;
			setInterval(function () {
				time++
				debugger
				$(`.chart[data-mac='${mac}']`).find('time')[0].innerHTML = `${time}s  ${(device.real[mac].mes.mesCounts/time).toFixed(2)}个/s`
				// $(`.chart[data-mac='${mac}']`).find('time')[0].innerHTML = time + 's'
			}, 1000)
		}
		if (new Date() - device.real[mac].lastnotify[value.type] < device.fre2) {
			console.log('丢弃数据')
			return
		}
		device.real[mac].lastnotify[value.type] = new Date()
		let accxData = device.real[mac].accxData,
			accyData = device.real[mac].accyData,
			acczData = device.real[mac].acczData,
			accDate = device.real[mac].accDate,
			gyroxData = device.real[mac].gyroxData,
			gyroyData = device.real[mac].gyroyData,
			gyrozData = device.real[mac].gyrozData,
			gyroDate = device.real[mac].gyroDate,
			lightData = device.real[mac].lightData,
			lightDate = device.real[mac].lightDate,
			noiseData = device.real[mac].noiseData,
			noiseDate = device.real[mac].noiseDate,
			temperatureData = device.real[mac].temperatureData,
			temperatureDate = device.real[mac].temperatureDate,
			humData = device.real[mac].humData,
			humDate = device.real[mac].humDate,
			pressureData = device.real[mac].pressureData,
			pressureDate = device.real[mac].pressureDate,
			magneticDate = device.real[mac].magneticDate,
			magneticxData = device.real[mac].magneticxData,
			magneticyData = device.real[mac].magneticyData,
			magneticzData = device.real[mac].magneticzData,
			magnetometerRData = device.real[mac].magnetometerRData;
		//收到数据后调用这个接口通知我
		// debugger
		if (accDate.length >= 10) {
			accxData.shift();
			accyData.shift();
			acczData.shift();
			accDate.shift();
		}

		if (gyroDate.length >= 10) {
			gyroxData.shift();
			gyroyData.shift();
			gyrozData.shift();
			gyroDate.shift();
		}

		if (lightData.length >= 10) {
			lightData.shift();
			lightDate.shift();
			noiseData.shift();
			noiseDate.shift();
			temperatureData.shift();
			temperatureDate.shift();
			humData.shift();
			humDate.shift();
			pressureData.shift();
			pressureDate.shift();
		}

		if (magneticxData.length >= 10) {
			magnetometerRData.shift();
			magneticxData.shift();
			magneticyData.shift();
			magneticzData.shift();
			magneticDate.shift();
		}
		let date = new Date(value.time);
		let dateStr = [date.getHours(), date.getMinutes(), date.getSeconds()].join(':');
		switch (value.type) {

			case 'ag':
				accDate.push(dateStr);
				accxData.push(value.acc[0])
				accyData.push(value.acc[1])
				acczData.push(value.acc[2])

				gyroDate.push(dateStr);
				gyroxData.push(value.gyro[0])
				gyroyData.push(value.gyro[1])
				gyrozData.push(value.gyro[2])

				break;
			case 'en':
				lightData.push(value.light);
				lightDate.push(dateStr);
				noiseData.push(value.noise);
				noiseDate.push(dateStr);
				temperatureData.push(value.temperature);
				temperatureDate.push(dateStr);
				humData.push(value.hum);
				humDate.push(dateStr);
				pressureData.push(value.pressure);
				pressureDate.push(dateStr);

				break;
			case 'ma':
				magneticDate.push(dateStr);
				magneticxData.push(value.ma[0])
				magneticyData.push(value.ma[1])
				magneticzData.push(value.ma[2])
				magnetometerRData.push(value.mar)

				break;
		}

		function refChart(type) {
			switch (type) {
				case 'ag':
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
					break;
				case 'en':
					device.real[mac].lightChart.setOption({
						xAxis: {
							data: lightDate
						},
						series: [{
							data: lightData
						}]
					});
					device.real[mac].noiseChart.setOption({
						xAxis: {
							data: noiseDate
						},
						series: [{
							data: noiseData
						}]
					});
					device.real[mac].temperatureChart.setOption({
						xAxis: {
							data: temperatureDate
						},
						series: [{
							data: temperatureData
						}]
					});

					device.real[mac].humChart.setOption({
						xAxis: {
							data: humDate
						},
						series: [{
							data: humData
						}]
					});
					device.real[mac].pressureChart.setOption({
						xAxis: {
							data: pressureDate
						},
						series: [{
							data: pressureData
						}]
					});
					break;
				case 'ma':
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
						}, {
							data: magnetometerRData
						}]
					})
					break;
			}
		}
		refChart(value.type);
	}


	let writeSpecialValue = function (mac) {
		// device[arg[1]].connect=true
		api.write({
			node: mac,
			handle: 59,
			value: device.fre1,
			success: function () {
				api.write({
					node: mac,
					handle: 57,
					value: '01'
				});
				api.write({
					node: mac,
					handle: 65,
					value: '01'
				})
			}
		});
		// api.write({
		// 	node: mac,
		// 	handle: 59,
		// 	value: device.fre1
		// })

	};

	let dataParse = function (str, id) {
		let reverseByte = function (str) {
			let temp = '',
				i = str.length
			for (i; i >= 2; i -= 2) {
				temp += str[i - 2] + str[i - 1]
			}
			return temp
		}
		let splitString = function (str, byte1, byte2) {
			function sum(arr, index) {
				let _arr = arr.slice(0, index)
				if (_arr.length !== 0) {
					return _arr.reduce(function (prev, cur, index, arr) {
						return prev + cur
					})
				}
				return 0
			}

			let temp = [],
				byteArr = Array.prototype.slice.call(arguments, 1),
				length = byteArr.length
			byteArr = byteArr.map(function (item) {
				return item * 2
			})
			for (let i = 0; i < length; i++) {
				temp.push(parseInt(reverseByte(str.substr(sum(byteArr, i), byteArr[i])), 16))
			}
			return temp
		}


		let _data = null,
			hiData = [],
			lowData1 = [],
			lowData2 = [],
			acc = [],
			gyro = [],
			light = [],
			noise = [],
			pressure = [],
			temperature = [],
			hum = [],
			sdCard = [],
			buttonStatus = [],
			magnetometer = [],
			magnetometerR = [],
			ledStatus = [],
			temp = str.substr(0, 2)


		if (temp === '01') {
			lowData1.push(str.substring(2))
			lowData1.forEach(function (item, index) {
				let temp = splitString(item, 4, 1, 4, 4, 4, 1, 1)
				light.push(temp[0] / 1000)
				noise.push(temp[1])
				pressure.push(temp[2] / 1000)
				temperature.push(temp[3] / 1000)
				hum.push(temp[4])
				sdCard.push(temp[5])
				buttonStatus.push(temp[6])
			})
			return {
				id: id,
				time: new Date().getTime(),
				type: 'en',
				light: light[0],
				noise: noise[0],
				pressure: pressure[0],
				hum: hum[0],
				temperature: temperature[0]
			}

		}
		if (temp === '02') {
			lowData2.push(str.substring(2))
			lowData2.forEach(function (item, index) {
				let temp = splitString(item, 2, 2, 2, 2, 1)
				magnetometer.push({
					x: temp[0],
					y: temp[1],
					z: temp[2]
				})
				magnetometerR.push(temp[3])
				ledStatus.push(temp[4])
				// console.log('Ma', {
				// 	x: temp[0],
				// 	y: temp[1],
				// 	z: temp[2]
				// })
			})

			return {
				id: id,
				time: new Date().getTime(),
				type: 'ma',
				ma: [magnetometer[0].x, magnetometer[0].y, magnetometer[0].z],
				mar: magnetometerR[0]
			}
		}

		hiData.push(str)
		hiData.forEach(function (item, index) {
			acc.push({
				x: parseInt(reverseByte(item.substr(0, 4)), 16) / 1000,
				y: parseInt(reverseByte(item.substr(4, 4)), 16) / 1000,
				z: parseInt(reverseByte(item.substr(8, 4)), 16) / 1000
			})
			// console.log('acc', {
			// 	x: parseInt(reverseByte(item.substr(0, 4)), 16) / 1000,
			// 	y: parseInt(reverseByte(item.substr(4, 4)), 16) / 1000,
			// 	z: parseInt(reverseByte(item.substr(8, 4)), 16) / 1000
			// });
			gyro.push({
				x: parseInt(reverseByte(item.substr(12, 4)), 16) / 1000,
				y: parseInt(reverseByte(item.substr(16, 4)), 16) / 1000,
				z: parseInt(reverseByte(item.substr(20, 4)), 16) / 1000
			})


			// console.log('gyro', {
			// 	x: parseInt(reverseByte(item.substr(12, 4)), 16) / 1000,
			// 	y: parseInt(reverseByte(item.substr(16, 4)), 16) / 1000,
			// 	z: parseInt(reverseByte(item.substr(20, 4)), 16) / 1000
			// });
		})

		return {
			id: id,
			time: new Date().getTime(),
			type: 'ag',
			acc: [acc[0].x, acc[0].y, acc[0].z],
			gyro: [gyro[0].x, gyro[0].y, gyro[0].z]
		}
	}


	/**
	 * 
	 * 
	 * @param {any} sensorNum 
	 * @param {any} addInterval 
	 */
	function virtualMoreSensor(sensorNum, nameArr, addInterval) {


		/**
		 * @param {number} sensorNum 虚拟MAC的个数
		 */
		let creatSensorNumMac = function (sensorNum) {
				let macArr = [],
					temp, tempArr
				for (let i = 0; i < sensorNum * 6; i++) {
					temp = (Math.floor(Math.random() * 256)).toString(16)
					temp = temp.toUpperCase()
					temp = temp.length < 2 ? '0' + temp : temp
					tempArr = macArr[parseInt(i / 6, 10)]
					if (typeof tempArr === 'undefined') {
						macArr.push(temp)
						tempArr = macArr[macArr.length - 1]
					} else {
						macArr[parseInt(i / 6, 10)] += ':' + temp
					}
				}
				return macArr
			},
			virtualMacArr, timer = null,
			virtualMac, index = 0
		if (device.virtualMacArr === false) {
			device.virtualMacArr = []
			device.virtualMacArr = creatSensorNumMac(sensorNum)
			timer = setInterval(function () {
				if (device.virtualMacArr.length !== 0) {
					virtualMac = device.virtualMacArr.shift()
					device.real[virtualMac] = {
						name: nameArr[index],
						created: false,
						connect: true,
						virtual: true,
						lastnotify: {},
						mes: {
							mesCounts: 0,
							counts: $('.packNum')[connectNum + device.virtualSensor.length - 1]
						}
					}
					$.extend(true, device.real[virtualMac], deviceDataInit)
					device.virtualSensor.push(virtualMac)
					createChart(connectNum + device.virtualSensor.length, nameArr[index], virtualMac)
					createVirtualDataControl(virtualMac)
					index++
				} else {
					// debugger
					clearInterval(timer)
				}
			}, addInterval + Math.floor(Math.random() * 2000))
		}



	}

	function createVirtualData(data) {
		let _data = $.extend(true, {}, data)
		_data.time += randomData(2000, 4000)

		function randomData(min = 0, max = 5) {
			return Math.floor(Math.random() * (max - min) + min)
		}
		for (let k in _data) {
			let min = 0,
				max = 5
			if (_data[k] instanceof Array) {
				if (k === 'acc') {
					min = 0
					max = 5
				} else if (k === 'gyro') {
					min = 0
					max = 3
				} else if (k === 'ma') {
					min = 0
					max = 10
				}
				_data[k].map(item => item + randomData(min, max))
			} else if (k === 'mar') {
				_data[k] += randomData(0, 20)
			} else if (k === 'light') {
				// _data[k] += randomData(0, 10)
			} else if (k === 'pressure' || k === 'temperature') {
				// _data[k] += Math.random()
			}
		}
		return _data
	}

	function createVirtualDataControl(virtualMac) {
		// debugger
		let mac = device.real2[tempIndex]
		if (!device.macRouterMap[mac]) {
			device.macRouterMap[mac] = []
		}
		device.macRouterMap[mac].push(virtualMac)
		tempIndex++
		if (tempIndex === device.real2.length) {
			tempIndex = 0
		}
		// debugger
	}

	function publisVirtualhData(data, notify) {
		// debugger
		let mac = data.id
		if (device.macRouterMap[mac]) {
			device.macRouterMap[mac].forEach(item => {
				data.id = item
				notify(data)
			})
		}
	}
	// virtualMoreSensor(3, ['wang', 'ran', 'wangg'], 1000)

	function virtualSensor(data, notify, sensorNum, nameArr, addInterval) {
		let virtualData
		if (connectNum === 3) {
			// debugger
			virtualMoreSensor(sensorNum, nameArr, addInterval)
			virtualData = createVirtualData(data)
			publisVirtualhData(virtualData, notify)
		}
	}



})