/* const defaultInfo = {
    vivalink: 15,
    default: 10
};

const ___ = {
    node: {
        mac: {
            life: 15,
            rssi: []
        }
    }
}
function init(info = {}) {
    info = Object.assign({}, defaultInfo, info);
    let nodes = {};
    function handle(scanData) {
        const mac = o.mac;
        const node = o.data.bdaddrs[0].bdaddr;
        const rssi = parseInt(o.data.rssi);
        const name = o.data.name;
        let timer = 0;
        if (!nodes[node]) {
            nodes[node] = {};
        }
        if (!nodes[node][mac]) {
            nodes[node][mac] = { life: 15, rssi: [] }
        }
        nodes[node][mac].life = info[name] || info.default;
        nodes[node][mac].rssi.push(rssi);
        if (!timer) {
            timer = setInterval(function () {
                for (const node in nodes) {
                    for (const mac in nodes[node]) {
                        if (nodes[node][mac].life) {
                            nodes[node][mac].life--;
                            if (!nodes[node][mac].life) {
                                nodes[node][mac].rssi.length = 0;
                            } else {
                                nodes[node][mac].rssi
                            }
                        }

                    }
                }
            }, 1000);
        }

    }
    return scanData;
} */


export default function () {
    var realPosition = {};
    var positionByRouter = {};
    var temperHub = {};

    setInterval(function () {
        for (var deviceId in realPosition) {
            if (!realPosition[deviceId]) {
                return;
            };
            if (realPosition[deviceId].flag) {
                realPosition[deviceId].flag = false;
            } else {
                let hubMac = realPosition[deviceId].hubMac;

                if (positionByRouter[hubMac] && (positionByRouter[hubMac].indexOf(deviceId) !== -1)) {
                    positionByRouter[hubMac].splice(positionByRouter[hubMac].indexOf(deviceId), 1);
                }
                realPosition[deviceId] = null;
                delete realPosition[deviceId];

            }
        }
    }, 20000);

    function getPositionByDevice(devices) {

        if (devices) {
            let b = {};

            for (let id of devices) {
                b[id] = realPosition[id] ? realPosition[id].hubMac : null;
            }
            return b;
        } else {
            let a = {};

            for (let id in realPosition) {
                a[id] = realPosition[id].hubMac;
            }
            return a;
        }
    }

    function getPositionByHub(hubs) {
        let b = {};

        for (let id in hubs) {
            b[hubs[id]] = positionByRouter[hubs[id]] ? positionByRouter[hubs[id]] : [];

        }
        return b;
    }

    function handleTemperHub(deviceId, hubMac, rssi) {
        if (!temperHub[deviceId]) {
            temperHub[deviceId] = {
                'flag': false,
                'rssi': [],
                'hub': hubMac
            };
        }
        if (temperHub[deviceId].hub !== hubMac) {
            return;
        }
        if (temperHub[deviceId].flag) {
            temperHub[deviceId].rssi.push(rssi);
            if (!realPosition[deviceId]) {
                return;
            }
            realPosition[deviceId].newRssiArray.push(rssi);
            realPosition[deviceId].newHub = hubMac;

        }
    }

    var l = 20;

    function rssiAverage(arr) {
        var sum = 0;

        for (var i in arr) {
            sum += arr[i];
        }
        if (arr.length) {
            return sum / arr.length;
        }
        return -100;
    }

    function handleTemperHubTimeOut(deviceid, hubMac) {
        setTimeout(function (deviceid, hubMac) {

            var aver = rssiAverage(temperHub[deviceid].rssi);

            delete temperHub[deviceid];
            if (!realPosition[deviceid]) {
                return;
            }

            realPosition[deviceid].newRssiArray = [];
            realPosition[deviceid].newHub = '';

            if (!realPosition[deviceid]) {
                return;
            }

            if (aver > realPosition[deviceid].average) {

                let routerMac = realPosition[deviceid].hubMac;
                if (positionByRouter[routerMac] && (positionByRouter[routerMac].indexOf(deviceid) !== -1)) {

                    positionByRouter[routerMac].splice(positionByRouter[routerMac].indexOf(deviceid), 1);

                }
                if (!realPosition[deviceid]) {
                    return;
                }
                realPosition[deviceid].average = aver;
                realPosition[deviceid].hubMac = hubMac;
                realPosition[deviceid].count = 1;
                realPosition[deviceid].rssiArray = [aver];

                if (positionByRouter[hubMac]) {
                    if (positionByRouter[hubMac].indexOf(deviceid) !== -1) {
                        positionByRouter[hubMac].splice(positionByRouter[hubMac].indexOf(deviceid), 1);
                        positionByRouter[hubMac].splice(positionByRouter[hubMac].push(deviceid));
                    } else {
                        positionByRouter[hubMac].splice(positionByRouter[hubMac].push(deviceid));
                    }
                } else {
                    positionByRouter[hubMac] = [deviceid];
                }
            }
        }.bind(null, deviceid, hubMac), 5000);
    }

    function realTimePosition(deviceid, rssi, hubMac) {
        if (realPosition[deviceid]) {
            if (realPosition[deviceid].hubMac === hubMac) {
                if (realPosition[deviceid].rssiArray.length < l) {
                    realPosition[deviceid].rssiArray.push(rssi);
                    realPosition[deviceid].average = rssiAverage(realPosition[deviceid].rssiArray);
                    realPosition[deviceid].count = (realPosition[deviceid].count + 1) % l;
                } else {
                    realPosition[deviceid].rssiArray[realPosition[deviceid].count] = rssi;
                    realPosition[deviceid].count = (realPosition[deviceid].count + 1) % l;
                    realPosition[deviceid].average = rssiAverage(realPosition[deviceid].rssiArray);
                }
            } else {
                if ((realPosition[deviceid].average + 5) < rssi) {

                    if (!temperHub[deviceid]) {
                        return;
                    }
                    if (temperHub[deviceid].flag) {
                        return;
                    }
                    temperHub[deviceid].flag = true;
                    temperHub[deviceid].hub = hubMac;
                    handleTemperHubTimeOut(deviceid, hubMac);
                }
            }

        } else {

            var positionInfo = {
                'hubMac': hubMac,
                'rssiArray': [],
                'count': 1,
                'average': rssi,
                'newHub': '',
                'newRssiArray': [],
                'newCount': 0,
                'newAverage': 0,
                'flag': true
            };

            positionInfo.rssiArray.push(rssi);
            realPosition[deviceid] = positionInfo;

            var devicePositionInfo = {
                'hubMac': hubMac,
                'rssiArray': [],
                'count': 1,
                'average': rssi,
                'newHub': '',
                'newRssiArray': [],
                'newCount': 0,
                'newAverage': 0,
                'flag': true
            };

            devicePositionInfo.rssiArray.push(rssi);
            if (positionByRouter[hubMac]) {
                if (positionByRouter[hubMac].indexOf(deviceid) === -1) {
                    positionByRouter[hubMac].push(deviceid);
                }
            } else {
                positionByRouter[hubMac] = [deviceid];
            }
        }
    }

  

   
    function handle(req) {
        var deviceId = req.data.bdaddrs[0].bdaddr;
        var hubMac = req.mac;
        var rssi = req.data.rssi;

        if (realPosition[deviceId] && (realPosition[deviceId].hubMac === hubMac)) {
            realPosition[deviceId].flag = true;
        }
        realTimePosition(deviceId, rssi, hubMac);
        handleTemperHub(deviceId, hubMac, rssi);
        // req.data.position = getByDevice([deviceId])[deviceId];
    }

    function getByHub(hubs) {
        if (hubs) {
            return getPositionByHub(hubs);
        } else {
            return positionByRouter;
        }
    }

    // function getByDevice(devices) {
    //     return getPositionByDevice(devices);
    // }

    return {
        handle,
        getByHub,
        getPositionByDevice
    };
};
