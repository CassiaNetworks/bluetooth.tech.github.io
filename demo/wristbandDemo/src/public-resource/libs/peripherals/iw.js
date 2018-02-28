
  function iwsendMsgHandle(node, hubs, str){

    
    //是否含有中文（也包含日文和韩文）
    function isChineseChar(str) {
        let reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
        return reg.test(str);
    }
    //同理，是否含有全角符号的函数
    function isFullwidthChar(str) {
        let reg = /[\uFF00-\uFFEF]/;
        return reg.test(str);
    }
    // 将str转为unicode
    function encodeUtf8(data) {
        // return encodeURI(data).split('%').join("")
        let val = "";
        for (let i = 0; i < data.length; i++) {
            let char = data[i];
            if (isChineseChar(char) || isFullwidthChar(char)) {
                if (val === "") {
                    val = encodeURI(char).split('%').join(",");
                } else {
                    val += encodeURI(char).split('%').join(",");
                }
            } else {
                if (val === "")
                    val = data.charCodeAt(i).toString(16);
                else
                    val += "," + data.charCodeAt(i).toString(16);
            }
        }
        console.log(val.split(",").join(''));
        return val.split(",").join('');
    }


    function packetData(data) {
      let dataLength = data.length / 2;
      if (dataLength < 15) {
        let totalLen = (2 + dataLength).toString();
            //console.log(totalLen.length);
            totalLen.length === 1 ? totalLen = ('0' + totalLen).toString(16) : totalLen = totalLen.toString(16);
            let packet = ['21ff31', totalLen, '02ff', data];
            console.log(packet.join('').split());
            return packet.join('').split();
          } else {
            let packets = [];
            let firstPacket = data.slice(0,28);
            let packet = '21ff311202ff' + firstPacket;
            packets.push(packet);
            let otherPacket = data.slice(28);
            for(let i = 0, len = otherPacket.length; i < len; i = i + 40){
              packets.push(otherPacket.slice(i,i+40));
            }
            console.log(packets);
            return  packets;
          }
        }


//写入逻辑  
    function iwsendMsg(node,hubs,str){
        let convertedData = encodeUtf8(str);
        let packets = packetData(convertedData);
        for (let i = 0; i < packets.length; i++) {
            let eventName = 'write';
            if (i === packets.length - 1) {
                eventName = 'finishiw';
            }
            hubs.write({
                node: node,
                handle: 39,
                mac: hubs.connetedPeripherals[node].mac,
                value: packets[i],
                eventName1: eventName
            });
            console.log(packets[i]);
        }
        hubs.once('finishiw', function (o) { 
            console.log("disconn");
            setTimeout(function () {
                hubs.disconn(o);
            }.bind(this), 5000);
        });

    }
        //hubs.disconn(hubs.locationData[node])
        hubs.__conn(hubs.locationData[node]).done(function(){
            iwsendMsg(node, hubs, str)
        });
};



const iw = {
    scanDataHandle: function (o) {
        let mac = o.mac,
            // chip = o.chip,
            node = o.data.bdaddrs[0].bdaddr,
            name = o.data.name;
            if(!name) return;
            let scanData = o.data.scanData || o.data.adData;
            if(!scanData) return;


        let battery = parseInt(scanData.slice(46, 48), 16),
            heartRate = parseInt(scanData.slice(44, 46), 16),
            step = parseInt(scanData.slice(38, 40) + scanData.slice(36, 38) + scanData.slice(34, 36), 16),
            cal = parseInt(scanData.slice(42, 44) + scanData.slice(40, 42), 16);

          //  console.info("%%%%%%%%%%%%%%%%%%%%", battery,heartRate,step,cal);
        return {
            mac,
            node,
            name: name,
            battery,
            heartRate,
            step,
            cal,
            say: true
        }
    },
    sendMsg: iwsendMsgHandle
};

export default iw

