import i18n from  './i18n'
import globalData from './globalData'

let methodNames = {
    scan: 'scanDevice',
    connectDevice: 'connDevice',
    getConnectList: 'connedDevice',
    getAllServices: 'disService',
    notify: 'getMsg',
    getConnectState: 'deviceConStateChange',
    writeByHandle: 'writeCom',
    disconnectDevice: 'disCon',
    oAuth:'oAuth'
}

let methodConfig = {
    scan: {
        type: 'GET/SSE',
        url: '',
        methodName: methodNames.scan
    },
    connectDevice: {
        type: 'POST',
        methodName: methodNames.connectDevice,
        url: ''
    },
    getConnectList: {
        type: 'GET',
        methodName: methodNames.getConnectList,
        url: ''
    },
    getConnectState: {
        type: 'GET/SSE',
        methodName: methodNames.getConnectState,
        url: ''
    },
    disconnectDevice: {
        type: 'DELETE',
        methodName: methodNames.disconnectDevice,
        url: ''
    },
    getAllServices:{
        type:'GET',
        methodName:methodNames.getAllServices,
        utl:''
    },
    notify:{
        type:'GET/SSE',
        methodName:methodNames.notify,
        url:''
    },
    writeByHandle:{
        type:'GET',
        methodName:methodNames.writeByHandle,
        url:''
    },
    oAuth:{
        type:'POST',
        methodName:methodNames.oAuth,
        url:''
    }
}
let $showMethods = $('.log .left .order')

function showMethod(method) {
    let _methodName = methodConfig[method].methodName,
        _type = methodConfig[method].type,
        _url = methodConfig[method].url,
        oLi = `<li>
					<p><span i18n='method'>方法名</span><span i18n='${_methodName}'></span><span>${_type}</span></p>
					<p><em>URL:</em>${_url}</p>
			    </li>`
    $showMethods.append(oLi);
    
    i18n(globalData.lang)



}



export {
    methodConfig,
    showMethod

}