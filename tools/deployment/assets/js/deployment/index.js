document.addEventListener('DOMContentLoaded', () => {
	var hubIP;
    var deviceMacArr = [],
        connDone = [],
        testingHis = [],
        scannedDev = [];
    var device = {},
        scan_table_mapping = {},
        conn_table_mapping = {},
        connDevice = {isConnecting: false},
        startTime = {},
        connCount = {};
    var time = (timeout = connTimes = 0);
    var timer = null,
        connTimer = null;


    $('#clear').on('click', () => {
        location.reload();
    });

    // 第一次打开页面弹出提示框，提醒设置网关跨域
	if (!localStorage.getItem('bluetooth_tech_cross_origin_tip_shown')) {
		alert(
			'请前往网关设置跨域选项，否则页面无法正常访问网关接口。\n please set the cross-origin option in the gateway settings, otherwise the page cannot access the gateway interface properly.',
		);
		localStorage.setItem('bluetooth_tech_cross_origin_tip_shown', '1');
	}

    function getUrlVars() {
        var vars = [],
            hash;
        var hashes = window.location.href
            .slice(window.location.href.indexOf('?') + 1)
            .split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }

    // if (getUrlVars()) {
    //     hubMac = getUrlVars()['hubMac'];
    //     $('#hubMac').val(hubMac);
    // }

    $('#export').on('click', () => {
        var content = JSON.stringify(testingHis);
        var data = new Blob([content], {type: 'text/plain;charset=UTF-8'});
        var downloadUrl = window.URL.createObjectURL(data);
        var anchor = document.createElement('a');
        anchor.href = downloadUrl;
        const formattedDate = new Date().toDateString();
        const date = new Date();
        // The above yields e.g. 'Mon Jan 06 2020'
        const [, month, day, year] = formattedDate.split(' ');
        const ddMmmYyyy = `${day}-${month}-${year}`;
        anchor.download = `testing-report-${ddMmmYyyy}-${date.getHours()}-${date.getMinutes()}.txt`;
        anchor.click();
        window.URL.revokeObjectURL(data);
    });

    function validateMac(macs) {
        var regex = /^([0-9a-fA-F]{2})(([/\s:][0-9a-fA-F]{2}){5})$/;
        for (let i = 0, len = deviceMacArr.length; i < len; i++) {
            if (deviceMacArr[i] == '') {
                $('.tip.error').show();
                return false;
            }
            if (!regex.test(deviceMacArr[i])) {
                $('.tip.error').children().text('MAC address is incorrect');
                $('.tip.error').show();
                return false;
            }
        }
        return true;
    }

    function validateOfScan(macs) {
        var regex = /^([0-9a-fA-F]{2})(([/\s:][0-9a-fA-F]{2}){5})$/;
        for (let i = 0, len = deviceMacArr.length; i < len; i++) {
            if (!deviceMacArr[i].includes('*') && !regex.test(deviceMacArr[i])) {
                $('.tip.error').children().text('MAC address is incorrect');
                $('.tip.error').show();
                return false;
            }
        }
        return true;
    }

    function scanTimeoutCallback() {
        for (var i = deviceMacArr.length - 1; i >= 0; i--) {
            let mac = deviceMacArr[i];
            if (!connDevice[mac]) {
                connDevice[mac] = {
                    minTime: 0,
                    maxTime: 0,
                    totalTime: 0,
                    success: 0,
                    fail: 0,
                    sr: 0,
                    times: [],
                    type: 'public',
                    count: 0,
                    mac: mac,
                };
            }
            scannedDev.push(connDevice);
        }
    }

    function xssFilter() {
        $('#scanTimeout').val(filterXSS($('#scanTimeout').val()));
        $('#deviceMacArr').val(filterXSS($('#deviceMacArr').val()));
        $('#deviceName').val(filterXSS($('#deviceName').val()));
        $("#connTimeout").val(filterXSS($("#connTimeout").val()));
        $('#connTimes').val(filterXSS($('#connTimes').val()));
    }

    	// 自动填充 hubIP
	if (localStorage.getItem('hubIP')) {
		$('#hubIP').val(localStorage.getItem('hubIP'));
	}

    let chipVal = 0;
    $('#chip').on('change', function() {
        chipVal = $(this).val();
    });

    $('#startScan').on('click', function () {
        xssFilter();
        $('#scan_tab > tbody').html('');
        scan_table_mapping = {};
        device = {};
        hubIP = $('#hubIP').val().trim();
        localStorage.setItem('hubIP', hubIP);
        timeout = parseInt($('#scanTimeout').val().trim()) || 60;
        if (timeout <= 0) {
            alert('scan timeout must be > 0');
            return;
        }
        deviceMacArr = $('#deviceMacArr').val().trim().split('\n');
        deviceNames = $('#deviceName').val().trim().split('\n');
        // var regex = /^([0-9a-fA-F]{2})(([/\s:][0-9a-fA-F]{2}){5})$/;
        deviceMacArr = unique(deviceMacArr, true);
        deviceNames = unique(deviceNames);

        var filter = {
            filter_mac: deviceMacArr,
            filter_name: deviceNames,
        };

        var params = Object.keys(filter)
            .map(function (key) {
                if (typeof filter[key] === 'string') {
                    return (
                        encodeURIComponent(key) + '=' + encodeURIComponent(filter[key])
                    );
                } else {
                    return encodeURIComponent(key) + '=' + filter[key].join(',');
                }
            })
            .join('&');
        params += `&chip=${chipVal}` 

        // if(!validateOfScan(deviceMacArr))return;
        for (let i = 0, len = deviceMacArr.length; i < len; i++) {
            $('.tip.error').hide();
            // domInit(deviceMacArr[i], i, 'scan');
        }
        let startTime = null;
        let timeoutDuration = 1000 * timeout; // 60 seconds
        function updateTimer(timestamp) {
            if (!startTime) {
                startTime = timestamp;
            }

            const elapsedTime = timestamp - startTime;
            const time = Math.floor(elapsedTime / 1000);
            const timeout = Math.floor((timeoutDuration - elapsedTime) / 1000);

            // document.getElementById('time').innerHTML = `${time}s`;
            // document.getElementById('timeout').innerHTML = `${timeout}s`;

            if (elapsedTime >= timeoutDuration) {
                document.getElementById('startScan').removeAttribute('disabled');
                document.getElementById('startConn').removeAttribute('disabled');
                // document.getElementById('loader').classList.remove('spinner');
                api.scan.close();
                device.testingType = 'scanning test';
                testingHis.push(device);

                // Perform cleanup here
                const macElements = document.querySelectorAll('#scan_tab > tbody > tr > td:nth-child(4)');
                macElements.forEach((element) => {
                    const mac = element.innerHTML.replace(/:/g, '');
                    document.getElementById(mac).setAttribute('id', '');
                });
            } else {
                requestAnimationFrame(updateTimer);
            }
        }


        requestAnimationFrame(updateTimer);
        api
            .use({
				server: `${hubIP}`,
			})
            .scan(params)
            .on('scan', scan2conn);
        $('#startScan').attr('disabled', true);
        $('#startConn').attr('disabled', true);
        // $('#loader').addClass('spinner');
        startScanProgress(timeoutDuration)
    });

    $('#startConn').on('click', () => {
        xssFilter(); 
        $('#conn_tab > tbody').html('');
        let connTimeout = parseInt($('#connTimeout').val().trim()) || 10;
        conn_table_mapping = {};
        connDevice = {};
        scannedDev.length = 0;
        hubIP = $('#hubIP').val().trim();
		localStorage.setItem('hubIP', hubIP);
        connTimes = parseInt($('#connTimes').val().trim()) || 1;
        if (connTimes <= 0) {
            alert('connecting times must be > 0');
            $('#connTimes').val(1);
            return;
        }
        deviceMacArr = $('#deviceMacArr').val().trim().split('\n');
        // var regex = /^([0-9a-fA-F]{2})(([/\s:][0-9a-fA-F]{2}){5})$/;
        deviceMacArr = unique(deviceMacArr);
        if (!validateMac(deviceMacArr)) return;
        for (let i = 0, len = deviceMacArr.length; i < len; i++) {
            $('.tip.error').hide();
            domInit(deviceMacArr[i], i, 'conn');
        }
        connDevice.isConnecting = false;
        // let url = `api2/gap/nodes/?active=1&event=1&chip=0&mac=${routeMac}`;

        var connScanTimeout = setTimeout(scanTimeoutCallback, 60000);

        api
            .use({
				server: `${hubIP}`,
			})
            .scan()
            .on('scan', scanConn);
        // $('#loader').addClass('spinner');
        startConnProgress(60000)

        let i = setInterval(() => {
            for (let k in connDevice) {
                if (k === 'isConnecting') continue;
                if (connDevice[k].count < connTimes) {
                    if (connDevice.isConnecting) return;
                    api
                        .conn(
                            {
                                node: k,
                                type: connDevice[k].type,
                                chip: chipVal,
                                phy: connDevice[k].phy
                            },
                            connTimeout * 1000,
                        )
                        .on('conn', connCallback)
                        .on('connErr', connErr);
                    connDevice.isConnecting = true;
                    startTime[k] = Date.now();
                } else {
                    if (!connDone.includes(k)) connDone.push(connDevice[k].mac);
                    connDone.forEach((mac) => {
                        mac = mac.replace(/:/g, '');
                        $('#conn' + mac).attr('id', '');
                    });
                }
                if (connDone.length == deviceMacArr.length) {
                    api.scan.close();
                    delete connDevice.isConnecting;
                    connDevice.testingType = 'connecting test';
                    testingHis.push(connDevice);
                    (connDevice = {}), (connCount = {}), (connDone = []);
                    clearInterval(i);
                    $('#startConn').removeAttr('disabled');
                    $('#startScan').removeAttr('disabled');
                    $('#loader').removeClass('spinner');
                    showConnSuccess();
                }
            }
        }, 10);
        $('#startConn').attr('disabled', true);
        $('#startScan').attr('disabled', true);
    });
    $('#stopScan').on('click', function () {
        api.scan.close();
        clearInterval(timer);
    });

    var connCallback = (hub, node, status) => {
        console.log('connect success node: ' + node, 'status: ' + status);
        // showConnSuccess();
        connDevice[node].success += 1;
        connDevice[node].count += 1;
        mac = node.replace(/:/g, '');
        let endTime = (Date.now() - startTime[node]) / 1000;
        if (endTime < connDevice[node].minTime || connDevice[node].minTime === 0)
            connDevice[node].minTime = endTime.toFixed(1);
        if (endTime > connDevice[node].maxTime)
            connDevice[node].maxTime = endTime.toFixed(1);
        connDevice[node].totalTime += endTime;
        connDevice[node].times.push(endTime.toFixed(1));
        //console.log(device[deviceMac]);
        // let deviceInfo = $("#conn" + mac);
        // deviceInfo.children('p').eq(2).html("Min time£∫" + connDevice[node].minTime + 's');
        // deviceInfo.children('p').eq(3).html("Max time£∫" + connDevice[node].maxTime + 's');
        // deviceInfo.children('p').eq(4).html("ave time£∫" + (connDevice[node].totalTime / connDevice[node].success).toFixed(2) + 's');
        // deviceInfo.children('p').eq(5).html("success:" + connDevice[node].success + ', fail:' + connDevice[node].fail);
        // deviceInfo.children('p').eq(6).html("success rate:" + (connDevice[node].success / connTimes) * 100 + '%');
        // deviceInfo.children('p').eq(7).html("duration:" + connDevice[node].times);
        let deviceInfo = $('#conn_tab tbody');
        $('#' + mac).html(
            `<div style="position: relative;width: 700px; overflow: auto; white-space:nowrap;">${connDevice[
                node
                ].times.join(',')}</div>`,
        );
        // $('#' + mac).html(`<div style="position: relative;width: 700px;overflow: auto;">${connDevice[node].times.join(',')}</div>`);
        deviceInfo[0].rows[conn_table_mapping[node] - 1].cells[4].innerText =
            connDevice[node].minTime;
        deviceInfo[0].rows[conn_table_mapping[node] - 1].cells[5].innerText =
            connDevice[node].maxTime;
        deviceInfo[0].rows[conn_table_mapping[node] - 1].cells[6].innerText =
            connDevice[node].success > 0
                ? (connDevice[node].totalTime / connDevice[node].success).toFixed(1)
                : 0;
        deviceInfo[0].rows[conn_table_mapping[node] - 1].cells[7].innerText =
            connDevice[node].success;
        deviceInfo[0].rows[conn_table_mapping[node] - 1].cells[8].innerText =
            connDevice[node].fail;
        if (connDevice[node].count == connTimes) {
            deviceInfo[0].rows[conn_table_mapping[node] - 1].cells[9].innerText =
                parseInt((connDevice[node].success / connTimes) * 100) + '%';
        }
        setTimeout(() => {
            api
                .disconn({
                    node: node,
                })
                .on('disconn', disconn)
                .on('disconnErr', disconnErr);
        }, 5000);
    };

    var disconn = (hub, node, text) => {
        console.log(hub, node, text);
        connDevice.isConnecting = false;
        connTimer = setTimeout(scanTimeoutCallback, 30000);
    };

    var disconnErr = (hub, node, code, res) => {
        connDevice.isConnecting = false;
        connTimer = setTimeout(scanTimeoutCallback, 30000);
    };

    var connErr = (node, text, code, res) => {
        console.error('connect error: ' + node, text, code);
        // showConnFail();
        connDevice.isConnecting = false;
        connTimer = setTimeout(scanTimeoutCallback, 30000);
        connDevice[node].fail += 1;
        connDevice[node].times.push(`Fail(${res || 'error'})`);
        connDevice[node].count += 1;
        mac = node.replace(/:/g, '');
        //console.log(device[deviceMac]);
        // let deviceInfo = $("#conn" + mac);
        // deviceInfo.children('p').eq(2).html("Min time£∫" + connDevice[node].minTime + 's');
        // deviceInfo.children('p').eq(3).html("Max time£∫" + connDevice[node].maxTime + 's');
        // deviceInfo.children('p').eq(4).html("ave time£∫" + (connDevice[node].totalTime / connDevice[node].success).toFixed(1) + 's');
        // deviceInfo.children('p').eq(5).html("success:" + connDevice[node].success + ', fail:' + connDevice[node].fail);
        // deviceInfo.children('p').eq(6).html("success rate:" + (connDevice[node].success / connTimes) * 100 + '%');
        // deviceInfo.children('p').eq(7).html("duration:" + connDevice[node].times);
        let deviceInfo = $('#conn_tab tbody');
        $('#' + mac).html(
            `<div style="position: relative;width: 700px; overflow: auto; white-space:nowrap;">${connDevice[
                node
                ].times.join(',')}</div>`,
        );
        deviceInfo[0].rows[conn_table_mapping[node] - 1].cells[4].innerText =
            connDevice[node].minTime;
        deviceInfo[0].rows[conn_table_mapping[node] - 1].cells[5].innerText =
            connDevice[node].maxTime;
        deviceInfo[0].rows[conn_table_mapping[node] - 1].cells[6].innerText =
            connDevice[node].success > 0
                ? (connDevice[node].totalTime / connDevice[node].success).toFixed(2)
                : 0;
        deviceInfo[0].rows[conn_table_mapping[node] - 1].cells[7].innerText =
            connDevice[node].success;
        deviceInfo[0].rows[conn_table_mapping[node] - 1].cells[8].innerText =
            connDevice[node].fail;
        if (connDevice[node].count == connTimes) {
            deviceInfo[0].rows[conn_table_mapping[node] - 1].cells[9].innerText =
                parseInt((connDevice[node].success / connTimes) * 100) + '%';
        }
    };

    var scanConn = (hubMac, scanData) => {
        //console.log('hubMac: ' + hubMac, 'data: ' + data);
        if (scanData.match && scanData.match('keep')) return;
        let data = JSON.parse(scanData),
            deviceMac = data.bdaddrs[0].bdaddr,
            type = data.bdaddrs[0].bdaddrType,
            primaryPhy = data.primaryPhy,
            secondaryPhy = data.secondaryPhy || data.secondryPhy;
        if (deviceMacArr.indexOf(deviceMac) === -1) return;
        if (connDevice.isConnecting) return;
        if (!connDevice[deviceMac]) {
            connDevice[deviceMac] = {
                minTime: 0,
                maxTime: 0,
                totalTime: 0,
                success: 0,
                fail: 0,
                sr: 0,
                times: [],
                type: type,
                count: 0,
                mac: deviceMac,
            };

            if(primaryPhy && secondaryPhy){
                connDevice[deviceMac].phy = {
                    phy: primaryPhy,
                    secondaryPhy
                }
            }
        }
        if (!scannedDev.includes(deviceMac)) scannedDev.push(deviceMac);
        if (scannedDev.length == deviceMacArr.length) {
            clearTimeout(connTimer);
            api.scan.close();
            // showConnSuccess()
        }
    };
    const htmlEscapes = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    };
    const reUnescapedHtml = /[&<>"']/g;
    const reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

    function _escape(string) {
        return string && reHasUnescapedHtml.test(string)
            ? string.replace(reUnescapedHtml, (chr) => htmlEscapes[chr])
            : string || '';
    }

    var scan2conn = function (hubMac, scanData) {
        if (scanData.match && scanData.match('keep')) return;
        let data = JSON.parse(scanData),
            deviceMac = data.bdaddrs[0].bdaddr,
            type = data.bdaddrs[0].bdaddrType,
            rssi = data.rssi;

        if (!device[deviceMac]) {
            device[deviceMac] = {
                name: data.name,
                minRssi: rssi,
                maxRssi: rssi,
                rssiArr: [rssi],
                scanNum: 1,
            };
            domInit(deviceMac, Object.keys(device).length - 1, 'scan', data.name);
        } else {
            device[deviceMac].scanNum += 1;
            device[deviceMac].rssiArr.push(rssi);
            if (rssi > device[deviceMac].maxRssi) device[deviceMac].maxRssi = rssi;
            if (rssi < device[deviceMac].minRssi) device[deviceMac].minRssi = rssi;
        }

        device[deviceMac].avgRssi = pingjun(device[deviceMac].rssiArr);
        updateScanTable(deviceMac, device[deviceMac]);
    };

    function updateScanTable(deviceMac, deviceData) {
        const tableBody = document.querySelector('#scan_tab tbody');
        const row = tableBody.rows[scan_table_mapping[deviceMac] - 1];

        row.cells[5].innerText = deviceData.minRssi;
        row.cells[6].innerText = deviceData.maxRssi;
        row.cells[7].innerText = deviceData.avgRssi.toFixed(2);
        row.cells[8].innerText = deviceData.scanNum;

        const rssiDiv = document.createElement('div');
        rssiDiv.style.position = 'relative';
        rssiDiv.style.width = '100%';
        rssiDiv.style.overflow = 'auto';
        rssiDiv.style['max-width'] = '800px'
        rssiDiv.style['white-space'] = 'nowrap'
        rssiDiv.innerHTML = deviceData.rssiArr.join(',');

        const rssiCell = row.cells[0];
        while (rssiCell.firstChild) {
            rssiCell.removeChild(rssiCell.firstChild);
        }
        rssiCell.appendChild(rssiDiv);
    }

    var pingjun = function (arr) {
        var sum = 0;
        for (var i = 0; i < arr.length; i++) {
            sum += arr[i];
        }
        var mean = sum / arr.length;
        return mean;
    };

    var domInit = function (deviceMac, num, type, name) {
        const btn_id = deviceMac.replace(/:/g, '');
        const id = type === 'scan' ? 'scan_tab' : 'conn_tab';
        const val = type === 'scan' ? document.getElementById('scanTimeout').value : document.getElementById('connTimes').value;
        const mapping = type === 'scan' ? scan_table_mapping : conn_table_mapping;

        const rawHtml = `<tr><td id="${btn_id}" colspan="${type === 'scan' ? '8' : '9'}" style="display: none; padding: 0; width: 100%;"></td><td>${num + 1}</td>
                <td>${val}</td>
                <td>${deviceMac}</td>
                <td>${type === 'scan' ? _escape(name) : ''}</td>
                <td></td
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                ${type === 'scan' ? '': '<td></td>'}
                <td><button class="detail-btn" onclick="showAll(${num}, '${type}')">view</button></td></tr>`;

        const tbody = document.getElementById(id).getElementsByTagName('tbody')[0];

        if (mapping[deviceMac]) {
            const row = tbody.children[mapping[deviceMac] - 1];
            const newRow = document.createElement('tr');
            newRow.innerHTML = rawHtml;
            row.replaceWith(newRow);
        } else {
            const frag = document.createDocumentFragment();
            const tempElem = document.createElement('tbody');
            tempElem.innerHTML = rawHtml;
            while (tempElem.firstChild) {
                frag.appendChild(tempElem.firstChild);
            }
            tbody.appendChild(frag);
            mapping[deviceMac] = num + 1;
        }
    };
});

