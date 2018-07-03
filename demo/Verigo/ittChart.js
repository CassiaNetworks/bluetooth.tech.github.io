function ec(mac_id,electricity_x,T_temperature_x,echarts5,deviceData,echarts2){
    // console.log(mac_id,electricity_x,T_temperature_x,echarts5,deviceData,echarts2)
    option = {
        title: {  
            text:"VRMS"
        },  
        tooltip : {  
            trigger: 'axis'  
        },  
        legend: {  
            data:['X','Y','Z']  
        },  
        toolbox: {  
            feature: {  
                saveAsImage: {}  
            }  
        },  
        grid: {  
            left: '3%',  
            right: '4%',  
            bottom: '3%',  
            containLabel: true  
        },  
        xAxis : [  
            {  
                type : 'category',  
                boundaryGap : false,  
                data : deviceData.date 
            }  
        ],  
        yAxis : [  
            {  
                type : 'value'  
            }  
        ],  
        series : [  
            {  
                name:'X',  
                type:'line',  
                stack: '',  
                data:deviceData.V_X_A  
            },  
            {  
                name:'Y',  
                type:'line',  
                stack: '',  
                data:deviceData.V_Y_A  
            }  ,{  
                name:'Z',  
                type:'line',  
                stack: '',   
                data:deviceData.V_Z_A  
            } 
        ]  
    };  
    if(echarts5[mac_id]){
        echarts5[mac_id].setOption(option);
    };
    option1 = {
        title: {  
            text:"Temperature"
        },  
        tooltip : {  
            trigger: 'axis'  
        },  
        legend: {  
            data:['Temperature']  
        },  
        toolbox: {  
            feature: {  
                saveAsImage: {}  
            }  
        },  
        grid: {  
            left: '3%',  
            right: '4%',  
            bottom: '3%',  
            containLabel: true  
        },  
        xAxis : [  
            {  
                type : 'category',  
                boundaryGap : false,  
                data : deviceData.date
            }  
        ],  
        yAxis : [  
            {  
                type : 'value'  
            }  
        ],  
        series : [  
            {  
                name:'Temperature',  
                type:'line',  
                stack: '',  
                data:deviceData.www,
            },  
        ]  
    }; 
    if(echarts2[mac_id]){
        echarts2[mac_id].setOption(option1);
    }
}

