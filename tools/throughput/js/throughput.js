/**
 * jQuery.fn.sortElements
 * --------------
 * @author James Padolsey (http://james.padolsey.com)
 * @version 0.11
 * @updated 18-MAR-2010
 * --------------
 * @param Function comparator:
 *
 *   Exactly the same behaviour as [1,2,3].sort(comparator)
 *
 * @param Function getSortable
 *   A function that should return the element that is
 *   to be sorted. The comparator will run on the
 *   current collection, but you may want the actual
 *   resulting sort to occur on a parent or another
 *   associated element.
 *
 *   E.g. $('td').sortElements(comparator, function(){
 *      return this.parentNode;
 *   })
 *
 *   The <td>'s parent (<tr>) will be sorted instead
 *   of the <td> itself.
 */
jQuery.fn.sortElements = (function() {
    const sort = [].sort;
    return function(comparator, getSortable) {
        getSortable =
            getSortable ||
            function() {
                return this;
            };

        const placements = this.map(function() {
            const sortElement = getSortable.call(this),
                parentNode = sortElement.parentNode,
                // Since the element itself will change position, we have
                // to have some way of storing it's original position in
                // the DOM. The easiest way is to have a 'flag' node:
                nextSibling = parentNode.insertBefore(
                    document.createTextNode(""),
                    sortElement.nextSibling
                );

            return function() {
                if (parentNode === this) {
                    throw new Error(
                        "You can't sort elements if any one is a descendant of another."
                    );
                }

                // Insert before flag:
                parentNode.insertBefore(this, nextSibling);
                // Remove flag:
                parentNode.removeChild(nextSibling);
            };
        });

        return sort.call(this, comparator).each(function(i) {
            placements[i].call(getSortable.call(this));
        });
    };
})();