function unique(arr, toUpperCase) {
    if (!Array.isArray(arr)) {
        console.log('type error!');
        return;
    }

    const array = [];

    arr.forEach((item) => {
        if (item === '*') return;

        const processedItem = toUpperCase ? item.toUpperCase() : item;

        if (!array.includes(processedItem)) {
            array.push(processedItem);
        }
    });

    return array;
}

function showAll(row, type) {
    let cells;
    switch (type) {
        case 'scan':
            cells = $(`#scan_tab tbody`)[0].rows[row].cells;
            for (let i = 0; i < cells.length - 1; i++) {
                if (i == 0) {
                    cells[i].style.display =
                        cells[i].style.display == 'none' ? '' : 'none';
                } else {
                    cells[i].style.display =
                        cells[i].style.display == 'none' ? '' : 'none';
                }
            }
            break;
        case 'conn':
            cells = $(`#conn_tab tbody`)[0].rows[row].cells;
            for (let i = 0; i < cells.length - 1; i++) {
                if (i == 0) {
                    cells[i].style.display =
                        cells[i].style.display == 'none' ? '' : 'none';
                } else {
                    cells[i].style.display =
                        cells[i].style.display == 'none' ? '' : 'none';
                }
            }
            break;
    }
}

const loader = document.getElementById('loader');
const progress = loader.querySelector('.progress');
const loaderLabel = document.getElementById('loader-label');
const btAnim = document.getElementById('bt-anim');

