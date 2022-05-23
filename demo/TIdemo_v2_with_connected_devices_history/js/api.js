/**
 * Created by KangWei on 2016/12/27.
 * 2016/12/27 16:49
 * CESDemo
 */

(function(G) {
    let api = {sse:{}}
    api.sse.scan=false
    api.sse.notify=false
    api.access_token = ''
    let _es = function(target, url, fn) {
        let es = target.es = new EventSource(String(url));
        es.onmessage = function(event) {
            fn && fn(event)
        }
    }

    _es.close = function(target) {
        let es = target.es;
        if (es && es.onmessage) {
            es.close(), es = es.onmessage = null, delete es
        }
    }

    api.use = function(o) {
        o = o || {}
        api.local = o.local;
        api.server = 'http://' + o.server || 'http://api.cassianetworks.com';
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

    api.scan = function() {
        _es(api.scan, api.server + '/gap/nodes/?active=1&event=1&mac=' + api.hub + '&access_token=' + api.access_token,
            function(event) {
             
                api.trigger('scan', [api.hub, event.data])
            });
        return api
    }

    api.scan.close = function() {
        _es.close(api.scan)
        return api
    }
    
    api.conn = function(o) {
        o = o || {}
        $.ajax({
            type: 'post',
            url: api.server + '/gap/nodes/' + o.node + '/connection?mac=' + (o.hub || api.hub) + '&access_token=' + api.access_token,
            headers : {"Content-Type" : "application/json"},
            data : JSON.stringify({"type" : o.type || "public"}),
            success: function(data) {
                console.log('connect Ok ', data)
                o.success && o.success(o.hub || api.hub, o.node, data)
                api.trigger('conn', [o.hub || api.hub, o.node, data])
            },
            error: function(err) {
                console.log('connect fail ',err)
                o.error && o.error(err)
            }
        })
        return api
    }

    api.iolist = ["DisplayOnly","DisplayYesNo","KeyboardOnly","NoInputNoOutput","KeyboardDisplay"];
    
    api.pair = function(o) {
        o = o || {}
        $.ajax({
            type: 'post',
            url: api.server + "/management/nodes/" + o.node + "/pair?mac=" + (o.hub || api.hub),
            headers: api.local ? {"Content-Type" : "application/json"} : {
                "Content-Type" : "application/json",
                'Authorization': api.authorization
            },
            data: JSON.stringify({
                "bond":1,
                "legacy-oob":o.oob || 0,
                "io-capability":o.io || 'NoInputNoOutput'
            }),
            success: function(data){
                console.log('pair,pair,pair,pair', data);
            }
        })
    }

    api.disconn = function(o) {
        o = o || {}
        $.ajax({
            type: 'delete',
            url: api.server + '/gap/nodes/' + o.node + '/connection?mac=' + (o.hub || api.hub) + '&access_token=' + api.access_token,
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
            url: api.server + '/gap/nodes/' + o.node + '/connection?mac=' + (o.hub || api.hub) + '&access_token=' + api.access_token,
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
            url: api.server + '/gap/nodes/?connection_state=connected&mac=' + (o.hub || api.hub) + '&access_token=' + api.access_token,
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
                'Authorization': api.authorization
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
        return $.ajax({
            type: 'get',
            url: api.server + '/gatt/nodes/' + o.node + '/handle/' + o.handle + '/value/' + o.value + '/?mac=' + (o.hub || api.hub) + '&access_token=' + api.access_token,
            // headers: {'Authorization': api.authorization},
            success: function(data) {
                o.success && o.success(data)
            },
            error: function(err){
                o.error && o.error(err);
            }
        })
    }

    api.read = function(o) {
        o = o || {}
        $.ajax({
            type: 'get',
            url: api.server + '/gatt/nodes/' + o.node + '/handle/' + o.handle + '/value/?mac=' + (o.hub || api.hub),
            headers: {
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
            _es(api.notify, api.server + '/gatt/nodes/?event=1&mac=' + api.hub + '&access_token=' + api.access_token,
                function(event) {
                    api.trigger('notify', [api.hub, event.data])
                })
        } else {
            api.sse.notify=false
            _es.close(api.notify)
        }
        return api
    }

    G.api = api
})(this);