let index = 1;
let conn0 = {};
let conn1 = {};
let connAll = {};
let filterType = "all";
let fetchData = 1;
let rowIndex = -1;
let currentLabel = null; // Store the current label being hovered
let columnsHidden = true;
let color_mapping = {};
const table = $("table");
const ids = {};
let updateInterval = null;
let currentConfig = null;

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

    $("#rssi_header, #pkt_loss_header, #tput_header")
        .wrapInner('<span title="sort this column"/>')
        .each(function() {
            let th = $(this),
                thIndex = th.index(),
                inverse = false;
            th.click(function() {
                table
                    .find("td")
                    .filter(function() {
                        return $(this).index() === thIndex;
                    })
                    .sortElements(
                        function(a, b) {
                            return parseFloat(
                                    $.text([a]).replace("%", "").replace("B/s", "")
                                ) >
                                parseFloat(
                                    $.text([b]).replace("%", "").replace("B/s", "")
                                ) ?
                                inverse ?
                                -1 :
                                1 :
                                inverse ?
                                1 :
                                -1;
                        },
                        function() {
                            // parentNode is the element we want to move
                            return this.parentNode;
                        }
                    );
                inverse = !inverse;
            });
        });
    $('input[name="chip-filter"]').change(function() {
        // Get the value of the selected radio button
        const selectedChip = $('input[name="chip-filter"]:checked').val();
        $(`tbody tr`).each(function() {
            hideDataset(chart, $(this).data("id"), true);
        });
        if (selectedChip === "all") {
            // $(`tbody tr[data-chip="chip${1}"]`).show();
            // $(`tbody tr[data-chip="chip${0}"]`).show();
            $(`tbody tr`).show();
            $(`tbody tr`).each(function() {
                hideDataset(chart, $(this).data("id"), false);
            });
        } else {
            $("tbody tr").hide();
            $(`tbody tr[data-chip="${selectedChip}"]`).show();
            $(`tbody tr[data-chip="${selectedChip}"]`).each(function() {
                hideDataset(chart, $(this).data("id"), false);
            });
        }
        // Log the selected value to the console (you can replace this with your desired action)
        console.log(`Selected chip: ${selectedChip}`);
        if (selectedChip !== filterType) {
            // removeData(chart);
            removeData(chart2);
            $(`tr[data-id="${currentLabel}"]`).removeClass("selected");
            currentLabel = null;
        }
        filterType = selectedChip;

        // Add your logic here to filter the data based on the selected chip
        // For example, you can use the selectedChip value to filter your table rows.
    });
    $("#collapse").bind("click", () => {
        let chartContainerEle = $(".chartContainer");
        if (columnsHidden) {
            // 显示被隐藏的列
            $("table thead tr th").show();
            $("table tbody tr td").show();
            columnsHidden = false;
            $("#collapse").attr(
                "src",
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAIKADAAQAAAABAAAAIAAAAACshmLzAAACCklEQVRYCe2WP0gCcRTH70xrCnRrSAKzCIKg3CKCIB0MbspBHIxamlpaC5zb+jMLDrVYgVuY4OTc5qZLtAWOSqDX95nv+N3d7y5v6Bzy4Hh37/e+7/vxh7/HKcr0+u87oFo3IJVKHeq6ng2Hw9lyufxlXZe9Q5MbDAapSCRyDE1fVuOUmxEX0OgE5iXc671ebyuRSDw2m03XhmROGvTZhGYZmgo0utjX7dkASCaT52h0h+LASLD6GwSbQ8d9NrxCsJmCJmEJ6UGn03nOZDKzkjVKzUFn9BjV5KApQcNQDtKftFHUbrfrsVgsiPSuReG4E61W6y0ej78DQoNG/D+NvRMGAJlOAsIEMAkIG4DfEFIAPyEcAfyCcAXwA8J6hsnTdtVqtUtVVa9sC4pCc+IJx1A8gsOyarVaDAQCpxINzYki58cC0DRtHoIdFokRJlXA2UZvoVAIAmxfrKVn1PZJw3kbOS9wJPNut/uCZtuc44hGZ/ilt/zOkcwbjcYDNBnOUSRz3Hlo7jnvCvDX5kMoJrFGP8wdAfwylwL4aW4D8NvcBDAJcwIwJmE0Gq3gfY+S4uV01KgmFArd4KgdifWyoyauW5+NQQSjCyx+igVu5qO6a8QP1ng1J51pDuAbbw2/6BX34hjmQ198S66gvg7zBeuQYTBPMZ1OLwEk70VEELhNU8+Lflr7v3fgG29qB1D+remzAAAAAElFTkSuQmCC"
            );
            chartContainerEle.css("flex", "4");
        } else {
            chartContainerEle.css("flex", "9");
            // 隐藏需要隐藏的列
            const columnsToHide = [5, 6, 7, 8, 9];

            $.each(columnsToHide, function(index, columnIndex) {
                // 隐藏表头列
                $("table thead tr th:eq(" + (columnIndex + 1) + ")").hide();
                // 隐藏表格内容列
                $("table tbody tr").each(function() {
                    $(this)
                        .find("td:eq(" + (columnIndex - 1) + ")")
                        .hide();
                });
            });
            $("#collapse").attr(
                "src",
                "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAIKADAAQAAAABAAAAIAAAAACshmLzAAACBklEQVRYCe2WsUvDQBTGm1R0EEFwaxGH1kHs4B8gSMEWrBAHySS2i4OT/4HQwclN3EWHLoq6OaQdugkuDoJQpF1qcRG7OElt/F7IhcvlkqaD6dAehF7ee9/7fhy9R2KxyRr3E4gPewC6rscTicRlOp2ebTabL2H00Ewnk8lraPrQvPKaoQDIvNvtXqHBPp4dNES/YAgyh+aO6vHsQtOB5hl7a4UG4Mz3bK2K30AIznybaUzT1FKp1Her1XqkGDUZuCTmlgbNSD8jayAxd8qgm2cvCtv4/fqZo95UVfXAMIwLURtkjtqTWq12zDSBAP9tThC+AFGY+wJEZS4FiNLcAxC1uQtgFOYE4MwBTCu6TmzIUM5auGqHsquGu6xAc4siNmRsBf7ZinLKXzUnIdk4ADAyIPwVa2C0WS6Xp8Q4amkOGGLcfl/XNG3OJ+cKO6OYZjrNdmRpZjtg2K+22+2VYrF4X6/X+7wamidovgC5xcexX+z1ehuZTOam0Wj8CDnXqwNA0VFAuABGAeEBiBpCChAlhC9AVBCBAFFADAQIAbGAr5sHquPXgCu6Bk2F6vn7zus9e0zDCoZPSRhWHRSeeYrtADTnGFZHQv4TPZwPklAnwBoIc+IDjbLVavWN5WW//Emg/h1AWYCF+pqW9bNiuVxOx7PsWyBJ5PP5UqFQWJKkJqExP4E/MGzhbtsr1QcAAAAASUVORK5CYII="
            );
            columnsHidden = true;
        }
        chart.resize();
        chart2.resize();
    });

    function toggleCheckboxes(checked) {
        if (!checked) {
            hideDataset(chart, "*", true);
        } else {
            hideDataset(chart, "*", false);
        }
        $('input[type="checkbox"]').prop("checked", checked);
    }

    $("#selectAll").click(function() {
        const checkboxes = $('input[type="checkbox"]:not(#selectAll)');
        const allChecked =
            checkboxes.length === checkboxes.filter(":checked").length;
        toggleCheckboxes(!allChecked);
    });

    function hideDataset(chart, label, hidden = true) {
        const datasets = chart.data.datasets;
        for (let i = 0; i < datasets.length; i++) {
            if (label === "*") {
                // If label is "*", hide or show all datasets
                datasets[i].hidden = hidden; // Toggle the hidden property
            } else if (datasets[i].label === label) {
                // If the label matches, hide or show that specific dataset
                datasets[i].hidden = hidden; // Toggle the hidden property
            }
        }
        chart.update(); // Update the chart to apply the changes
    }

    window.onItemClick = (params, event) => {
        const checkboxes = $('input[type="checkbox"]:not(#selectAll)');
        const allChecked =
            checkboxes.length === checkboxes.filter(":checked").length;
        if (!allChecked) {
            $("#selectAll").prop("checked", false);
        } else {
            $("#selectAll").prop("checked", true);
        }
        let label = params.id || "";
        if (!$(event.target).is('input[type="checkbox"]')) {
            removeData(chart2);
            let color = params.color || "";
            if (!label) return;
            $(`tr[data-id="${currentLabel}"]`).removeClass("selected");
            $(`tr[data-id="${label}"]`).addClass("selected");
            currentLabel = label;
            for (let timestamp in connAll) {
                connAll[timestamp].forEach((item) => {
                    for (let k in item) {
                        if (k === params.id) {
                            addData(
                                chart2,
                                dateFormat(
                                    new Date(parseInt(timestamp)),
                                    "%H:%M:%S",
                                    false
                                ), {
                                    [label]: {
                                        RSSI: item[k].rssi,
                                        "Packet Loss Rate": item[k].packetLossRate,
                                    },
                                },
                                "packetLossRate",
                                color
                            );
                        }
                    }
                });
            }
        } else {
            if (event.target.checked) {
                console.log("Checkbox checked");
                hideDataset(chart, label, false);
            } else {
                console.log("Checkbox unchecked");
                hideDataset(chart, label, true);
            }
        }
    };

    window.addEventListener("resize", function() {
        // 更新图表的大小
        chart.resize();
        chart2.resize();
        console.log("window resize event triggered");
    });

    let COLORS = [
        "#FEAE41",
        "#FF7537",
        "#FF6C87",
        "#F34D4B",
        "#F34D4B",
        "#1CAE77",
        "#8CCFE4",
        "#379FF6",
        "#F067AB",
        "#916EAE",
    ];

    function getLineColor(ctx) {
        return COLORS[ctx.datasetIndex % COLORS.length];
    }

    function alternatePointStyles(ctx) {
        let index = ctx.dataIndex;
        return index % 2 === 0 ? "circle" : "rect";
    }

    function getDataSet(datasets, key) {
        for (let i = 0; i <= datasets.length - 1; i++) {
            if (key === datasets[i].label) {
                return i;
            }
        }
        return -1;
    }

    function addData(chart, label, data, dataType = "Throughput", color = "") {
        chart.data.labels.push(label);
        // let newwidth = $(".chartAreaWrapper2").width() + 60;
        // $(".chartAreaWrapper2").width(newwidth);
        let datasets = chart.data.datasets;
        //断连后data的数据跟datasets数据不一致
        for (let k in data) {
            let index = getDataSet(datasets, k);
            if (index < 0) {
                if (dataType === "Throughput") {
                    let len = chart.data.labels.length;
                    let dataArr = new Array(len),
                        interferenceArr = new Array(len);
                    dataArr.fill(data[k].speed, -1);
                    interferenceArr.fill(
                        [data[k].rssi, data[k].packetLossRate],
                        -1
                    );
                    datasets.push({
                        label: k,
                        data: dataArr,
                        backgroundColor: color_mapping[k],
                        borderColor: color_mapping[k],
                        pointStyle: "circle",
                    }, {
                        label: k + "_interference",
                        data: interferenceArr,
                        hidden: true,
                    });
                } else
                    datasets.push({
                        label: "_" + k,
                        yAxisID: "packetLossRate",
                        backgroundColor: ["rgba(226,232,240, 0.5)"],
                        borderColor: "#e2e8f0",
                        barThickness: 30, // Adjust the bar width as needed
                        data: [data[k]["Packet Loss Rate"]],
                        order: 2,
                    }, {
                        label: k,
                        yAxisID: "rssi",
                        type: "line",
                        borderColor: "transparent",
                        backgroundColor: color,
                        data: [data[k]["RSSI"]],
                        order: 1,
                        fill: false,
                    });
            } else {
                if (dataType === "Throughput") {
                    datasets[index].data.push(data[k].speed || 0);
                    datasets[index + 1].data.push([
                        data[k].rssi,
                        data[k].packetLossRate,
                    ]);
                } else {
                    datasets[0].data.push(data[k]["Packet Loss Rate"]);
                    datasets[1].data.push(data[k]["RSSI"]);
                }
            }
        }
        chart.update();
    }

    function removeData(chart) {
        chart.data.labels.length = 0;
        chart.data.datasets.length = 0;
        chart.update();
    }

    // {
    //                 label: 'Advertisting',
    //                 data: [1500, 96, 84, 76, 300],
    //                 backgroundColor: "#40CE5E",
    //                 borderColor: '#40CE5E',
    //                 pointStyle: 'rect'
    //             }, {
    //                 label: 'Connection',
    //                 data: [123, 155, 12, 31, 250],
    //                 backgroundColor: "#6D99EA",
    //                 borderColor: '#6D99EA',
    //                 pointStyle: 'circle'
    //             }, {
    //                 label: 'Notification',
    //                 data: [83, 122, 156, 1, 66],
    //                 backgroundColor: "#FF9900",
    //                 borderColor: '#FF9900',
    //                 pointStyle: 'triangle'
    // 创建水印回调函数
    function drawWatermark(chart) {
        const ctx = chart.chart.ctx;

        // 设置水印样式
        ctx.font = "30px Arial";
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // 旋转水印
        ctx.translate(chart.chart.width / 2, chart.chart.height / 2);
        ctx.rotate(-Math.PI / 4); // 逆时针旋转45度

        // 添加水印文本
        ctx.fillText("Cassia Networks Inc.", 0, 0);

        // 恢复画布状态
        ctx.rotate(Math.PI / 4);
        ctx.translate(-chart.chart.width / 2, -chart.chart.height / 2);
    }

    function getChartOptions(chartOpts = 1) {
        return {
            type: chartOpts === 1 ? "line" : "bar",
            options: {
                layout: {
                    padding: {
                        right: 10,
                    },
                },
                responsive: true,
                maintainAspectRatio: false,
                elements: {
                    line: {
                        fill: false,
                        borderWidth: 2,
                    },
                    point: {
                        backgroundColor: getLineColor,
                        pointStyle: alternatePointStyles,
                        hoverRadius: 1,
                    },
                },
                scales: {
                    y: {
                        beginAtZero: false
                    },
                    xAxes: [{
                        gridLines: {
                            // zeroLineColor: "#40CE5E",
                            zeroLineWidth: 2,
                        },
                        ticks: {
                            stacked: true,
                            callback: function(label, index, labels) {
                                return label;
                            },
                        },
                    }, ],
                    yAxes: [{
                        type: "linear",
                        position: "left",
                        // stacked: true,
                        scaleLabel: {
                            display: true,
                            labelString: chartOpts === 1 ?
                                "Throughput" :
                                "Packet Loss Rate",
                            fontColor: "black",
                            fontStyle: "bold",
                        },
                        point: {
                            pointStyle: "circle",
                        },
                        ticks: {
                            // min: chartOpts === 1 ? 0 : 0,
                            // max: chartOpts === 1 ? undefined : 100,
                            stepSize: chartOpts === 1 ? 5 : 1,
                            // fontColor: "#40CE5E",
                            // stacked: true,
                            callback: function(value, index, ticks) {
                                return (
                                    (value / 1000).toFixed(2) +
                                    (chartOpts === 1 ? "kB/s" : "%")
                                );
                            },
                        },
                    }, ],
                },
                animation: {
                    onAnimationComplete: function() {
                        let sourceCanvas = this.chart.ctx.canvas;
                        let copyWidth = this.scale.xScalePaddingLeft;
                        let copyHeight = this.scale.endPoint + 5;
                        let targetCtx = document
                            .getElementById("myChartAxis")
                            .getContext("2d");
                        targetCtx.canvas.width = copyWidth;
                        targetCtx.drawImage(
                            sourceCanvas,
                            0,
                            0,
                            copyWidth,
                            copyHeight,
                            0,
                            0,
                            copyWidth,
                            copyHeight
                        );
                    },
                },
                legend: {
                    display: false,
                    position: "top",
                    align: "end",
                    labels: {
                        boxWidth: 5,
                        usePointStyle: true,
                        click: function(e, legendItem, legend) {
                            console.log(e, legendItem, legend);
                        },
                        filter: function(legendItem, data) {
                            return !legendItem.text.includes("interference");
                        },
                    },
                },
                tooltips: {
                    mode: "nearest",
                    callbacks: {
                        label: function(tooltipItem, data) {
                            let label =
                                data.datasets[tooltipItem.datasetIndex].label || "";
                            let subData = data.datasets[
                                tooltipItem.datasetIndex
                            ].data.slice(0, tooltipItem.index + 1);
                            if (label) {
                                let interferenceData =
                                    data.datasets[tooltipItem.datasetIndex + 1]
                                    .data[tooltipItem.index];
                                let total = subData.reduce(
                                    (a, b) => (a || 0) + (b || 0)
                                );

                                return [
                                    " mac: " + label,
                                    " value: " +
                                    (interferenceData[0] === undefined ||
                                        interferenceData[0] === "-" ?
                                        "-" :
                                        tooltipItem.yLabel),
                                    " total: " + total.toFixed(1),
                                    " rssi: " + (interferenceData[0] || "-"), // RSSI
                                    // If interferenceData[1] is undefined, display "-", else display the value with a % sign
                                    " packetLossRate: " +
                                    (typeof interferenceData[1] !==
                                        "undefined" &&
                                        interferenceData[1] !== "-" ?
                                        interferenceData[1] + "%" :
                                        "-"), // Packet Loss Rate
                                ];
                            }
                            return label;
                        },
                    },
                },
            },
        };
    }

    function initializeChart() {
        let chart1 = $("#chart1");
        let chart2 = $("#chart2");
        return [
            new Chart(chart1, getChartOptions()),
            new Chart(chart2, {
                type: "line",
                plugins: {
                    beforeDraw: drawWatermark, // 在绘制图表前调用水印函数
                },
                options: {
                    layout: {
                        padding: {
                            right: 10, // 设置右边距为 20 像素
                        },
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        xAxes: [{
                            ticks: {
                                display: false, // Hide the x-axis labels
                            },
                        }, ],
                        yAxes: [{
                                id: "packetLossRate",
                                type: "linear",
                                position: "right",
                                scaleLabel: {
                                    display: false,
                                    labelString: "Packet Loss Rate",
                                    fontColor: "#f9fafb",
                                    fontStyle: "bold",
                                },
                                point: {
                                    pointStyle: "circle",
                                },
                                ticks: {
                                    min: 0,
                                    max: 100,
                                    stepSize: 1,
                                    fontColor: "#f9fafb",
                                    callback: function(value, index, ticks) {
                                        return "";
                                    },
                                },
                            },
                            {
                                id: "rssi",
                                type: "linear",
                                scaleLabel: {
                                    display: true,
                                    labelString: "RSSI(dBm) / Pkt Loss(%)",
                                    fontColor: "black",
                                    fontStyle: "bold",
                                    padding: 8,
                                },
                                point: {
                                    pointStyle: "circle",
                                },
                                ticks: {
                                    min: -100,
                                    max: 0,
                                    stepSize: 1,
                                    // fontColor: "#4dc9f6",
                                    callback: function(value, index, ticks) {
                                        return ` ${value}/ ${value + 100}`;
                                    },
                                },
                            },
                        ],
                    },
                    animation: {
                        onAnimationComplete: function() {
                            let sourceCanvas = this.chart.ctx.canvas;
                            let copyWidth = this.scale.xScalePaddingLeft;
                            let copyHeight = this.scale.endPoint + 5;
                            let targetCtx = document
                                .getElementById("myChartAxis")
                                .getContext("2d");
                            targetCtx.canvas.width = copyWidth;
                            targetCtx.drawImage(
                                sourceCanvas,
                                0,
                                0,
                                copyWidth,
                                copyHeight,
                                0,
                                0,
                                copyWidth,
                                copyHeight
                            );
                        },
                    },
                    legend: {
                        display: false,
                        position: "top",
                        align: "end",
                        labels: {
                            boxWidth: 5,
                            usePointStyle: true,
                            click: function(e, legendItem, legend) {
                                console.log(e, legendItem, legend);
                            },
                            filter: function(legendItem, data) {
                                return !legendItem.text.includes("_");
                            },
                        },
                    },
                    tooltips: {
                        mode: "nearest",
                        callbacks: {
                            label: function(tooltipItem, data) {
                                let index = tooltipItem.index;
                                let pktDropVal = data.datasets[0].data[index];
                                let rssiVal = data.datasets[1].data[index];
                                let label =
                                    data.datasets[tooltipItem.datasetIndex].label ||
                                    "";
                                return [
                                    " mac: " + label,
                                    ` pkt drop:  ${pktDropVal} %`,
                                    ` rssi: ${rssiVal}`,
                                ];
                            },
                        },
                    },
                },
            }),
        ];
    }

    //             }
    const [chart, chart2] = initializeChart();

    const FETCH_DATA_INTERVAL = 5 * 1000;

    function updateTable(item) {
        const tableBody = $("table tbody");

        const existingRow = tableBody.find(`tr[data-id="${item.id}"]`);
        if (existingRow.length > 0) {
            // Update existing row data
            const cells = existingRow[0].cells;
            item.chipId !== undefined && (cells[4].innerText = item.chipId);
            item.type !== undefined && (cells[5].innerText = item.type);
            item.rssi !== undefined && (cells[6].innerText = item.rssi);
            item.speed !== undefined &&
                (cells[7].innerText =
                    item.rssi === "-" ? item.rssi : +item.speed + " B/s");
            item.packetLossRate !== undefined &&
                (cells[8].innerText = `${
                item.packetLossRate === "-" ? "-" : item.packetLossRate + "%"
            }`);

            // Update data-chip attribute if chipId is provided
            if (item.chipId !== undefined) {
                existingRow.attr("data-chip", "chip" + item.chipId);
            }
        } else {
            // Create a new row
            let _color = COLORS[index % COLORS.length];
            color_mapping[item.id] = _color;
            ids[item.id] = index;
            const newRowHtml = `<tr data-id="${
            item.id
        }" data-color="${_color}" data-chip="chip${
            item.chipId
        }" onclick="onItemClick({id: this.dataset.id, color: this.dataset.color}, event)">
            <td class="checkbox-cell"><input type="checkbox" checked></td>
            <td><span class="circle" style="background: ${_color}"></span></td>
            <td>${index}</td>
            <td colspan="2">${item.id}</td>
            <td class="${columnsHidden ? "hidden" : ""}">${item.chipId}</td>
            <td class="${columnsHidden ? "hidden" : ""}">${item.type}</td>
            <td class="${columnsHidden ? "hidden" : ""}">${item.rssi}</td>
            <td ${columnsHidden ? "class='hidden'" : ""} colspan="2">${
            item.speed || 0 + " B/s"
        }</td>
            <td class="${columnsHidden ? "hidden" : ""}">${
            item.packetLossRate
        }%</td>
        </tr>`;
            tableBody.append(newRowHtml);
            index++;
        }
    }

    function getSpeedAndInterference() {
        const configStr = localStorage.getItem('throughputMonitorConfig');
        let config = {};
        if (configStr) {
            config = JSON.parse(configStr);
        }
        const mode = config.mode || 'local';
        const ip = config.localIp || localStorage.getItem('gatewayIP') || ''; // Local IP from config or storage
        
        let interferenceUrl, rateUrl;
        
        if (mode === 'ac') {
            const acAddress = config.acAddress;
            const acToken = config.acAuthToken;
            const acGateway = config.acGateway;
            
            if (!acAddress || !acToken || !acGateway) {
                console.error('AC configuration incomplete');
                return;
            }
            
            interferenceUrl = `${acAddress}/api/gap/connection/interference?mac=${acGateway}&access_token=${acToken}`;
            rateUrl = `${acAddress}/api/gatt/nodes/rate?mac=${acGateway}&access_token=${acToken}`;
        } else {
            interferenceUrl = `http://${ip}/gap/connection/interference`;
            rateUrl = `http://${ip}/gatt/nodes/rate`;
        }

        let now = Date.now();
        for (let i in conn0) {
            conn0[i] = 0;
        }

        for (let i in conn1) {
            conn1[i] = 0;
        }

        $.ajax({
            url: interferenceUrl,
            type: "get",
            timeout: 5000,
            success: (connections) => {
                if (
                    connections === null ||
                    connections === undefined ||
                    (Array.isArray(connections) && connections.length === 0) ||
                    (typeof connections === "object" &&
                        Object.keys(connections).length === 0)
                ) {
                    chart.data.labels.push(
                        dateFormat(new Date(now), "%H:%M:%S", false)
                    );
                    chart.data.datasets.forEach((dataset) => {
                        if (dataset.label.includes("_interference")) {
                            dataset.data.push([0, 0]);
                        } else dataset.data.push(0);
                    });
                    chart.update();
                }
                for (let id in ids) {
                    if (
                        typeof connections === "object" &&
                        Array.isArray(connections) &&
                        !connections.find((item) => item.id === id)
                    ) {
                        let chipId = $(
                            `tr[data-id="${id}"] td:nth-child(5)`
                        ).text();
                        connections.push({
                            id: id,
                            chipId: parseInt(chipId),
                            type: "public",
                            rssi: "-",
                            speed: "-",
                            packetLossRate: "-",
                        });
                    } else {
                        $(`tr[data-id="${id}"] td:nth-child(7)`).text("-");
                        $(`tr[data-id="${id}"] td:nth-child(8)`).text("-");
                        $(`tr[data-id="${id}"] td:nth-child(9)`).text("-");
                    }
                }
                connections.map &&
                    connections.map((item) => {
                        // item.speed = 0;
                        if (item.chipId === 0) {
                            conn0[item.id] = item;
                        } else {
                            conn1[item.id] = item;
                        }
                        updateTable(item);
                    });
                $.ajax({
                    url: rateUrl,
                    type: "get",
                    timeout: 5000,
                    success: function(d) {
                        // if (Object.keys(d).length === 0) {
                        //     return;
                        // }
                        // d = {"EF:F4:F8:F6:B7:F0": "8.6"}
                        // <th colspan="1">#</th>
                        //             <th colspan="2">Device</th>
                        //             <th>Chip</th>
                        //             <th>Type</th>
                        //             <th colspan="2">RSSI</th>
                        //             <th colspan="2">Speed</th>
                        //             <th>Package Loss Rate</th>
                        connections.forEach &&
                            connections.forEach((item) => {
                                let mac = item.id;
                                item.speed = d[mac] || 0;
                                if (item.chipId === 0) {
                                    conn0[mac] = item;
                                } else {
                                    conn1[mac] = item;
                                }
                                updateTable(item);
                            });

                        connAll[now] = [
                            Object.assign({}, conn0),
                            Object.assign({}, conn1),
                        ];
                        addData(
                            chart,
                            dateFormat(new Date(now), "%H:%M:%S", false),
                            Object.assign({}, conn0, conn1)
                        );

                        if (currentLabel) {
                            let all = Object.assign({}, conn0, conn1);
                            addData(
                                chart2,
                                dateFormat(new Date(now), "%H:%M:%S", false), {
                                    [currentLabel]: {
                                        RSSI: all[currentLabel].rssi,
                                        "Packet Loss Rate": all[currentLabel].packetLossRate,
                                    },
                                },
                                "packetLossRate"
                            );
                        }
                    },
                });
            },
        });
    }

    function dateFormat(date, fstr, utc) {
        utc = utc ? "getUTC" : "get";
        return fstr.replace(/%[YmdHMS]/g, function(m) {
            switch (m) {
                case "%Y":
                    return date[utc + "FullYear"](); // no leading zeros required
                case "%m":
                    m = 1 + date[utc + "Month"]();
                    break;
                case "%d":
                    m = date[utc + "Date"]();
                    break;
                case "%H":
                    m = date[utc + "Hours"]();
                    break;
                case "%M":
                    m = date[utc + "Minutes"]();
                    break;
                case "%S":
                    m = date[utc + "Seconds"]();
                    break;
                default:
                    return m.slice(1); // unknown code, remove %
            }
            // add leading zero if required
            return ("0" + m).slice(-2);
        });
    }

    // labels: ['2020-12-14 24:00', '2020-12-14 24:00', '2020-12-14 24:00', '2020-12-14 24:00', '2020-12-14 24:00'],
    // $.get(`http://${ip}/cassia/info`).done(function(data) {
    //     if (data["local-api"] === "0" && data["fat"] === "0") {
    //         return alert("please open the local api!");
    //     }
    // }).fail(function(jqXHR, textStatus, errorThrown) {
    //     let errorMessage;
    //     switch (jqXHR.status) {
    //         case 0:
    //             errorMessage = 'Not connected. Verify Network.';
    //             break;
    //         case 404:
    //             errorMessage = 'Requested page not found. [404]';
    //             break;
    //         case 500:
    //             errorMessage = 'Internal Server Error [500].';
    //             break;
    //         default:
    //             errorMessage = 'Uncaught Error.\n' + jqXHR.responseText;
    //     }
    //     return alert(errorMessage)
    // });
    function startThroughputUpdates() {
        if (updateInterval) clearInterval(updateInterval);
        
        getSpeedAndInterference();
        updateInterval = setInterval(() => {
            if (fetchData) getSpeedAndInterference();
        }, FETCH_DATA_INTERVAL);
    }

    window.restartThroughput = function() {
        // Reset everything
        index = 1;
        conn0 = {};
        conn1 = {};
        connAll = {};
        ids.length = 0; // Clear keys
        for (let key in ids) delete ids[key];
        color_mapping = {};
        $("table tbody").empty();
        removeData(chart);
        removeData(chart2);
        
        startThroughputUpdates();
    };

    startThroughputUpdates();
})
