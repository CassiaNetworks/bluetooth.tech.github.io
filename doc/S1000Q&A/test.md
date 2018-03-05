##BI配置文档
### 一、数据采集业务
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**实时采集手环佩戴人员的心率、步数、卡路里、手环的电量信息以及手环的位置信息等。可以自定义接收该数据的服务器地址、每次发送的时间间隔、数据的格式。程序会根据配置的时间间隔定时向指定的服务器POST数据，数据格式如下：**
####Hw330:
{  
**type**: 'breceletData',// 数据类型 表示手环数据
**'C2:EB:18:BD:18:AA'**: { //设备mac地址 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**model**: HW330, //设备类型 酷思手环
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**node**:'C2:EB:18:BD:18:AA',//设备的MAC地址
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**position**: 'CC:1B:E0:E0:97:B0',//定位在哪台路由器附近
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**rssi**: -70,//信号强度
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**routerMac**: 'CC:1B:E0:E0:97:B0',//该数据是哪台路由器扫描到的
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**step**: 12586,//步数信息
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **heartrate**: 0,//心率数据
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**calorie**:123,//卡路里
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**battery**: 100,//设备电量
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **timestamp**: 1508510388556, //时间戳,
},
**’C2:EB:18:BD:18:BB’**:{...}
 }
####IW：
{
**type**: 'breceletData',// 数据类型 表示手环数据
**'C2:EB:18:BD:18:AA'**: { //设备mac地址 
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**model**: 'iw',//设备类型 埃微手环
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**node**:'C2:EB:18:BD:18:AA',//设备的MAC地址
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**rssi'**:  -70,//信号强度
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**position**: 'CC:1B:E0:E0:97:B0',//定位在哪台路由器附近
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**routerMac**: 'CC:1B:E0:E0:97:B0',//该数据是哪台路由器扫描到的
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**step**: 123,//步数信息
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**heartrate**: 0,//心率数据
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**calorie**: 123,//卡路里
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**sportType**: //运动类型
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**battery**: 100,//设备电量
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**timestamp**: 1508510388556, //时间戳,  
},
**’C2:EB:18:BD:18:BB’**:{...}
 }                                                                                                                     
**选择设备**：选择1种或多种
**POST URL**：最终的数据结果以POST方式发送到该URL；
**Date Interval**：每个时间间隔发送该时间段内所有数据(单位：秒)
**位置信息(需要打开定位业务)**：打开后会在最终的数据结果中增加‘position’字段，值为蓝牙路由器mac地址(‘position’: CC:1B:E0:E0:22:60);
(关闭后在最终的数据结果中不包含‘position’字段；)
**Data Format**：选择数据的格式，目前支持json和form两种数据格式；

###二、信息录入业务
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**指定一台或多台蓝牙路由器用于信息录入功能，当蓝牙终端设备放置在蓝牙路由器旁边时，会主动将该终端设备的MAC推送到指定的服务器。为了防止频繁推送同一个终端设备，在程序内部做了保障机制，当终端设备一直在蓝牙路由器旁边时，只推送一次。如果想重新录入某终端设备，需要将终端设备远离负责录入的路由器，再重新放到路由器旁边。数据格式如下：**
{
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**type**: infoInput,// 数据类型 表示信息录入
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**timestamp**: 1508510388556 , //时间戳
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**deviceMac**: ‘AA:BB:EE:DD:EE:FF’，//设备mac地址 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**routerMac**: 'CC:1B:E0:E0:97:B0'//该数据是哪台蓝牙路由器上报的
}
**选择设备**：在支持该功能的设备列表中选择一种或多种设备进行信息录入；
**POST URL**：最终的数据结果以POST方式发送到该URL；
**录入阈值**: 当设备的信号强度大于该阈值时才能被录入(理论上终端设备离蓝牙路由器越近，检测到终端设备的信号强度越大)；
**重录阈值**：终端设备被录入以后，想重新录入该设备需要远离录入的蓝牙路由器，将信号强度低于该阈值。
**添加蓝牙路由器**：选择一个或多个蓝牙路由器作为信息录入功能的路由器，
**Data Format**：选择数据的格式，目前支持json和form两种数据格式；

###三、进出校业务
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**在大门的内外各部署一台或多台蓝牙路由器，门外路由器和门内路由器中间有3-5米建筑遮挡。人员佩戴终端设备从校外进入到学校内，依次经过校外和校内的蓝牙路由器，程序会检测到该设备佩戴人员进入学校，反之为离开学校，进入和离开都对应了一个唯一的标识符。**
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**程序会记录人员最后一次进出校记录，不会重复上报出校或入校。如果人员在两台路由器中间逗留，同样会上报进出校，以最后一次为准。因为进出校门的人员较多，程序会根据用户自定义设置的时间间隔，定时发送该时间间隔内的所有进出校记录，进出校数据如下：**
{
**type**: “entryAndExit”,// 数据类型 表示信息录入
**‘CC:00:AB:0A:C2:E0’**:{  //设备mac地址 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**status** ：1 // 标识符，
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**node**: CC:00:AB:0A:C2:E0 //设备mac地址 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**timestamp**：1503997863790 //时间戳
},
**‘CC:00:AB:0A:C4:27’**:{  //设备mac地址 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**status** ：2// 标识符，
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**node**: CC:00:AB:0A:C4:27//设备mac地址 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**timestamp**：1503997863790 //时间戳
}
} 

**选择设备**：在支持该功能的设备列表中选择一种或多种设备进行信息录入；
**POST URL**：最终的数据结果以POST方式发送到该URL；
**Date Interval**：每个时间间隔发送该时间段内所有进出校结果(单位：秒)
**大门类别**: 可支持多个种类大门，学校有南北两个大门，这两个大门就都属于学校大门类别。目前可支持多个种类大门，如宿舍门和篮球馆大门。因为学校大门与其他门的算法不同，所以需要把学校大门部署的蓝牙路由器的信息填在第一个；
#####&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;例如某个学校共有南北两个大门，其中南门的门内门外各部署1台蓝牙路由器；北门的门内门外各部署2台蓝牙路由器；这南北两个大门属于一个类别。该类别门内3台合并在一起，标识符为1,；门外的3台合并在一起，标识符为2。小明从南门或北门进入学校都会上报1，出学校会报2。如下图：


###四、定位业务
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**_开启该功能后会计算已选择设备的位置信息，区域级定位，定位到蓝牙路由器。定时向目标服务器发送，数据格式如下_**：
{
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**type**: ’position’,// 数据类型 表示定位信息
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**Timestamp**: 1508510388556,//时间戳
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**‘C2:EB:18:BD:18:AA’**: ‘CC:1B:E0:E0:22:60’,
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**’C2:EB:18:BD:18:BB‘’**: ‘CC:1B:E0:E0:21:5C’,
...
}
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;以终端设备的MAC地址为键(C2:EB:18:BD:18:AA、C2:EB:18:BD:18:BB)，以蓝牙路由器的MAC地址为值；
**选择设备**：在支持该功能的设备列表中选择一种或多种设备计算定位；
**POST URL**：最终的数据结果以POST方式发送到该URL；
**Date Interval**：每个时间间隔发送该时间段内所有位置信息(单位：秒)
**Data Format**：选择数据的格式，目前支持json和form两种数据格式；