let loaderInterval;

function startScanProgress(durationMs) {
  stopLoader();
  loader.className = 'scan-mode';
  loader.style.display = 'block';
  loaderLabel.style.display = 'block';
  loaderLabel.textContent = 'Scanning…';
  progress.style.width = '0%';
  btAnim.style.display = 'block';   // show bluetooth ripple

  let start = Date.now();
  loaderInterval = setInterval(() => {
    const elapsed = Date.now() - start;
    const percent = Math.min((elapsed / durationMs) * 100, 100);
    progress.style.width = percent + '%';
    if (percent >= 100) {btAnim.style.display = 'none';   // show bluetooth ripple
    stopLoader();}

  }, 100);
}

function startConnProgress(durationMs) {
  stopLoader();
  loader.classList.add('conn-mode');
  loaderLabel.style.display = 'block';
  loaderLabel.textContent = 'Connecting…';
  loader.style.display = 'block';
  btAnim.style.display = 'block';   // show bluetooth ripple
  progress.style.width = '';

  // setTimeout(() => {
  //   showConnSuccess();
  //   // const success = Math.random() > 0.5;
  //   // if (success) {
  //   //   showConnSuccess();
  //   // } else {
  //   //   showConnFail();
  //   // }
  // }, durationMs);
}

function showConnSuccess() {
  loader.classList.remove('conn-mode');
  loader.classList.add('conn-success');
  // loaderLabel.textContent = 'Connected!';
  loaderLabel.textContent = 'Completed!';
  btAnim.style.display = 'none';   // hide when done
  setTimeout(stopLoader, 1500);
}

function showConnFail() {
  loader.classList.remove('conn-mode');
  loader.classList.add('conn-fail');
  loaderLabel.textContent = 'Connection Failed!';
  btAnim.style.display = 'none';   // hide when failed
  setTimeout(stopLoader, 2000);
}

function stopLoader() {
  clearInterval(loaderInterval);
  loader.style.display = 'none';
  loader.className = ''; // 清空所有状态
  progress.style.width = '0%';
  loaderLabel.style.display = 'none';
  loaderLabel.textContent = '';
}