import {
    methodConfig
} from './showmethod'
import globalData from './globalData'

function addURLParam(url, data, flag = true) {
    for (var key in data) {
        url += (url.indexOf("?") === -1 ? "?" : "&");
        url += (flag ? encodeURIComponent(key) : key) + "=" + (flag ? encodeURIComponent(data[key]) : data[key]);
    }
    return url;
}


function start(url, data, scanSSE, cb) {
    // debugger
    let _data = Object.assign({
            event: 1,
            chip: 0
        }, data),
        _url = addURLParam(url, _data, false),
        virtualData = ''
    methodConfig.scan.url = _url
    let es = new EventSource(_url)

    es.addEventListener("open", function() {
        // debugger
        if (scanSSE.status === 'toClosed') {
            this.close()
            scanSSE.es = ''
            return
        }
        scanSSE.es = this
    }, false);
    // es.addEventListener('message', function(e) {
    //     if (e.data !== "keep-alive") {
    //         globalData.neverSave.scanData.push( e.data )
    //             // console.log(new Date(), globalData.neverSave.scanData.length)
    //             // let time = new Date()
    //         cb(e.data)
    //             // console.warn("time%s,data%s", new Date - time, e.data)
    //     }
    // })


    layui.use('flow', function() {
        var flow = layui.flow,
            num = 10
        es.addEventListener('message', function(e) {
            if (!e.data.match("keep-alive")) {
                globalData.neverSave.scanData.push(e.data)
                    // console.log(new Date(), globalData.neverSave.scanData.length)
                    // let time = new Date()
                cb(e.data)
                    // console.warn("time%s,data%s", new Date - time, e.data)
            }
        })



        flow.load({
            elem: '#scanLog ul',
            scrollElem: '.layui-tab-content',
            mb: 100,
            done: function(page, next) {
                var lis = globalData.neverSave.scanData
                if (page === 1) {
                    setTimeout(() => {
                        next( '<li>'+lis.slice(0, num).join('</li><li>')+'</li>', num < lis.length)
                        page++
                    }, 1000)
                } else {
                    next('<li>'+lis.slice((page - 1) * num, page * num).join('</li><li>')+'</li>', page * num <= lis.length)
                    page++
                }
            }
        })
    })

}

function connectDevice(url, data) {
    let _url = url
    if (data.qs.chip !== null)
        _url = addURLParam(url, data.qs, false)
        // debugger
    methodConfig.connectDevice.url = _url
    return $.ajax({
        url: _url,
        type: 'POST',
         headers : {"Content-Type" : "application/json"},
        data: JSON.stringify({
            "timeOut": 5000,
            "type": data.type
        })
    })
}

function disconnectDevice(url) {
    methodConfig.disconnectDevice.url = url
    return $.ajax({
        url: url,
        type: 'DELETE',
        headers : {"Content-Type" : "application/json"}
    })
}


function getConnectList(url) {
    methodConfig.getConnectList.url = url
    return $.ajax({
        url: url,
        type: 'GET',
        dataType:'json'
    })
}

function getConnectState(url, stateSSE) {
    const es = new EventSource(url)
    methodConfig.getConnectState.url = url
        // debugger
    es.addEventListener("open", function() {
        console.log('open')
        if (stateSSE.status === 'toClosed') {
            this.close()
            console.log('closed')
            stateSSE.status = 'closed'
            stateSSE.es = ''
            return
        }
        stateSSE.es = this
        stateSSE.status = 'open'
    }, false);
    return es
}

function reboot(url) {
    return $.ajax({
        url: url,
        type: 'GET'
    })
}

function getAllServices(url) {
    methodConfig.getAllServices.url = url;
    return $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json'
    });
}

function readByHandle(url, data) {
    var _url = addURLParam(url, data, false);
    $.ajax({
        url: _url,
        type: 'GET',
        headers : {"Content-Type" : "application/json"},
        data: data,
    }).done(function(e) {
        console.log(e);
    }).fail(function(e) {
        console.error(e);

    });
}


function receiveNotification(url, notifySSE) {
    const es = new EventSource(url);
    // notifySSE.status = 'toOpen'
    console.log(notifySSE)
    methodConfig.notify.url = url
    es.addEventListener("open", function() {
        if (notifySSE.status === 'toClosed') {
            this.close()
            notifySSE.status = 'closed'
            notifySSE.es = ''
            return
        }
        console.log('open')
        notifySSE.es = this
        notifySSE.status = 'open'
    }, false);
    return es

}



function writeByHnadle(url, data) {
    methodConfig.writeByHandle.url = addURLParam(url, data, false)
    return $.ajax({
        url: url,
        type: 'GET',
        headers : {"Content-Type" : "application/json"},
        data: data
    })

}
let api = {
    start,
    connectDevice,
    disconnectDevice,
    getConnectList,
    getConnectState,
    reboot,
    getAllServices,
    writeByHnadle,
    readByHandle,
    receiveNotification,
    addURLParam

}

export {
    api
}