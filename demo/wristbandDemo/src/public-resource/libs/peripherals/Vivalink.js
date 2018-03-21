
// 版本1

// eval(function(p,a,c,k,e,d){e=function(c){return(c<a?"":e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)d[e(c)]=k[c]||e(c);k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1;};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p;}('c a=["\\v\\m","\\h\\k\\1V\\Q\\k\\o\\B\\h\\T\\o\\k","\\U\\B\\h\\h\\k\\o\\1k","\\1w\\t\\m\\h\\B\\L\\m\\v","\\Q\\o\\t\\h\\t\\h\\1k\\Q\\k","\\L\\m\\1s\\k\\1r\\1F\\z","\\d\\1y\\d\\K\\d\\d\\S\\z","\\d\\1A\\d\\K\\d\\d\\S\\z","\\d\\d\\d\\1E\\K\\1q\\S\\z","","\\1D\\k\\m\\19\\h\\1C","\\h\\t\\1B\\t\\1x\\k\\o\\1z\\B\\v\\k","\\v\\T\\U\\v\\h\\o\\L\\m\\19","\\d","\\1v","\\1t"];i X(){H[a[0]]=G;H[a[1]]=G;H[a[2]]=G}1u[a[4]][a[3]]=i(18){e H[a[5]](18)!==-1};c q=a[6];c D=a[7];c A=a[8];c 1j=0.1P;c M=0.1Q;i 1d(b){e Z(b)||b[a[3]](D)||b[a[3]](q)||b[a[3]](A)}i Z(p){e p===F||p===G||p===a[9]||p[a[10]]<=0}i 1W(b){j(!1d(b)){e F};c E=a[9];b=b[a[11]]();j(b[a[3]](D)||b[a[3]](q)){E=O(b[a[12]](1I,N),1J)}x{j(b[a[3]](A)){c W=b[a[12]](1R,1K)+b[a[12]](1N,1O)+b[a[12]](J,1M);E=O(W,1L)}x{e F}};c f=1H X();f[a[0]]=E;j(b[a[3]](D)){1m(f,b);e F};j(b[a[3]](q)||b[a[3]](A)){f=1o(f,b)};e f}i 1o(f,b){c C;c y;j(b[a[3]](q)){C=(l(b[a[12]](N,1h),16)^1i);y=(l(b[a[12]](1h,1U),16)^1g)*M}x{C=(l(b[a[12]](1f,N),16)^1i);y=(l(b[a[12]](1G,1f),16)^1g)*M};f[a[2]]=C;f[a[1]]=y+1j;e f}i 1m(f,b){}i O(R,1n){c g;j(1n){g=(l(R,16)^1T).w(2);g=g[a[12]](J,1S)}x{g=l(R,16).w(2);g=17(g,J)};c 1p=l(g[a[12]](1,6),2).w();c r=l(g[a[12]](6,12),2).w();j(r[a[10]]<2){r=a[13]+r};c 1l=1e(l(g[a[12]](12,J),2),8);c V=a[14]+1p;e V+r+a[15]+1l}i 17(I,P){c u=I;j(I[a[10]]>=P){e u}x{c 1a=P-I[a[10]];1c(c n=0;n<1a;n++){u=a[13]+u};e u}}i 1e(1b,Y){c s=1b.w();1c(c n=0;n<(Y-s[a[10]]);n++){s=a[13]+s};e s}',62,121,'||||||||||_0|_1|var|x30|return|_2|_3|x74|function|if|x65|parseInt|x6E|_4|x72|_8|FRAME_SPC_DEVICE_DISCOVERY|_6|_5|x6F|_7|x73|toString|else|_9|x66|FRAME_SPC_BEANCON|x61|_10|FRAME_SPC_TEMP_COMPENSATION|_12|null|undefined|this|_11|32|x31|x69|TEMPERATURE_HEXSTRING_UNIT|56|getSNStringInfo|_13|x70|_14|x38|x75|x62|_23|_15|Message|_19|isEmpty||||||||stringLeftAddZero|_16|x67|_17|_18|for|isFeverScout|frontCompWithZore|54|0xffff|58|0xff|DEFAULT_COMPENSATION|x79|_20|handleCompensation|_21|handleAdvertiseFrame|_22|x35|x78|x64|x2F|String|x42|x63|x77|x34|x43|x33|x4C|x68|x6C|x32|x4F|50|new|48|true|22|false|34|26|30|28|0625|20|64|0xffffffff|62|x6D|parseMsg'.split('|'),0,{}))



