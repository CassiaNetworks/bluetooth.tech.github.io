[TOC]
#云端使用说明文档

注：为了方便描述，下文将蓝牙路由器称为AP。
蓝牙路由器以及蓝牙设备的管理软件称为AC。 

##正文
###一、产品综述
####1.1、产品介绍AP,AC是什么？
**AP**：
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**1）** <font face="华文楷体">蓝牙路由器(AP)</font>:可以通过扫描和建连的方式对蓝牙设备进行控制和数据采集。一方面，蓝牙路由器可以大大地提高传统的蓝牙通信距离和连接 终端数量，另一方面，蓝牙路由器可以将蓝牙信号通过网络传递给远程的控 制端。
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**2）** <font face="华文楷体">蓝牙路由器(AP)</font>:可以实现主设备到从设备的角色反转，作为模拟蓝牙设备向外发送广播包。

**AC**: 
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**1）**AC是一套对AP以及蓝牙设备的管理软件。 
针对企业的业务层提供 API 接口作为调用、数据转发、定位、漫游、 安全及策略管理等，可以跨越局域网实现对AP的远程控制。
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**2）**AC作为集中管理的网络节点，其形态可以有如下三种：
        <font face="华文楷体">盒子</font>：旁挂在用户网络的汇聚交换机或核心交换机上。
        <font face="华文楷体">私有云</font>：部署在刀片服务器上。
        <font face="华文楷体">公有云</font>：部署在IDC机房或阿里云、亚马逊上，为B端用户提供蓝 牙路由器托管服务。
####1.2、AP，AC会给你带来什么？
__*AP*：__
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**1)**AP解决了手机与蓝牙设备之间只能一对一连接的问题。
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**2)**解决了手机与蓝牙设备之间只能连接10m的问题
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**3)**<font face="华文楷体">家庭方面</font>：可躺在沙发通过手机，控制家中多个蓝牙设备
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**4)**<font face="华文楷体">养老方面</font>：通过蓝牙技术将跌倒呼救器与智能终端或者蓝牙路由器相连接，      实现使用者的跌倒自动报警和一键主动求救。
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**5)**<font face="华文楷体">教育方面</font>：管理学生进出校，考勤管理，反向通知等功能。
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**6)**<font face="华文楷体">工业方面</font>：通过传感器，实时获取多个工业设备的运转状态及数据等。
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**7)**<font face="华文楷体">运动检测</font>：通过手环，获取多人实时心率，步数，卡路里等数据
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**8)**AP提供了简单的api接口，供开发使用
_**AC**：_
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **1)** 快速批量配置网络信息、wifi等
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**2)** 连接保障、系统的稳定性
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**3) **可视化查询ap的状态以及详细信息（如版本信息等）
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**4)** 定位功能
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**5) **方便接入客户的软件系统
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**6) **可以通过外网远程控制
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**7) **对局域网的网络环境适应性强（二层、三层网络均可，可穿透内网防火墙）
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**8) **可以根据ap的唯一标识（mac地址）来控制ap，防止出现ap的ip变化      的问题
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**9)** 安全问题，内网通过ip地址调试无任何安全机制，普通人可以简单地干扰      ap的使用，需要oAuth认证；ac支持https方式对数据进行加密
###二、产品结构
####2.1、网络结构图
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;下图一是集中管理架构下，AC作为网络设备、私有云时的网络结构示意图：
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ![Alt text](./1505294636131.png)

**图1： AC作为网络设备或私有云时的网络拓朴**

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;图二是集中管理架构下，AC作为公有云时的网络结构示意图：
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![Alt text](./1505294665616.png)

     
**图2： AC作为公有云部署时的网络拓朴**

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;有线上行和WiFi上行的AP均可由本地局域网连接到AC上；若采用3G、LTE上行时，AC需要在互联网上具备一个公网地址（或公网映射）,AP通过互联网可连入AC。
业务平台与AC之间通过局域网或Internet进行通信。
####2.2、工作流程图
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![Alt text](./1505294677169.png)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![Alt text](./1505294684870.png)

以下为我们健身房实例图：
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![Alt text](./1505294688878.png)
###三、连网方式
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.1：以太网：通过以太网线直接连接到AP的网口，AP将会自动接入接入互联网，AP的IP地址默认通过DHCP方式获取。
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.2：wifi：只支持2.4G网络，不支持portal认证方式
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.3：3G,4G(暂不支持5G)：插入3G/4G无线网卡到USB插口，AP将会自动接入互联网， 目前大陆支持中兴MF823 Hilink版

