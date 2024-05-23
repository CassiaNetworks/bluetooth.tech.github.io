let max = [],
    avg,
    current = [],
    currentTable = "ble_table",
    table_mapping = {},
    stack = "rssi",
    wifiRaw = {},
    fetchData = 1,
    myChart;
let excludeModel = ["S2000", "X2000"];
let timeBtn = $("#timeBtn");
const hash = $(location).prop("hash");
// if (hash && hash.toUpperCase().includes(excludeModel)) {
//     $("#chartView").hide();
//     $("#btnChart").hide();
// }
// $.ajax({
//     url: "/cassia/info",
//     type: "GET",
//     dataType: "json", // or the data type you expect (e.g., "xml", "html", "text")
//     success: function (data) {},
//     error: function (jqXHR) {
//         console.error(
//             "Request failed: " + jqXHR.status + ", " + jqXHR.statusText
//         );
//         window.location = "/cassia/login";
//     },
// });
$(document).ready(function() {
    function isValidIP(ip) {
        const ipPattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return ipPattern.test(ip);
    }

    const getwayIpInput = $('#gateway_ip');

    // 页面加载时从 localStorage 加载内容到输入框
    const gatewayIpls = localStorage.getItem('gatewayIP');
    if (gatewayIpls !== null) {
        getwayIpInput.val(gatewayIpls);
    }

    getwayIpInput.on('blur', function() {
        const ip = $(this).val();
        const $error = $('#error');

        // 清除之前的错误信息
        $error.text('');
        getwayIpInput.removeClass('input-error');

        if (!isValidIP(ip)) {
            $error.text('Invalid IP address.');
            getwayIpInput.addClass('input-error');
        } else {
            const inputValue = getwayIpInput.val();
            localStorage.setItem('gatewayIP', inputValue);
        }
    });


    const ip = getwayIpInput.val();

    $("#btnTable").bind("click", function() {
        $("#chartView").hide();
        $("#tableView").show();
        $("#control").show();
        $("#btnChart").removeAttr("disabled");
    });
    $("#btnChart").bind("click", function() {
        getWiFiData();
        $("#tableView").hide();
        $("#chartView").show();
        update();
        $(".chartWrapper").height(window.innerHeight - 120);
        if (!myChart) myChart = echarts.init(document.querySelector("#chart"));
        myChart && myChart.setOption(option);
        myChart.resize();
        myChart.on("magictypechanged", (params) => {
            if (params.currentType === "bar") {
                stack = "rssi";
            } else {
                stack = undefined;
            }
        });
        $("#control").show();
        $("#btnTable").removeAttr("disabled");
    });
    $("#btnClear").bind("click", () => {
        (max = []), (avg = []), (current = []);
        for (let i = 0; i < option.series.length; i++) {
            option.series[i].data = [];
        }
        myChart && myChart.setOption(option, true);
        timeBtn.html("1s");
    });
    $("#control").bind("click", function() {
        if ($("#control").hasClass("a")) {
            fetchData = 0;
            $("#control").removeClass("a");
            $("#control").addClass("b");
        } else {
            fetchData = 1;
            $("#control").removeClass("b");
            $("#control").addClass("a");
        }
    });

    $("#btnBle").bind("click", function() {
        $("#btnBle").addClass("active");
        $("#btnWifi").removeClass("active");
        $("#ble_table").removeClass("hidden");
        $("#wifi_table").addClass("hidden");
        $("#wifi_table tbody").text("");
        currentTable = "ble_table";
    });

    $("#btnWifi").bind("click", function() {
        $("#btnWifi").addClass("active");
        $("#btnBle").removeClass("active");
        $("#wifi_table").removeClass("hidden");
        $("#ble_table").addClass("hidden");
        currentTable = "wifi_table";
        getWiFiData();
    });

    const wifiChannelIndex = [
            0, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75,
        ],
        wifiData = [],
        wifiTableData = [];
    let wifi2g;

    function getWiFiData() {
        const settings = {
            url: `http://${ip}/gap/channel/assessment?wifi=1`,
            method: "GET",
        };

        if (_.isEmpty(wifiRaw) || _.isEmpty(wifi2g)) {
            $.ajax(settings).done(function(response) {
                wifiRaw = response;
                wifi2g = wifiRaw.wifi.results.filter((item) => {
                    return item.channel < 14;
                });

                wifi2g.forEach((item) => {
                    // {value: [2,9.8] , name: 'value1'},
                    wifiData.push({
                        value: [wifiChannelIndex[item.channel], item.signal],
                        name: item.ssid,
                    });
                    let wpaStr =
                        "WPA" +
                        (item?.encryption?.wpa && item.encryption?.wpa.length >= 2 ?
                            "/WPA2" :
                            "");
                    let authenticationStr = `${
                    (item.encryption?.authentication &&
                        item.encryption?.authentication[0]) ||
                    ""
                } ${
                    (item.encryption?.authentication &&
                        item.encryption?.authentication[1]) ||
                    ""
                }`.toUpperCase();
                    let ciphersStr = `${
                    (item.encryption?.ciphers && item.encryption.ciphers[0]) ||
                    ""
                } ${
                    (item.encryption?.ciphers && item.encryption.ciphers[1]) ||
                    ""
                }`.toUpperCase();

                    wifiTableData.push({
                        bssid: item.bssid,
                        ssid: item.ssid || "unknown",
                        channel: item.channel,
                        mode: item.mode,
                        signal: item.signal,
                        encryption: `${wpaStr} ${authenticationStr} (${ciphersStr})`,
                    });
                });
                render();
            });
        } else {
            render();
        }
    }

    function render() {
        if (currentTable === "ble_table") return;
        let tableView = $(`#${currentTable} tbody`);
        tableView.html("");
        for (let k in wifiTableData) {
            k = Number(k);
            let rawHtml = `<tr>
                        <td>${k + 1}</td>
                        <td>${wifiTableData[k].bssid}</td>
                        <td>${wifiTableData[k].ssid}</td>
                        <td>${wifiTableData[k].channel}</td>
                        <td>${wifiTableData[k].mode}</td>
                        <td>${wifiTableData[k].signal}</td>
                        <td>${wifiTableData[k].encryption}</td>
                    </tr>`;
            tableView.append(rawHtml);
        }
    }

    const app = {};

    stack = undefined;

    function open() {
        let chipCount = 2;
        if (
            hash &&
            _.includes(excludeModel, hash.replaceAll("#", "").toUpperCase())
        ) {
            chipCount = 1;
        }
        for (let i = 0; i < chipCount; i++) {
            const settings = {
                url: `http://${ip}/gap/channel/assessment`,
                method: "POST",
                timeout: 0,
                headers: {
                    "Content-Type": "application/json",
                },
                data: JSON.stringify({
                    chip: i + "",
                    enable: "1",
                    mode: "0"
                }),
            };

            $.ajax(settings)
                .fail((error) => {
                    console.error(error);
                    if (error.status === 404)
                        alert(
                            "Please open the local API on AC, or else the data can't be loaded"
                        );
                })
                .done(function(response) {
                    console.log(response);
                });
        }
    }

    function update() {
        if (_.isEmpty(timeBtn.html())) {
            timeBtn.html("1s");
        } else {
            let time = timeBtn.html().replace("s", "");
            time = parseInt(time);
            time += 3;
            timeBtn.html(time + "s");
        }
        $.get(`http://${ip}/gap/channel/assessment`).done(function(data) {
            if (current.length >= 20) {
                current.shift();
            }

            let channels;

            if (
                hash &&
                _.includes(excludeModel, hash.replaceAll("#", "").toUpperCase())
            ) {
                channels = _.concat(
                    data?.chip0?.channels.map((item) => {
                        return item;
                    })
                );
            } else {
                channels = _.concat(
                    data?.chip0?.channels.slice(0, 20).map((item) => {
                        return item;
                    }),
                    data?.chip1?.channels.slice(20).map((item) => {
                        return item;
                    })
                );
            }

            channels.splice(0, 0, channels[37]);
            channels.splice(38, 1);
            channels.splice(12, 0, channels[38]);
            channels.splice(39, 1);
            current.push(channels);

            avg = _.zipWith(...current, (...items) => {
                return _.ceil(_.sum(items) / items.length);
            });
            max = _.zipWith(...current, (...items) => {
                return _.max(items);
            });
            let tableView = $(`#${currentTable} tbody`);
            if (currentTable === "ble_table") {
                let quality = "",
                    currentData = _.last(current);
                for (let k in currentData) {
                    k = Number(k);
                    if (avg[k] >= -100 && avg[k] < -70) {
                        quality = "highest";
                    } else if (avg[k] >= -70 && avg[k] < -60) {
                        quality = "high";
                    } else if (avg[k] >= -60 && avg[k] < -50) {
                        quality = "medium";
                    } else if (avg[k] >= -50 && avg[k] < -30) {
                        quality = "low";
                    }

                    let prr = "-",
                        currentText,
                        maxText,
                        avgText;
                    if (k < 20) {
                        if (
                            data.chip0.mode === 1 &&
                            k !== 0 &&
                            k !== 12 &&
                            k !== 18 &&
                            k !== 19
                        ) {
                            prr = Math.abs(currentData[k]) + "%";
                            currentText = "-";
                            maxText = "-";
                            avgText = "-";
                            quality = "-";
                        }
                    } else {
                        if (
                            hash &&
                            _.includes(
                                excludeModel,
                                hash.replaceAll("#", "").toUpperCase()
                            )
                        ) {
                            if (data.chip0.mode === 1 && k !== 22 && k !== 39) {
                                prr = Math.abs(currentData[k]) + "%";
                                currentText = "-";
                                maxText = "-";
                                avgText = "-";
                                quality = "-";
                            }
                        } else {
                            if (data.chip1.mode === 1 && k !== 22 && k !== 39) {
                                prr = Math.abs(currentData[k]) + "%";
                                currentText = "-";
                                maxText = "-";
                                avgText = "-";
                                quality = "-";
                            }
                        }
                    }

                    if (currentData[k] === -100) {
                        currentText = "-";
                    } else {
                        currentText = currentData[k];
                    }
                    if (max[k] === -100) {
                        maxText = "-";
                    } else {
                        maxText = max[k];
                    }

                    if (avg[k] === -100) {
                        avgText = "-";
                        quality = "-";
                    } else {
                        avgText = avg[k];
                    }

                    let index = "";
                    if (k === 0) {
                        index = 37;
                    } else if (k === 12) {
                        index = 38;
                    } else if (k === 39) {
                        index = 39;
                    } else {
                        if (k < 13) index = k - 1;
                        else index = k - 2;
                    }
                    let rawHtml = `<tr>
                        <td>${index}</td>
                        <td>${maxText}</td>
                        <td>${currentText}</td>
                        <td>${avgText}</td>
                        <td>${prr}</td>
                        <td><div class="${
                            quality === "-" ? "" : quality
                        }">${quality}</div></td>
                    </tr>`;
                    if (table_mapping[k] !== undefined) {
                        let qualityView = $(
                            `#ble_table > tbody > tr:nth-child(${
                            k + 1
                        }) > td:nth-child(6)`
                        );
                        tableView[0].rows[k].cells[1].innerText = maxText;

                        tableView[0].rows[k].cells[2].innerText = currentText;

                        tableView[0].rows[k].cells[3].innerText = avgText;

                        tableView[0].rows[k].cells[4].innerText = prr;

                        qualityView.text("");
                        qualityView.append(
                            `<div class="${
                            quality === "-" ? "" : quality
                        }">${quality}</div>`
                        );
                    } else {
                        tableView.append(rawHtml);
                        table_mapping[k] = max[k];
                    }
                }
            }

            myChart &&
                myChart.setOption({
                    yAxis: {
                        max: -30,
                        type: "value",
                        interval: 5,
                    },
                    series: [{
                            data: max,
                            stack: stack,
                            smooth: true,
                        },
                        {
                            data: avg,
                            stack: stack,
                            smooth: true,
                            areaStyle: {
                                origin: "start",
                                color: {
                                    type: "linear",
                                    x: 0,
                                    y: 1,
                                    x2: 0,
                                    y2: 0,
                                    colorStops: [{
                                            offset: 0,
                                            color: "#4C84FF",
                                        },
                                        {
                                            offset: 0.4,
                                            color: "#90cc7d",
                                        },
                                        {
                                            offset: 0.6,
                                            color: "#f3aa3d", // 0% 处的颜色
                                        },
                                        {
                                            offset: 1,
                                            color: "#e4514b", // 100% 处的颜色
                                        },
                                    ],
                                    globalCoord: false, // 缺省为 false
                                },
                                // color: {
                                //     x: 0,
                                //     y: 0,
                                //     x2: 0,
                                //     y2: 1,
                                //     colorStops: [{
                                //         offset: 0, color: '#f00'
                                //     }, {
                                //         offset: 1, color: '#0f0'
                                //     }]
                                // }
                            },
                            // type: 'bar',
                            // name: 'avg',
                            // showBackground: true,
                            // emphasis: {
                            //     focus: 'series'
                            // },
                            // backgroundStyle: {
                            //     color: 'rgba(220, 220, 220, 0.8)'
                            // }
                        },
                        {
                            data: _.last(current),
                            stack: stack,
                            smooth: true,
                            // type: 'bar',
                            // name: 'current',
                            // showBackground: true,
                            // emphasis: {
                            //     focus: 'series'
                            // },
                            // backgroundStyle: {
                            //     color: 'rgba(220, 220, 220, 0.8)'
                            // }
                        },
                        {
                            type: "scatter",
                            name: "Wi-Fi AP",
                            xAxisIndex: 1,
                            data: wifiData,
                            symbolSize: 12,
                            colorBy: "data",
                            symbol: "image://data:image/jpeg;base64,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",
                            label: {
                                show: true,
                                position: "right",
                                formatter: (params) => params.name,
                                color: "#636466",
                                fontSize: 12,
                            },
                        },
                    ],
                });
        });
    }

    const option = {
        color: ["#e4514a", "#90cc7d", "#7599e4"],
        grid: {
            left: 30,
            right: 100,
            bottom: 5,
            containLabel: true,
        },
        legend: {
            itemWidth: 12,
            itemHeight: 12,
            top: "15",
            right: 100,
            textStyle: {
                color: "#797979",
                fontSize: 14,
            },
            tooltip: {
                show: true,
            },
        },
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "cross",
            },
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            // position: function (pos, params, el, elRect, size) {
            //     var obj = { top: 10 };
            //     obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
            //     return obj;
            // },
            extraCssText: "width: 170px",
            formatter: function(param) {
                // console.log(param)
                let res = [];

                for (let x = 0; x < param.length; x++) {
                    let xAxisIndex = param[x].axisIndex;
                    if (!res[xAxisIndex]) {
                        res[xAxisIndex] = `${param[x].axisValueLabel} <br/>`;
                    }
                    if (param[x].seriesIndex > 2) {
                        res[xAxisIndex] +=
                            `<img style='width:12px;height:12px; display: inline-block' src="data:image/png;base64,
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" alt="" />` +
                            " " +
                            param[x].name +
                            "" +
                            `<span style="float: right">${param[x].data.value[1]}</span><br/>`;
                    } else {
                        res[xAxisIndex] +=
                            `<i style="width:10px;height:10px;border-radius:50%;background-color:${param[x].color};display: inline-block"></i>` +
                            " " +
                            param[x].seriesName +
                            "" +
                            `<span style="float: right">${param[x].data}</span><br/>`;
                    }
                }
                return res.reverse().join("<br/>");
            },
        },
        axisPointer: {
            link: {
                xAxisIndex: "all"
            },
            label: {
                backgroundColor: "#777",
            },
        },
        dataZoom: [{
                type: "inside",
                yAxisIndex: [0],
                start: 0,
                end: 100,
            },
            {
                type: "slider",
                show: true,
                width: 20,
                right: 60,
                bottom: 83,
                orient: "vertical",
                yAxisIndex: 0,
                filterMode: "empty",
                showDataShadow: false,
            },
        ],
        toolbox: {
            // padding: [0, 55, 0, 0],
            show: false,
            // orient: 'vertical',
            // left: 'right',
            // top: 'center',
            dataZoom: {},
            feature: {
                mark: {
                    show: true
                },
                dataView: {
                    show: true,
                    readOnly: true
                },
                magicType: {
                    show: true,
                    type: ["line", "bar"]
                },
                restore: {
                    show: true
                },
                saveAsImage: {
                    show: true
                },
            },
        },
        calculable: true,
        xAxis: [{
                name: "Bluetooth",
                nameLocation: "end",
                nameTextStyle: {
                    padding: [0, 0, 0, 0],
                    fontWeight: "bold",
                    fontSize: 13,
                    verticalAlign: "top",
                    color: "#02060e",
                },
                nameGap: 20,
                type: "category",
                data: [
                    37, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 38, 11, 12, 13, 14, 15,
                    16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
                    32, 33, 34, 35, 36, 39,
                ],
                axisPointer: {
                    show: true,
                    type: "shadow",
                    label: {
                        formatter: "Bluetooth Channel {value}",
                    },
                },
                boundaryGap: false,
                axisLine: {
                    onZero: false,
                },
                // nameRotate: 10,    // 坐标轴名字旋转，角度值
                // boundaryGap: ['20%', '20%'],    // 坐标轴两边留白策略
                // axisTick: {
                //     show: true,    // 是否显示坐标轴刻度
                //     inside: false,     // 坐标轴刻度是否朝内，默认朝外
                //     length: 1,    // 坐标轴刻度的长度
                //     lineStyle: {
                //         color: '#FFF',     // 刻度线的颜色
                //         width: 1,    // 坐标轴刻度线宽
                //         type: 'dashed',     // 坐标轴线线的类型（'solid'，实线类型；'dashed'，虚线类型；'dotted',点状类型）
                //     },
                // }
            },
            {
                type: "category",
                position: "bottom", // 将分组x轴位置定至底部，不然默认在顶部
                name: "Wi-Fi",
                nameLocation: "end",
                nameTextStyle: {
                    padding: [3, 0, 0, 0],
                    fontWeight: "bold",
                    fontSize: 14,
                    verticalAlign: "top",
                    backgroundColor: "#606266",
                    color: "#fff",
                    borderWidth: 3,
                    borderColor: "606266",
                    borderRadius: [4, 4, 4, 4],
                },
                nameGap: 20,
                boundaryGap: false,
                offset: 23, // 向下偏移，使分组文字显示位置不与原x轴重叠
                axisLine: {
                    show: true, // 隐藏分组x轴的轴线
                },
                axisLabel: {
                    margin: 3,
                    backgroundColor: "#606266",
                    color: "rgba(255, 255, 255, 1)",
                    fontSize: 12,
                    width: 16,
                    // padding: [1, 0],
                    formatter: function(val, index) {
                        if (parseInt(val) < 100) {
                            return val;
                        }
                    },
                },
                girdIndex: 1,
                data: [
                    "2402",
                    "2403",
                    "2404",
                    "2405",
                    "2406",
                    "2407",
                    "2408",
                    "2409",
                    "2410",
                    "2411",
                    "1",
                    "2413",
                    "2414",
                    "2415",
                    "2416",
                    "2",
                    "2418",
                    "2419",
                    "2420",
                    "2421",
                    "3",
                    "2423",
                    "2424",
                    "2425",
                    "2426",
                    "4",
                    "2428",
                    "2429",
                    "2430",
                    "2431",
                    "5",
                    "2433",
                    "2434",
                    "2435",
                    "2436",
                    "6",
                    "2438",
                    "2439",
                    "2440",
                    "2441",
                    "7",
                    "2443",
                    "2444",
                    "2445",
                    "2446",
                    "8",
                    "2448",
                    "2449",
                    "2450",
                    "2451",
                    "9",
                    "2453",
                    "2454",
                    "2455",
                    "2456",
                    "10",
                    "2458",
                    "2459",
                    "2460",
                    "2461",
                    "11",
                    "2463",
                    "2464",
                    "2465",
                    "2466",
                    "12",
                    "2468",
                    "2469",
                    "2470",
                    "2471",
                    "13",
                    "2473",
                    "2474",
                    "2475",
                    "2476",
                    "2477",
                    "2478",
                    "2479",
                    "2480",
                ],
                axisPointer: {
                    show: true,
                    type: "shadow",
                    label: {
                        formatter: function(params) {
                            if (parseInt(params.value) < 20)
                                return "Wi-Fi Channel " + params.value;
                            else return null;
                        },
                    },
                    // label: {
                    //     formatter: "Wi-Fi Channel {value}",
                    // },
                },
            },
            {
                type: "category",
                name: "Frequency",
                nameLocation: "end",
                nameTextStyle: {
                    padding: [6, 0, 0, 0],
                    fontWeight: "bold",
                    fontSize: 13,
                    height: 35,
                    verticalAlign: "top",
                    color: "#02060e",
                },
                nameGap: 20,
                position: "bottom", // 将分组x轴位置定至底部，不然默认在顶部
                offset: 45, // 向下偏移，使分组文字显示位置不与原x轴重叠
                axisLabel: {
                    // rotate: 90,
                    fontStyle: "oblique",
                    rotate: 30,
                    formatter: function(value, index) {
                        if (parseInt(value) % 2 === 0) {
                            return value;
                        }
                    },
                },
                axisLine: {
                    show: true,
                },
                boundaryGap: false,
                data: [
                    "2402",
                    "2403",
                    "2404",
                    "2405",
                    "2406",
                    "2407",
                    "2408",
                    "2409",
                    "2410",
                    "2411",
                    "2412",
                    "2413",
                    "2414",
                    "2415",
                    "2416",
                    "2417",
                    "2418",
                    "2419",
                    "2420",
                    "2421",
                    "2422",
                    "2423",
                    "2424",
                    "2425",
                    "2426",
                    "2427",
                    "2428",
                    "2429",
                    "2430",
                    "2431",
                    "2432",
                    "2433",
                    "2434",
                    "2435",
                    "2436",
                    "2437",
                    "2438",
                    "2439",
                    "2440",
                    "2441",
                    "2442",
                    "2443",
                    "2444",
                    "2445",
                    "2446",
                    "2447",
                    "2448",
                    "2449",
                    "2450",
                    "2451",
                    "2452",
                    "2453",
                    "2454",
                    "2455",
                    "2456",
                    "2457",
                    "2458",
                    "2459",
                    "2460",
                    "2461",
                    "2462",
                    "2463",
                    "2464",
                    "2465",
                    "2466",
                    "2467",
                    "2468",
                    "2469",
                    "2470",
                    "2471",
                    "2472",
                    "2473",
                    "2474",
                    "2475",
                    "2476",
                    "2477",
                    "2478",
                    "2479",
                    "2480",
                ],
            },
        ],
        yAxis: [{
            offset: 0,
            // max: -30,
            min: -100,
            type: "value",
            name: "RSSI(dbm)",
            nameGap: 30,
            nameLocation: "middle",
            nameTextStyle: {
                fontWeight: "bold",
                fontSize: 16,
            },
            axisLine: {
                show: true,
                cap: "butt",
                lineStyle: {
                    // color: {
                    //     type: 'linear',
                    //     x: 0,
                    //     y: 1,
                    //     x2: 0,
                    //     y2: 0,
                    //     colorStops: [
                    //         {
                    //             offset: 0,
                    //             color: '#4C84FF'
                    //         },
                    //         {
                    //             offset: 0.4,
                    //             color: '#90cc7d'
                    //         },
                    //         {
                    //             offset: 0.6,
                    //             color: '#f3aa3d' // 0% 处的颜色
                    //         },
                    //         {
                    //             offset: 1,
                    //             color: '#e4514b' // 100% 处的颜色
                    //         }
                    //     ],
                    //     globalCoord: false // 缺省为 false
                    // },
                    color: function(value) {
                        if (value >= -100 && value <= -70) {
                            return "#90cc7d";
                        } else if (value >= -70 && value <= -60) {
                            return "#7599e4";
                        } else if (value >= -60 && value <= -50) {
                            return "#f3aa3d";
                        } else if (value >= -50 && value <= -30) {
                            return "#e4514b";
                        }
                    },
                },
                onZero: false,
            },
            axisTick: {
                //刻度线
                show: true,
                lineStyle: {
                    color: "#7599e4",
                },
            },
            splitLine: {
                show: true,
            },
        }, ],
        series: [{
                data: [],
                name: "Max",
                type: "line",
                itemStyle: {
                    normal: {
                        lineStyle: {
                            width: 2,
                            type: "dashed", //'dotted'虚线 'solid'实线 'dashed'
                        },
                    },
                },
            },
            {
                data: [],
                name: "Average",
                type: "line",
            },
            {
                data: [],
                name: "Current",
                type: "line",
            },
            {
                type: "scatter",
                name: "Wi-Fi AP",
                xAxisIndex: 1,
                data: wifiData,
                symbolSize: 12,
                colorBy: "data",
                symbol: "image://data:image/jpeg;base64,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",
                label: {
                    show: true,
                    position: "right",
                    formatter: (params) => params.name,
                    color: "#636466",
                    fontSize: 12,
                },
            },
        ],
    };

    window.onresize = function() {
        myChart && myChart.resize();
    };

    function checkConnected() {
        $.get(`http://${ip}/gap/nodes/?connection_state=connected`).done((response) => {
            if (response?.nodes.length > 0) {
                alert(
                    "Can't use this feature when the gateway has connected devices"
                );
            } else {
                open();
                setInterval(update, 3000);
            }
        });
    }

    checkConnected();
});