//版本2 修复版本1 中sn可能解析错误和sn格式问题
//  eval(function(p,a,c,k,e,d){e=function(c){return(c<a?"":e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)d[e(c)]=k[c]||e(c);k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1;};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p;}('c a=["\\t\\q","\\h\\i\\Y\\T\\i\\l\\p\\h\\18\\l\\i","\\Z\\p\\h\\h\\i\\l\\1i","\\X\\n\\q\\h\\p\\O\\q\\t","\\T\\l\\n\\h\\n\\h\\1i\\T\\i","\\O\\q\\R\\i\\1C\\1B\\v","\\d\\1A\\d\\L\\d\\d\\P\\v","\\d\\1y\\d\\L\\d\\d\\P\\v","\\d\\d\\d\\1z\\L\\1I\\P\\v","","\\1F\\i\\q\\1b\\h\\N","\\h\\n\\1D\\n\\1G\\i\\l\\B\\p\\t\\i","\\t\\18\\Z\\t\\h\\l\\O\\q\\1b","\\d","\\X\\N\\p\\l\\B\\n\\R\\i\\1E\\h","\\1H","\\v\\l\\n\\Y\\B\\N\\p\\l\\B\\n\\R\\i","\\1J"];j 1u(){G[a[0]]=A;G[a[1]]=A;G[a[2]]=A}1r[a[4]][a[3]]=j(1g){e G[a[5]](1g)!==-1};c u=a[6];c D=a[7];c H=a[8];c 1s=0.1W;c M=0.1U;j 1k(b){e 1c(b)||b[a[3]](D)||b[a[3]](u)||b[a[3]](H)}j 1c(r){e r===F||r===A||r===a[9]||r[a[10]]<=0}j 1X(b){k(!1k(b)){e F};c E=a[9];b=b[a[11]]();k(b[a[3]](D)||b[a[3]](u)){E=S(b[a[12]](1Y,Q),1T)}x{k(b[a[3]](H)){c 19=b[a[12]](1N,1K)+b[a[12]](1L,1O)+b[a[12]](J,1V);E=S(19,1R)}x{e F}};c f=1S 1u();f[a[0]]=E;k(b[a[3]](D)){1p(f,b);e F};k(b[a[3]](u)||b[a[3]](H)){f=1t(f,b)};e f}j 1t(f,b){c C;c z;k(b[a[3]](u)){C=(m(b[a[12]](Q,1n),16)^1o);z=(m(b[a[12]](1n,1Q),16)^1m)*M}x{C=(m(b[a[12]](1l,Q),16)^1o);z=(m(b[a[12]](1P,1l),16)^1m)*M};f[a[2]]=C;f[a[1]]=z+1s;e f}j 1p(f,b){}j S(U,1q){c g;k(1q){g=(~m(U,16)).I(2);1M(g[a[10]]<J){g=a[13]+g}}x{g=m(U,16).I(2);g=1d(g,J)};c 1x=m(g[a[12]](1,6),2);c s=m(g[a[12]](6,12),2).I();k(s[a[10]]<2){s=a[13]+s};c 1j=1e(m(g[a[12]](12,J),2),8);c 1w=a[15][a[14]]();c 1v=1r[a[16]](1w+1x);e 1v+s+a[17]+1j}j 1d(K,V){c w=K;k(K[a[10]]>=V){e w}x{c 1h=V-K[a[10]];W(c o=0;o<1h;o++){w=a[13]+w};e w}}j 1e(1f,1a){c y=1f.I();W(c o=0;o<(1a-y[a[10]]);o++){y=a[13]+y};e y}',62,123,'||||||||||_0|_1|var|x30|return|_2|_3|x74|x65|function|if|x72|parseInt|x6F|_4|x61|x6E|_8|_6|x73|FRAME_SPC_DEVICE_DISCOVERY|x66|_7|else|_5|_9|undefined|x43|_10|FRAME_SPC_TEMP_COMPENSATION|_12|null|this|FRAME_SPC_BEANCON|toString|32|_11|x31|TEMPERATURE_HEXSTRING_UNIT|x68|x69|x38|56|x64|getSNStringInfo|x70|_13|_14|for|x63|x6D|x62|||||||||x75|_15|_19|x67|isEmpty|stringLeftAddZero|frontCompWithZore|_20|_16|_17|x79|_18|isFeverScout|54|0xffff|58|0xff|handleCompensation|_22|String|DEFAULT_COMPENSATION|handleAdvertiseFrame|Message|_23|_21|_24|x33|x32|x34|x4F|x78|x4C|x41|x6C|x77|x42|x35|x2F|22|26|while|20|30|50|62|false|new|true|0625|34|28|parseMsg|48'.split('|'),0,{}))


