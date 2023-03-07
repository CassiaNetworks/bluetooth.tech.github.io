import i18n from  './i18n'
import globalData from './globalData'

let methodNames = {
    scan: 'scanDevice',
    connectDevice: 'connDevice',
    getConnectList: 'connedDevice',
    getAllServices: 'disService',
    notify: 'getMsg',
    getConnectState: 'deviceConStateChange',
    readByHandle: 'readCom',
    writeByHandle: 'writeCom',
    disconnectDevice: 'disCon',
    oAuth:'oAuth',
    advertiseStart: 'advertiseStart',
    advertiseStop: 'advertiseStop',
    cassiaInfo: 'cassiaInfo',
    pair:'pair',
    pair_input:'pair_input',
    unpair:'unpair'
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
    readByHandle: {
        type: 'GET',
        methodName:methodNames.readByHandle,
        url: ''
    },
    oAuth:{
        type:'POST',
        methodName:methodNames.oAuth,
        url:''
    },
    advertiseStart:{
        type:'GET',
        methodName:methodNames.advertiseStart,
        url:''
    },
    advertiseStop:{
        type:'GET',
        methodName:methodNames.advertiseStop,
        url:''
    },
    cassiaInfo:{
        type:'GET',
        methodName:methodNames.cassiaInfo,
        url:''
    },
    pair:{
        type:'POST',
        methodName:methodNames.pair,
        url:''
    },
    pair_input:{
        type:'POST',
        methodName:methodNames.pair_input,
        url:''
    },
    unpair:{
        type:'DELETE',
        methodName:methodNames.unpair,
        url:''
    }
}

let $showMethods = $('.log .left .order')

function showMethod(method) {
    console.log("method map:",methodConfig[method])
    let _methodName = methodConfig[method].methodName,
        _type = methodConfig[method].type,
        _url = methodConfig[method].url,
        oLi = `<li>
					<p><span i18n='method'>方法名</span><span i18n='${_methodName}'></span><span>${_type}</span></p>
					<p><em>URL:</em>${_url}</p>
			    </li>`;
    let oLiParsed = filterXSS(oLi);
    $showMethods.append(oLiParsed);
    
    i18n(globalData.lang)



}



export {
    methodConfig,
    showMethod

}