优先级：以太网>wifi>3G4G（即：插上网线后，优先通过以太网方式进行dhcp分配地址）
###三、<font color="ff0000" face="Microsoft YaHei">对接流程 </font>，AP详细功能及BI使用说明</font>
####3.1 <font color="ff0000" face="Microsoft YaHei">AP与AC对接设备调试的流程（必看）此流程可完成初步对接</font>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**1)** 将AP供电并插上网线，保证其可以进入到配置页面。(3.2)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**2)** 进入到AP配置页面，对AP进行配置，填写Developer Key和 AC Address保证与AC端一致。(3.4)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**3)** 进入到AC，在设置中填写Developer Key和Developer Secret。(4.6)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**4)**  AC添加或自动发现AP，等待约1分钟后，AP上线，可以进行调试及对接工作。(4.6)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**5)** 通过蓝牙调试工具或其他方式进行设备的对接，获取数据。(5.2)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**6)** 最后遵照蓝牙协议进行解析数据。(例子见6.12)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**<font color="ff0000" face="Microsoft YaHei">选看(7)</font>** 在可以成功使用AC后可对AC中的BI进行使用，目前支持教育解决方案（详情看4.8）
####3.2 怎么进入到AP的配置页面？
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**1）**将进入到wifi路由器的配置页面
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**2）**找到AP的mac地址（在AP的底部）
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**3）**进入WiFi路由器控制面板，通过mac地址查找AP被分配的IP地址。
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**4）**在浏览器地址栏中输入AP的ip地址即可进到AP的配置页面
####3.3 获取AP的ip地址
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;进入WiFi路由器控制面板，查看AP被分配的IP地址。
在这里找到AP的mac地址所对应的ip地址
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![Alt text](./1505294738895.png)


####3.4  AP配置页面的详情
![Alt text](./1505294744320.png)


将AP登录到AC ，必须配置Developer和 AC Address（cassia提供）
![Alt text](./1505294747991.png)


####3.5 怎么连接到3G/4G网？
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;插入3G/4G无线网卡到USB插口，AP将会自动接入互联网，目前大陆  支持中兴MF823 Hilink版。
####3.6 怎么连接到以太网 ？
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;通过以太网线直接连接到AP的网口，AP将会自动接入接入互联网，AP的IP地址默认通过DHCP方式获取。
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;可以在AP配置页面将IP配置为static
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;打开cmd，输入ipconfig

![Alt text](./1505294755743.png)
![Alt text](./1505294758973.png)


####3.7怎么连接到WiFi？（及网络优先级问题）
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;插上网线连接以太网。通过IP地址进入AP的配置页面(如图3)，在Wireless处配置WIfI 的名字和密码,配置完成后拔掉网线，AP会自动连接WiFi.
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;设置WiFi静态IP，同上
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;网络优先级：连网的优先级由高到低为：3G/4G > 以太网 > WiFi（优先级：当3G/4G、以太网、WIFI并存的情况下数据会从优先级高的通道走）
####3.8连网成功有什么提示吗？
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;AP上共有5个指示灯：WIFI、BT、SYS、PWR、ETH;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;当接通电源后，PWR的绿灯常亮；
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;当系统正常工作时，SYS的绿灯会闪烁；
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;当连接以太网成功后，ETH的绿灯会闪烁；
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;当连接WIFI以后，WIFI的绿灯会闪烁。
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;当有蓝牙设备与其连接上时，BT亮
####3.9 AP登录到AC,需要配置哪些参数？
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;让AP登录到AC，必须配置AC Address和Developer 。Developer 要跟AC中设置相同，配置成功后点击保存。然后进入AC中添加或自动发现AP

### 四、AC详细功能

####4.1总览面板
![Alt text](./1505294773126.png)
  

![Alt text](./1505294776539.png)


####4.2  ac历史统计

![Alt text](./1505294782299.png)
![Alt text](./1505294785923.png)
![Alt text](./1505294788974.png)


####4.3管理蓝牙路由器
![Alt text](./1505294793007.png)

####4.4查看已连接蓝牙设备
![Alt text](./1505294796167.png)

####4.5 地图管理
![Alt text](./1505294800029.png)
![Alt text](./1505294802841.png)