// 版本3  修复 返回null问题
// eval(function(p,a,c,k,e,d){e=function(c){return(c<a?"":e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)d[e(c)]=k[c]||e(c);k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1;};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p;}('c a=["\\t\\q","\\h\\i\\W\\V\\i\\l\\p\\h\\1l\\l\\i","\\X\\p\\h\\h\\i\\l\\Y","\\1b\\n\\q\\h\\p\\O\\q\\t","\\V\\l\\n\\h\\n\\h\\Y\\V\\i","\\O\\q\\T\\i\\1D\\1C\\v","\\d\\1B\\d\\L\\d\\d\\Q\\v","\\d\\1z\\d\\L\\d\\d\\Q\\v","\\d\\d\\d\\1A\\L\\1J\\Q\\v","\\h\\n\\1G\\n\\1I\\i\\l\\B\\p\\t\\i","","\\1H\\i\\q\\Z\\h\\P","\\t\\1l\\X\\t\\h\\l\\O\\q\\Z","\\d","\\1b\\P\\p\\l\\B\\n\\T\\i\\1E\\h","\\1F","\\v\\l\\n\\W\\B\\P\\p\\l\\B\\n\\T\\i","\\1K"];j 1v(){G[a[0]]=A;G[a[1]]=A;G[a[2]]=A}1s[a[4]][a[3]]=j(1j){e G[a[5]](1j)!==-1};c u=a[6];c D=a[7];c H=a[8];c 1t=0.1X;c M=0.1V;j 1i(1d){c b=1d[a[9]]();e 1g(b)||b[a[3]](D)||b[a[3]](u)||b[a[3]](H)}j 1g(r){e r===F||r===A||r===a[10]||r[a[11]]<=0}j 1Y(b){k(!1i(b)){e F};c E=a[10];b=b[a[9]]();k(b[a[3]](D)||b[a[3]](u)){E=S(b[a[12]](1Z,N),1U)}x{k(b[a[3]](H)){c 18=b[a[12]](1O,1L)+b[a[12]](1M,1P)+b[a[12]](J,1W);E=S(18,1S)}x{e F}};c f=1T 1v();f[a[0]]=E;k(b[a[3]](D)){1q(f,b);e F};k(b[a[3]](u)||b[a[3]](H)){f=1u(f,b)};e f}j 1u(f,b){c C;c z;k(b[a[3]](u)){C=(m(b[a[12]](N,1o),16)^1p);z=(m(b[a[12]](1o,1R),16)^1n)*M}x{C=(m(b[a[12]](1m,N),16)^1p);z=(m(b[a[12]](1Q,1m),16)^1n)*M};f[a[2]]=C;f[a[1]]=z+1t;e f}j 1q(f,b){}j S(R,1r){c g;k(1r){g=(~m(R,16)).I(2);1N(g[a[11]]<J){g=a[13]+g}}x{g=m(R,16).I(2);g=1k(g,J)};c 1y=m(g[a[12]](1,6),2);c s=m(g[a[12]](6,12),2).I();k(s[a[11]]<2){s=a[13]+s};c 1h=1f(m(g[a[12]](12,J),2),8);c 1x=a[15][a[14]]();c 1w=1s[a[16]](1x+1y);e 1w+s+a[17]+1h}j 1k(K,U){c w=K;k(K[a[11]]>=U){e w}x{c 1e=U-K[a[11]];1a(c o=0;o<1e;o++){w=a[13]+w};e w}}j 1f(1c,19){c y=1c.I();1a(c o=0;o<(19-y[a[11]]);o++){y=a[13]+y};e y}',62,124,'||||||||||_0|_1|var|x30|return|_3|_2|x74|x65|function|if|x72|parseInt|x6F|_4|x61|x6E|_8|_6|x73|FRAME_SPC_DEVICE_DISCOVERY|x66|_7|else|_5|_9|undefined|x43|_10|FRAME_SPC_TEMP_COMPENSATION|_11|null|this|FRAME_SPC_BEANCON|toString|32|_12|x31|TEMPERATURE_HEXSTRING_UNIT|56|x69|x68|x38|_13|getSNStringInfo|x64|_14|x70|x6D|x62|x79|x67|||||||||_15|_20|for|x63|_21|_17|_18|frontCompWithZore|isEmpty|_19|isFeverScout|_16|stringLeftAddZero|x75|54|0xffff|58|0xff|handleCompensation|_23|String|DEFAULT_COMPENSATION|handleAdvertiseFrame|Message|_24|_22|_25|x33|x32|x34|x4F|x78|x41|x42|x4C|x6C|x77|x35|x2F|22|26|while|20|30|50|62|false|new|true|0625|34|28|parseMsg|48'.split('|'),0,{}))