function fft(notifyData,deviceMac,data){
        //fft<<<<<<<<<<<<<<<<<<<<<haha>>>>>>>>>>>>>>>>>>>>>>
// console.log(notifyData[deviceMac].data)
// 
var x = notifyData[deviceMac].data[0].substring(8).substring(8,16392)
var y = notifyData[deviceMac].data[0].substring(16392,32776)
var z = notifyData[deviceMac].data[0].substring(32776,49140)
// console.log(x,y,z,x.length,y.length,z.length)
var xf = notifyData[deviceMac].data[1].substring(0,16384)
var yf = notifyData[deviceMac].data[1].substring(16384,32768)
var zf = notifyData[deviceMac].data[1].substring(32768,49152)



var oz = z.replace(/[\r\n]/g,"")
regz=/.{4}/g,rsz=oz.match(regz),hz=[];
$.each(rsz,function(i,v){
    hz.push(parseInt(v,16)*0.0001.toFixed(8));
})

var ox = x.replace(/[\r\n]/g,"")
regx=/.{4}/g,rsx=ox.match(regx),hx=[];
$.each(rsx,function(i,v){
    hx.push(parseInt(v,16)*0.0001.toFixed(8));
})

var oy = y.replace(/[\r\n]/g,"")
regy=/.{4}/g,rsy=oy.match(regy),hy=[];
$.each(rsy,function(i,v){
    hy.push(parseInt(v,16)*0.0001.toFixed(8));
})

var ozf = zf.replace(/[\r\n]/g,"")
regzf=/.{8}/g,rszf=ozf.match(regzf),hzfft=[];
$.each(rszf,function(i,v){
    hzfft.push(parseInt(v,16)*0.0001.toFixed(8));
})

var oxf = xf.replace(/[\r\n]/g,"")
regxf=/.{8}/g,rsxf=oxf.match(regxf),hxfft=[];
$.each(rsxf,function(i,v){
    hxfft.push(parseInt(v,16)*0.0001.toFixed(8));
})

var oyf = yf.replace(/[\r\n]/g,"")
regyf=/.{8}/g,rsyf=oyf.match(regyf),hyfft=[];
$.each(rsyf,function(i,v){
    hyfft.push(parseInt(v,16)*0.0001.toFixed(8));
})
i = 0
iarr = []
for (i = 0; i < hz.length; i++) {
    iarr.push(i)
}

n_2048 = 0
narr = []
for (var n_2048 = 0; n_2048 < 2048; n_2048++) {
    narr.push(n_2048)
}
// console.log(iarr)
var optionz = {
    tooltip: {
        trigger: 'axis',
        position: function (pt) {
            return [pt[0], '10%'];
        }
    },
    title: {
        left: 'center',
        text: 'Z',
    },
    toolbox: {
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: iarr
    },
    yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        min:'dataMin',
        max:'dataMax'
    },
    dataZoom: [{
        type: 'inside',
        start: 0,
        end: 10
    }, {
        start: 0,
        end: 10,
        handleSize: '80%',
        handleStyle: {
            color: '#fff',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2
        }
    }],
    series: [
        {
            
            type:'line',
            smooth:true,
            symbol: 'none',
            sampling: 'average',
            itemStyle: {
                normal: {
                    color: 'rgb(255, 70, 131)'
                }
            },
            data: hz
        }
    ]
};
myChartz[deviceMac.toUpperCase()].setOption(optionz);
var optionx = {
    tooltip: {
        trigger: 'axis',
        position: function (pt) {
            return [pt[0], '10%'];
        }
    },
    title: {
        left: 'center',
        text: 'X',
    },
    toolbox: {
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: iarr
    },
    yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        min:'dataMin',
        max:'dataMax'
    },
    dataZoom: [{
        type: 'inside',
        start: 0,
        end: 10
    }, {
        start: 0,
        end: 10,
        handleSize: '80%',
        handleStyle: {
            color: '#fff',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2
        }
    }],
    series: [
        {
            
            type:'line',
            smooth:true,
            symbol: 'none',
            sampling: 'average',
            itemStyle: {
                normal: {
                    color: 'rgb(255, 70, 131)'
                }
            },
            data: hx
        }
    ]
};
myChartx[deviceMac.toUpperCase()].setOption(optionx);
var optiony = {
    tooltip: {
        trigger: 'axis',
        position: function (pt) {
            return [pt[0], '10%'];
        }
    },
    title: {
        left: 'center',
        text: 'y',
    },
    toolbox: {
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: iarr
    },
    yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        min:'dataMin',
        max:'dataMax'
    },
    dataZoom: [{
        type: 'inside',
        start: 0,
        end: 10
    }, {
        start: 0,
        end: 10,
        handleSize: '80%',
        handleStyle: {
            color: '#fff',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2
        }
    }],
    series: [
        {
            type:'line',
            smooth:true,
            symbol: 'none',
            sampling: 'average',
            itemStyle: {
                normal: {
                    color: 'rgb(255, 70, 131)'
                }
            },
            data: hy
        }
    ]
};
myCharty[deviceMac.toUpperCase()].setOption(optiony);
var optionyfft = {
    tooltip: {
        trigger: 'axis',
        position: function (pt) {
            return [pt[0], '10%'];
        }
    },
    title: {
        left: 'center',
        text: 'fft_y',
    },
    toolbox: {
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: narr
    },
    yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        min:'dataMin',
        max:'dataMax'
    },
    dataZoom: [{
        type: 'inside',
        start: 0,
        end: 10
    }, {
        start: 0,
        end: 10,
        handleSize: '80%',
        handleStyle: {
            color: '#fff',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2
        }
    }],
    series: [
        {
    
            type:'line',
            smooth:true,
            symbol: 'none',
            sampling: 'average',
            itemStyle: {
                normal: {
                    color: 'rgb(255, 70, 131)'
                }
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgb(255, 158, 68)'
                    }, {
                        offset: 1,
                        color: 'rgb(255, 70, 131)'
                    }])
                }
            },
            data: hyfft
        }
    ]
};
myChartyfft[deviceMac.toUpperCase()].setOption(optionyfft);
var optionzfft = {
    tooltip: {
        trigger: 'axis',
        position: function (pt) {
            return [pt[0], '10%'];
        }
    },
    title: {
        left: 'center',
        text: 'fft_z',
    },
    toolbox: {
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: narr
    },
    yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        min:'dataMin',
        max:'dataMax'
    },
    dataZoom: [{
        type: 'inside',
        start: 0,
        end: 10
    }, {
        start: 0,
        end: 10,
        handleSize: '80%',
        handleStyle: {
            color: '#fff',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2
        }
    }],
    series: [
        {
            
            type:'line',
            smooth:true,
            symbol: 'none',
            sampling: 'average',
            itemStyle: {
                normal: {
                    color: 'rgb(255, 70, 131)'
                }
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgb(255, 158, 68)'
                    }, {
                        offset: 1,
                        color: 'rgb(255, 70, 131)'
                    }])
                }
            },
            data: hzfft
        }
    ]
};
myChartzfft[deviceMac.toUpperCase()].setOption(optionzfft);
var optionxfft = {
    tooltip: {
        trigger: 'axis',
        position: function (pt) {
            return [pt[0], '10%'];
        }
    },
    title: {
        left: 'center',
        text: 'fft_x',
    },
    toolbox: {
        feature: {
            dataZoom: {
                yAxisIndex: 'none'
            },
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: narr
    },
    yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        min:'dataMin',
        max:'dataMax'
    },
    dataZoom: [{
        type: 'inside',
        start: 0,
        end: 10
    }, {
        start: 0,
        end: 10,
        handleSize: '80%',
        handleStyle: {
            color: '#fff',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2
        }
    }],
    series: [
        {
            
            type:'line',
            smooth:true,
            symbol: 'none',
            sampling: 'average',
            itemStyle: {
                normal: {
                    color: 'rgb(255, 70, 131)'
                }
            },
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgb(255, 158, 68)'
                    }, {
                        offset: 1,
                        color: 'rgb(255, 70, 131)'
                    }])
                }
            },
            data: hxfft
        }
    ]
};
myChartxfft[deviceMac.toUpperCase()].setOption(optionxfft);
}