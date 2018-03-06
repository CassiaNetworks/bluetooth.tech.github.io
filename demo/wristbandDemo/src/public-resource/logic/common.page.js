import Hub from 'publicDir/libs/hubs/hub'
//import HW3300000001 from 'publicDir/libs/peripherals/HW3300000001'
//import HW0000001 from 'publicDir/libs/peripherals/HW0000001'
import HW from 'publicDir/libs/peripherals/HW3300000001'
import iw from 'publicDir/libs/peripherals/iw'
import {
    dashBoardItemColl
} from '../../pages/sport/sport/models/dashboardmodel'

const modelHandle = {
    /*    'HW330-0000001': {
            scanDataHandle: HW3300000001.scanDataHandle

        },*/
    'HW': {
        scanDataHandle: HW.scanDataHandle
    },
    'iw': {
        scanDataHandle: iw.scanDataHandle
    }

}
const names = {};

const DEBUG = false
const bg = (function () {
    if (DEBUG) {
        return {
            log() {
                console.log.apply(console, arguments)
            },
            table() {
                console.table.apply(console, arguments)
            },
            time() {
                console.time.apply(console, arguments)
            },
            timeEnd() {
                console.timeEnd.apply(console, arguments)
            },
            now() {
                console.log.apply(console, $.now().toLocaleTimeString())
            }
        }
    }
    return {
        log() {

        },
        table() {},
        time() {},
        timeEnd() {}
    }
})()

