
    function ec(mac_id,electricity_x,T_temperature_x,echarts5,deviceData,echarts2){

            var option = {

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
                
            // assign configuration
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
                        data:['Temp']  
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
 //    function ec1(mac_id,electricity_x,T_temperature_x,echarts5,deviceData){
 //            var option = {
 //                    title: {  
                        
 //                    },  
 //                    tooltip : {  
 //                        trigger: 'axis'  
 //                    },  
 //                    legend: {  
 //                        data:['tem']  
 //                    },  
 //                    toolbox: {  
 //                        feature: {  
 //                            saveAsImage: {}  
 //                        }  
 //                    },  
 //                    grid: {  
 //                        left: '3%',  
 //                        right: '4%',  
 //                        bottom: '3%',  
 //                        containLabel: true  
 //                    },  
 //                    xAxis : [  
 //                        {  
 //                            type : 'category',  
 //                            boundaryGap : false,  
 //                            data : [1,2,3,4,5,6,7,8,9,10]  
 //                        }  
 //                    ],  
 //                    yAxis : [  
 //                        {  
 //                            type : 'value'  
 //                        }  
 //                    ],  
 //                    series : [  
 //                        {  
 //                            name:'tem',  
 //                            type:'line',  
 //                            stack: '',  
 //                            data:deviceData.ddd,
 //                        },  
 //                    ]  
 //                }; 
 //            // assign configuration
 //            if(echarts5[mac_id]){
 //                echarts5[mac_id].setOption(option);
 //            }
 //    } 
	// 