####4.6 AP怎么连接到AC（设置详情）
![Alt text](./1505294806203.png)

![Alt text](./1505294809412.png)

点击添加或自动发现，并写入AP的mac地址和名字(名字自定义)
添加：
![Alt text](./1505294823270.png)

自动发现：
![Alt text](./1505294827890.png)

点击确定后，等待约1分钟，AP上线，就可以进行简单的调试，对接工作了。
####4.7升级更新与维护
![Alt text](./1505294836199.png)
####4.8BI的使用说明
#####4.8.1BI概述
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**①、BI是什么**
            BI（Business Intelligence）即商务智能软件，是一种根据预设定的程序自主处理用户的原始数据，并将原始数据转化成可读的用户数据的软件。在我们的产品中，BI是通用的面向大部分客户的蓝牙数据采集及蓝牙数据交互平台。
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**②、为什么要用BI**
            使用蓝牙路由器获取数据后，将原始数据进行解析，并发送到服务地址的过程，多是重复工作，这样的开发多为复杂，繁琐的工作。若使用相同的手环，解析数据是对于每个客户都相同步骤。为省去客户许多不必要的对接工作，我们创造了BI。
#####4.8.2、BI页面

#####4.8.3、BI功能及使用
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;AC进入BI的唯一通道：将AC地址中主机名后的第一个路由改为”bi”，即可进到BI中。
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;进到BI后，会有许多版本选择，在您想要的版本后点击install，即可下载成功。
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;点击setting，进到BI配置页面
BI目前整合了6项业务，**数据采集业务、信息录入业务、定位业务、进出校业务、反向通知业务、校时业务。**
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;每项业务必须填写参数，保存后需**重启BI**，路由器会将获取到的数据发送到目标地址上。


**我们以定位业务为例：**

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;当我们想要获取到手环的数据时，需将左侧AC的信息写入，地址为AP的所在AC地址（后面必须加入端口号+/api），账号及密码为AC中设置项的信息。右侧有4项填写的信息，**url**为目标服务器地址，数据将通过post请求方式向地址推送数据。**选择设备**为使用设备的名称。**发送间隔**为获取到的数据发送至目标服务器的发送间隔。**数据类型**有json和form两种类型。
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;全部配置好后，点击保存，若提示保存失败，请完善上方配置信息，不符合标准的会有提示，确认信息填写正确后，点击保存，会提示”保存成功，重启BI生效”，**返回到上一页面，重启BI**。配置信息即可生效。

**再以比较复杂的校时业务为例：**

校时业务分为自动校时，手动校时。
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**自动校时**：

**选择设备：**为使用的终端设备
**是否接收回复：**为是否接收校时的结果
**接受回复的地址：**为接受结果的地址，BI将校时的结果通过post请求推送至目标地址
**校时开始时间；**为路由器开始进行校时的时间点，时间以AC服务器的时间为准。注：若校时开始时间为8:00则在8点前需将手环开启（路由器可以扫到），在8点过后再次扫描到手环才可进行校时。
**校时时间：**为进行校时的总时长，若接受回复，且在指定时间内没有全部校时成功，则校时时间结束时向服务器推送校时结果。若接受回复，且全部手环在时间范围内全部校时成功，则在全部校时成功后，将结果推送至服务器。


&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**手动校时：**

**选择设备**为使用的终端设备
**是否接收回复**为是否接收校时的结果
**BI服务器地址**为将进行手动校时的手环或其他蓝牙设备的MAC地址推送至BI的服务器中的地址。常为http://192.168.199.183:8081/bi/education/api/clockSync/后接自定义路由。（下面以postman为例，向BI服务器发送请求）注：推送的地址与BI页面中的地址必须统一。
**接受回复的地址**为接受结果的地址，BI将校时的结果通过post请求推送至目标地址。推送的数据格式请看业务的介绍文档

**校时开始时间**为路由器开始进行校时的时间点，时间以AC服务器的时间为准
**校时时间**为进行校时的总时长，若接受回复，且在校时时间内没有全部校时成功，则校时时间结束时向服务器教室结果数据。若接受回复，且全部手环在时间范围内全部校时成功，则在全部校时成功后，将结果推送至服务器。
**黑白名单**为是选用制定路由器执行，还是不选用指定路由器执行


我们拿postman举例，向BI服务器地址发送指定的校时手环。


