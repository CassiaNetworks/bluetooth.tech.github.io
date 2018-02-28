
var co = require('co');

function sendMsgHandle(node, hubs, str) {
    let packets = ['0100', 'ff2006000227', 'ff000d00040110010102FF0125'];
    let packetSeq = 6;
    function checksum(data) {
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
            let item = data[i];
            if (item.length <= 2) {
                sum += parseInt(item, 16);
            } else {
                let count = 0;
                if (item.length % 2 === 0) {
                    count = item.length / 2;
                } else {
                    count = parseInt(item.length / 2) + 1;
                }

                let pos = 0;
                for (let j = 0; j < count; j++) {
                    sum += parseInt(item.slice(pos, pos += 2), 16);
                }
            }
        }

        sum %= 0x100;

        let checksum = sum.toString(16);
        checksum = checksum.length < 2 ? '0' + checksum : checksum;

        data.insert(data.length, checksum);
    }


    function wrapData(val) {
        return val < 10 ? '0' + val : val + "";
    }

    function getTotalLength(datalen, sequence) {
        if (sequence === 0) {
            return 1 + 1 + 1 + 2 + 9 + parseInt(datalen / 2) + 1;
        } else {
            let len = (1 + 1 + 1 + parseInt(datalen / 2) + 1).toString(16);
            len = len.length < 2 ? '0' + len : len;
            return len;
        }
    }

    function getPacketSequence() {
        let packetSeqS;
        if (packetSeq > 10 && packetSeq < 99) {
            packetSeqS = '00' + packetSeq;
        } else if (packetSeq > 99) {
            packetSeqS = '0' + packetSeq;
        } else {
            packetSeqS = '000' + packetSeq;
        }

        return packetSeqS;
    }




    /**
     *组包
     * @param data
     * @param remainder
     * @param sequence
     */
    function setOfPackets(data, remainder, sequence) {
        // function getTimestamp() {
        //     let date = new Date();
        //     return wrapData(date.getHours()) + wrapData(date.getMinutes());
        // }

        if (sequence >= 0) {
            let x = 0b10000000 + sequence;
            let identifier = x.toString(16);
            let packetHeader = 'ff';
            if (sequence === 0) {
                let content = data.slice(0, 10);
                let contentLen = (remainder / 2 + 4).toString(16);
                contentLen = contentLen.length < 2 ? '0' + contentLen : contentLen;
                let packet = [packetHeader, identifier, getTotalLength(content.length, sequence).toString(16), getPacketSequence(), "02100201" + contentLen + "0103" + '0101', content + ""];
                checksum(packet);
                remainder -= 10;
                sequence += 1;
                packets.push(packet.join(''));
            } else {
                let content;
                if (remainder <= 32) {
                    x = 0b11000000 + sequence;
                    identifier = x.toString(16);
                    content = data.substr((sequence - 1) * 32 + 10, 32);
                    sequence = -1;
                } else {
                    remainder -= 32;
                    content = data.substr((sequence - 1) * 32 + 10, 32);
                    sequence += 1;
                }

                let packet = [packetHeader, identifier, getTotalLength(content.length, sequence).toString(16), content];

                wrapData();
                checksum(packet);
                packets.push(packet.join(''));

            }

            setOfPackets(data, remainder, sequence);
        }

    }




    function packetData(data) {
        let dataLength = data.length / 2;
        if (dataLength < 5) {
            let totalLen = 16 + dataLength;
            let packet = ['ff00', totalLen.toString(16), '0b', getPacketSequence(), "02100201" + '0' + (dataLength + 4).toString(16) + "0103" + '0101', data + ""];
            checksum(packet);
            packets.push(packet.join(''));
        } else {
            //多包
            setOfPackets(data, data.length, 0)
        }
    }


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



    Array.prototype.insert = function (index, item) {
        this.splice(index, 0, item);
    };

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

        return val.split(",").join('');

    }






    function sendMsg(node, hubs, msg) {
        let convertedData = encodeUtf8(msg);
        packetData(convertedData);
        let handle;
        co(function* () {
            try {
                for (let i = 0; i < packets.length; i++) {
                    i === 0 ? handle = 17 : handle = 19;
                    let eventName = 'write';
                    if (i === packets.length - 1) {
                        eventName = 'finishHW3300000001';
                    }
                    yield hubs.write({
                        node: node,
                        handle: handle,
                        mac: hubs.connetedPeripherals[node].mac,
                        value: packets[i],
                        eventName1: eventName
                    });
                    console.log(packets[i]);
                }
            } catch(e){}
        });
/*        for (let i = 0; i < packets.length; i++) {
            i === 0 ? handle = 17 : handle = 19;
            let eventName = 'write';
            if (i === packets.length - 1) {
                eventName = 'finishHW3300000001';
            }

             hubs.write({
                node: node,
                handle: handle,
                mac: hubs.connetedPeripherals[node].mac,
                value: packets[i],
                eventName1: eventName
            });
            //console.log(packets[i]);
        }*/
        hubs.once('finishHW3300000001', function (o) {
            setTimeout(function () {
                
                hubs.disconn(o);
            }.bind(this), 7000);
        })
/*        packetSeq++;
        packets = [];*/
    }
    hubs.__conn(hubs.locationData[node]).done(function(){
        sendMsg(node, hubs, str);
    });
    // hubs.once('conn', function () {
    //     // sendMsg(node, hubs, str,'finishHW33000000011')
        
    // })
    // if (hubs.connetedPeripherals[node]) {
    //     sendMsg(node, hubs, str)
    // } else {
    //     // hubs.disconn(hubs.locationData[node])
    //     hubs.__conn(hubs.locationData[node])
    //     hubs.on('conn', function () {
    //         // sendMsg(node, hubs, str,'finishHW33000000011')
    //         sendMsg(node, hubs, str)
    //     })
    // }

}



const HW = {
    scanDataHandle: function (o) {
        function toDEC(str) {
            return parseInt(str, 16)
        }
        const mac = o.mac,
            // chip = o.chip,
            node = o.data.bdaddrs[0].bdaddr,
            data = o.data.adData || o.data.scanData,
            manufacturer = data.slice(-20);

        let battery = toDEC(manufacturer.slice(4, 6)),
            heartRate = toDEC(manufacturer.slice(6, 8)),
            step = toDEC(manufacturer.slice(8, 14)),
            cal = toDEC(manufacturer.slice(14, 20)) / 10;
        //console.log(node, battery, heartRate, step);
        ////((model.get('step') * .03918)).toFixed(2)
        return {
            mac,
            node,
            name: 'HW',
            battery,
            heartRate,
            step,
            cal: cal,
            say: true
        }
    },
    sendMsg: sendMsgHandle
};


export default HW