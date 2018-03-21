import lang from '../../../pages/sport/sport/page'

exports.changeLang = function (jsonObj) {
    let _lang = jsonObj || lang
    $('[i18n]').each(function () {
        const key = $(this).attr('i18n')
        _lang[key] && $(this).html(_lang[key])
    })
}
exports.getLang = function () {
    let userlang = (navigator.language) ? navigator.language : navigator.userLanguage;
    userlang = userlang.match(/cn/i) ? 'cn' : 'en'
    return userlang
}

exports.Reg = {
    mac: /^([0-9a-f]{2}\:){5}[0-9a-f]{2}$/i,
    ip: /^(?:(?:2[0-4][0-9]\.)|(?:25[0-5]\.)|(?:1[0-9][0-9]\.)|(?:[1-9][0-9]\.)|(?:[0-9]\.)){3}(?:(?:2[0-4][0-9])|(?:25[0-5])|(?:1[0-9][0-9])|(?:[1-9][0-9])|(?:[0-9]))$/,
    server: /\。/,
    developer: /^[a-z_]+[a-z0-9_]*$/i

}

exports.trimeClone = function (obj) {
    let data = {},
        _obj = obj || {}
    for (let key in obj) {
        data[key] = $.trim(_obj[key])
    }
    return data
}


exports.checkOnline = function (model, option) {
    const hub = model.toJSON()

    function checkOnline(hub, option) {
        const mac = hub.mac
        let _url
        if (hub.method === '0') {
            _url = 'http://' + hub.ip + `/gap/nodes/?connection_state=connected`
        } else {
            _url = 'http://' + hub.server + `/cassia/hubs/${mac}` + '?&access_token=' + hub.access_token
        }
        $.ajax({
            type: 'get',
            url: _url,
            context: model,
            dataType: 'json',
            success: function () {
                option.success && option.success.call(this,arguments)
            },
            timeout: 5000,
            error: function () {
                option.error && option.error.call(this, arguments)
            }
        })
    }

    function oauth(hub, option) {
        if (hub.method === '0') {
            checkOnline(hub, option)
            return
        }
        $.ajax({
            type: 'post',
            url: 'http://' + hub.server + '/oauth2/token',
            headers: {
                'Authorization': 'Basic ' + btoa(hub.developer + ':' + hub.password)
            },
            data: {
                'grant_type': 'client_credentials'
            },
            dataType: 'json',
            context: model,
            success: function (data) {
                model.set('access_token', data.access_token)
                checkOnline(model.toJSON(),option)
            },
            error: function () {
                option.error && option.error.call(this, arguments)
            }
        })
    }
    oauth(hub, option)
}