//定义全局的hubs变量，存储所有hub的信息
let hubs = {
    timer: null,
    writeArr: {},
    scanDataHandle: {
        // 'HW330-0000001': HW3300000001.scanDataHandle,
        // 'HW-0000001': HW3300000001.scanDataHandle
    },
    onceInit: false,
    hubs: {}, //所有hub
    scanHubs: [], //正在扫描的hub
    availableHubs: [], //空闲的hub  没有连接
    conningPers: [], //正在连接的设备
    writeHubs: [], //正在写入的设备
    locationData: {}, //定位信息
    connetedPeripherals: {}, //所有连接的设备
    interval: { //定时任务
        timer: null,
        tasks: []
    },
    target: {
        node: [],
        name: []
    },
    position: {
        node: [],
        name: []
    },
    destroy() {
        hubs.scanHubs = [] //正在扫描的hub
        hubs.availableHubs = [] //空闲的hub  没有连接
        hubs.conningPers = [] //正在连接的设备
        hubs.writeHubs = [] //正在写入的设备
        hubs.locationData = {} //定位信息
        hubs.connetedPeripherals = {} //所有连接的设备
        for (let mac in hubs.hubs) {
            if (hubs.hubs[mac]) {
                hubs.close({
                    event: 'scan',
                    mac: mac
                })
                hubs.close({
                    event: 'notify',
                    mac: mac
                })
            }
        }

        hubs.off('oauth')
        hubs.off('online')
        hubs.off('scanData')
        hubs.off('connByName')
        hubs.off('conn')
        hubs.hubs = {}
    },
    init(mac) {
        const __initEvent = function () {
            this.on('oauth', function (o) {

                hubs.__checkOnline(o.mac)
            })
            this.on('online', function (o) {
                hubs.scan(o.mac, 0)
                hubs.notify(o.mac)
                hubs.__intervalTask.call(this)
            })
            this.on('scanData', function (o) {
                hubs.addName(o);
                hubs.__scanDataColl(o)
                let node = o.data.bdaddrs[0].bdaddr,
                    name = o.data.name.match('unknow') ? hubs.locationData[node].name : o.data.name;
                names[node]
                if (o.data.name.match('unknow')) {
                    return;
                }

                if (name.match('Brace')) {
                    name = 'iw';
                    //console.log('$$$$$$$$$$$$$$$$$$$$$',o);
                }
                if (name.match('HW')) {
                    name = 'HW'
                }
                if (hubs.scanDataHandle[name]) {

                    hubs.trigger('broadcastData', hubs.scanDataHandle[name].call(this, o))
                }
            })
            //每次收到期望连接的设备时 触发连接请求
            // this.on('autoCon', function (o) {
            //     hubs.__slectHubByName.call(this, o)
            //     hubs.__slectHubByNode.call(this, o)
            // })
            this.on('connByName', hubs.__autoConnByName)
            this.on('conn', function (o) {
                const writeArr = hubs.writeArr[o.name]
                if (writeArr) {
                    for (let i = 0; i < writeArr.length; i++) {
                        const index = _.findWhere(writeArr, {
                            handle: o.handle,
                            value: o.value
                        })
                        if (index > -1 && index < writeArr.length) {
                            hubs.write(writeArr[index + 1])
                        }
                    }
                }
            })

        }
        __initEvent.call(this)
        this.__changeServer(mac)
        this.oauth(mac)
        return this
    },
    __changeServer(mac) {
        const info = this.hubs[mac].info
        info.realserver = info.method === '1' ? info.server : info.ip
    },
    addName(o) {
        let node = o.data.bdaddrs[0].bdaddr;
        if (names[node]) {
            o.data.name = names[node]
        }

        if (!o.data.name.match('unknow')) {
            names[node] = o.data.name;
        }
    },
    add(o = {}) {
        const mac = o.mac
        if (!this.onceInit) {
            hubs.destroy()
        }
        hubs.onceInit = true

        function _add() {
            if (this.hubs[mac]) {
                console.warn(`${mac} has existed`)
            } else {
                this.hubs[mac] = new Hub(o)
            }
        }

        if (mac === undefined) {
            return
        } else {
            _add.call(this)
        }
        return this
    },
    remove(mac) {
        if (this.hubs[mac])
            this.hubs[mac] = null
        return this
    },
    __es(target, method, url, fn) {
        if (target.output[method]) {
            return
        }
        let es = target.output[method] = new EventSource(String(url));
        es.onmessage = function (event) {
            fn && fn(event)
        }
    },
    oauth(mac, option) {
        mac = mac || ''
        option = option || {
            silent: false,
            eventName1: 'oauth',
            eventName2: 'oauthErr'
        }
        const hub = this.hubs[mac]
        if (hub.info.method === '0') {
            if (!option.silent) {
                if (!option.silent) {
                    this.trigger(option.eventName1, {
                        mac
                    })
                }
            }
            return this
        }
        $.ajax({
            type: 'post',
            url: hub.info.realserver + '/oauth2/token',
            headers: {
                'Authorization': 'Basic ' + btoa(hub.info.developer + ':' + hub.info.password)
            },
            data: {
                'grant_type': 'client_credentials'
            },
            // contentType: 'application/json',
            dataType: 'json',
            context: this,
            success: function (data) {
                hub.info.access_token = data.access_token
                hub.info.tokenExpire = data.expires_in
                hub._escapeTime.token = 0
                hub.info.authorization = 'Bearer ' + data.access_token
                if (!option.silent) {
                    this.trigger(option.eventName1, {
                        mac,
                        data
                    })
                }
            },
            error: function (xhr) {
                if (!option.silent) {
                    this.trigger(option.eventName2, {
                        mac,
                        xhr
                    })
                }
            }
        })
        return this
    },
    __checkOnline(mac) {
        const hub = this.hubs[mac]
        let _url
        if (hub.info.method === '0') {
            _url = hub.info.ip + `/gap/nodes/?connection_state=connected`
        } else {
            _url = hub.info.realserver + '/cassia/hubs/' + mac + '?&access_token=' + hub.info.access_token
        }

        $.ajax({
            type: 'get',
            url: _url,
            // headers: hub.info.method === 0 ? '' : {
            //     'Authorization': hub.info.authorization
            // },
            context: this,
            dataType: 'json',
            success: function () {
                this.hubs[mac]._escapeTime.checkOnline = 0
                this.hubs[mac].status.online = true
                if (hubs.availableHubs.indexOf(mac) === -1)
                    hubs.availableHubs.push(mac)
                this.trigger('online', {
                    mac
                })
            },
            timeout: 5000,
            error: function () {
                this.hubs[mac].status.online = false
                this.__delete(mac, this.availableHubs)
                this.hubs[mac].scanData = {
                    origin: {},
                    sort: {
                        name: {},
                        rssi: []
                    }
                }
                this.hubs[mac].output = {
                    scan: {},
                    notify: {}
                }
                this.trigger('offline', {
                    mac
                })

            }
        })
    },
    scan(mac, chip) {
        chip = chip || 0
        // debugger
        const hub = this.hubs[mac]
        if (!this.__online(mac)) {
            return
        }
        this.__es(hub, 'scan', hub.info.realserver + '/gap/nodes/?event=1&active=1&mac=' + mac + '&chip=' + chip + '&access_token=' + hub.info.access_token,
            function (event) {
                if (hubs.scanHubs.indexOf(mac) === -1) {
                    hubs.scanHubs.push(mac)
                }
                if (event.data.match(/keep-alive/i))
                    return
                var _data = JSON.parse(event.data)
                _data.name += "";
                hubs.trigger('scanData', {
                    mac,
                    chip,
                    data: _data
                })
            });

        return this
    },

    notify(mac) {
        const hub = this.hubs[mac]
        if (!this.__online(mac)) {
            return this
        }
        if (!hub.output.notify) {
            this.__es(hub, 'notify', hub.info.realserver + '/gatt/nodes/?event=1&mac=' + hub.info.mac + '&access_token=' + hub.info.access_token,
                function (event) {
                    if (event.data.match(/keep-alive/)) {
                        return
                    }
                    hubs.trigger('notify', {
                        mac,
                        data: event.data
                    })
                })
        }
        return this
    },
    __delete(item, Arr) {
        const index = Arr.indexOf(item)
        if (index === -1)
            return
        else {
            return Arr.splice(index, 1)
        }
    },
    close(o) {
        o = o || {
            mac: '',
            event: ''
        }
        if (!o.event) {
            return
        }
        this.hubs[o.mac].output[o.event] && this.hubs[o.mac].output[o.event].close()
        this.hubs[o.mac].output[o.event] = null
        this.__delete(o.mac, this.scanHubs)
        return this
    },
    /**
     * 定时任务
     * 
     * 
     */
    __intervalTask() {
        if (this.interval.timer) {
            return
        }
        this.interval.tasks = [{
            fn: this.oauth,
            interval: 3000,
            escapeTime: 'token',
            silent: true
        }, {
            fn: this.__checkOnline,
            interval: 60,
            escapeTime: 'checkOnline',
            silent: true
        }, {
            fn: this.devices,
            interval: 4,
            escapeTime: 'devices',
            silent: true
        }, {
            fn: this.__clearZombyScanData,
            interval: 1,
            escapeTime: 'clearZombyScanData',
            silent: true
        }, {
            fn: this.__sortByRssi,
            interval: 1,
            escapeTime: 'sortByRssi',
            silent: true
        }]
        clearImmediate(this.interval.timer)
        this.interval.timer = setInterval(function () {
            this.__clearOldLoac()
            for (let mac in this.hubs) {
                let hub = this.hubs[mac]
                this.interval.tasks.forEach(function (item) {
                    if (++hub._escapeTime[item.escapeTime] === item.interval) {
                        item.fn && item.fn.call(this, mac, {
                            silent: item.silent
                        })
                    }
                }, this)
            }
            this.__slectHubPs.call(this)
        }.bind(this), 1000)

        return this
    },
    __clearZombyScanData(mac, option) {
        option = option || {
            silent: false
        }
        if (!this.__online(mac)) {
            return
        }
        const origin = this.hubs[mac].scanData.origin
        for (let node in origin) {
            if (origin[node] && origin[node].life === 0) {
                this.__syncDelScanData(mac, node)
                if (!option.silent) {
                    hubs.trigger('clearZombyScanData', {
                        node,
                        mac
                    })
                }
            }
        }
        this.hubs[mac]._escapeTime.clearZombyScanData = 0

    },
    __clearOldLoac() {
        for (let node in this.locationData) {
            this.locationData[node] && this.locationData[node].life--;
        }
    },
    __hubAvailable(mac) {
        if (this.availableHubs.indexOf(mac) === -1) {
            return false
        }
        if (this.hubs[mac].status.conn >= this.hubs[mac].config.maxConnected) {
            console.warn(`hub ${mac} has connected max`)
            this.__delete(mac, this.availableHubs)
            this.trigger('maxConnected', {
                mac
            })
            return false
        }
        return true
    },
    //同步 availableHubs  conningPers connetedPeripherals  hubs[mac].status.doing   hubs[mac]status.conn   
    __conningSyncInfoData(o) {
        console.log(`${o.mac}   开始连接   ${o.name}   ${o.node}   RSSI${o.avg}`)
        hubs.__delete(o.mac, hubs.availableHubs)
        hubs.conningPers.push(o.node)
        hubs.hubs[o.mac].status.doing.node = o.node
    },
    __connedOkSyncInfoData(o) {
        console.info(`${o.mac}   成功连接   ${o.name}   ${o.node}`)
        hubs.addPer(o)
        hubs.hubs[o.mac].status.conn++
    },
    __connedErrSyncInfoData(o) {
        console.warn(`${o.mac}   失败连接   ${o.name}   ${o.node}`)
        hubs.connetedPeripherals[o.node] = null
        hubs.hubs[o.mac].connetedPeripherals.Peripherals[o.node] = null
    },
    __connedSyncInfoData(o) {
        if (this.availableHubs.indexOf(o.mac) === -1 && this.hubs[o.mac].status.conn < this.hubs[o.mac].config.maxConnected) {
            hubs.availableHubs.push(o.mac)
        }
        hubs.__delete(o.node, hubs.conningPers)
        hubs.hubs[o.mac].status.doing.node = ''
    },

    __syncDelScanData(mac, node) {
        const origin = this.hubs[mac].scanData.origin,
            sort = this.hubs[mac].scanData.sort,
            name = origin[node] ? origin[node].name : ''
        let index

        origin[node] = null
        //删除sort.name中的相应值
        if (sort.name[name]) {
            index = _.findIndex(sort.name[name], function (item) {
                return item.node === node
            })
            if (index > -1) {
                sort.name[name].splice(index, 1)
            }
        }
        //删除sort.rssi中相应值
        index = _.findIndex(sort.rssi, function (item) {
            return item.node === node
        })
        if (index > -1) {
            sort.rssi.splice(index, 1)
        }
    },
    __sortByRssi(mac, option) {
        bg.time('sortAllRssi')
        option = option || {
            silent: false
        }
        this.hubs[mac].scanData.sort.rssi = _.sortBy(this.hubs[mac].scanData.sort.rssi, (item) => -item.avg)
        for (let name in this.hubs[mac].scanData.sort.name) {
            this.hubs[mac].scanData.sort.name[name] = _.sortBy(this.hubs[mac].scanData.sort.name[name], (item) => -item.avg)
        }
        bg.log(`${new Date().toLocaleTimeString()}  ${mac}   Rssi排序耗时`)
        bg.timeEnd('sortAllRssi')
        // console.clear()
        // bg.table(hubs.hubs[mac].scanData.sort.rssi)
        this.hubs[mac]._escapeTime.sortByRssi = 0
        if (!option.silent) {
            hubs.trigger('sortByRssi')
        }
    },
    __perAvailable(node) {
        if (typeof node === typeof {}) {
            debugger
        }
        return this.conningPers.indexOf(node) === -1 && !this.connetedPeripherals[node]
    },
    __slectHubPs() {
        const len = this.availableHubs.length
        let result = {},
            filterArr = []
        for (let i = 0; i < len; i++) {
            const mac = this.availableHubs[i]
            for (let node of this.hubs[mac].scanData.sort.rssi) {
                if (this.conningPers.indexOf(node.node) === -1 && (this.target.name.indexOf(node.name) > -1 || this.target.node.indexOf(node.node) > -1)) {
                    if (filterArr.length < len * (i + 1)) {
                        filterArr.push(node)
                    }
                }
            }
        }

        if (filterArr.length === 0) {
            return this
        }
        let len2 = 0
        filterArr = _.sortBy(filterArr, (item) => -item.avg)
        for (let node of filterArr) {
            if (!result[node.mac] && len2 < len) {
                result[node.mac] = node
                len2++
            }
        }
        this.trigger('connByName', result)
    },
    /**
     * 
     * 
     * @param {any} [name=[]] 
     * @param {any} [option={}] 
     * @returns  每次第一次发现设备时 就会去连接，如果哦连接失败则会从最大3秒内最大平均rssi中选择hub
     */
    __slectHubByName(o, option) {
        option = option || {
            available: true,
            rssiAvg: -80
        }

        //存储当前 所有/可用 hub扫描到的名为 name 的设备
        let availableHubs = this.availableHubs




        const len = availableHubs.length,
            name = o.name
        if (len === 0 || this.target.name.indexOf(name) === -1) {
            return this
        }
        console.log(`发现要连接的设备${name}`)

        // have bug
        let node = this.hubs[availableHubs[o.mac]].scanData.sort.name[name][0]
        if (len === 1 && this.__perAvailable(node.node)) {
            if (this.__hubAvailable(availableHubs[0])) {
                this.trigger('connByName', {
                    [availableHubs[0]]: node
                })
            }

            return this
        }

        let filtedData = {},
            allScanData = [],
            sortByName,
            // 过滤指定available，返回可用hub中scandata中有特定name的hub
            availableWithOrderName = availableHubs.filter(item => hubs.hubs[item].scanData.sort.name[name], this)

        for (let mac of availableWithOrderName) {
            sortByName = this.hubs[mac].scanData.sort.name[name]
            for (let i = 0, len2 = Math.min(len, sortByName.length); i < len2; i++) {
                if (this.__perAvailable(sortByName[i].node) && this.__hubAvailable(mac)) {
                    if (!filtedData[mac])
                        filtedData[mac] = []
                    filtedData[mac].push(sortByName[i])
                }
            }
            allScanData.concat(filtedData[mac])
        }

        let result = {},
            resultNode = []



        for (let i = 0, len = allScanData.length; i < len; i++) {
            node = allScanData[i]
            if (resultNode.length < len && !result[node.mac] && resultNode.indexOf(node.node) === -1) {
                result[node.mac] = node
                resultNode.push(node.node)
            }
        }
        // this.trigger('connByName', result)
    },
    __slectHubByNode(node) {
        const mac = node.mac,
            availableHubs = this.availableHubs;
        if (this.target.node.indexOf(mac) === 1) {
            return
        }
        if (availableHubs.indexOf(mac) > -1 && this.__perAvailable(node)) {
            this.trigger('connByNode', this.locationData[node])
        }
    },

    // {
    //     mac,
    //     chip,
    //     data: event.data
    // }
    __scanDataColl(o) {
        const node = o.data.bdaddrs[0].bdaddr,
            name = o.data.name,
            rssi = parseInt(o.data.rssi),
            type = o.data.bdaddrs[0].bdaddrType,
            mac = o.mac

        function initNode(node, origin) {
            if (!origin[node]) {
                return {
                    rssi: [],
                    node: '',
                    mac: '',
                    max: -200,
                    min: 0,
                    avg: 0,
                    name: '',
                    type: '',
                    life: 4,
                    times: 0
                }
            }

            origin[node].life = 4;
            return origin[node]
        }

        function addData(node, hub) {

            hub.scanData.origin[node] = initNode(node, hub.scanData.origin)
            let index, _node = hub.scanData.origin[node]
            const len = _node.rssi.push(rssi)
            if (len > 5) {
                _node.rssi.shift()
            }
            _node.node = node
            _node.mac = mac
            _node.max = Math.max(rssi, _node.max)
            _node.min = Math.min(rssi, _node.min)
            _node.avg = parseInt(_.reduce(_node.rssi, function (memo, num) {
                return memo + num;
            }, 0) / len)
            if (!name.match(/unknown/)) {
                _node.name = name
            }
            _node.type = type
            // _node.life = 4 //生命周期是4秒
            if (_node.name.startsWith('Brace')) {

            }
            _node.times++;
            // _node.free = true

            //更新location 数据
            if (!this.locationData[node]) {
                this.locationData[node] = _node
            } else {
                if (_node.avg - this.locationData[node].avg > 2 && _node.times > 1) {
                    this.locationData[node] = _node
                }
            }
            this.locationData[node].life = 4;

            //更新hub.scanData.sort.name值
            const realName = _node.name,
                _name = hub.scanData.sort.name
            if (realName) {
                if (!_name[realName]) {
                    _name[realName] = []
                }
                index = _.findIndex(_name[realName], function (item) {
                    return item.node === node
                })
                if (index === -1) {
                    _name[realName].push(_node)
                } else {
                    _name[realName].splice(index, 1, _node)
                }
            }

            //triggle 发现要链接的name事件
            // if (realName) {
            //     hubs.trigger('autoCon', {
            //         node: node,
            //         name: realName,
            //         mac: mac
            //     })
            // }

            //更新hub.scanData.sort.rssi值
            const _rssi = hub.scanData.sort.rssi
            index = _.findIndex(_rssi, function (item) {
                return item.node === node
            })
            if (index === -1) {
                _rssi.push(hub.scanData.origin[node])
            } else {
                _rssi.splice(index, 1, hub.scanData.origin[node])
            }

        }
        addData.call(this, node, this.hubs[mac])
    },
    __autoConnByName(o) {
        console.log('发现要连接的设备by name', o)
        for (let mac in o) {
            hubs.__conn(o[mac])
        }
    },
    __autoConnByNode(o) {
        console.log('发现要连接的设备by node', o)
        hubs.__conn(o)
    },
    conn(o) {
        o = o || {
            mac: '',
            node: '',
            type: '',
            name: ''
        }
        const node = o.node,
            type = o.type,
            name = o.name,
            mac = o.mac

        if (typeof mac === 'string' && typeof node === 'string' && type) {
            this.__conn(o)
            return this
        }
        if (typeof node === 'object' && node.length > 0) {
            this.target.node = _.union(this.target.node, node)
            return this
        }
        if (typeof name === 'object' && name.length > 0) {
            this.target.name = _.union(this.target.name, name)
            return this
        }


        if (node.length > 0) {
            if (typeof name === 'string' && this.target.name.indexOf(name) === -1)
                this.target.node.push(node)
            else {
                this.target.name = _.union(this.target.name, name)
            }
            return this
        }
        return this
    },
    __conn(o) {
        const hub = this.hubs[o.mac],
            mac = o.mac,
            node = o.node,
            type = o.type,
            name = o.name
        if (this.availableHubs.indexOf(mac) === -1)
            return
        this.__conningSyncInfoData(o)
        return $.ajax({
            type: 'post',
            contentType: 'application/json',
            url: hub.info.realserver + '/gap/nodes/' + o.node + '/connection?mac=' + o.mac + '&access_token=' + hub.info.access_token,
            // headers: hub.info.method === 0 ? '' : {
            //     'Authorization': hub.info.authorization
            // },
            data: JSON.stringify({
                "type": o.type || "public"
            }),
            // dataType:'json',
            // contentType:'application/json',
            context: this,
            success: function (data) {
                this.__connedOkSyncInfoData(o)
                this.__syncDelScanData(mac, node)
                this.trigger('conn', {
                    mac,
                    node,
                    type,
                    name,
                    data
                })
            },
            error: function () {
                this.__connedErrSyncInfoData(o)
            },
            complete: function () {
                console.info(`${mac}可用`)
                this.__connedSyncInfoData(o)
                this.trigger('connFin', {
                    mac
                })
            }
        })
    },
    disconn(o) {
        o = o || {
            mac: this.connetedPeripherals[o.node],
            node: ''
        }
        const hub = this.hubs[o.mac],
            mac = o.mac,
            node = o.node
        if (!this.__online(mac) || !this.__online(node)) {
            return
        }

        $.ajax({
            type: 'delete',
            url: hub.info.realserver + '/gap/nodes/' + o.node + '/connection?mac=' + mac + '&access_token=' + hub.info.access_token,
            // headers: hub.info.method === 0 ? '' : {
            //     'Authorization': hub.info.authorization
            // },
            context: this,
            success: function (data) {
                this.removePer({
                    mac,
                    node
                })
                this.trigger('disconn', {
                    mac,
                    node,
                    data
                })
            }
        })
        return this
    },
    addPer(o) {
        hubs.connetedPeripherals[o.node] = o
        hubs.hubs[o.mac].connetedPeripherals.Peripherals[o.node] = o
        return this
    },
    removePer(o) {
        hubs.connetedPeripherals[o.node] = null
        hubs.hubs[o.mac].connetedPeripherals.Peripherals[o.node] = null
        return this
    },
    devices(mac, option) {
        option = option || {
            silent: false
        }
        const hub = this.hubs[mac]
        if (!this.__online(mac)) {
            return
        }
        $.ajax({
            type: 'get',
            url: hub.info.realserver + '/gap/nodes/?connection_state=connected&mac=' + mac + '&access_token=' + hub.info.access_token,
            // headers: hub.info.method === 0 ? '' : {
            //     'Authorization': hub.info.authorization
            // },
            context: this,
            dataType: 'application/json',
            success: function (data) {
                const nodes = data.nodes
                this.hubs[mac].status.conn = nodes.length
                const nodeList = _.pluck(nodes, 'id')
                for (let item of nodes) {
                    const node = item.id,
                        chip = item.chipId
                    if (!this.hubs[mac].connetedPeripherals.Peripherals[node])
                        this.addPer({
                            node,
                            mac,
                            chip,
                            name: hubs.locationData[node] ? hubs.locationData[node].name : item.name,
                            type: ''
                        })
                    else {
                        this.hubs[mac].connetedPeripherals.Peripherals[node].chip = chip
                        this.connetedPeripherals[node].chip = chip
                    }
                }
                for (let item in this.connetedPeripherals) {
                    const node = item
                    if (nodeList.indexOf(node) === -1) {
                        this.removePer({
                            mac,
                            node
                        })
                    }
                }
                if (!option.silent) {
                    this.trigger('devices', {
                        mac,
                        nodes
                    })
                }
            }
        })
        // this.hubs[mac]._escapeTime.devices = 0
        return this
    },
    __online(mac) {
        return this.hubs[mac] && this.hubs[mac].status.online || this.connetedPeripherals[mac]
    },
    write(o) {
        o = o || {
            mac: this.connetedPeripherals[o.node],
            node: '',
            value: '',
            handle: ''
        }
        const node = o.node,
            mac = o.mac,
            hub = this.hubs[mac],
            handle = o.handle,
            value = o.value

        if (!this.__online(mac) || !this.__online(node)) {
            return
        }
        return $.ajax({
            type: 'get',
            // cache: false,
            context: this,
            url: hub.info.realserver + '/gatt/nodes/' + node + '/handle/' + handle + '/value/' + value + '/?mac=' + mac + '&access_token=' + hub.info.access_token || '',
            // headers: hub.info.method === 0 ? '' : {
            //     'Authorization': hub.info.authorization
            // },
            success: function (data) {
                this.trigger(o.eventName1 || 'write', {
                    mac,
                    node,
                    value,
                    handle,
                    data
                })
            }
        })

    },
    read(o) {
        o = o || {
            mac: this.connetedPeripherals[o.node],
            node: '',
            handle: ''
        }
        const node = o.node,
            mac = o.mac,
            hub = this.hubs[mac],
            handle = o.handle

        if (!this.__online(mac) || !this.__online(node)) {
            return
        }

        $.ajax({
            type: 'get',
            url: hub.info.realserver + '/gatt/nodes/' + node + '/handle/' + handle + '/value/?mac=' + mac + '&access_token' + hub.info.access_token,
            // headers: hub.info.method === 0 ? '' : {
            //     'Authorization': hub.info.authorization
            // },
            success: function (data) {
                this.trigger('read', {
                    mac,
                    node,
                    handle,
                    data
                })
            }
        })
        return this
    }
}


