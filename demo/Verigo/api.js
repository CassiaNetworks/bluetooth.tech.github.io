/**
 * Created by KangWei on 2016/12/27.
 * 2016/12/27 16:49
 * CESDemo
 */
(function(G) {
    let api = {sse:{}}
    api.sse.scan=false
    api.sse.notify=false
    let __es = function(target, url, fn) {
        let es = target.es = new EventSource(String(url));
        es.onmessage = function(event) {
            fn && fn(event)
        }
    }
    __es.close = function(target) {
        let es = target.es;
        if (es && es.onmessage) {
            es.close(), es = es.onmessage = null, delete es
        }
    }

    api.use = function(o) {
        o = o || {}
        let reg_ip = /(\d+)\.(\d+)\.(\d+)\.(\d+)/,
            reg_http = /http\:\/\/(.+)/;
        // local
        if (o.server && typeof o.server == 'string' && reg_ip.test(o.server)) {
            api.server = 'http://' + o.server
            api.local = true
            // console.log(12312312)
        } else {
            // api.server = 'http://' + ({
            //     'us': 'api1',
            //     'cn': 'api2',
            //     'demo': 'demo',
            //     'auto': 'api'
            // }[o.server] || 'api') + '.cassianetworks.com'
        }
        api.server = o.server
        api.developer = o.developer || 'tester'
        api.key = o.key || '10b83f9a2e823c47'
        api.base64_dev_key = 'Basic ' + btoa(o.developer + ':' + o.key)
        api.hub = o.hub
        return api
    }
    api.oauth2 = function(o) {
        o = o || {}
        let next = function(d) {
            api.access_token = d || '',
                api.authorization = 'Bearer ' + (d || ''),
                o.success && o.success(d),
                api.trigger('oauth2', [d])
        }
        if (api.local) {
            next()
        } else {
            $.ajax({
                type: 'post',
                url: api.server + '/oauth2/token',
                headers: {
                    'Authorization': api.base64_dev_key
                },
                data: {
                    "grant_type": "client_credentials"
                },
                success: function(data) {
                    next(data.access_token)
                }
            })
        }
        return api
    }
    api.on = function(e, fn) {
        api.on[e] = fn
        if (e == 'notify' && !api.sse.notify) {
            api.sse.notify=true
            api.notify(true)
        }
        return api
    }
    api.off = function(e) {
        api.on[e] = null
        delete api.on[e]
        if (e == 'notify') {
            api.sse.notify=false
            api.notify(false)
        }
        return api
    }
    api.trigger = function(e, args) {
        api.on[e] && (typeof api.on[e] == 'function') && (api.on[e].apply(api, args))
        return api
    
}
    api.scan = function(chip) {
        __es(api.scan, api.server + '/gap/nodes/?event=1&mac=' + api.hub + '&active=1&access_token=' + api.access_token,
            function(event) {0
                api.trigger('scan', [api.hub, event.data])
            });
        return api
    };
    api.scan.close = function() {
        __es.close(api.scan)
        return api
    };
    api.conn = function(o) {
        o = o || {}
        $.ajax({
            type: 'post',
            url: api.server + '/gap/nodes/' + o.node + '/connection?mac=' + (o.hub || api.hub),
            headers: api.local ? '' : {
                'Content-Type':'application/json',
                'Authorization': api.authorization
            },
            data: JSON.stringify({"type":o.type || "public"}),
            //dataType:"text",
            success: function(data) {
                console.log('connect --> success  Writing command')
                o.success && o.success(o.hub || api.hub, o.node, data)
                api.trigger('conn', [o.hub || api.hub, o.node, data])
                console.log("Connection successful!Open rawData")
            },
            error: function(err){
                console.log("connect --> err ");
            }
        })
        return api
    }
    api.disconn = function(o) {
        o = o || {}
        $.ajax({
            type: 'delete',
            url: api.server + '/gap/nodes/' + o.node + '/connection?mac=' + (o.hub || api.hb),
            headers: api.local ? '' : {
                'Authorization': api.authorization
            },
            success: function(data) {
                console.log(data)
                o.success && o.success(o.hub || api.hub, o.node, data)
                api.trigger('disconn', [o.hub || api.hub, o.node, data])
            }
        })
        return api
    }
    api.conn.close = function(o) {
        o = o || {}
        $.ajax({
            type: 'delete',
            url: api.server + '/gap/nodes/' + o.node + '/connection?mac=' + (o.hub || api.hub),
            headers: api.local ? '' : {
                'Authorization': api.authorization
            },
            success: function(data) {
                console.log(data)
                o.success && o.success(o.hub || api.hub, o.node, data)
                api.trigger('conn.close', [o.hub || api.hub, o.node, data])
            }
        })
        return api
    }

    api.devices = function(o) {
        o = o || {}
        $.ajax({
            type: 'get',
            url: api.server + '/gap/nodes/?connection_state=connected&mac=' + (o.hub || api.hub),
            headers: api.local ? '' : {
                'Authorization': api.authorization
            },
            success: function(data) {
                console.log(data)
                o.success && o.success(data)
            }
        })
        return api
    }

    api.discover = function(o) {
        o = o || {}
        $.ajax({
            type: 'get',
            url: api.server + '/gatt/nodes/' + o.node + '/services/characteristics/descriptors?mac=' + (o.hub || api.hub),
            headers: api.local ? '' : {
                'Authorization': api.authorizaton
            },
            success: function(data) {
                console.log(data)
                o.success && o.success(data)
            }
        })
        return api
    }

    api.write = function(o) {
        o = o || {}
        $.ajax({
            type: 'get',
            url: api.server + '/gatt/nodes/' + o.node + '/handle/' + o.handle + '/value/' + o.value + '/?mac=' + (o.hub || api.hub),
            headers: api.local ? '' : {
                'Authorization': api.authorization
            },
            dataType: 'text',
            success: function(data, node) {
                 console.log('writeByhabdle --> success')
                 iAlertDevice.real[o.node].connect = false
                 connectFirst = false
                o.success && o.success(data)
            },
            error: function(err){
                console.log('writeByhabdle --> err')
            }
        })
        return api
    }

    api.read = function(o) {
        o = o || {}
        $.ajax({
            type: 'get',
            url: api.server + '/gatt/nodes/' + o.node + '/handle/' + o.handle + '/value/?mac=' + (o.hub || api.hub),
            headers: api.local ? '' : {
                'Authorization': api.authorization
            },
            success: function(data) {
                o.success && o.success(data)
            }
        })
        return api
    }

    api.notify = function(toggle) {
        if (toggle) {
            api.sse.notify=true
            __es(api.notify, api.server + '/gatt/nodes/?event=1&mac=' + api.hub + '&access_token=' + api.access_token,
                function(event) {
                    api.trigger('notify', [api.hub, event.data])
                })
        } else {
            api.sse.notify=false
            __es.close(api.notify)
        }
        return api
    }

    api.when = function(){
        var a = [], pm = [], then = function(f, d){
            // var f = a[i][0], d = a[i][1] || {}
            f = f || ''
            d = d || {}
            pm.push(function(resolve){
                d.success = function(){
                    // console.log(f, d)
                    setTimeout(function(){
                        var u = pm.shift()
                        u && u(resolve)
                    }, 10)
                }
                api[f](d)
            })
        };
        var my_co = {
            discover: function(d){ a.push(['discover', d]); return my_co },
            write: function(d){ a.push(['write', d]); return my_co },
            read: function(d){ a.push(['read', d]); return my_co },
            done: function(fn){
                for (var i in a){
                    then(a[i][0], a[i][1])
                }
                pm.length && pm.shift()()
            }
        }
        return my_co
    }

    G.api = api
})(this);