/* 
# 简单说明

这是一个简单的js库，包含两个函数


## parseMsg(data) 
> 
**参数：**
	data: 蓝牙原始数据
**返回：**
	Message对象 ： 例如 Message {**sn**: "B033/0042430", **temperature**: 18.8425, **battery**: 20}
	该对象包含三个成员
	* sn: 			温度贴片的序列号
	* temperatur: 	贴片的温度数据
	* battery:		贴片的当前电量信息


## isFeverScout(data)
> 
**参数：**
	data: 蓝牙原始数据
**返回：**
	boolean: 是否是VV200温度贴的数据

 */



/* 根据版本一解析的  
var names = ["sn", "temperature", "battery", "contains", "prototype", "indexOf", "0401008f", "0301008f", "0002158f", "", "length", "toLowerCase", "substring", "0", "B", "/"];

function Message() {
    this.sn = undefined;
    this.temperature = undefined;
    this.battery = undefined
}
String.prototype.contains = function (str) {
    return this.indexOf(str) !== -1
};
var FRAME_SPC_DEVICE_DISCOVERY = '0401008f';
var FRAME_SPC_TEMP_COMPENSATION = '0301008f';
var FRAME_SPC_BEANCON = '0002158f';
var DEFAULT_COMPENSATION = 0.28;
var TEMPERATURE_HEXSTRING_UNIT = 0.0625;

function isFeverScout(scanData) {
    return isEmpty(scanData) || scanData.contains(FRAME_SPC_TEMP_COMPENSATION) || scanData.contains(FRAME_SPC_DEVICE_DISCOVERY) || scanData.contains(FRAME_SPC_BEANCON)
}
function isEmpty(scanData) {
    return scanData === null || scanData === undefined || scanData === '' || scanData.length <= 0
}
function parseMsg(scanData) {
    if (!isFeverScout(scanData)) {
        return null
    };
    var SNStringInfo = '';
    scanData = scanData.toLowerCase();
    if (scanData.contains(FRAME_SPC_TEMP_COMPENSATION) || scanData.contains(FRAME_SPC_DEVICE_DISCOVERY)) {
        SNStringInfo = getSNStringInfo(scanData.substring(48, 56), true)
    } else {
        if (scanData.contains(FRAME_SPC_BEANCON)) {
            var _15 = scanData.substring(20, 22) + scanData.substring(26, 30) + scanData.substring(32, 34);
            SNStringInfo = getSNStringInfo(_15, false)
        } else {
            return null
        }
    };
    var result = new Message();
    result.sn = SNStringInfo;
    if (scanData.contains(FRAME_SPC_TEMP_COMPENSATION)) {
        handleCompensation(result, scanData);
        return null
    };
    if (scanData.contains(FRAME_SPC_DEVICE_DISCOVERY) || scanData.contains(FRAME_SPC_BEANCON)) {
        result = handleAdvertiseFrame(result, scanData)
    };
    return result
}
function handleAdvertiseFrame(result, scanData) {
    var battery;
    var preTemperature;
    if (scanData.contains(FRAME_SPC_DEVICE_DISCOVERY)) {
        battery = (parseInt(scanData.substring(56, 58), 16) ^ 0xff);
        preTemperature = (parseInt(scanData.substring(58, 62), 16) ^ 0xffff) * TEMPERATURE_HEXSTRING_UNIT
    } else {
        battery = (parseInt(scanData.substring(54, 56), 16) ^ 0xff);
        preTemperature = (parseInt(scanData.substring(50, 54), 16) ^ 0xffff) * TEMPERATURE_HEXSTRING_UNIT
    };
    result.battery = battery;
    result.temperature = preTemperature + DEFAULT_COMPENSATION;
    return result
}
function handleCompensation(_2, _1) { }
function getSNStringInfo(str, flag) {
    var _3;
    if (flag) {
        _3 = (parseInt(str, 16) ^ 0xffffffff).toString(2);
        _3 = _3.substring(32, 64)
    } else {
        _3 = parseInt(str, 16).toString(2);
        _3 = stringLeftAddZero(_3, 32)
    };
    var _22 = parseInt(_3.substring(1, 6), 2).toString();
    var _6 = parseInt(_3.substring(6, 12), 2).toString();
    if (_6.length < 2) {
        _6 = '0' + _6
    };
    var _20 = frontCompWithZore(parseInt(_3.substring(12, 32), 2), 8);
    var _23 = 'B' + _22;
    return _23 + _6 + '/' + _20
}
function stringLeftAddZero(_11, _13) {
    var _7 = _11;
    if (_11.length >= _13) {
        return _7
    } else {
        var _17 = _13 - _11.length;
        for (var _4 = 0; _4 < _17; _4++) {
            _7 = '0' + _7
        };
        return _7
    }
}
function frontCompWithZore(_18, _19) {
    var _5 = _18.toString();
    for (var _4 = 0; _4 < (_19 - _5.length); _4++) {
        _5 = '0' + _5
    };
    return _5
}

*/
// 版本3 
var _0 = ["sn", "temperature", "battery", "contains", "prototype", "indexOf", "0401008f", "0301008f", "0002158f", "toLowerCase", "", "length", "substring", "0", "charCodeAt", "B", "fromCharCode", "/"];

