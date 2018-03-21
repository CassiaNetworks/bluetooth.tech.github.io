var hubConfig = require('../../config/hubConfig.json')
let Hub = function (config) {
    config = config || {}
    this.output = {
        scan: '',
        notify: ''
    }
    this._escapeTime = {
        token: 0,
        devices: 0,
        scanData: 0,
        clearZombyScanData: 0,
        sortByRssi: 0,
        checkOnline: 0
    }
    this.scanData = {
        origin: {},
        sort: {
            name: {},
            rssi: []
        }
    }

    this.info = {
        method: config.method || hubConfig.info.method,
        server: 'http://' + config.server || hubConfig.info.cloundAddress,
        developer: config.developer || hubConfig.info.developer,
        password: config.password || hubConfig.info.password,
        interval: hubConfig.info.tokenExpire,
        ip: 'http://' + config.ip || '',
        location: config.location,
        mac: config.mac,
        access_token: '',
        authorization: ''
    }
    this.config = {
        maxConnected: config.maxConnected || hubConfig.config.maxConnected,
        maxConnected0: config.maxConnected0 || hubConfig.config.maxConnected0,
        maxConnected1: config.maxConnected1 || hubConfig.config.maxConnected1
    }
    this.status = {
        online: false, //hub在线?
        conn: 0, //连接数量
        doing: { //正在做什么
            scan: 2, //0:芯片0扫描;1:芯片1扫描;2代表停止扫描
            node: '' //正在连接设备的mac
        }
    }
    this.connetedPeripherals = { //已连接设备
        checkConnTime: hubConfig.connetedPeripherals.checkConnTime, //检查连接时间周期
        CheckConnTimeExp: 0, //时间后检查
        Peripherals: { //
            peripheralsMac: {
                // node: '',
                // name: '',
                // type: '',
                // chipId: null //连接的芯片
                // notify: '', //是否通知
                // expectedNotify: '', //期望是否通知
                // checkNotifyTime: 3, //
                // checkNotifyTimeExp: 0 //时间后检查
            }
        }
    }

}



export default Hub