&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Headers中写入Content-&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Type:application/json
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Body中数据格式为
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "type": "clockSync",
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "timeout": 300,//与BI中的填写相同
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "requireRes": "true",
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; "deviceMac":["D8:45:A3:B8:20:C2","D3:CB:56:6E:7C:82","E6:96:F1:52:D1:C2"]


###五、配置完成后怎么调试？
####5.1 可以用哪些工具进行调试？
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**1）**我们提供了一个蓝牙调试工具，实现了API中的大部分控制功能，在如何操作见5.2；
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**2）**其他支持HTTP请求的软件，比如Postman(不支持SSE)，如何操作间见5.3；
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**3）**浏览器(不支持POST请求)，在地址栏发送http请求，如何操作见5.4；
####5.2 蓝牙调试工具怎么使用？（推荐）
(http://www.bluetooth.tech/nativeHubControl/index.html)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;说明文档：蓝牙调试工具
####5.3 Postman怎么调用API接口？(不支持sse)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;需要获取token，详细见6.4
![Alt text](./1505294894975.png)

####5.4 浏览器怎么调用调用API接口？(不可请求post)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在浏览器地址栏中输入API接口
例:scan接口
![Alt text](./1505294927502.png)

###六、API接口的常见问题
API接口文档地址：https://cassiasdk.docs.apiary.io
找到APIs的章节，即为所有API的接口

####6.1 什么是API接口？都有哪些接口？
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;AP提供了简单的api接口，供开发使用
#####token
>`http://AC地址/oauth2/token`
#####Scan 
>`http://AC address/gap/nodes/?event=1&mac=&chip=&filter_name=&filter_mac=&filter_uuid=&access_token=`
#####Connect
>`http://AC address/gap/nodes/<node>/connection?mac=&chip=&access_token=`
#####Disconnect
>`http://AC address/gap/nodes/<node>/connection?mac=&access_token`
#####Connect_list
>`http://ACaddress/gap/nodes/?connection_state=connected&mac=&access_token=`
#####Discover  services & characteristics & desciptors
>`http://AC address/gatt/nodes/<node>/services/characteristics/descriptors?mac=&access_token=`
#####Get device connection state
>`http://AC address/gap/nodes/?connection_state=connected&mac=&access_token=`
#####Write by handle
>`http://AC address/gatt/nodes/<node>/handle/<handle>/value/<value>/?mac=&access_token=`
#####Notify
>`http://AC address/gatt/nodes/?event=1&mac=&access_token=`

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;以上为常用API接口，供开发使用，有专门的的API接口文档，蓝牙调试工具所有功能都是通过API接口实现的。
以连接接口为例（js语言）：
![Alt text](./1505294944711.png)

####6.2 API支持哪些开发语言？
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;任何基于HTTP通信协议的编程语言都支持（例如C＃，Node.js，Java，iOS等）。
    对于C＃、Node.js、Java、iOS，我们提供了oAuth认证及sse的sampleCode。
https://github.com/CassiaNetworks/CassiaHubSDKSamples/tree/master/samples
####6.3 SSE（Server-sent Events）是什么?该如何实现？API中有哪些接口使用SSE？
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font face="黑体">server-sent events</font>，简称：see。是一种http的长链接，请求需要手动关闭，否则理论上在不报错的情况下会一直进行，每条数据会以“data: ” 开头。在调试中可以直接将sse的url输入在浏览器中进行调用。但是在编程中使用一般的http请求无法请求到数据(一般的http请求都是在请求结束后返回所有的数据)，我们目前提供了iOS/java/nodejs/js/c#等的demo来实现sse的调用，如果在这方面遇到困难可以参考。另外，当调用sse时，最好对该长链接进行监控，以便在长链接出现错误或意外停止后进行重启，或者其他操作。
API中的SCAN、Get device connection state、Receive indication & notification 三个接口使用的是SSE   
####6.4 怎么通过API进行oAuth认证？
#####**1）**http的post请求进行oAuth认证(可在postman中进行)：
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;例如你的用户名：tester 密码：10b83f9a2e823c47
#####①将 tester:10b83f9a2e823c47进行base64编码得到 dgvzdgvyojewyjgzzjlhmmu4mjnjndc= 使用下面的HTTP请求进行身份验证：
     POST  /oauth2/token  HTTP/1.1
       Host: AC地址 /oauth2/token
       Headers: 
       {
         Authorization:Basic dGVzdGVyOjEwYjgzZjlhMmU4MjNjNDc=,
         Content-Type:application/x-www-form-urlencoded
        }
     Body: {grant_type=client_credentials}
#####②如果没有错，你会得到这样的JSON响应:
        HTTP/1.1 200 OK
        Content-Type: application/json;charset=UTF-8,
        Cache-Control: no-store,
        Pragma: no-cache
        {
        token_type:’bearer’,    
        access_token:"2b6ced831413685ec33204abc2a9a476310a852f53a763b72c854fd7708499f1bc0b3626bfcfef2a2cfe0519356c9d7cb1b514243cb29f60e76b92d4a64ea8bd"
         expires_in: 3600
        }


现在你可以使用access_token访问其他API，添加access_token URL参数：
        例：
![Alt text](./1505294953686.png)
![Alt text](./1505294956044.png)


####6.5 拿到token后怎么使用？
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;拿到access_token后访问其他API，例：scan接口
_http://AC地址/gap/nodes/?event=1&mac=xxx&access_token=xxxx_
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;或者你可以在接口中添加Headers “Authorization:Bearer XXXX”
####6.6 oAuth认证得到的token有效期是多长久?
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Token的有效期为1小时
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在上一个token有效期内再次申请token，这两个token都有效
####6.7 token与100个AP的问题
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Token只与开发者账号有关，与AP的MAC无关，100个AP如果有相同的开发者账号，那只需要1个小时重新获取一次token
####6.8 怎么调用API中的SSE接口？（以扫描为例）
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在浏览器地址栏中输入：
_http://AC地址/gap/nodes/?event=1&mac=&access_token=xxx_
####6.9 API中url的参数是什么意思？该如何填写？
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**mac=**:当前AP的mac地址(例如：CC:1B:E0:E0:24:B4)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**node=**:需要对接的设备的mac地址(例如：EF:F3:CF:F0:8B:81)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**handle=**:对应操作的索引值(发现设备服务后，根据设备蓝牙协议中的UUID找到对应的handle)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;**value=**:想对应handle中写入的值(根据蓝牙协议，写入操作的对应命令)
在此，以开源蓝牙协议为例：

(![Alt text](./1505294963477.png))
![Alt text](./1505294965722.png)

###七、高频错误信息有哪些？
**1）** **Offline(例如CC:1B:E0:E0:22:61is offline)**： 该AP没有上线，或者在云端调用时接口的domain与AP配置页面的domain不一致。查看AP的网络和电源，让AP重新上线后在进行操作并且查看AP的domain。

**2）** **net::ERR_NAME_NOT_RESOLVED**：在进行oAuth认证时，云服务器地址发生错误检查下云服务器地址是否书写有误，重新输入正确的云服务器地址

**3）** **Failed to load resource**: the server responded with a status of 401 (Unauthorized)：在进行oAuth认证时，开发者账户/密码输入错误检查开发者账户和密码输入是否有误，确认无误重新进行认证

**4）** **{"error":"forbidden","error_description":"Token not found or expired"}(403)**：token错误或者token超时(token只支持1小时)确认用户名密码，然后重新进行oAuth认证，获取token再执行操作

**5）** **{“error”:”access_denied”,”error_description”:”Bearer token not found”}(403)**: 拒绝访问，token错误，一般token输入为空时会返回上面的数据，检查开发<!-- MarkdownTOC -->


<!-- /MarkdownTOC -->
者账户、密码、云服务器是否输入正确，重新申请token

**6）** **net::ERR_CONNECTION_TIMED_OUT**：链接超时 可能是因为IP地址写错导致

**7）** **net::ERR_INCOMPLETE_CHUNKED_ENCODING**：可能因为url中的参数写错导致(例如将chip写成非0和1的值)

**8）** **param error **：可能是因为url中的参数写错导致(例如event写错)

**9）** **400 (Bad Request)**： 当设备没有连接AP时，AP向设备发送请求，有可能返回400

**10）** **NO DEVICE **：当你想断连某蓝牙设备时可能会发生该错误，因为其已经断开或者未连接AP

**11）** **NO HUB MAC **：没有配置开发者账号或者开发者账号错误

**12）** **CHIP IS BUSY,PLEASE WAITE** ：路由器正在连接其他设备，需要等待该设备连接结束，才可以连接下一个

**13）** **ERR timeout **：发送http请求超时

**14）** **404**：请检查url中参数是否正确