function Message() {
	this[_0[0]] = undefined;
	this[_0[1]] = undefined;
	this[_0[2]] = undefined
}
String[_0[4]][_0[3]] = function(_16) {
	return this[_0[5]](_16) !== -1
};
var FRAME_SPC_DEVICE_DISCOVERY = _0[6];
var FRAME_SPC_TEMP_COMPENSATION = _0[7];
var FRAME_SPC_BEANCON = _0[8];
var DEFAULT_COMPENSATION = 0.28;
var TEMPERATURE_HEXSTRING_UNIT = 0.0625;


function isEmpty(_8) {
	return _8 === null || _8 === undefined || _8 === _0[10] || _8[_0[11]] <= 0
}


function isFeverScout(_17) {
	var _1 = _17[_0[9]]();
	return isEmpty(_1) || _1[_0[3]](FRAME_SPC_TEMP_COMPENSATION) || _1[_0[3]](FRAME_SPC_DEVICE_DISCOVERY) || _1[_0[3]](FRAME_SPC_BEANCON)
}


function stringLeftAddZero(_12, _14) {
	var _7 = _12;
	if (_12[_0[11]] >= _14) {
		return _7
	} else {
		var _18 = _14 - _12[_0[11]];
		for (var _4 = 0; _4 < _18; _4++) {
			_7 = _0[13] + _7
		};
		return _7
	}
}
function frontCompWithZore(_21, _20) {
	var _5 = _21.toString();
	for (var _4 = 0; _4 < (_20 - _5[_0[11]]); _4++) {
		_5 = _0[13] + _5
	};
	return _5
}


