$(function() {

    var hubMac,rule,reg;
    var deviceMacArr = [],
        testingHis = [],
        scannedDev = [];
    var device = {},
        scan_table_mapping = {},
        startTime = {};
    var time = timeout = num = 0;
    var timer = null;
    var optVal;

    // $.get( "/cassia/info", function( data ) {
    //     $( "#hubMac" ).val( data.mac );
    // });
    $('#scan_tab th').bind('click' ,function(){
        var table = $(this).parents('table').eq(0);
        var rows = table.find('tr:gt(1)').toArray().sort(comparer($(this).index()));
        this.asc = !this.asc;
        if (!this.asc){rows = rows.reverse();}
        table.children('tbody').empty().html(rows);
    });
    function comparer(index) {
        return function(a, b) {
            var valA = getCellValue(a, index), valB = getCellValue(b, index);
            return valA.localeCompare(valB);
        };
    }
    function getCellValue(row, index){
        return $(row).children('td').eq(index).text();
    }

    $('#clear').bind('click', () => {
        location.reload();
    });

    function getUrlVars()
    {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++)
        {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    };

    $.get('/ap', (aps) =>{
        if(aps){
            aps = aps.filter((ap) => {
                return ap.status == 'online';
            });

            $("#select_route").prepend("<option value='' i18n='deployment.select'>Select Gateway</option>");
            for (var i = 0; i < aps.length; i++) {
                let ap = aps[i];
                $("#select_route").append(`<option value=${ap.id}>${ap.name}</option>`);
            }
        }
    });

    $('#devtype').bind('change', function(){
        optVal = this.value;
        let el_rule = $('#rule');
        el_rule.prop('readonly', true);
        if(optVal != 'cname' && optVal != 'cmac'){
            el_rule.val(this.value);
        }else{
            if(optVal == 'cname'){
                el_rule.attr('placeholder', i18n('deployment.inputDeviceName') || 'Please type the device name');
            }else if(optVal == 'cmac'){
                el_rule.attr('placeholder', i18n('deployment.inputDeviceMac') || 'Please type the device MAC');
            }
            el_rule.val('');
            el_rule.prop('readonly', '');
        }
    })

    $('#select_route').bind('change', function(){
        $('#hubMac').val(this.value);
        hubMac = this.value;
    })

    // if(getUrlVars()){
    //     hubMac = getUrlVars()['hubMac'];
    //     $("#hubMac").val(hubMac);
    // };


    $('#export').bind('click', () => {
        var content = JSON.stringify(testingHis);
        var data = new Blob([content], { type: "text/plain;charset=UTF-8" });
        var downloadUrl = window.URL.createObjectURL(data);
        var anchor = document.createElement("a");
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

    $('#startScan').bind('click', function() {
        $("#scan_tab > tbody").html("");
        if(!hubMac){
            alert(i18n('deployment.mustSelectAp') || 'Must select Gateway')
            return;
        }
        scan_table_mapping = {};
        num = 0;
        device = {};
        timeout = parseInt($('#scanTimeout').val().trim()) || 60;
        if(timeout <= 0){
            alert('scan timeout must be > 0');
            return;
        }

        rule = $('#rule').val().trim();
        if(!rule){
            alert(i18n('deployment.rule') || 'Please type the device name or devcie MAC');
            return;
        }
        // if(rule == 'cgm'){
        //     rule = '^GT|^Phe'
        // }
        // reg = new RegExp(`(?=${rule})`, 'i');
        $.ajax({
          type: 'GET',
          url: '/ap',
          contentType: 'application/json',
          error: function(error){
            console.log(error);
            if(error.responseText == 'Unauthorized'){
                alert(i18n('deployment.sesisonExpired') || 'Session expired');
                document.location = '/';
            }
          }
        })

        if(optVal == 'cname'){
            if(!rule.includes('*')){
                filter = `filter_name=${rule}*`;
            }else {
                filter = `filter_name=${rule}`;
            }
        }else if(optVal == 'cmac'){
            filter = `filter_mac=${rule}`; 
        }else{
            if(rule == 'cgm'){
                rule = 'GT'
            }            
            filter = `filter_name=${rule}*`;
        }
        api
            .use({
                server: `${document.location.protocol}//${document.location.host}`,
                hub: hubMac
            })
            .scanFilter(filter)
            .on('scan', scan2conn);
        $('#startScan').attr('disabled', true);
        $("#loader").addClass("spinner");
        timer = setInterval(function() {
            time += 1;
            timeout -= 1;
            $('#time').html(time + 's');
            $('#startScan').html(timeout);

            if (timeout <= 0) {
                $('#startScan').removeAttr('disabled');
                $("#loader").removeClass("spinner");
                $('#startScan').html(i18n('deployment.startScan') || 'Start scan');
                api.scan.close();
                device.testingType = 'scanning test';
                testingHis.push(device);
                clearInterval(timer);
            };
        }, 1000)
    });

    $('#stopScan').bind('click', function() {
        api.scan.close();
        clearInterval(timer)
    });

    var scan2conn = function(hubMac, scanData) {
        if (scanData.match && scanData.match("keep")) return;
        let data = JSON.parse(scanData),
            name = data.name,
            deviceMac = data.bdaddrs[0].bdaddr,
            type = data.bdaddrs[0].bdaddrType,
            rssi = data.rssi;
        // if (!reg.test(name) && !reg.test(deviceMac)) return;
        console.log(scanData);
        if (!device[deviceMac]) {
            device[deviceMac] = {
                minRssi: rssi,
                maxRssi: rssi,
                rssiArr: [rssi],
                scanNum: 1,
            };
            domInit(deviceMac, num, 'scan', device);
            num += 1;
        } else {
            device[deviceMac].scanNum += 1;
            device[deviceMac].rssiArr.push(rssi);
            if (rssi > device[deviceMac].maxRssi) device[deviceMac].maxRssi = rssi;
            if (rssi < device[deviceMac].minRssi) device[deviceMac].minRssi = rssi;
        }
        mac = deviceMac.replace(/:/g, '');
        // let deviceInfo = $("#" + mac);
        let deviceInfo = $("#scan_tab tbody");
        // deviceInfo[0].rows[scan_table_mapping[deviceMac]].cells[0].innerText = `<div style="position: absolute;width: 86%;bottom: 45px;overflow: auto;">${device[deviceMac].rssiArr.join(',')}</div>`
        deviceInfo[0].rows[scan_table_mapping[deviceMac] - 1].cells[2].innerText = device[deviceMac].minRssi;
        deviceInfo[0].rows[scan_table_mapping[deviceMac] - 1].cells[3].innerText = device[deviceMac].maxRssi;
        deviceInfo[0].rows[scan_table_mapping[deviceMac] - 1].cells[1].innerText = deviceMacName[deviceMac] || '';
        deviceInfo[0].rows[scan_table_mapping[deviceMac] - 1].cells[4].innerText = pingjun(device[deviceMac].rssiArr).toFixed(2);
        deviceInfo[0].rows[scan_table_mapping[deviceMac] - 1].cells[5].innerText = device[deviceMac].scanNum;
        // deviceInfo.children('p').eq(2).html("Min RSSI：" + device[deviceMac].minRssi);
        // deviceInfo.children('p').eq(3).html("Max RSSI：" + device[deviceMac].maxRssi);
        // deviceInfo.children('p').eq(4).html("ave RSSI：" + pingjun(device[deviceMac].rssiArr).toFixed(2));
        // deviceInfo.children('p').eq(5).html("Number:" + device[deviceMac].scanNum);
        // deviceInfo.children('p').eq(6).html("RSSI:" + device[deviceMac].rssiArr);
    };

    var pingjun = function(arr) {
        var sum = 0;
        for (var i = 0; i < arr.length; i++) {
            sum += arr[i];
        }
        var mean = sum / arr.length;
        return mean;
    };

    var domInit = function(deviceMac, num, type, device) {
        let rawHtml, btn_id = deviceMac.replace(/:/g, '');
        switch (type) {
            case 'scan':
                rawHtml =
                    // `<tr>
                    //   <td>${deviceMac}</td>
                    //   <td>${device[deviceMac].minRssi}</td>
                    //   <td>${device[deviceMac].maxRssi}</td>
                    //   <td>${device[deviceMac].rssiArr / 1}</td>
                    //   <td>${device[deviceMac].scanNum}</td>
                    //   </tr>`;
                    `<tr>
                      <td>${deviceMac}</td>
                      <td></td>
                      <td>${device[deviceMac].minRssi}</td>
                      <td>${device[deviceMac].maxRssi}</td>
                      <td>${device[deviceMac].rssiArr / 1}</td>
                      <td>${device[deviceMac].scanNum}</td>
                      </tr>`;
                    if(scan_table_mapping[deviceMac]){
                      //   $(`#scan_tab tbody tr:nth-child(${scan_table_mapping[deviceMac] + 1})`).html(`
                      // <td>${deviceMac}</td>
                      // <td></td>
                      // <td></td>
                      // <td></td>
                      // <td></td>`);
                        $(`#scan_tab tbody tr:nth-child(${scan_table_mapping[deviceMac] + 1})`).html(`
                      <td>${deviceMac}</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>`);
                    }else{
                        $("#scan_tab tbody").append(rawHtml);
                        scan_table_mapping[deviceMac] = num + 1;                       
                    }
                break;
            case 'conn':
                rawHtml =
                    `<tr><td id="${btn_id}" colspan="7" style="display: none;"></td><td>${numberToWords.toOrdinal(num + 1)}</td>
                      <td>${$('#connTimes').val()}</td>
                      <td>${deviceMac}</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td><button onclick="showAll(${conn_table_mapping[deviceMac] || 2}, 'conn')>view</button></td></tr>`;
                    if(conn_table_mapping[deviceMac]){
                        $(`#conn_tab tbody tr:nth-child(${conn_table_mapping[deviceMac] + 1})`).html(`<td id="${btn_id}" colspan="7" style="display: none;"></td><td>${numberToWords.toOrdinal(num + 1)}</td>
                      <td>${$('#connTimes').val()}</td>
                      <td>${deviceMac}</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td><button onclick="showAll(${conn_table_mapping[deviceMac] || 2}, 'conn')>view</button></td>`);
                    }else{
                        $("#conn_tab tbody").append(rawHtml);
                        conn_table_mapping[deviceMac] = num + 2;
                    }
                break;
        }
    };

});

function showAll(row, type) {
   switch(type){
    case 'scan':
        let cells = $(`#scan_tab tbody`)[0].rows[row].cells;
        for(let i =0; i<cells.length - 1; i++){
            if(i == 0){
                cells[i].style.display = cells[i].style.display == "none" ? "" : "none";
            }else{
                cells[i].style.display = cells[i].style.display == "none" ? "" : "none";
            }
        }
        break;
    case 'conn':
        break;
   }
}