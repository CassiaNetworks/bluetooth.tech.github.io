/**
 * Created by KangWei on 2016/12/27.
 * 2016/12/27 16:49
 * CESDemo
 */
(function (G) {
    let api = {},
        _notify = false,
        _scan = false;

    let __es = function (target, url, fn) {
        let es = target.es = new EventSource(String(url));
        es.onmessage = function (event) {
            target.event = event
            fn && fn(event)
        }
    }
    __es.close = function (target) {
        let es = target.es;
        if (es && es.onmessage) {
            es.close(), es = es.onmessage = null, delete es, target.es = null
        }
    }

    api.use = function (o) {
        o = o || {}
        let reg_ip = /(\d+)\.(\d+)\.(\d+)\.(\d+)/,
            reg_http = /http\:\/\/(.+)/;
        // local
        if (o.server && typeof o.server == 'string' && o.server.match(reg_ip)) {
            api.server = 'http://' + o.server
            api.local = true
            // cloud
        } else if (o.server && typeof o.server == 'string' && o.server.match(reg_http)) {
            // ... hehe, use url directly
            // cloud (use us/cn/auto)
        } else {
            api.server = 'http://' + ({
                'us': 'api1',
                'cn': 'api2',
                'demo': 'demo',
                'auto': 'api'
            }[o.server] || 'api') + '.cassianetworks.com'
        }
        api.developer = o.developer || 'tester'
        api.key = o.key || '10b83f9a2e823c47'
        api.base64_dev_key = 'Basic ' + btoa(o.developer + ':' + o.key)
        api.hub = o.hub
        return api
    }
    api.oauth2 = function (o) {
        o = o || {}
        let next = function (d) {
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
                success: function (data) {
                    next(data.access_token)
                }
            })
        }
        return api
    }
    api.on = function (e, fn) {
        api.on[e] = fn
        if (e == 'notify' && !_notify) {
            api.notify(true)
        }
        return api
    }
    api.off = function (e) {
        api.on[e] = null
        delete api.on[e]
        if (e == 'notify') {
            api.notify(false)
        }
        return api
    }
    api.trigger = function (e, args) {
        api.on[e] && (typeof api.on[e] == 'function') && (api.on[e].apply(api, args))
        return api
    }

    api.scan = function (chip) {
        if (_scan) {
            api.trigger('scan', [api.hub, api.scan.event])
            return
        }
        __es(api.scan, api.server + '/gap/nodes/?event=1&mac=' + api.hub + '&chip=' + (chip || 0) + '&access_token=' + api.access_token,
            function (event) {
                api.trigger('scan', [api.hub, event.data])
                _scan = true
            });
        return api
    };
    api.scan.close = function () {
        __es.close(api.scan)
        _scan = false
        return api
    };
    api.conn = function (o) {
        o = o || {}
        $.ajax({
            type: 'post',
            url: api.server + '/gap/nodes/' + o.node + '/connection?mac=' + (o.hub || api.hub),
            headers: api.local ? '' : {
                'Authorization': api.authorization
            },
            data: {
                "type": o.type || "public"
            },
            success: function (data) {
                console.log(data)
                o.success && o.success(o.hub || api.hub, o.node, data)
                api.trigger('conn', [o.hub || api.hub, o.node, data])
            }
        })
        return api
    }
    api.conn.close = function (o) {
        o = o || {}
        $.ajax({
            type: 'delete',
            url: api.server + '/gap/nodes/' + o.node + '/connection?mac=' + (o.hub || api.hub),
            headers: api.local ? '' : {
                'Authorization': api.authorization
            },
            success: function (data) {
                console.log(data)
                o.success && o.success(o.hub || api.hub, o.node, data)
                api.trigger('conn.close', [o.hub || api.hub, o.node, data])
            }
        })
        return api
    }

    api.devices = function (o) {
        o = o || {}
        $.ajax({
            type: 'get',
            url: api.server + '/gap/nodes/?connection_state=connected&mac=' + (o.hub || api.hub),
            headers: api.local ? '' : {
                'Authorization': api.authorization
            },
            success: function (data) {
                console.log(data)
                o.success && o.success(data)
            }
        })
        return api
    }

    api.discover = function (o) {
        o = o || {}
        $.ajax({
            type: 'get',
            url: api.server + '/gatt/nodes/' + o.node + '/services/characteristics/descriptors?mac=' + (o.hub || api.hub),
            headers: api.local ? '' : {
                'Authorization': api.authorization
            },
            success: function (data) {
                console.log(data)
                o.success && o.success(data)
            }
        })
        return api
    }

    api.write = function (o) {
        o = o || {}
        $.ajax({
            type: 'get',
            url: api.server + '/gatt/nodes/' + o.node + '/handle/' + o.handle + '/value/' + o.value + '/?mac=' + (o.hub || api.hub),
            // headers: {'Authorization': api.authorization},
            success: function (data) {
                o.success && o.success(data)
            }
        })
        return api
    }

    api.read = function (o) {
        o = o || {}
        $.ajax({
            type: 'get',
            url: api.server + '/gatt/nodes/' + o.node + '/handle/' + o.handle + '/value/?mac=' + (o.hub || api.hub),
            headers: {
                'Authorization': api.authorization
            },
            success: function (data) {
                o.success && o.success(data)
            }
        })
        return api
    }

    api.notify = function (toggle) {
        if (toggle) {
            if (_notify) {
                api.trigger('notify', [api.hub, api.notify.event])
                return
            }
            _notify = true
            __es(api.notify, api.server + '/gatt/nodes/?event=1&mac=' + api.hub + '&access_token=' + api.access_token,
                function (event) {
                    api.trigger('notify', [api.hub, event.data])
                })
        } else {
            _notify = false
            __es.close(api.notify)
        }
    }

    api.connlist = function (o) {
        o = o || {}
        $.ajax({
            type: 'get',
            url: api.server + '/gap/nodes/' + '?connection_state=connected&mac=' + (o.hub || api.hub),
            headers: {
                'Authorization': api.authorization
            },
            success: function (data) {
                o.success && o.success(data)
            }
        })
        return api
    }

    G.api = api
})(this);