//  hubs 继承Backbone.Events的事件
_.defaults(hubs, Backbone.Events)
let peripherals = [],
    allHubs = []

const startWork = function () {
    //console.log("$$$$$$$$$$$$$$$$$$$$",peripherals)
    //连接相关
    hubs.onceInit = false
    const target = {
            name: [],
            node: []
        },
        position = {
            name: [],
            node: []
        }
    if (allHubs.length === 0) {
        return
    }

    for (let item of allHubs) {
        hubs.add(item).init(item.mac)
    }
    for (let item of peripherals) {
        if (item.location) {
            if (item.mac) {
                position.node.push(item.node)
            } else if (item.name) {
                position.name.push(item.name)
                hubs.scanDataHandle[item.name] = modelHandle[item.name].scanDataHandle
            }
        } else {
            if (item.node) {
                target.node.push(item.mac)
            } else if (item.name) {
                target.name.push(item.name)
            }
        }
    }
    hubs.conn(target)
    //
    hubs.off('broadcastData')
    hubs.off('notify')
    hubs.on('broadcastData', function (o) {
        if (!o) return;
        //console.log(o);
        let model = dashBoardItemColl.get(o.node),
            name = o.name;
        name.match('Brace') ? name = 'iw' : name;
        switch (name) {
            /*case 'HW330-0000001':
                {
                    if (model) {
                        model.set('heartRate', o.heartRate)
                        if (model.get('baseStep') !== o.step) {
                            model.set('totalStep', o.step - model.get('baseStep'))
                        }
                        model.set('step', o.step - model.get('baseCircleStep'))
                        model.set('loc', hubs.hubs[hubs.locationData[o.node].mac].info.location)
                        model.set('cal', ((model.get('step') * .03918)).toFixed(2))
                    } else {
                        dashBoardItemColl.add({
                            userName: o.node.slice(-5),
                            baseStep: o.step,
                            baseCircleStep: o.step,
                            totalStep: 0,
                            cal: o.cal,
                            loc: hubs.hubs[hubs.locationData[o.node].mac].info.location,
                            heartRate: o.heartRate,
                            step: 0,
                            say: o.say,
                            node: o.node,
                            name: o.name
                        })
                    }
                    break
                }*/
            case 'HW':
                {
                    if (model) {
                        model.set('heartRate', o.heartRate)
                        model.set('baseStep', 0);
                        /*  if (model.get('baseStep') !== o.step) {
                             // model.set('totalStep', o.step - model.get('baseStep'))
                              model.set('totalStep', o.step)
                          }*/
                        // model.set('step', o.step - model.get('baseCircleStep'))
                        model.set('step', o.step)
                        model.set('loc', hubs.hubs[hubs.locationData[o.node].mac].info.location)
                        model.set('cal', o.cal)
                    } else {
                        //console.log(o.node, o.cal);
                        dashBoardItemColl.add({
                            userName: o.node.slice(-5),
                            baseStep: o.step,
                            baseCircleStep: o.step,
                            totalStep: 0,
                            cal: o.cal,
                            loc: hubs.hubs[hubs.locationData[o.node].mac].info.location,
                            heartRate: o.heartRate,
                            step: 0,
                            say: o.say,
                            node: o.node,
                            name: o.name,
                            timeFlag: 0
                        })
                    }
                    break;
                }
            case 'iw':
                {
                    if (model) {
                        model.set('heartRate', o.heartRate)
                        /*if (model.get('baseStep') !== o.step) {
                            model.set('totalStep', o.step - model.get('baseStep'))
                        }*/
                        model.set('totalStep', o.step /*- model.get('baseStep')*/ )
                        model.set('step', o.step /*- model.get('baseCircleStep')*/ )
                        model.set('loc', hubs.hubs[hubs.locationData[o.node].mac].info.location)
                        model.set('cal', o.cal /*((model.get('step') * .03918)).toFixed(2)*/ )
                    } else {
                        dashBoardItemColl.add({
                            userName: o.node.slice(-5),
                            baseStep: o.step,
                            baseCircleStep: o.step,
                            totalStep: o.step,
                            cal: o.cal,
                            loc: hubs.hubs[hubs.locationData[o.node].mac].info.location,
                            heartRate: o.heartRate,
                            step: o.step,
                            say: o.say,
                            node: o.node,
                            name: o.name,
                            timeFlag: 0

                        })
                    }
                }
                break;
        }

    })
    hubs.on('notify', function () {
        // const node = data.id,
        //     name = _.findWhere(hubs.connetedPeripherals, {
        //         node: node
        //     }).name
        // if (name === 'HW330-0000001') {

        // }
    })

}

export {
    hubs,
    allHubs,
    peripherals,
    startWork
}