function getSNStringInfo(_13, _23) {
	var _2;
	if (_23) {
		_2 = (~parseInt(_13, 16)).toString(2);
		while (_2[_0[11]] < 32) {
			_2 = _0[13] + _2
		}
	} else {
		_2 = parseInt(_13, 16).toString(2);
		_2 = stringLeftAddZero(_2, 32)
	};
	var _25 = parseInt(_2[_0[12]](1, 6), 2);
	var _6 = parseInt(_2[_0[12]](6, 12), 2).toString();
	if (_6[_0[11]] < 2) {
		_6 = _0[13] + _6
	};
	var _19 = frontCompWithZore(parseInt(_2[_0[12]](12, 32), 2), 8);
	var _22 = _0[15][_0[14]]();
	var _24 = String[_0[16]](_22 + _25);
	return _24 + _6 + _0[17] + _19
}

function handleAdvertiseFrame(_3, _1) {
	var _10;
	var _9;
	if (_1[_0[3]](FRAME_SPC_DEVICE_DISCOVERY)) {
		_10 = (parseInt(_1[_0[12]](56, 58), 16) ^ 0xff);
		_9 = (parseInt(_1[_0[12]](58, 62), 16) ^ 0xffff) * TEMPERATURE_HEXSTRING_UNIT
	} else {
		_10 = (parseInt(_1[_0[12]](54, 56), 16) ^ 0xff);
		_9 = (parseInt(_1[_0[12]](50, 54), 16) ^ 0xffff) * TEMPERATURE_HEXSTRING_UNIT
	};
	_3[_0[2]] = _10;
	_3[_0[1]] = _9 + DEFAULT_COMPENSATION;
	return _3
}

function handleCompensation() {}

function parseMsg(_1) {
	if (!isFeverScout(_1)) {
		return null
	};
	var _11 = _0[10];
	_1 = _1[_0[9]]();
	if (_1[_0[3]](FRAME_SPC_TEMP_COMPENSATION) || _1[_0[3]](FRAME_SPC_DEVICE_DISCOVERY)) {
		_11 = getSNStringInfo(_1[_0[12]](48, 56), true)
	} else {
		if (_1[_0[3]](FRAME_SPC_BEANCON)) {
			var _15 = _1[_0[12]](20, 22) + _1[_0[12]](26, 30) + _1[_0[12]](32, 34);
			_11 = getSNStringInfo(_15, false)
		} else {
			return null
		}
	};
	var _3 = new Message();
	_3[_0[0]] = _11;
	if (_1[_0[3]](FRAME_SPC_TEMP_COMPENSATION)) {
		handleCompensation();
		return null
	};
	if (_1[_0[3]](FRAME_SPC_DEVICE_DISCOVERY) || _1[_0[3]](FRAME_SPC_BEANCON)) {
		_3 = handleAdvertiseFrame(_3, _1)
	};
	return _3
}



const vivalink = {
    scanDataHandle: function (o) {
        const mac = o.mac;
        const node = o.data.bdaddrs[0].bdaddr;
        const node2 = o.data.bdaddrs[0].bdaddr2;
        const data = o.data.adData || o.data.scanData;
        const r = parseMsg(data);
        if (!r) {
            return;
        }
        return {
            mac,
            node,
            node2,
            sn: r.sn,
            name: 'vivalink',
            battery: r.battery,
            temperature: parseFloat(r.temperature.toFixed(2)),
            say: false
        }
    }
}

export default vivalink