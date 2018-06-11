
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
        let totalLen = (2 + dataLength).toString(16);
      
        totalLen.length === 1 ? totalLen = ('0' + totalLen).toString(16) : totalLen = totalLen.toString(16);
        if (dataLength < 15) {
          let packet = '21ff31' + totalLen + '02ff' + data;
      
          return [packet];
        } else {
          let packets = [];
          let firstPacket = data.slice(0, 28);
          let packet = '21ff31' + totalLen + '02ff' + firstPacket;
      
          packets.push(packet);
          let otherPacket = data.slice(28);
      
          for (let i = 0, len = otherPacket.length; i < len; i = i + 40) {
            packets.push(otherPacket.slice(i, i + 40));
          }
          return packets;
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
        console.log('ssssssss',o);
        let mac = o.mac,
            // chip = o.chip,
            node = o.data.bdaddrs[0].bdaddr,
            name = o.data.name;
            if(!name) return;
            let adData = o.data.adData;
            if(!adData) return;
        let battery = parseInt(adData.slice(38, 40), 16),
            heartRate = parseInt(adData.slice(36, 38), 16),
            step = parseInt(adData.slice(30, 32) + adData.slice(28, 30) + adData.slice(26, 28), 16),
            cal = parseInt(adData.slice(34, 36) + adData.slice(32, 34), 16);

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

