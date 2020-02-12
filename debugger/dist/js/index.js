/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(/*! ./src/css/index.css */ 1);
	
	var _mainHandle = __webpack_require__(/*! ./src/js/mainHandle */ 5);
	
	var handle = _interopRequireWildcard(_mainHandle);
	
	var _scan = __webpack_require__(/*! ./src/js/scan */ 117);
	
	var _scan2 = _interopRequireDefault(_scan);
	
	var _notifyStateAndFill = __webpack_require__(/*! ./src/js/notifyStateAndFill */ 113);
	
	var _notifyStateAndFill2 = _interopRequireDefault(_notifyStateAndFill);
	
	var _notifyMsgAndFill = __webpack_require__(/*! ./src/js/notifyMsgAndFill */ 112);
	
	var _notifyMsgAndFill2 = _interopRequireDefault(_notifyMsgAndFill);
	
	var _globalData = __webpack_require__(/*! ./src/js/globalData */ 50);
	
	var _globalData2 = _interopRequireDefault(_globalData);
	
	var _i18n = __webpack_require__(/*! ./src/js/i18n */ 49);
	
	var _i18n2 = _interopRequireDefault(_i18n);
	
	var _oAuth = __webpack_require__(/*! ./src/js/oAuth2 */ 127);
	
	var _api = __webpack_require__(/*! ./src/js/api */ 10);
	
	var _urlconfig = __webpack_require__(/*! ./src/js/urlconfig */ 56);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	(0, _i18n2.default)();
	(function () {
		$('#hubIp').val(_globalData2.default.saved.hubIp).triggerHandler('blur');
		$('#hubMac').val(_globalData2.default.saved.hubMac).triggerHandler('blur');
	})();
	
	layui.use(['layer', 'form'], function () {
		var layer = layui.layer,
		    form = layui.form();
		$('#reboot').click(function () {
			console.log(_urlconfig.urlArr.reboot);
			_api.api.reboot(_urlconfig.urlArr.reboot).done(layer.load(2, {
				time: 5 * 1000
			}));
		});
	
		form.on('select(control)', function (data) {
			(0, _oAuth.control)(data.value, form);
		});
		form.on('select(lang)', function (data) {
			(0, _i18n2.default)(data.value, form.render);
		});
		form.on('switch(switchScan)', function (data) {
			handle.linkage(0);
			if (data.elem.checked) {
				console.log(_globalData2.default.saved);
				_scan2.default.start({
					chip: _globalData2.default.saved.chip || 0
				}, _globalData2.default.neverSave.scanSSE.timeOut);
			} else {
				_scan2.default.stop();
			}
		});
	
		form.on('switch(switchNotifyState)', function (data) {
			handle.linkage(5);
			if (data.elem.checked) {
				_notifyStateAndFill2.default.start();
			} else {
				_notifyStateAndFill2.default.stop();
			}
		});
	
		form.on('switch(switchNotifyMsg)', function (data) {
			handle.linkage(4);
			if (data.elem.checked) {
				_notifyMsgAndFill2.default.start();
			} else {
				_notifyMsgAndFill2.default.stop(0);
			}
		});
	
		$('#clearNotify').on('click', function () {
			$('.box .l4 ul').empty();
		});
	
		handle.mainHandle(layer, form);
		handle.connectButton();
		handle.getConnectLists();
		handle.disConnectDevice();
		handle.getAllServices();
		handle.gopair();
		handle.cancelpair();
	});
	
	layui.use(['element'], function () {
		var element = layui.element();
	});

/***/ }),
/* 1 */
/*!***************************!*\
  !*** ./src/css/index.css ***!
  \***************************/
/***/ (function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }),
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/*!******************************!*\
  !*** ./src/js/mainHandle.js ***!
  \******************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.linkage = exports.cancelpair = exports.gopair = exports.getAllServices = exports.disConnectDevice = exports.getConnectLists = exports.connectButton = exports.mainHandle = undefined;
	
	var _connectDevice = __webpack_require__(/*! ./connectDevice */ 6);
	
	var _connectDevice2 = _interopRequireDefault(_connectDevice);
	
	var _disConnectDeviceAndFill = __webpack_require__(/*! ./disConnectDeviceAndFill */ 58);
	
	var _disConnectDeviceAndFill2 = _interopRequireDefault(_disConnectDeviceAndFill);
	
	var _unpairDeviceAndFill = __webpack_require__(/*! ./unpairDeviceAndFill */ 59);
	
	var _unpairDeviceAndFill2 = _interopRequireDefault(_unpairDeviceAndFill);
	
	var _pairDeviceAndFill = __webpack_require__(/*! ./pairDeviceAndFill */ 60);
	
	var _pairDeviceAndFill2 = _interopRequireDefault(_pairDeviceAndFill);
	
	var _pair = __webpack_require__(/*! ./pair */ 61);
	
	var _pair2 = _interopRequireDefault(_pair);
	
	var _unpair = __webpack_require__(/*! ./unpair */ 63);
	
	var _unpair2 = _interopRequireDefault(_unpair);
	
	var _getConnectList = __webpack_require__(/*! ./getConnectList */ 64);
	
	var _getAllServicesAndFill = __webpack_require__(/*! ./getAllServicesAndFill */ 97);
	
	var _notifyMsgAndFill = __webpack_require__(/*! ./notifyMsgAndFill */ 112);
	
	var _notifyMsgAndFill2 = _interopRequireDefault(_notifyMsgAndFill);
	
	var _notifyStateAndFill = __webpack_require__(/*! ./notifyStateAndFill */ 113);
	
	var _notifyStateAndFill2 = _interopRequireDefault(_notifyStateAndFill);
	
	var _connectTip = __webpack_require__(/*! ./connectTip */ 114);
	
	var _scanTip = __webpack_require__(/*! ./scanTip */ 116);
	
	var _scanTip2 = _interopRequireDefault(_scanTip);
	
	var _connectListTip = __webpack_require__(/*! ./connectListTip */ 118);
	
	var _connectListTip2 = _interopRequireDefault(_connectListTip);
	
	var _getAllServicesTip = __webpack_require__(/*! ./getAllServicesTip */ 119);
	
	var _getAllServicesTip2 = _interopRequireDefault(_getAllServicesTip);
	
	var _notifyMsgTip = __webpack_require__(/*! ./notifyMsgTip */ 120);
	
	var _notifyMsgTip2 = _interopRequireDefault(_notifyMsgTip);
	
	var _pairTip = __webpack_require__(/*! ./pairTip */ 121);
	
	var _unpairTip = __webpack_require__(/*! ./unpairTip */ 122);
	
	var _unpairTip2 = _interopRequireDefault(_unpairTip);
	
	var _notifyStateTip = __webpack_require__(/*! ./notifyStateTip */ 123);
	
	var _notifyStateTip2 = _interopRequireDefault(_notifyStateTip);
	
	var _disconnectTip = __webpack_require__(/*! ./disconnectTip */ 124);
	
	var _disconnectTip2 = _interopRequireDefault(_disconnectTip);
	
	var _writeByHandleTip = __webpack_require__(/*! ./writeByHandleTip.js */ 125);
	
	var _writeByHandleTip2 = _interopRequireDefault(_writeByHandleTip);
	
	var _globalData = __webpack_require__(/*! ./globalData */ 50);
	
	var _globalData2 = _interopRequireDefault(_globalData);
	
	var _i18n = __webpack_require__(/*! ./i18n */ 49);
	
	var _i18n2 = _interopRequireDefault(_i18n);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var $l1 = $('.box .l1'),
	    $l3 = $('.box .l3');
	
	function mainHandle(layer, form) {
	    $l1.on('click', function (e) {
	        var targetId = e.target.id;
	        switch (targetId) {
	            case 'bscan':
	                {
	                    (0, _scanTip2.default)(layer, form, e.target);
	
	                    break;
	                }
	            case 'bConnect':
	                {
	                    (0, _connectTip.connectTips)(layer, form, e.target);
	                    break;
	                }
	
	            case 'bconnectList':
	                {
	                    e.target.fn = _getConnectList.getConnectListAndFill;
	                    (0, _connectListTip2.default)(layer, form, e.target);
	
	                    break;
	                }
	            case 'bdiscoverSer':
	                {
	
	                    e.target.fn = _getAllServicesAndFill.getAllServicesAndFill;
	                    (0, _getAllServicesTip2.default)(layer, form, e.target);
	                    break;
	                }
	            case 'bnotify':
	                {
	                    e.target.start = _notifyMsgAndFill2.default.start;
	                    e.target.stop = _notifyMsgAndFill2.default.stop;
	                    (0, _notifyMsgTip2.default)(layer, form, e.target);
	                    break;
	                }
	            case 'bnotifyState':
	                {
	                    e.target.start = _notifyStateAndFill2.default.start;
	                    e.target.stop = _notifyStateAndFill2.default.stop;
	                    (0, _notifyStateTip2.default)(layer, form, e.target);
	                    break;
	                }
	            case 'bwrite':
	                {
	                    (0, _writeByHandleTip2.default)(layer, form, e.target);
	                    break;
	                }
	            case 'bdisconnect':
	                {
	                    e.target.fn = _disConnectDeviceAndFill2.default;
	                    (0, _disconnectTip2.default)(layer, form, e.target);
	                    break;
	                }
	            case 'bpair':
	                {
	                    e.target.fn = _pairDeviceAndFill2.default;
	                    (0, _pairTip.pairTips)(layer, form, e.target);
	                    break;
	                }
	            case 'bpairInput':
	                {
	                    $('.firstPair').show();
	                    $('.yes').unbind('click').bind('click', function () {
	                        $('.firstPair').hide();
	                    });
	                    break;
	                }
	            case 'bunpair':
	                {
	                    e.target.fn = _unpairDeviceAndFill2.default;
	                    console.log(e.target);
	                    (0, _unpairTip2.default)(layer, form, e.target);
	                    break;
	                }
	        }
	        (0, _i18n2.default)(_globalData2.default.lang);
	        form.render();
	    });
	}
	function linkage(id) {
	    $('.log .layui-tab-title li').eq(id).addClass('layui-this').siblings().removeClass('layui-this');
	    $('.layui-tab-card .layui-tab-content>div').eq(id).addClass('layui-show').siblings().removeClass('layui-show');
	}
	
	function connectButton() {
	    $('.box .l2').on('click', "[data-action='connect']", function () {
	        linkage(1);
	        var deviceMac = this.dataset.mac,
	            type = this.dataset.type;
	        (0, _connectDevice2.default)(null, type, deviceMac);
	    });
	}
	function cancelpair() {
	    $('body').on('click', "[data-action='unpair']", function () {
	        linkage(11);
	        var deviceMac = this.dataset.mac;
	        (0, _unpair2.default)(deviceMac);
	    });
	}
	function disConnectDevice() {
	    $l3.on('click', "[data-action='disconnect']", function () {
	        linkage(7);
	        var deviceMac = this.dataset.mac;
	        (0, _disConnectDeviceAndFill2.default)(deviceMac);
	    });
	}
	
	function getAllServices() {
	    $l3.on('click', "button[data-action='services']", function () {
	        linkage(3);
	        var deviceMac = this.dataset.mac;
	        (0, _getAllServicesAndFill.getAllServicesAndFill)(deviceMac);
	    });
	}
	function gopair() {
	    $l3.on('click', "[data-action='pair']", function (e) {
	        linkage(9);
	        var deviceMac = this.dataset.mac;
	        (0, _pair2.default)(deviceMac, e.target);
	    });
	}
	
	function getConnectLists() {
	    $l3.on('click', '.connectList', function () {
	        linkage(2);
	        (0, _getConnectList.getConnectListAndFill)();
	    });
	}
	
	exports.mainHandle = mainHandle;
	exports.connectButton = connectButton;
	exports.getConnectLists = getConnectLists;
	exports.disConnectDevice = disConnectDevice;
	exports.getAllServices = getAllServices;
	exports.gopair = gopair;
	exports.cancelpair = cancelpair;
	exports.linkage = linkage;

/***/ }),
/* 6 */
/*!*********************************!*\
  !*** ./src/js/connectDevice.js ***!
  \*********************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _stringify = __webpack_require__(/*! babel-runtime/core-js/json/stringify */ 7);
	
	var _stringify2 = _interopRequireDefault(_stringify);
	
	var _api = __webpack_require__(/*! ./api */ 10);
	
	var _urlconfig = __webpack_require__(/*! ./urlconfig */ 56);
	
	var _showmethod = __webpack_require__(/*! ./showmethod */ 48);
	
	var _showlog = __webpack_require__(/*! ./showlog */ 57);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function connectDevice(chip, type, deviceMac) {
		var url = _urlconfig.urlArr.connectDevice.replace("*deviceMac*", deviceMac),
		    $parent = $('#connect ul');
	
		_api.api.connectDevice(url, {
			qs: {
				chip: chip
			},
			type: type
		}).done(function (e) {
			(0, _showlog.showLog)($parent, {
				before: 'mac:' + deviceMac + '&nbsp;&nbsp;',
				message: (0, _stringify2.default)(e),
				class: 'success'
			});
		}).fail(function (e) {
			(0, _showlog.showLog)($parent, {
				before: 'mac:' + deviceMac + '&nbsp;&nbsp;',
				message: (0, _stringify2.default)(e),
				class: 'fail'
			});
		}).always(function (e) {
			console.log('connect:', e);
		});
	
		(0, _showmethod.showMethod)('connectDevice');
	}
	exports.default = connectDevice;

/***/ }),
/* 7 */
/*!***************************************************!*\
  !*** ./~/babel-runtime/core-js/json/stringify.js ***!
  \***************************************************/
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(/*! core-js/library/fn/json/stringify */ 8), __esModule: true };

/***/ }),
/* 8 */
/*!************************************************!*\
  !*** ./~/core-js/library/fn/json/stringify.js ***!
  \************************************************/
/***/ (function(module, exports, __webpack_require__) {

	var core = __webpack_require__(/*! ../../modules/_core */ 9);
	var $JSON = core.JSON || (core.JSON = { stringify: JSON.stringify });
	module.exports = function stringify(it) { // eslint-disable-line no-unused-vars
	  return $JSON.stringify.apply($JSON, arguments);
	};


/***/ }),
/* 9 */
/*!********************************************!*\
  !*** ./~/core-js/library/modules/_core.js ***!
  \********************************************/
/***/ (function(module, exports) {

	var core = module.exports = { version: '2.6.11' };
	if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 10 */
/*!***********************!*\
  !*** ./src/js/api.js ***!
  \***********************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.api = undefined;
	
	var _stringify = __webpack_require__(/*! babel-runtime/core-js/json/stringify */ 7);
	
	var _stringify2 = _interopRequireDefault(_stringify);
	
	var _assign = __webpack_require__(/*! babel-runtime/core-js/object/assign */ 11);
	
	var _assign2 = _interopRequireDefault(_assign);
	
	var _showmethod = __webpack_require__(/*! ./showmethod */ 48);
	
	var _globalData = __webpack_require__(/*! ./globalData */ 50);
	
	var _globalData2 = _interopRequireDefault(_globalData);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function addURLParam(url, data) {
	    var flag = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
	
	    for (var key in data) {
	        url += url.indexOf("?") === -1 ? "?" : "&";
	        url += (flag ? encodeURIComponent(key) : key) + "=" + (flag ? encodeURIComponent(data[key]) : data[key]);
	    }
	    return url;
	}
	
	function start(url, data, scanSSE, cb) {
	    var _data = (0, _assign2.default)({
	        event: 1,
	        chip: 0
	    }, data),
	        _url = addURLParam(url, _data, false),
	        virtualData = '';
	    _showmethod.methodConfig.scan.url = _url;
	    var es = new EventSource(_url);
	
	    es.addEventListener("open", function () {
	        if (scanSSE.status === 'toClosed') {
	            this.close();
	            scanSSE.es = '';
	            return;
	        }
	        scanSSE.es = this;
	    }, false);
	
	
	    layui.use('flow', function () {
	        var flow = layui.flow,
	            num = 10;
	        es.addEventListener('message', function (e) {
	            if (!e.data.match("keep-alive")) {
	                _globalData2.default.neverSave.scanData.push(e.data);
	
	                cb(e.data);
	            }
	        });
	
	        flow.load({
	            elem: '#scanLog ul',
	            scrollElem: '.layui-tab-content',
	            mb: 100,
	            done: function done(page, next) {
	                var lis = _globalData2.default.neverSave.scanData;
	                if (page === 1) {
	                    setTimeout(function () {
	                        next('<li>' + lis.slice(0, num).join('</li><li>') + '</li>', num < lis.length);
	                        page++;
	                    }, 1000);
	                } else {
	                    next('<li>' + lis.slice((page - 1) * num, page * num).join('</li><li>') + '</li>', page * num <= lis.length);
	                    page++;
	                }
	            }
	        });
	    });
	}
	
	function connectDevice(url, data) {
	    var _url = url;
	    if (data.qs.chip !== null) _url = addURLParam(url, data.qs, false);
	
	    _showmethod.methodConfig.connectDevice.url = _url;
	    return $.ajax({
	        url: _url,
	        type: 'POST',
	        headers: { "Content-Type": "application/json" },
	        data: (0, _stringify2.default)({
	            "timeOut": 5000,
	            "type": data.type
	        })
	    });
	}
	
	function disconnectDevice(url) {
	    _showmethod.methodConfig.disconnectDevice.url = url;
	    return $.ajax({
	        url: url,
	        type: 'DELETE',
	        headers: { "Content-Type": "application/json" }
	    });
	}
	
	function getConnectList(url) {
	    _showmethod.methodConfig.getConnectList.url = url;
	    return $.ajax({
	        url: url,
	        type: 'GET',
	        dataType: 'json'
	    });
	}
	
	function getConnectState(url, stateSSE) {
	    var es = new EventSource(url);
	    _showmethod.methodConfig.getConnectState.url = url;
	
	    es.addEventListener("open", function () {
	        console.log('open');
	        if (stateSSE.status === 'toClosed') {
	            this.close();
	            console.log('closed');
	            stateSSE.status = 'closed';
	            stateSSE.es = '';
	            return;
	        }
	        stateSSE.es = this;
	        stateSSE.status = 'open';
	    }, false);
	    return es;
	}
	
	function reboot(url) {
	    return $.ajax({
	        url: url,
	        type: 'GET'
	    });
	}
	
	function getAllServices(url) {
	    _showmethod.methodConfig.getAllServices.url = url;
	    return $.ajax({
	        url: url,
	        type: 'GET',
	        dataType: 'json'
	    });
	}
	
	function readByHandle(url, data) {
	    _showmethod.methodConfig.readByHandle.url = addURLParam(url, data, false);
	    return $.ajax({
	        url: url,
	        type: 'GET',
	        headers: { "Content-Type": "application/json" },
	        data: data
	    });
	}
	
	function receiveNotification(url, notifySSE) {
	    var es = new EventSource(url);
	
	    console.log(notifySSE);
	    _showmethod.methodConfig.notify.url = url;
	    es.addEventListener("open", function () {
	        if (notifySSE.status === 'toClosed') {
	            this.close();
	            notifySSE.status = 'closed';
	            notifySSE.es = '';
	            return;
	        }
	        console.log('open');
	        notifySSE.es = this;
	        notifySSE.status = 'open';
	    }, false);
	    return es;
	}
	
	function writeByHandle(url, data) {
	    _showmethod.methodConfig.writeByHandle.url = addURLParam(url, data, false);
	    return $.ajax({
	        url: url,
	        type: 'GET',
	        headers: { "Content-Type": "application/json" },
	        data: data
	    });
	}
	
	function pair(url) {
	    _showmethod.methodConfig.pair.url = url;
	
	    return $.ajax({
	        type: 'post',
	        url: url,
	        headers: { "Content-Type": "application/json" },
	        data: (0, _stringify2.default)({
	            "bond": 1,
	            "legacy-oob": 0,
	            "io-capability": 'KeyboardDisplay'
	        })
	    });
	}
	function unpair(url) {
	    _showmethod.methodConfig.unpair.url = url;
	    return $.ajax({
	        type: 'delete',
	        url: url,
	        headers: { "Content-Type": "application/json" },
	        success: function success(data) {
	            console.log('unPair success', data);
	        },
	        error: function error(err) {
	            console.log('unPair fail', err);
	        }
	    });
	}
	
	function pairInput(url, passkey) {
	    _showmethod.methodConfig.pair_input.url = url;
	    console.log('pairInput Start');
	    return $.ajax({
	        type: 'post',
	        url: url,
	        headers: { "Content-Type": "application/json" },
	        data: (0, _stringify2.default)({
	            "passkey": passkey || "000000"
	        })
	
	    });
	}
	var api = {
	    start: start,
	    connectDevice: connectDevice,
	    disconnectDevice: disconnectDevice,
	    getConnectList: getConnectList,
	    getConnectState: getConnectState,
	    reboot: reboot,
	    getAllServices: getAllServices,
	    writeByHandle: writeByHandle,
	    readByHandle: readByHandle,
	    receiveNotification: receiveNotification,
	    addURLParam: addURLParam,
	    pair: pair,
	    pairInput: pairInput,
	    unpair: unpair
	
	};
	
	exports.api = api;

/***/ }),
/* 11 */
/*!**************************************************!*\
  !*** ./~/babel-runtime/core-js/object/assign.js ***!
  \**************************************************/
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/assign */ 12), __esModule: true };

/***/ }),
/* 12 */
/*!***********************************************!*\
  !*** ./~/core-js/library/fn/object/assign.js ***!
  \***********************************************/
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(/*! ../../modules/es6.object.assign */ 13);
	module.exports = __webpack_require__(/*! ../../modules/_core */ 9).Object.assign;


/***/ }),
/* 13 */
/*!********************************************************!*\
  !*** ./~/core-js/library/modules/es6.object.assign.js ***!
  \********************************************************/
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(/*! ./_export */ 14);
	
	$export($export.S + $export.F, 'Object', { assign: __webpack_require__(/*! ./_object-assign */ 29) });


/***/ }),
/* 14 */
/*!**********************************************!*\
  !*** ./~/core-js/library/modules/_export.js ***!
  \**********************************************/
/***/ (function(module, exports, __webpack_require__) {

	var global = __webpack_require__(/*! ./_global */ 15);
	var core = __webpack_require__(/*! ./_core */ 9);
	var ctx = __webpack_require__(/*! ./_ctx */ 16);
	var hide = __webpack_require__(/*! ./_hide */ 18);
	var has = __webpack_require__(/*! ./_has */ 28);
	var PROTOTYPE = 'prototype';
	
	var $export = function (type, name, source) {
	  var IS_FORCED = type & $export.F;
	  var IS_GLOBAL = type & $export.G;
	  var IS_STATIC = type & $export.S;
	  var IS_PROTO = type & $export.P;
	  var IS_BIND = type & $export.B;
	  var IS_WRAP = type & $export.W;
	  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
	  var expProto = exports[PROTOTYPE];
	  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
	  var key, own, out;
	  if (IS_GLOBAL) source = name;
	  for (key in source) {
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if (own && has(exports, key)) continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function (C) {
	      var F = function (a, b, c) {
	        if (this instanceof C) {
	          switch (arguments.length) {
	            case 0: return new C();
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if (IS_PROTO) {
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library`
	module.exports = $export;


/***/ }),
/* 15 */
/*!**********************************************!*\
  !*** ./~/core-js/library/modules/_global.js ***!
  \**********************************************/
/***/ (function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self
	  // eslint-disable-next-line no-new-func
	  : Function('return this')();
	if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 16 */
/*!*******************************************!*\
  !*** ./~/core-js/library/modules/_ctx.js ***!
  \*******************************************/
/***/ (function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(/*! ./_a-function */ 17);
	module.exports = function (fn, that, length) {
	  aFunction(fn);
	  if (that === undefined) return fn;
	  switch (length) {
	    case 1: return function (a) {
	      return fn.call(that, a);
	    };
	    case 2: return function (a, b) {
	      return fn.call(that, a, b);
	    };
	    case 3: return function (a, b, c) {
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function (/* ...args */) {
	    return fn.apply(that, arguments);
	  };
	};


/***/ }),
/* 17 */
/*!**************************************************!*\
  !*** ./~/core-js/library/modules/_a-function.js ***!
  \**************************************************/
/***/ (function(module, exports) {

	module.exports = function (it) {
	  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
	  return it;
	};


/***/ }),
/* 18 */
/*!********************************************!*\
  !*** ./~/core-js/library/modules/_hide.js ***!
  \********************************************/
/***/ (function(module, exports, __webpack_require__) {

	var dP = __webpack_require__(/*! ./_object-dp */ 19);
	var createDesc = __webpack_require__(/*! ./_property-desc */ 27);
	module.exports = __webpack_require__(/*! ./_descriptors */ 23) ? function (object, key, value) {
	  return dP.f(object, key, createDesc(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};


/***/ }),
/* 19 */
/*!*************************************************!*\
  !*** ./~/core-js/library/modules/_object-dp.js ***!
  \*************************************************/
/***/ (function(module, exports, __webpack_require__) {

	var anObject = __webpack_require__(/*! ./_an-object */ 20);
	var IE8_DOM_DEFINE = __webpack_require__(/*! ./_ie8-dom-define */ 22);
	var toPrimitive = __webpack_require__(/*! ./_to-primitive */ 26);
	var dP = Object.defineProperty;
	
	exports.f = __webpack_require__(/*! ./_descriptors */ 23) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if (IE8_DOM_DEFINE) try {
	    return dP(O, P, Attributes);
	  } catch (e) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};


/***/ }),
/* 20 */
/*!*************************************************!*\
  !*** ./~/core-js/library/modules/_an-object.js ***!
  \*************************************************/
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(/*! ./_is-object */ 21);
	module.exports = function (it) {
	  if (!isObject(it)) throw TypeError(it + ' is not an object!');
	  return it;
	};


/***/ }),
/* 21 */
/*!*************************************************!*\
  !*** ./~/core-js/library/modules/_is-object.js ***!
  \*************************************************/
/***/ (function(module, exports) {

	module.exports = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};


/***/ }),
/* 22 */
/*!******************************************************!*\
  !*** ./~/core-js/library/modules/_ie8-dom-define.js ***!
  \******************************************************/
/***/ (function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(/*! ./_descriptors */ 23) && !__webpack_require__(/*! ./_fails */ 24)(function () {
	  return Object.defineProperty(__webpack_require__(/*! ./_dom-create */ 25)('div'), 'a', { get: function () { return 7; } }).a != 7;
	});


/***/ }),
/* 23 */
/*!***************************************************!*\
  !*** ./~/core-js/library/modules/_descriptors.js ***!
  \***************************************************/
/***/ (function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(/*! ./_fails */ 24)(function () {
	  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
	});


/***/ }),
/* 24 */
/*!*********************************************!*\
  !*** ./~/core-js/library/modules/_fails.js ***!
  \*********************************************/
/***/ (function(module, exports) {

	module.exports = function (exec) {
	  try {
	    return !!exec();
	  } catch (e) {
	    return true;
	  }
	};


/***/ }),
/* 25 */
/*!**************************************************!*\
  !*** ./~/core-js/library/modules/_dom-create.js ***!
  \**************************************************/
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(/*! ./_is-object */ 21);
	var document = __webpack_require__(/*! ./_global */ 15).document;
	// typeof document.createElement is 'object' in old IE
	var is = isObject(document) && isObject(document.createElement);
	module.exports = function (it) {
	  return is ? document.createElement(it) : {};
	};


/***/ }),
/* 26 */
/*!****************************************************!*\
  !*** ./~/core-js/library/modules/_to-primitive.js ***!
  \****************************************************/
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(/*! ./_is-object */ 21);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function (it, S) {
	  if (!isObject(it)) return it;
	  var fn, val;
	  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
	  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
	  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};


/***/ }),
/* 27 */
/*!*****************************************************!*\
  !*** ./~/core-js/library/modules/_property-desc.js ***!
  \*****************************************************/
/***/ (function(module, exports) {

	module.exports = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};


/***/ }),
/* 28 */
/*!*******************************************!*\
  !*** ./~/core-js/library/modules/_has.js ***!
  \*******************************************/
/***/ (function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};


/***/ }),
/* 29 */
/*!*****************************************************!*\
  !*** ./~/core-js/library/modules/_object-assign.js ***!
  \*****************************************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// 19.1.2.1 Object.assign(target, source, ...)
	var DESCRIPTORS = __webpack_require__(/*! ./_descriptors */ 23);
	var getKeys = __webpack_require__(/*! ./_object-keys */ 30);
	var gOPS = __webpack_require__(/*! ./_object-gops */ 45);
	var pIE = __webpack_require__(/*! ./_object-pie */ 46);
	var toObject = __webpack_require__(/*! ./_to-object */ 47);
	var IObject = __webpack_require__(/*! ./_iobject */ 33);
	var $assign = Object.assign;
	
	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = !$assign || __webpack_require__(/*! ./_fails */ 24)(function () {
	  var A = {};
	  var B = {};
	  // eslint-disable-next-line no-undef
	  var S = Symbol();
	  var K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function (k) { B[k] = k; });
	  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
	}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
	  var T = toObject(target);
	  var aLen = arguments.length;
	  var index = 1;
	  var getSymbols = gOPS.f;
	  var isEnum = pIE.f;
	  while (aLen > index) {
	    var S = IObject(arguments[index++]);
	    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
	    var length = keys.length;
	    var j = 0;
	    var key;
	    while (length > j) {
	      key = keys[j++];
	      if (!DESCRIPTORS || isEnum.call(S, key)) T[key] = S[key];
	    }
	  } return T;
	} : $assign;


/***/ }),
/* 30 */
/*!***************************************************!*\
  !*** ./~/core-js/library/modules/_object-keys.js ***!
  \***************************************************/
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys = __webpack_require__(/*! ./_object-keys-internal */ 31);
	var enumBugKeys = __webpack_require__(/*! ./_enum-bug-keys */ 44);
	
	module.exports = Object.keys || function keys(O) {
	  return $keys(O, enumBugKeys);
	};


/***/ }),
/* 31 */
/*!************************************************************!*\
  !*** ./~/core-js/library/modules/_object-keys-internal.js ***!
  \************************************************************/
/***/ (function(module, exports, __webpack_require__) {

	var has = __webpack_require__(/*! ./_has */ 28);
	var toIObject = __webpack_require__(/*! ./_to-iobject */ 32);
	var arrayIndexOf = __webpack_require__(/*! ./_array-includes */ 36)(false);
	var IE_PROTO = __webpack_require__(/*! ./_shared-key */ 40)('IE_PROTO');
	
	module.exports = function (object, names) {
	  var O = toIObject(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (has(O, key = names[i++])) {
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};


/***/ }),
/* 32 */
/*!**************************************************!*\
  !*** ./~/core-js/library/modules/_to-iobject.js ***!
  \**************************************************/
/***/ (function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(/*! ./_iobject */ 33);
	var defined = __webpack_require__(/*! ./_defined */ 35);
	module.exports = function (it) {
	  return IObject(defined(it));
	};


/***/ }),
/* 33 */
/*!***********************************************!*\
  !*** ./~/core-js/library/modules/_iobject.js ***!
  \***********************************************/
/***/ (function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(/*! ./_cof */ 34);
	// eslint-disable-next-line no-prototype-builtins
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};


/***/ }),
/* 34 */
/*!*******************************************!*\
  !*** ./~/core-js/library/modules/_cof.js ***!
  \*******************************************/
/***/ (function(module, exports) {

	var toString = {}.toString;
	
	module.exports = function (it) {
	  return toString.call(it).slice(8, -1);
	};


/***/ }),
/* 35 */
/*!***********************************************!*\
  !*** ./~/core-js/library/modules/_defined.js ***!
  \***********************************************/
/***/ (function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on  " + it);
	  return it;
	};


/***/ }),
/* 36 */
/*!******************************************************!*\
  !*** ./~/core-js/library/modules/_array-includes.js ***!
  \******************************************************/
/***/ (function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(/*! ./_to-iobject */ 32);
	var toLength = __webpack_require__(/*! ./_to-length */ 37);
	var toAbsoluteIndex = __webpack_require__(/*! ./_to-absolute-index */ 39);
	module.exports = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIObject($this);
	    var length = toLength(O.length);
	    var index = toAbsoluteIndex(fromIndex, length);
	    var value;
	    // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare
	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++];
	      // eslint-disable-next-line no-self-compare
	      if (value != value) return true;
	    // Array#indexOf ignores holes, Array#includes - not
	    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
	      if (O[index] === el) return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};


/***/ }),
/* 37 */
/*!*************************************************!*\
  !*** ./~/core-js/library/modules/_to-length.js ***!
  \*************************************************/
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(/*! ./_to-integer */ 38);
	var min = Math.min;
	module.exports = function (it) {
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};


/***/ }),
/* 38 */
/*!**************************************************!*\
  !*** ./~/core-js/library/modules/_to-integer.js ***!
  \**************************************************/
/***/ (function(module, exports) {

	// 7.1.4 ToInteger
	var ceil = Math.ceil;
	var floor = Math.floor;
	module.exports = function (it) {
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};


/***/ }),
/* 39 */
/*!*********************************************************!*\
  !*** ./~/core-js/library/modules/_to-absolute-index.js ***!
  \*********************************************************/
/***/ (function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(/*! ./_to-integer */ 38);
	var max = Math.max;
	var min = Math.min;
	module.exports = function (index, length) {
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};


/***/ }),
/* 40 */
/*!**************************************************!*\
  !*** ./~/core-js/library/modules/_shared-key.js ***!
  \**************************************************/
/***/ (function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(/*! ./_shared */ 41)('keys');
	var uid = __webpack_require__(/*! ./_uid */ 43);
	module.exports = function (key) {
	  return shared[key] || (shared[key] = uid(key));
	};


/***/ }),
/* 41 */
/*!**********************************************!*\
  !*** ./~/core-js/library/modules/_shared.js ***!
  \**********************************************/
/***/ (function(module, exports, __webpack_require__) {

	var core = __webpack_require__(/*! ./_core */ 9);
	var global = __webpack_require__(/*! ./_global */ 15);
	var SHARED = '__core-js_shared__';
	var store = global[SHARED] || (global[SHARED] = {});
	
	(module.exports = function (key, value) {
	  return store[key] || (store[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: core.version,
	  mode: __webpack_require__(/*! ./_library */ 42) ? 'pure' : 'global',
	  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
	});


/***/ }),
/* 42 */
/*!***********************************************!*\
  !*** ./~/core-js/library/modules/_library.js ***!
  \***********************************************/
/***/ (function(module, exports) {

	module.exports = true;


/***/ }),
/* 43 */
/*!*******************************************!*\
  !*** ./~/core-js/library/modules/_uid.js ***!
  \*******************************************/
/***/ (function(module, exports) {

	var id = 0;
	var px = Math.random();
	module.exports = function (key) {
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};


/***/ }),
/* 44 */
/*!*****************************************************!*\
  !*** ./~/core-js/library/modules/_enum-bug-keys.js ***!
  \*****************************************************/
/***/ (function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');


/***/ }),
/* 45 */
/*!***************************************************!*\
  !*** ./~/core-js/library/modules/_object-gops.js ***!
  \***************************************************/
/***/ (function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;


/***/ }),
/* 46 */
/*!**************************************************!*\
  !*** ./~/core-js/library/modules/_object-pie.js ***!
  \**************************************************/
/***/ (function(module, exports) {

	exports.f = {}.propertyIsEnumerable;


/***/ }),
/* 47 */
/*!*************************************************!*\
  !*** ./~/core-js/library/modules/_to-object.js ***!
  \*************************************************/
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(/*! ./_defined */ 35);
	module.exports = function (it) {
	  return Object(defined(it));
	};


/***/ }),
/* 48 */
/*!******************************!*\
  !*** ./src/js/showmethod.js ***!
  \******************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.showMethod = exports.methodConfig = undefined;
	
	var _i18n = __webpack_require__(/*! ./i18n */ 49);
	
	var _i18n2 = _interopRequireDefault(_i18n);
	
	var _globalData = __webpack_require__(/*! ./globalData */ 50);
	
	var _globalData2 = _interopRequireDefault(_globalData);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var methodNames = {
	    scan: 'scanDevice',
	    connectDevice: 'connDevice',
	    getConnectList: 'connedDevice',
	    getAllServices: 'disService',
	    notify: 'getMsg',
	    getConnectState: 'deviceConStateChange',
	    readByHandle: 'readCom',
	    writeByHandle: 'writeCom',
	    disconnectDevice: 'disCon',
	    oAuth: 'oAuth',
	    pair: 'pair',
	    pair_input: 'pair_input',
	    unpair: 'unpair'
	};
	
	var methodConfig = {
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
	    getAllServices: {
	        type: 'GET',
	        methodName: methodNames.getAllServices,
	        utl: ''
	    },
	    notify: {
	        type: 'GET/SSE',
	        methodName: methodNames.notify,
	        url: ''
	    },
	    writeByHandle: {
	        type: 'GET',
	        methodName: methodNames.writeByHandle,
	        url: ''
	    },
	    readByHandle: {
	        type: 'GET',
	        methodName: methodNames.readByHandle,
	        url: ''
	    },
	    oAuth: {
	        type: 'POST',
	        methodName: methodNames.oAuth,
	        url: ''
	    },
	    pair: {
	        type: 'POST',
	        methodName: methodNames.pair,
	        url: ''
	    },
	    pair_input: {
	        type: 'POST',
	        methodName: methodNames.pair_input,
	        url: ''
	    },
	    unpair: {
	        type: 'DELETE',
	        methodName: methodNames.unpair,
	        url: ''
	    }
	};
	
	var $showMethods = $('.log .left .order');
	
	function showMethod(method) {
	    console.log("method map:", methodConfig[method]);
	    var _methodName = methodConfig[method].methodName,
	        _type = methodConfig[method].type,
	        _url = methodConfig[method].url,
	        oLi = '<li>\n\t\t\t\t\t<p><span i18n=\'method\'>\u65B9\u6CD5\u540D</span><span i18n=\'' + _methodName + '\'></span><span>' + _type + '</span></p>\n\t\t\t\t\t<p><em>URL:</em>' + _url + '</p>\n\t\t\t    </li>';
	    $showMethods.append(oLi);
	
	    (0, _i18n2.default)(_globalData2.default.lang);
	}
	
	exports.methodConfig = methodConfig;
	exports.showMethod = showMethod;

/***/ }),
/* 49 */
/*!************************!*\
  !*** ./src/js/i18n.js ***!
  \************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _globalData = __webpack_require__(/*! ./globalData */ 50);
	
	var _globalData2 = _interopRequireDefault(_globalData);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var i18n = function i18n(language, cb) {
	    var cn = {
	        'control': '控制',
	        'local': '本地',
	        'remote': '远程',
	        '_lang': 'cn',
	        'lang': 'Language',
	        'title': 'Cassia 蓝牙调试工具',
	        'header': 'Cassia 蓝牙调试工具',
	        'reboot': '重启',
	        'allApi': '总览API',
	        'sm': '扫描',
	        'sb': '设备',
	        'lj': '连接',
	        'unpair': '取消配对',
	        'ylj': '已连接',
	        'fx': '发现',
	        'sb-fw': '设备服务',
	        'fw': ' ',
	        'connDeviceLog': '连接设备',
	        'connedDeviceLog': '已连接设备',
	        'writeComLog': '写入指令',
	        'readComLog': '读取指令',
	        'openHub': '打开Router',
	        'notify': '通知',
	        'connDevice': '连接设备',
	        'connedDevice': '已连接设备',
	
	        'discoverServices': '发现设备服务',
	        'openNotify': '打开router通知',
	        'stateChange': '连接状态变化',
	        'scanDevice': '扫描设备',
	        'writeCom': '写入指令',
	        'readCom': '读取指令',
	
	        'dk': '打开',
	        'router': 'router通知',
	        'tz': ' ',
	        'zt': '状态变化',
	        'bh': ' ',
	        'ljj': '连接',
	        'xr': '写入指令',
	        'zl': ' ',
	        'router-mac': '路由器 Mac',
	        'router-ip': '路由器 Ip',
	        'disCon': '断开连接',
	        'getCond': '已连接',
	        'scanList': '扫描列表',
	        'startScan': '开始扫描',
	        'devcieAndService': '设备及服务列表',
	
	        'co-st': '连接状态',
	        'ch-no': '变化通知',
	        'notifyList': '通知列表',
	
	        'clearList': '清空此列表',
	        'apiSocket': 'API接口',
	        'scanResult': '扫描结果',
	        'pair_input': '写入配对码',
	        'disService': '发现服务',
	        'getMsg': '接收设备信息',
	        'firstCode': '请先进行配对',
	        'deviceConStateChange': '设备连接转态变化',
	        'arguments': '参数',
	        'optional': '(选填)',
	        'required': '(必填)',
	        'description': '描述',
	        'pairInput': '写入配对码',
	        'hubNotifyStatus': 'router通知状态',
	        'method': '方法名',
	        'addMore': '加载更多',
	        'username': '开发者账号:',
	        'password': '密码:',
	        'host': 'AC 地址:',
	        'yes': '是',
	        'input': '输入',
	        'close': '关闭',
	        'pleaseCode': '请输入配对码',
	        'pair': '配对',
	        'cond': '已连接',
	        'num': '数量:',
	        'interfaceURL': '<b>接口URL：</b>调用接口后，此URL会自动生成在下面的”API接口”的窗口中。',
	        'oAouh-Tip-p2': '<b>接口描述：</b>此接口是通过oAuth2.0认证实现云端远程控制。将用户名和密码以base64编码的方式添加在请求参数中，认证成功后获得1小时有效期的access_token,你可以添加参数access_token访问其他API，从而实现远程控制。',
	        'oAouh-Tip-p3': '<b>参数解释：用户名/密码：</b>从Cassia请求的开发者账户和密码(会以base64编码的方式添加在请求中)。',
	        'oAouh-Tip-p4': '<b>AC Address</b>和蓝牙路由器交互的服务器地址。',
	        'connectList-Tip-p2': '<b>接口描述：</b>此接口是GET请求，调用接口后，蓝牙路由器会将目前连接的设备的列表返回到pc端。',
	        'connect-Tip-p1': '<b>chip：</b>蓝牙路由器共有两个芯片，芯片0和芯片1，在调用接口时可以通过添加queryString来选择芯片(?chip=0或者?chip=1)，每个芯片的连接上限是11个设备，如果不填此参数，蓝牙路由器会根据连接数量自动匹配芯片。',
	        'connect-Tip-p2': '<b>deviceMac：</b>要连接的设备的MAC地址。',
	        'pair-Tip-p2': '<b>deviceMac：</b>要配对的设备的MAC地址。',
	        'connect-Tip-p3': '<b>type：</b>此参数在body中，是必填项。蓝牙设备的MAC地址分为random和public两种，所以在连接设备时，需要指出设备的广播type，广播type可以从扫描数据中获取。',
	        'unpair-Tip-p2': '<b>接口描述：</b>此接口是DELETE请求，调用接口后，蓝牙路由器会与指定MAC地址的蓝牙设备取消配对。</p>',
	        'unpair-Tip-p3': '<b>>参数解释：deviceMac：</b>要取消配对的设备的MAC地址。</p>',
	        'disconn-Tip-p2': '<b>接口描述：</b>此接口是DELETE请求，调用接口后，蓝牙路由器会与指定MAC地址的蓝牙设备断连。</p>',
	        'disconn-Tip-p3': '<b>参数解释：deviceMac：</b>要断连的设备的MAC地址。</p>',
	        'services-Tip-p1': '<b>接口描述：</b>此接口是GET请求，调用接口后，蓝牙路由器会向指定的蓝牙设备请求其服务的树形列表，调用次接口的主要目的是为对蓝牙设备进行读写操作时，获取蓝牙设备的characteristic所对应的valueHandle或者handle。',
	        'services-Tip-p2': '<b>参数解释：deviceMac：</b>要请求服务列表的设备的MAC地址。',
	        'notify-Tip-p1': '<b>接口描述：</b>此接口是sse长链接，当打开蓝牙设备的notification/indication后，蓝牙设备会将消息上报到蓝牙路由器，但是如果在pc上希望接收到此消息，还需要调用此接口来建立蓝牙路由器到pc端的数据通路，这样蓝牙路由器才会将收到的蓝牙设备的数据转发到pc端。',
	        'notify-Tip-p2': '<b>SSE：</b>server-sent events，简称：see。是一种http的长链接，请求需要手动关闭，否则理论上在不报错的情况下会一直进行，每条数据会以“data: ” 开头。在调试中可以直接将sse的url输入在浏览器中进行调用。但是在编程中使用一般的http请求无法请求到数据(一般的http请求都是在请求结束后返回所有的数据)，我们目前提供了iOS/java/nodejs/js/c#等的demo来实现sse的调用，如果在这方面遇到困难可以参考。另外，当调用sse时，最好对该长链接进行监控，以便在长链接出现错误或意外停止后进行重启，或者其他操作。',
	        'connState-Tip-p1': '<b>接口描述：</b>此接口是sse长链接，当蓝牙路由器上的蓝牙设备的连接状态发生改变时（连接成功或者发生断连），会通过此接口将消息通知到pc端。',
	        'scan-Tip-p1': '<b>接口描述：</b>此接口是sse长链接调用接口后，蓝牙路由器会扫描周边的设备,并将蓝牙设备的MAC地址(bdaddr)、广播type（bdaddrType）、广播报数据（adData/scanData）、设备名称（name）、信号强度（rssi）等信息以http response的形式返回（原始数据见“http response”窗口。',
	        'scan-Tip-p2': '<b> 参数解释：chip：</b>蓝牙路由器共有两个芯片，芯片0和芯片1，在调用接口时可以通过添加queryString来选择芯片(?chip=0或者?chip=1)，如果不填,会默认用芯片0扫描，芯片0扫描距离会优于芯片1，也建议一般情况下使用芯片0扫描。',
	        'write-Tip-p1': '<b>接口描述：</b>本接口是负责与设备通讯的主要接口，具体负责向蓝牙设备写入指令以及打开蓝牙设备的notification/indication，下面会具体讲解两个功能分别如何实现。',
	        'write-Tip-p2': '<b>1、对蓝牙设备写入指令：</b>当需要往蓝牙设备指定的characteristic写入指令时，先调用“发现服务”的接口，当返回蓝牙设备服务信息的树形列表后，寻找指定的characteristic所对应的valueHandle（characteristic内包含handle、valueHandle、properties、descriptors等属性），然后调用此接口时，handle对应的值是characteristic的valueHandle，value对应的值是需要写入的指令内容（将指令的每个byte顺序拼在一起写成一个字符串）。',
	        'write-Tip-p3': '<b>2、打开蓝牙设备的notification/indication：</b>当需要接收蓝牙设备发来的数据时，需要先打开蓝牙设备的notification或者indication（打开的过程在本质上也是对蓝牙设备下发的一个指令），当需要打开指定characteristic的notification或者indication时，也是先调用“发现服务”的方法，找到指定的characteristic所对应的descriptors，打开descriptors，找到uuid包含“00002902”所对应的handle，然后调用此接口，接口中的handle就是上面descriptor的handle，如果是打开notification，value对应的是“0100”，如果是打开indication，value对应的是“0200”，如果是关闭notification/indication，value对应的是“0000”。',
	        'write-Tip-p4': '<b>参数解释： deviceMac：</b>要写入指令的设备的MAC地址。',
	        'write-Tip-p5': '<b>handle：</b>通过“发现服务接口”所找到的characteristic所对应的valueHandle或者handle。',
	        'write-Tip-p6': '<b>value：</b>要写入的指令的值，或者“0100”（打开notification）、“0200”（打开indication）、“0000”（关闭notification和indication）。',
	        'write-Tip-p7': ' <b>handle & value输入格式</b>',
	        'write-Tip-p8': '单条指令格式 handle:value1,type',
	        'write-Tip-p9': 'handle为要写入的handle如20',
	        'write-Tip-p10': 'value1 为要写入的值（十六进制）',
	        'write-Tip-p11': 'type为写入类型，0代表write without response，1代表write with response',
	        'write-Tip-p12': '多条语句之间用回车键换行'
	    },
	        en = {
	        'control': 'Control',
	        'local': 'Local',
	        'remote': 'Remote',
	        '_lang': 'en',
	        'lang': '语言',
	        'title': 'Cassia Bluetooth Debug Tool',
	        'header': 'Cassia Bluetooth Debug  Tool',
	        'reboot': 'Reboot',
	        'allApi': 'API Info',
	        'firstCode': 'Please pair first',
	        'sm': 'Scan',
	        'sb': 'Device',
	        'lj': 'Connect',
	        'unpair': 'Unpair',
	        'pairInput': 'Pair Input',
	        'pair': 'Pair',
	        'Pair': 'Pair',
	        'Unpair': 'Unpair',
	        'Seri': 'Serivices',
	        'Disc': 'Disconnect',
	        'pair_input': 'Pair_input',
	        'ylj': 'Connected',
	        'fx': 'Discover',
	        'fw': 'Services',
	        'sb-fw': 'Device',
	        'connDeviceLog': 'Connect Device',
	        'connedDeviceLog': 'Connected Devices',
	        'writeComLog': 'Write Instruction',
	        'readComLog': 'Read Instruction',
	        'router-mac': 'Router MAC',
	        'router-ip': 'Router Ip',
	        'openHub': 'Open Router',
	        'notify': 'Notification',
	        'connDevice': 'Connect Device',
	        'connedDevice': 'Connected Devices',
	
	        'scanDevice': 'Scan\rDevice',
	        'openNotify': 'Open Router Notify',
	        'stateChange': 'Connection State Changes',
	        'writeCom': 'Write Instruction',
	        'readCom': 'Read Instruction',
	
	        'discoverServices': 'Discover Device Services',
	        'dk': 'Open',
	        'router': 'Router',
	        'tz': 'Notify',
	        'xr': 'Write',
	        'zl': 'Instruction',
	        'ljj': 'Connection',
	        'zt': 'State',
	        'bh': 'Changes',
	        'getCond': 'Connected',
	        'disCon': 'Disconnect',
	        'scanList': 'Scan List',
	        'startScan': 'Start Scan',
	        'devcieAndService': 'Device and Services List',
	
	        'co-st': 'Connection State',
	        'ch-no': 'Notification',
	        'notifyList': 'Notify List',
	
	        'clearList': 'Clear List',
	        'apiSocket': 'Api Interfaces',
	        'scanResult': 'Scan Results',
	        'disService': 'Discover Services',
	        'getMsg': 'Devices\'s Messages',
	        'deviceConStateChange': 'State Changes',
	        'arguments': 'Parameter',
	        'optional': '(optional)',
	        'required': '(Required)',
	        'description': 'Description',
	        'hubNotifyStatus': 'router Notify Status',
	        'method': 'Method',
	        'addMore': 'Add More',
	        'username': 'Developer Key:',
	        'password': 'Developer Secret:',
	        'pleaseCode': 'Please enter the pair code',
	        'host': 'AC Server Address:',
	        'yes': 'yes',
	        'input': 'import',
	        'close': 'close',
	        'cond': 'Connected',
	        'num': 'Number:',
	        'interfaceURL': '<b>Interface URL:</b>calling the interface, this URL is suyomatically generated in the window below "API Interface".',
	        'oAouh-Tip-p2': '<b>Interface Description:</b>This interface is achieved through oAuth2.0 cloud remote control. The developer key and developer secret to base64 encoding added in the request parameters, access to 1hour after the successful authentication access_token, you can add parameters access_token access other API, in order to achieve remote control.',
	        'oAouh-Tip-p3': '<b>Parameter Explanation:Developer Key / Developer Secret:</b>Developer credential requested from Cassia (will be added as a base64 encoding in the request).',
	        'oAouh-Tip-p4': '<b>AC Address: </b>The address of the AC Server that interacts with the Bluetooth router.',
	        'connectList-Tip-p2': '<b>Interface Description:</b>This interface is a GET request. After calling the interface, the Bluetooth router will return the list of currently connected devices to the PC side.',
	        'connect-Tip-p1': '<b>chip：</b>There are two chips in the Bluetooth router, the chip 0 and the chip 1, when calling the interface, you can select the chip (? chip = 0 or? chip = 1) by adding queryString and the connection ceiling of each chip is 20 devices for E1000 router. Without this parameter, the Bluetooth router automatically matches the chip according to the number of connections.',
	        'connect-Tip-p2': '<b>deviceMac：</b>MAC address of the device to connect to.',
	        'pair-Tip-p2': '<b>deviceMac：</b>MAC address of the device to pair to.',
	        'connect-Tip-p3': '<b>type\uFF1A</b>This parameter is required in the body. The MAC addresses of Bluetooth devices are divided into random and public, so when connecting devices, you need to indicate the device\'s broadcast type, it can be obtained from the scan data.',
	        'disconn-Tip-p2': '<b>Interface Description:</b>After calling the interface, the Bluetooth router will be disconnected from the Bluetooth device with the specified MAC address.</p>',
	        'disconn-Tip-p3': '<b>Parameter Explanation: deviceMac:</b> MAC address of the device to be disconnected. </p>',
	        'unpair-Tip-p2': '<b>Interface Description:</b>After calling the interface, the Bluetooth router will be unpaired from the Bluetooth device with the specified MAC address.</p>',
	        'unpair-Tip-p3': '<b>Parameter Explanation: deviceMac:</b> MAC address of the device to be unpaired. </p>',
	        'services-Tip-p1': '<b>Interface Description: </b>This interface is a GET request. After the interface is called, the Bluetooth router will request the specified Bluetooth device for the tree list of its service. The main purpose of calling the secondary interface is to obtain the Bluetooth device\'s read / value corresponding to the valueHandle or handle.',
	        'services-Tip-p2': '<b>Parameter Explanation: deviceMac:</b>MAC address of the device on which the service list is to be requested.',
	        'notify-Tip-p1': '<b>Interface Description: </b>This interface is sse long link, when you open the notification / indication Bluetooth device, the Bluetooth device will report the message to the Bluetooth router, but if you want to receive this message on the pc, you also need to call this interface to establish a Bluetooth router Data path to the pc end, so that the Bluetooth router will receive the data of the Bluetooth device is forwarded to the pc side.',
	        'notify-Tip-p2': '<b>SSE：</b>server-sent events，Short: see Is a long link http, the request needs to be manually shut down, or in theory, no error will continue, each data will be "data:" at the beginning. Debugging can be directly input sse url in the browser to call. But in the process of using ordinary HTTP requests can not request data (the general http request is returned after the request all the data), we currently provide a demo of iOS / java / nodejs / js / c # to achieve sse Call, if you encounter difficulties in this regard can refer to. In addition, when calling sse, it is best to monitor the long link in order to restart the long link after an error or unexpected stop, or other operation.',
	        'connState-Tip-p1': '<b>Interface Description:</b>This interface is sse long link, when the Bluetooth router on the Bluetooth device connection status changes (connection is successful or disconnected), will be notified through this interface to the pc side of the message.',
	        'scan-Tip-p1': '<b>Interface Description:</b>This interface is the sse long-link call interface, Bluetooth router will scan the surrounding devices, and the Bluetooth device\'s MAC address (bdaddr), broadcast type (bdaddrType) broadcast data (adData / scanData), device name name), signal strength (rssi) and other information in the form of http response (the original data, see "http response" window.',
	        'scan-Tip-p2': '<b>Parameters: chip: </b>Bluetooth router has two chips, chip 0 and chip 1, when calling the interface can be added by adding queryString chip (? Chip = 0 or chip = 1), if you do not fill, the default chip 0 Scan, chip 0 scanning distance will be better than chip 1, it is recommended to use chip 0 scan under normal circumstances.',
	        'write-Tip-p1': '<b>Interface Description:</b>This interface is responsible for communicating with the main interface of the device. It is responsible for writing instructions to the Bluetooth device and opening the notification / indication of the Bluetooth device. The following describes how to implement the two functions.',
	        'write-Tip-p2': '<b>1、Write command to bluetooth device:</b>When it needs to write the command to the Bluetooth device in the specified characteristic, it first calls the interface of "find service", after returning to the tree list of the bluetooth device service information, look for the corresponding characteristic valueHandle (property contains handle, valueHandle, properties, descriptors and other attributes), and then call this interface, the handle corresponding value is characteristic valueHandle value corresponding value is the need to write the contents of the instruction Spell together written as a string).',
	        'write-Tip-p3': '<b>2、open the Bluetooth device notification / indication: </b>When you need to receive the data sent by the Bluetooth device, you need to open the notification or indication of the Bluetooth device (the opening process is essentially an instruction issued by the Bluetooth device), when needed Open the notification or indication of the specified characteristic, it is also called the "discovery service" method to find the descriptors corresponding to the specified characteristic, open the descriptors, find uuid contains "00002902" corresponding to the handle, and then call this interface, the interface The handle is the handle of the above descriptor. If it is open, the value corresponds to "0100". If the indication is on, the value corresponds to "0200". If the notification / indication is off, the value corresponds to "0000".',
	        'write-Tip-p4': '<b><b>Parameter Explanation: deviceMac:</b>MAC address of the device to write the instruction.',
	        'write-Tip-p5': '<b>handle：</b>The valueHandle or handle corresponding to the characteristic found through the Discovery Service Interface.',
	        'write-Tip-p6': '<b>value：</b>The value of the command to be written, or "0100" (open notification), "0200" (open indication), "0000" (close notification and indication).',
	        'write-Tip-p7': ' <b>handle & value Input format</b>',
	        'write-Tip-p8': 'Single instruction format handle: value1, type',
	        'write-Tip-p9': 'handle to write the handle as 20',
	        'write-Tip-p10': 'value1 is the value to be written (hex)',
	        'write-Tip-p11': 'type is write type, 0 means write without response, and 1 means write with response',
	        'write-Tip-p12': 'Use a carriage-return between the multiple statements'
	    },
	        lang = {},
	        i18n = function i18n(k) {
	        return lang[k] || null;
	    },
	        auto = function auto() {
	        var bl = (navigator.language || navigator.browserLanguage).toLowerCase();
	        bl.match('cn') ? lang = cn : lang = en;
	    };
	
	    if (typeof language === 'undefined') {
	        try {
	            var s = JSON.parse(localStorage.getItem('settings'));
	            if (!s.language || s.language === 0) {
	                auto();
	            } else {
	                s.language === 'cn' ? lang = cn : lang = en;
	            }
	        } catch (e) {
	            auto();
	        }
	    } else if (language === 'cn') {
	        lang = cn;
	    } else {
	        lang = en;
	    }
	
	    i18n.render = function () {
	        _globalData2.default.lang = lang._lang;
	        console.warn(_globalData2.default.lang);
	
	        $('#lang option').removeAttr('checked');
	        $('#lang').val(_globalData2.default.lang);
	
	        setTimeout(function () {
	            var a = document.getElementsByTagName('*'),
	                t,
	                s;
	            for (var i in a) {
	                t = a[i];
	                if (t && t.getAttribute) {
	                    s = t.getAttribute('i18n');
	
	                    if (s && i18n(s) && t.getAttribute('i18n-loaded') !== _globalData2.default.lang) {
	                        t.innerHTML = i18n(s);
	                        t.setAttribute('i18n-loaded', _globalData2.default.lang);
	                    }
	                }
	            }
	            cb && cb();
	        }, 25);
	    };
	    i18n.render();
	    return i18n;
	};
	
	exports.default = i18n;

/***/ }),
/* 50 */
/*!******************************!*\
  !*** ./src/js/globalData.js ***!
  \******************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _defineProperties = __webpack_require__(/*! babel-runtime/core-js/object/define-properties */ 51);
	
	var _defineProperties2 = _interopRequireDefault(_defineProperties);
	
	var _localStorage = __webpack_require__(/*! ./localStorage */ 55);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var firstFlag = true,
	    saved = void 0;
	var localStorageKey = 'cassiaSDKTool',
	    neverSave = {
		notifySSE: {
			status: 'closed',
			es: ''
		},
		stateSSE: {
			status: 'closed',
			es: ''
		},
		scanSSE: {
			status: 'closed',
			es: '',
			timeOut: 5
		},
		scanData: [],
		length: null
	},
	    savedInit = {
		_deviceMac: '',
		_hubMac: '',
		_hubIp: '',
		_chip: '0',
		_commond: '',
		_oAuth_dev: '',
		_secret: '',
		_acaddress: ''
	};
	(0, _defineProperties2.default)(savedInit, {
		deviceMac: {
			get: function get() {
				return this._deviceMac;
			},
			set: function set(newValue) {
				this._deviceMac = newValue;
				(0, _localStorage.storage)(localStorageKey, this);
			}
		},
		hubMac: {
			get: function get() {
				return this._hubMac;
			},
			set: function set(newValue) {
				this._hubMac = newValue;
				(0, _localStorage.storage)(localStorageKey, this);
			}
		},
		hubIp: {
			get: function get() {
				return this._hubIp;
			},
			set: function set(newValue) {
				this._hubIp = newValue;
				(0, _localStorage.storage)(localStorageKey, this);
			}
		},
		chip: {
			get: function get() {
				return this._chip;
			},
			set: function set(newValue) {
				this._chip = newValue;
				(0, _localStorage.storage)(localStorageKey, this);
			}
		},
		commond: {
			get: function get() {
				return this._commond;
			},
			set: function set(newValue) {
				this._commond = newValue;
				(0, _localStorage.storage)(localStorageKey, this);
			}
		},
		oAuth_dev: {
			get: function get() {
				return this._oAuth_dev;
			},
			set: function set(newValue) {
				this._oAuth_dev = newValue;
				(0, _localStorage.storage)(localStorageKey, this);
			}
		},
		secret: {
			get: function get() {
				return this._secret;
			},
			set: function set(newValue) {
				this._secret = newValue;
				(0, _localStorage.storage)(localStorageKey, this);
			}
		},
		acaddress: {
			get: function get() {
				return this._acaddress;
			},
			set: function set(newValue) {
				this._acaddress = newValue;
				(0, _localStorage.storage)(localStorageKey, this);
			}
		}
	});
	
	if (firstFlag) {
		firstFlag = false;
		saved = (0, _localStorage.readStorage)(localStorageKey, savedInit);
	}
	
	var globalData = {
		neverSave: neverSave,
		saved: saved
	
	};
	
	exports.default = globalData;

/***/ }),
/* 51 */
/*!*************************************************************!*\
  !*** ./~/babel-runtime/core-js/object/define-properties.js ***!
  \*************************************************************/
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/define-properties */ 52), __esModule: true };

/***/ }),
/* 52 */
/*!**********************************************************!*\
  !*** ./~/core-js/library/fn/object/define-properties.js ***!
  \**********************************************************/
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(/*! ../../modules/es6.object.define-properties */ 53);
	var $Object = __webpack_require__(/*! ../../modules/_core */ 9).Object;
	module.exports = function defineProperties(T, D) {
	  return $Object.defineProperties(T, D);
	};


/***/ }),
/* 53 */
/*!*******************************************************************!*\
  !*** ./~/core-js/library/modules/es6.object.define-properties.js ***!
  \*******************************************************************/
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(/*! ./_export */ 14);
	// 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
	$export($export.S + $export.F * !__webpack_require__(/*! ./_descriptors */ 23), 'Object', { defineProperties: __webpack_require__(/*! ./_object-dps */ 54) });


/***/ }),
/* 54 */
/*!**************************************************!*\
  !*** ./~/core-js/library/modules/_object-dps.js ***!
  \**************************************************/
/***/ (function(module, exports, __webpack_require__) {

	var dP = __webpack_require__(/*! ./_object-dp */ 19);
	var anObject = __webpack_require__(/*! ./_an-object */ 20);
	var getKeys = __webpack_require__(/*! ./_object-keys */ 30);
	
	module.exports = __webpack_require__(/*! ./_descriptors */ 23) ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject(O);
	  var keys = getKeys(Properties);
	  var length = keys.length;
	  var i = 0;
	  var P;
	  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};


/***/ }),
/* 55 */
/*!********************************!*\
  !*** ./src/js/localStorage.js ***!
  \********************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.readStorage = exports.storage = undefined;
	
	var _assign = __webpack_require__(/*! babel-runtime/core-js/object/assign */ 11);
	
	var _assign2 = _interopRequireDefault(_assign);
	
	var _stringify = __webpack_require__(/*! babel-runtime/core-js/json/stringify */ 7);
	
	var _stringify2 = _interopRequireDefault(_stringify);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function getType(data) {
		return Object.prototype.toString.call(data).match(/^\[object\s(.*)\]$/)[1];
	}
	
	function verifylocalStorageData(localData, expectationData, exclude) {
		var result = true;
	
		function fn(localData, expectationData, exclude) {
			var type = getType(expectationData),
			    type2 = getType(localData);
			if (type === 'Object' || type === 'Array') {
				if (type === type2) {
					for (var key in expectationData) {
						if (exclude && exclude.indexOf(key) > -1) continue;
						if (localData.hasOwnProperty(key)) {
							if (getType(expectationData[key]) === getType(localData[key])) {
								fn(localData[key], expectationData[key]);
							} else result = false;
						} else result = false;
					}
				} else result = false;
			} else {}
		}
		fn(localData, expectationData, exclude);
		return result;
	}
	
	function storage(key, data) {
	
		if (!window.localStorage) return;
		var storage = window.localStorage;
		storage.setItem(key, (0, _stringify2.default)(data));
	}
	
	function readStorage(key, expectationData) {
		if (!window.localStorage) return expectationData;
		var storage = window.localStorage;
		var localData = JSON.parse(storage.getItem(key));
		console.log(storage, localData);
	
	
		return (0, _assign2.default)(expectationData, localData);
	}
	
	exports.storage = storage;
	exports.readStorage = readStorage;

/***/ }),
/* 56 */
/*!*****************************!*\
  !*** ./src/js/urlconfig.js ***!
  \*****************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.updateUrlArr = exports.data = exports.urlArr = undefined;
	
	var _globalData = __webpack_require__(/*! ./globalData */ 50);
	
	var _globalData2 = _interopRequireDefault(_globalData);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var $hubIp = $('#hubIp');
	var $hubMac = $('#hubMac');
	var data = {},
	    urlArr = {};
	
	data.hubIp = $hubIp.val().trim();
	data.hubMac = $hubMac.val();
	data.perMac = '*deviceMac*';
	data.handle = '*handle*';
	data.writeValue = '*writeValue*';
	data.access_token = '';
	
	function updateUrlArr(hubIp) {
	    urlArr.scan = 'http://' + hubIp + '/gap/nodes/?mac=' + data.hubMac + '&access_token=' + data.access_token + '&active=1';
	    urlArr.connectDevice = 'http://' + hubIp + '/gap/nodes/' + data.perMac + '/connection/?mac=' + data.hubMac + '&access_token=' + data.access_token;
	    urlArr.disconnectDevice = 'http://' + hubIp + '/gap/nodes/' + data.perMac + '/connection?mac=' + data.hubMac + '&access_token=' + data.access_token;
	    urlArr.getConnectedDeviceList = 'http://' + hubIp + '/gap/nodes/?connection_state=connected&mac=' + data.hubMac + '&access_token=' + data.access_token;
	    urlArr.getConnectState = 'http://' + hubIp + '/management/nodes/connection-state?mac=' + data.hubMac + '&access_token=' + data.access_token;
	    urlArr.getAllServices = 'http://' + hubIp + '/gatt/nodes/' + data.perMac + '/services/characteristics/descriptors?mac=' + data.hubMac + '&access_token=' + data.access_token;
	    urlArr.readByHandle = 'http://' + hubIp + '/gatt/nodes/' + data.perMac + '/handle/' + data.handle + '/value/?mac=' + data.hubMac + '&access_token=' + data.access_token;
	    urlArr.notifyMsg = 'http://' + hubIp + '/gatt/nodes/?mac=' + data.hubMac + '&event=1&access_token=' + data.access_token;
	    urlArr.writeByHandle = 'http://' + hubIp + '/gatt/nodes/' + data.perMac + '/handle/' + data.handle + '/value/' + data.writeValue + '/?mac=' + data.hubMac + '&access_token=' + data.access_token;
	    urlArr.reboot = 'http://' + hubIp + '/cassia/reboot/?mac=' + data.hubMac + '&access_token=' + data.access_token;
	    urlArr.pair_input = 'http://' + hubIp + '/management/nodes/' + data.perMac + '/pair-input?&access_token=' + data.access_token;
	    urlArr.unpair = 'http://' + hubIp + '/management/nodes/' + data.perMac + '/bond?&access_token=' + data.access_token;
	    urlArr.pair = 'http://' + hubIp + '/management/nodes/' + data.perMac + '/pair?&access_token=' + data.access_token;
	}
	updateUrlArr(data.hubIp);
	
	$hubIp.on('blur', function () {
	    data.hubIp = this.value.trim();
	    updateUrlArr(data.hubIp);
	    _globalData2.default.saved.hubIp = data.hubIp;
	});
	$('#hubMac').on('blur', function () {
	    data.hubMac = this.value.trim();
	    updateUrlArr(data.hubIp);
	    _globalData2.default.saved.hubMac = data.hubMac;
	});
	
	exports.urlArr = urlArr;
	exports.data = data;
	exports.updateUrlArr = updateUrlArr;

/***/ }),
/* 57 */
/*!***************************!*\
  !*** ./src/js/showlog.js ***!
  \***************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.showLog = undefined;
	
	var _assign = __webpack_require__(/*! babel-runtime/core-js/object/assign */ 11);
	
	var _assign2 = _interopRequireDefault(_assign);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function showLog(parent, data) {
		var _data = (0, _assign2.default)({
			before: '',
			message: '',
			after: '',
			class: ''
		}, data);
		console.log(_data);
	
		var temp = '<li><pre class=\'' + _data.class + '\'>' + _data.before + _data.message + _data.after + '</pre></li>';
	
		parent.append(temp);
	}
	
	exports.showLog = showLog;

/***/ }),
/* 58 */
/*!*******************************************!*\
  !*** ./src/js/disConnectDeviceAndFill.js ***!
  \*******************************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _stringify = __webpack_require__(/*! babel-runtime/core-js/json/stringify */ 7);
	
	var _stringify2 = _interopRequireDefault(_stringify);
	
	var _api = __webpack_require__(/*! ./api */ 10);
	
	var _urlconfig = __webpack_require__(/*! ./urlconfig */ 56);
	
	var _showmethod = __webpack_require__(/*! ./showmethod */ 48);
	
	var _showlog = __webpack_require__(/*! ./showlog */ 57);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function disConnectDeviceAndFill(deviceMac) {
		var url = _urlconfig.urlArr.connectDevice.replace("*deviceMac*", deviceMac),
		    parent = $('#disconnectLog ul');
		var ajaxResult = _api.api.disconnectDevice(url);
		(0, _showmethod.showMethod)('disconnectDevice');
		ajaxResult.done(function (e) {
			(0, _showlog.showLog)(parent, {
				before: 'mac:&nbsp;&nbsp;' + deviceMac + ' disconnect',
				message: (0, _stringify2.default)(e, null, 2),
				class: 'success'
			});
			$('.l3 ul li[data-mac=\'' + deviceMac + '\']').slideUp('normal', function () {
				this.remove();
			});
		}).fail(function (e) {
			(0, _showlog.showLog)(parent, {
				before: 'mac:&nbsp;&nbsp;' + deviceMac + ' disconnect',
				message: (0, _stringify2.default)(e, null, 2),
				class: 'fail'
			});
		});
	}
	
	exports.default = disConnectDeviceAndFill;

/***/ }),
/* 59 */
/*!***************************************!*\
  !*** ./src/js/unpairDeviceAndFill.js ***!
  \***************************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _stringify = __webpack_require__(/*! babel-runtime/core-js/json/stringify */ 7);
	
	var _stringify2 = _interopRequireDefault(_stringify);
	
	var _api = __webpack_require__(/*! ./api */ 10);
	
	var _urlconfig = __webpack_require__(/*! ./urlconfig */ 56);
	
	var _showmethod = __webpack_require__(/*! ./showmethod */ 48);
	
	var _showlog = __webpack_require__(/*! ./showlog */ 57);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function unpairDeviceAndFill(deviceMac) {
		var url = _urlconfig.urlArr.unpair.replace("*deviceMac*", deviceMac),
		    parent = $('#unpairLog ul');
		var ajaxResult = _api.api.unpair(url);
		(0, _showmethod.showMethod)('unpair');
		ajaxResult.done(function (e) {
			console.log(parent, 'mac:&nbsp;&nbsp;' + deviceMac + ' unpair');
			(0, _showlog.showLog)(parent, {
				before: 'mac:&nbsp;&nbsp;' + deviceMac + ' unpair',
				message: (0, _stringify2.default)(e, null, 2),
				class: 'success'
			});
			$('.l3 ul li[data-mac=\'' + deviceMac + '\']').slideUp('normal', function () {
				this.remove();
			});
		}).fail(function (e) {
			(0, _showlog.showLog)(parent, {
				before: 'mac:&nbsp;&nbsp;' + deviceMac + ' unpair',
				message: (0, _stringify2.default)(e, null, 2),
				class: 'fail'
			});
		});
	}
	
	exports.default = unpairDeviceAndFill;

/***/ }),
/* 60 */
/*!*************************************!*\
  !*** ./src/js/pairDeviceAndFill.js ***!
  \*************************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _stringify = __webpack_require__(/*! babel-runtime/core-js/json/stringify */ 7);
	
	var _stringify2 = _interopRequireDefault(_stringify);
	
	var _api = __webpack_require__(/*! ./api */ 10);
	
	var _urlconfig = __webpack_require__(/*! ./urlconfig */ 56);
	
	var _showmethod = __webpack_require__(/*! ./showmethod */ 48);
	
	var _showlog = __webpack_require__(/*! ./showlog */ 57);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function pairDeviceAndFill(deviceMac) {
		var url = _urlconfig.urlArr.pair.replace("*deviceMac*", deviceMac),
		    parent = $('#pairLog ul');
		var ajaxResult = _api.api.pair(url);
		(0, _showmethod.showMethod)('pair');
		ajaxResult.done(function (e) {
			(0, _showlog.showLog)(parent, {
				before: 'mac:&nbsp;&nbsp;' + deviceMac + ' pair',
				message: (0, _stringify2.default)(e, null, 2),
				class: 'success'
			});
			$('.l3 ul li[data-mac=\'' + deviceMac + '\']').slideUp('normal', function () {
				this.remove();
			});
		}).fail(function (e) {
			(0, _showlog.showLog)(parent, {
				before: 'mac:&nbsp;&nbsp;' + deviceMac + ' pair',
				message: (0, _stringify2.default)(e, null, 2),
				class: 'fail'
			});
		});
	}
	
	exports.default = pairDeviceAndFill;

/***/ }),
/* 61 */
/*!************************!*\
  !*** ./src/js/pair.js ***!
  \************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _stringify = __webpack_require__(/*! babel-runtime/core-js/json/stringify */ 7);
	
	var _stringify2 = _interopRequireDefault(_stringify);
	
	var _api = __webpack_require__(/*! ./api */ 10);
	
	var _urlconfig = __webpack_require__(/*! ./urlconfig */ 56);
	
	var _pairInput = __webpack_require__(/*! ./pair-input */ 62);
	
	var _pairInput2 = _interopRequireDefault(_pairInput);
	
	var _showmethod = __webpack_require__(/*! ./showmethod */ 48);
	
	var _showlog = __webpack_require__(/*! ./showlog */ 57);
	
	var _mainHandle = __webpack_require__(/*! ./mainHandle */ 5);
	
	var mainHandle = _interopRequireWildcard(_mainHandle);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var temp = '<form class="layui-form  getpair-tip tip" action="#">\n\t<div class="layui-form-item">\n\t  <label class="layui-form-label">getpair a device\uFF1AGET</label>\n\t</div>\n\t<fieldset class="layui-elem-field layui-field-title">\n\t  <legend  i18n=\'arguments\'>\u53C2\u6570</legend>\n\t</fieldset>\n\t\n\t<div class="layui-form-item">\n\t  <label class="layui-form-label">pair code:</label>\n\t  <div class="layui-input-inline">\n\t\t<input type="text" name="pair code"  placeholder="CC:1B:E0:E0:10:C1" value="" lay-verify=\'deviceMac\'  class="layui-input">\n\t  </div>\n\t  <div class="layui-form-mid layui-word-aux" i18n = \'required\'>(\u5FC5\u586B)</div>\n\t</div>\n\t\n\t\n\t<fieldset class="layui-elem-field layui-field-title">\n\t  <legend i18n = \'description\'>\u63CF\u8FF0</legend>\n\t</fieldset>\n\t<div class="layui-form-item layui-form-text">\n\t  <div class="descriptors getpair-des">\n\t\t<p i18n="getpair-Tip-p1"><b>chip\uFF1A</b>\u84DD\u7259\u8DEF\u7531\u5668\u5171\u6709\u4E24\u4E2A\u82AF\u7247\uFF0C\u82AF\u72470\u548C\u82AF\u72471\uFF0C\u5728\u8C03\u7528\u63A5\u53E3\u65F6\u53EF\u4EE5\u901A\u8FC7\u6DFB\u52A0queryString\u6765\u9009\u62E9\u82AF\u7247(?chip=0\u6216\u8005?chip=1)\uFF0C\u6BCF\u4E2A\u82AF\u7247\u7684\u8FDE\u63A5\u4E0A\u9650\u662F11\u4E2A\u8BBE\u5907\uFF0C\u5982\u679C\u4E0D\u586B\u6B64\u53C2\u6570\uFF0C\u84DD\u7259\u8DEF\u7531\u5668\u4F1A\u6839\u636E\u8FDE\u63A5\u6570\u91CF\u81EA\u52A8\u5339\u914D\u82AF\u7247\u3002</p>\n\t\t<p i18n="getpair-Tip-p2"><b>deviceMac\uFF1A</b>\u8981\u8FDE\u63A5\u7684\u8BBE\u5907\u7684MAC\u5730\u5740\u3002</p>\n\t\t<p i18n="getpair-Tip-p3"><b>type\uFF1A</b>\u6B64\u53C2\u6570\u5728body\u4E2D\uFF0C\u662F\u5FC5\u586B\u9879\u3002\u84DD\u7259\u8BBE\u5907\u7684MAC\u5730\u5740\u5206\u4E3Arandom\u548Cpublic\u4E24\u79CD\uFF0C\u6240\u4EE5\u5728\u8FDE\u63A5\u8BBE\u5907\u65F6\uFF0C\u9700\u8981\u6307\u51FA\u8BBE\u5907\u7684\u5E7F\u64ADtype\uFF0C\u5E7F\u64ADtype\u53EF\u4EE5\u4ECE\u626B\u63CF\u6570\u636E\u4E2D\u83B7\u53D6\u3002</p>\n\t  </div>\n\t</div>\n\t<div class="layui-form-item">\n\t  <div class="layui-input-block">\n\t\t<button class="layui-btn" lay-submit lay-filter="getpair">do</button>\n\t  </div>\n\t</div>\n  </form>';
	
	function gopair(deviceMac, etarget) {
	
		var url = _urlconfig.urlArr.pair.replace("*deviceMac*", deviceMac),
		    parent = $('#pairLog ul');
		var ajaxResult = _api.api.pair(url);
		(0, _showmethod.showMethod)('pair');
		ajaxResult.done(function (e) {
			if (e.pairingStatus === "Passkey Input Expected") {
				$('.pairCode').show();
				$('.sub').unbind('click').bind('click', function () {
					var x = $('.Code').val();
					$('.pairCode').hide();
					mainHandle.linkage(10);
					(0, _pairInput2.default)(deviceMac, x);
				});
				$('.close').unbind('click').bind('click', function () {
					$('.pairCode').hide();
				});
				(0, _showlog.showLog)(parent, {
					before: 'mac:&nbsp;&nbsp;' + deviceMac + ' pair',
					message: (0, _stringify2.default)(e, null, 2),
					class: 'success'
				});
				$('.l3 ul li[data-mac=\'' + deviceMac + '\']').slideUp('normal', function () {
					this.remove();
				});
			} else if (e.pairingStatus === 'Pairing Successful') {
				alert("已经配对");
				(0, _showlog.showLog)(parent, {
					before: 'mac:&nbsp;&nbsp;' + deviceMac + ' pair',
					message: (0, _stringify2.default)(e, null, 2),
					class: 'success'
				});
				$('.l3 ul li[data-mac=\'' + deviceMac + '\']').slideUp('normal', function () {
					this.remove();
				});
			} else {
				alert('此设备不支持配对');
			}
		}).fail(function (e) {
			(0, _showlog.showLog)(parent, {
				before: 'mac:&nbsp;&nbsp;' + deviceMac + ' pair',
				message: (0, _stringify2.default)(e, null, 2),
				class: 'fail'
			});
			console.log(e);
		});
	}
	
	exports.default = gopair;

/***/ }),
/* 62 */
/*!******************************!*\
  !*** ./src/js/pair-input.js ***!
  \******************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _stringify = __webpack_require__(/*! babel-runtime/core-js/json/stringify */ 7);
	
	var _stringify2 = _interopRequireDefault(_stringify);
	
	var _api = __webpack_require__(/*! ./api */ 10);
	
	var _urlconfig = __webpack_require__(/*! ./urlconfig */ 56);
	
	var _showmethod = __webpack_require__(/*! ./showmethod */ 48);
	
	var _showlog = __webpack_require__(/*! ./showlog */ 57);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function pair_input(deviceMac, x) {
		var url = _urlconfig.urlArr.pair_input.replace("*deviceMac*", deviceMac),
		    parent = $('#pairInputLog ul');
	
		var ajaxResult = _api.api.pairInput(url, x);
		(0, _showmethod.showMethod)('pair_input');
		ajaxResult.done(function (e) {
			(0, _showlog.showLog)(parent, {
				before: 'mac:&nbsp;&nbsp;' + deviceMac + ' pair-input',
				message: (0, _stringify2.default)(e, null, 2),
				class: 'success'
			});
			$('.l3 ul li[data-mac=\'' + deviceMac + '\']').slideUp('normal', function () {
				this.remove();
			});
			console.log("写入配对码成功", x);
		}).fail(function (e) {
			(0, _showlog.showLog)(parent, {
				before: 'mac:&nbsp;&nbsp;' + deviceMac + ' pair-input',
				message: (0, _stringify2.default)(e, null, 2),
				class: 'fail'
			});
			$('.l3 ul li[data-mac=\'' + deviceMac + '\']').slideUp('normal', function () {
				this.remove();
			});
			console.log(e);
		});
	}
	
	exports.default = pair_input;

/***/ }),
/* 63 */
/*!**************************!*\
  !*** ./src/js/unpair.js ***!
  \**************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _stringify = __webpack_require__(/*! babel-runtime/core-js/json/stringify */ 7);
	
	var _stringify2 = _interopRequireDefault(_stringify);
	
	var _api = __webpack_require__(/*! ./api */ 10);
	
	var _urlconfig = __webpack_require__(/*! ./urlconfig */ 56);
	
	var _showmethod = __webpack_require__(/*! ./showmethod */ 48);
	
	var _showlog = __webpack_require__(/*! ./showlog */ 57);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function unpair(deviceMac) {
		var url = _urlconfig.urlArr.unpair.replace("*deviceMac*", deviceMac),
		    $parent = $('#unpairLog ul');
		var ajaxResult = _api.api.unpair(url);
		(0, _showmethod.showMethod)('unpair');
		ajaxResult.done(function (e) {
			(0, _showlog.showLog)($parent, {
				before: 'mac:' + deviceMac + '&nbsp;&nbsp;',
				message: (0, _stringify2.default)(e),
				class: 'success'
			});
			console.log("取消配对成功");
		}).fail(function (e) {
			(0, _showlog.showLog)($parent, {
				before: 'mac:' + deviceMac + '&nbsp;&nbsp;',
				message: (0, _stringify2.default)(e),
				class: 'fail'
			});
			console.log(e);
		});
	}
	
	exports.default = unpair;

/***/ }),
/* 64 */
/*!**********************************!*\
  !*** ./src/js/getConnectList.js ***!
  \**********************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.htmlTemp = exports.getConnectListAndFill = undefined;
	
	var _stringify = __webpack_require__(/*! babel-runtime/core-js/json/stringify */ 7);
	
	var _stringify2 = _interopRequireDefault(_stringify);
	
	var _typeof2 = __webpack_require__(/*! babel-runtime/helpers/typeof */ 65);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	var _api = __webpack_require__(/*! ./api */ 10);
	
	var _showmethod = __webpack_require__(/*! ./showmethod.js */ 48);
	
	var _showlog = __webpack_require__(/*! ./showlog */ 57);
	
	var _urlconfig = __webpack_require__(/*! ./urlconfig */ 56);
	
	var _globalData = __webpack_require__(/*! ./globalData */ 50);
	
	var _globalData2 = _interopRequireDefault(_globalData);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function htmlTemp(mac, name) {
		return '<li data-mac=' + mac + '>\n\t\t\t\t<div class="layui-form-item">\n\t\t\t\t\t<div class="layui-inline">\n\t\t\t\t\t\t<label class="layui-form-label">mac:</label>\n\t\t\t\t\t\t<div class="layui-input-inline">\n\t\t\t\t\t\t\t<span class="layui-input">' + mac + '</span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="layui-inline">\n\t\t\t\t\t\t<label class="layui-form-label">name:</label>\n\t\t\t\t\t\t<div class="layui-input-inline">\n\t\t\t\t\t\t\t<span class="layui-input">' + name + '</span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class="layui-form-item">\n\t\t\t\t\t<div class="layui-input-inline">\n\t\t\t\t\t\t<button class="layui-btn" data-mac=' + mac + ' data-action=\'services\' i18n="Seri">Serivices</button>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="layui-input-inline">\n\t\t\t\t\t\t<button class="layui-btn" data-mac=' + mac + ' data-action=\'pair\' i18n="Pair">Pair</button>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="layui-input-inline">\n\t\t\t\t\t\t<button class="layui-btn" data-mac=' + mac + ' data-action=\'unpair\' i18n="Unpair">Unpair</button>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class="layui-input-inline">\n\t\t\t\t\t\t<button class="layui-btn" data-mac=' + mac + ' data-action=\'disconnect\' i18n="Disc">Disconnect</button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t\t<div class="layui-input-item tree">\n\t\t\t\t\t<ul data-mac=' + mac + '></ul> \n\t\t\t\t</div>\n\t\t\t</li>';
	}
	
	function getConnectListAndFill() {
		if (_urlconfig.data.access_token) (0, _urlconfig.updateUrlArr)(_globalData2.default.saved.acaddress);
		var parent1 = $('.l3 ul'),
		    parent2 = $('#connectLists ul'),
		    ajaxResult = _api.api.getConnectList(_urlconfig.urlArr.getConnectedDeviceList);
	
		(0, _showmethod.showMethod)('getConnectList');
		ajaxResult.done(function (e) {
			console.log('getConnectList typeof：', typeof e === 'undefined' ? 'undefined' : (0, _typeof3.default)(e), e);
			var temp = '',
			    mac = void 0,
			    name = void 0;
	
			(0, _showlog.showLog)(parent2, {
				message: (0, _stringify2.default)(e)
			});
			var num = 0;
	
			if (!e.nodes.forEach) {
				parent1.html(temp);
				$('#connectedNum').html(num);
				return;
			}
			e.nodes.forEach(function (item, index, arr) {
				num++;
	
				mac = item.id;
				name = item.name;
				temp += htmlTemp(mac, name);
			});
			console.log('getConnectList conncected number:', num);
	
			parent1.html(temp);
			$('#connectedNum').html(num);
			mac = null;
			temp = null;
			name = null;
		});
	}
	
	exports.getConnectListAndFill = getConnectListAndFill;
	exports.htmlTemp = htmlTemp;

/***/ }),
/* 65 */
/*!*******************************************!*\
  !*** ./~/babel-runtime/helpers/typeof.js ***!
  \*******************************************/
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _iterator = __webpack_require__(/*! ../core-js/symbol/iterator */ 66);
	
	var _iterator2 = _interopRequireDefault(_iterator);
	
	var _symbol = __webpack_require__(/*! ../core-js/symbol */ 84);
	
	var _symbol2 = _interopRequireDefault(_symbol);
	
	var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

/***/ }),
/* 66 */
/*!****************************************************!*\
  !*** ./~/babel-runtime/core-js/symbol/iterator.js ***!
  \****************************************************/
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(/*! core-js/library/fn/symbol/iterator */ 67), __esModule: true };

/***/ }),
/* 67 */
/*!*************************************************!*\
  !*** ./~/core-js/library/fn/symbol/iterator.js ***!
  \*************************************************/
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(/*! ../../modules/es6.string.iterator */ 68);
	__webpack_require__(/*! ../../modules/web.dom.iterable */ 79);
	module.exports = __webpack_require__(/*! ../../modules/_wks-ext */ 83).f('iterator');


/***/ }),
/* 68 */
/*!**********************************************************!*\
  !*** ./~/core-js/library/modules/es6.string.iterator.js ***!
  \**********************************************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $at = __webpack_require__(/*! ./_string-at */ 69)(true);
	
	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(/*! ./_iter-define */ 70)(String, 'String', function (iterated) {
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function () {
	  var O = this._t;
	  var index = this._i;
	  var point;
	  if (index >= O.length) return { value: undefined, done: true };
	  point = $at(O, index);
	  this._i += point.length;
	  return { value: point, done: false };
	});


/***/ }),
/* 69 */
/*!*************************************************!*\
  !*** ./~/core-js/library/modules/_string-at.js ***!
  \*************************************************/
/***/ (function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(/*! ./_to-integer */ 38);
	var defined = __webpack_require__(/*! ./_defined */ 35);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function (TO_STRING) {
	  return function (that, pos) {
	    var s = String(defined(that));
	    var i = toInteger(pos);
	    var l = s.length;
	    var a, b;
	    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};


/***/ }),
/* 70 */
/*!***************************************************!*\
  !*** ./~/core-js/library/modules/_iter-define.js ***!
  \***************************************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY = __webpack_require__(/*! ./_library */ 42);
	var $export = __webpack_require__(/*! ./_export */ 14);
	var redefine = __webpack_require__(/*! ./_redefine */ 71);
	var hide = __webpack_require__(/*! ./_hide */ 18);
	var Iterators = __webpack_require__(/*! ./_iterators */ 72);
	var $iterCreate = __webpack_require__(/*! ./_iter-create */ 73);
	var setToStringTag = __webpack_require__(/*! ./_set-to-string-tag */ 76);
	var getPrototypeOf = __webpack_require__(/*! ./_object-gpo */ 78);
	var ITERATOR = __webpack_require__(/*! ./_wks */ 77)('iterator');
	var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
	var FF_ITERATOR = '@@iterator';
	var KEYS = 'keys';
	var VALUES = 'values';
	
	var returnThis = function () { return this; };
	
	module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function (kind) {
	    if (!BUGGY && kind in proto) return proto[kind];
	    switch (kind) {
	      case KEYS: return function keys() { return new Constructor(this, kind); };
	      case VALUES: return function values() { return new Constructor(this, kind); };
	    } return function entries() { return new Constructor(this, kind); };
	  };
	  var TAG = NAME + ' Iterator';
	  var DEF_VALUES = DEFAULT == VALUES;
	  var VALUES_BUG = false;
	  var proto = Base.prototype;
	  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
	  var $default = $native || getMethod(DEFAULT);
	  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
	  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
	  var methods, key, IteratorPrototype;
	  // Fix native
	  if ($anyNative) {
	    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
	    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
	      // Set @@toStringTag to native iterators
	      setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if (DEF_VALUES && $native && $native.name !== VALUES) {
	    VALUES_BUG = true;
	    $default = function values() { return $native.call(this); };
	  }
	  // Define iterator
	  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG] = returnThis;
	  if (DEFAULT) {
	    methods = {
	      values: DEF_VALUES ? $default : getMethod(VALUES),
	      keys: IS_SET ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if (FORCED) for (key in methods) {
	      if (!(key in proto)) redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};


/***/ }),
/* 71 */
/*!************************************************!*\
  !*** ./~/core-js/library/modules/_redefine.js ***!
  \************************************************/
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(/*! ./_hide */ 18);


/***/ }),
/* 72 */
/*!*************************************************!*\
  !*** ./~/core-js/library/modules/_iterators.js ***!
  \*************************************************/
/***/ (function(module, exports) {

	module.exports = {};


/***/ }),
/* 73 */
/*!***************************************************!*\
  !*** ./~/core-js/library/modules/_iter-create.js ***!
  \***************************************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var create = __webpack_require__(/*! ./_object-create */ 74);
	var descriptor = __webpack_require__(/*! ./_property-desc */ 27);
	var setToStringTag = __webpack_require__(/*! ./_set-to-string-tag */ 76);
	var IteratorPrototype = {};
	
	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(/*! ./_hide */ 18)(IteratorPrototype, __webpack_require__(/*! ./_wks */ 77)('iterator'), function () { return this; });
	
	module.exports = function (Constructor, NAME, next) {
	  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
	  setToStringTag(Constructor, NAME + ' Iterator');
	};


/***/ }),
/* 74 */
/*!*****************************************************!*\
  !*** ./~/core-js/library/modules/_object-create.js ***!
  \*****************************************************/
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject = __webpack_require__(/*! ./_an-object */ 20);
	var dPs = __webpack_require__(/*! ./_object-dps */ 54);
	var enumBugKeys = __webpack_require__(/*! ./_enum-bug-keys */ 44);
	var IE_PROTO = __webpack_require__(/*! ./_shared-key */ 40)('IE_PROTO');
	var Empty = function () { /* empty */ };
	var PROTOTYPE = 'prototype';
	
	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(/*! ./_dom-create */ 25)('iframe');
	  var i = enumBugKeys.length;
	  var lt = '<';
	  var gt = '>';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(/*! ./_html */ 75).appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
	  return createDict();
	};
	
	module.exports = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    Empty[PROTOTYPE] = anObject(O);
	    result = new Empty();
	    Empty[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : dPs(result, Properties);
	};


/***/ }),
/* 75 */
/*!********************************************!*\
  !*** ./~/core-js/library/modules/_html.js ***!
  \********************************************/
/***/ (function(module, exports, __webpack_require__) {

	var document = __webpack_require__(/*! ./_global */ 15).document;
	module.exports = document && document.documentElement;


/***/ }),
/* 76 */
/*!*********************************************************!*\
  !*** ./~/core-js/library/modules/_set-to-string-tag.js ***!
  \*********************************************************/
/***/ (function(module, exports, __webpack_require__) {

	var def = __webpack_require__(/*! ./_object-dp */ 19).f;
	var has = __webpack_require__(/*! ./_has */ 28);
	var TAG = __webpack_require__(/*! ./_wks */ 77)('toStringTag');
	
	module.exports = function (it, tag, stat) {
	  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
	};


/***/ }),
/* 77 */
/*!*******************************************!*\
  !*** ./~/core-js/library/modules/_wks.js ***!
  \*******************************************/
/***/ (function(module, exports, __webpack_require__) {

	var store = __webpack_require__(/*! ./_shared */ 41)('wks');
	var uid = __webpack_require__(/*! ./_uid */ 43);
	var Symbol = __webpack_require__(/*! ./_global */ 15).Symbol;
	var USE_SYMBOL = typeof Symbol == 'function';
	
	var $exports = module.exports = function (name) {
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};
	
	$exports.store = store;


/***/ }),
/* 78 */
/*!**************************************************!*\
  !*** ./~/core-js/library/modules/_object-gpo.js ***!
  \**************************************************/
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has = __webpack_require__(/*! ./_has */ 28);
	var toObject = __webpack_require__(/*! ./_to-object */ 47);
	var IE_PROTO = __webpack_require__(/*! ./_shared-key */ 40)('IE_PROTO');
	var ObjectProto = Object.prototype;
	
	module.exports = Object.getPrototypeOf || function (O) {
	  O = toObject(O);
	  if (has(O, IE_PROTO)) return O[IE_PROTO];
	  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};


/***/ }),
/* 79 */
/*!*******************************************************!*\
  !*** ./~/core-js/library/modules/web.dom.iterable.js ***!
  \*******************************************************/
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(/*! ./es6.array.iterator */ 80);
	var global = __webpack_require__(/*! ./_global */ 15);
	var hide = __webpack_require__(/*! ./_hide */ 18);
	var Iterators = __webpack_require__(/*! ./_iterators */ 72);
	var TO_STRING_TAG = __webpack_require__(/*! ./_wks */ 77)('toStringTag');
	
	var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
	  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
	  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
	  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
	  'TextTrackList,TouchList').split(',');
	
	for (var i = 0; i < DOMIterables.length; i++) {
	  var NAME = DOMIterables[i];
	  var Collection = global[NAME];
	  var proto = Collection && Collection.prototype;
	  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}


/***/ }),
/* 80 */
/*!*********************************************************!*\
  !*** ./~/core-js/library/modules/es6.array.iterator.js ***!
  \*********************************************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(/*! ./_add-to-unscopables */ 81);
	var step = __webpack_require__(/*! ./_iter-step */ 82);
	var Iterators = __webpack_require__(/*! ./_iterators */ 72);
	var toIObject = __webpack_require__(/*! ./_to-iobject */ 32);
	
	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(/*! ./_iter-define */ 70)(Array, 'Array', function (iterated, kind) {
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function () {
	  var O = this._t;
	  var kind = this._k;
	  var index = this._i++;
	  if (!O || index >= O.length) {
	    this._t = undefined;
	    return step(1);
	  }
	  if (kind == 'keys') return step(0, index);
	  if (kind == 'values') return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');
	
	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;
	
	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');


/***/ }),
/* 81 */
/*!**********************************************************!*\
  !*** ./~/core-js/library/modules/_add-to-unscopables.js ***!
  \**********************************************************/
/***/ (function(module, exports) {

	module.exports = function () { /* empty */ };


/***/ }),
/* 82 */
/*!*************************************************!*\
  !*** ./~/core-js/library/modules/_iter-step.js ***!
  \*************************************************/
/***/ (function(module, exports) {

	module.exports = function (done, value) {
	  return { value: value, done: !!done };
	};


/***/ }),
/* 83 */
/*!***********************************************!*\
  !*** ./~/core-js/library/modules/_wks-ext.js ***!
  \***********************************************/
/***/ (function(module, exports, __webpack_require__) {

	exports.f = __webpack_require__(/*! ./_wks */ 77);


/***/ }),
/* 84 */
/*!*******************************************!*\
  !*** ./~/babel-runtime/core-js/symbol.js ***!
  \*******************************************/
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(/*! core-js/library/fn/symbol */ 85), __esModule: true };

/***/ }),
/* 85 */
/*!**********************************************!*\
  !*** ./~/core-js/library/fn/symbol/index.js ***!
  \**********************************************/
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(/*! ../../modules/es6.symbol */ 86);
	__webpack_require__(/*! ../../modules/es6.object.to-string */ 94);
	__webpack_require__(/*! ../../modules/es7.symbol.async-iterator */ 95);
	__webpack_require__(/*! ../../modules/es7.symbol.observable */ 96);
	module.exports = __webpack_require__(/*! ../../modules/_core */ 9).Symbol;


/***/ }),
/* 86 */
/*!*************************************************!*\
  !*** ./~/core-js/library/modules/es6.symbol.js ***!
  \*************************************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var global = __webpack_require__(/*! ./_global */ 15);
	var has = __webpack_require__(/*! ./_has */ 28);
	var DESCRIPTORS = __webpack_require__(/*! ./_descriptors */ 23);
	var $export = __webpack_require__(/*! ./_export */ 14);
	var redefine = __webpack_require__(/*! ./_redefine */ 71);
	var META = __webpack_require__(/*! ./_meta */ 87).KEY;
	var $fails = __webpack_require__(/*! ./_fails */ 24);
	var shared = __webpack_require__(/*! ./_shared */ 41);
	var setToStringTag = __webpack_require__(/*! ./_set-to-string-tag */ 76);
	var uid = __webpack_require__(/*! ./_uid */ 43);
	var wks = __webpack_require__(/*! ./_wks */ 77);
	var wksExt = __webpack_require__(/*! ./_wks-ext */ 83);
	var wksDefine = __webpack_require__(/*! ./_wks-define */ 88);
	var enumKeys = __webpack_require__(/*! ./_enum-keys */ 89);
	var isArray = __webpack_require__(/*! ./_is-array */ 90);
	var anObject = __webpack_require__(/*! ./_an-object */ 20);
	var isObject = __webpack_require__(/*! ./_is-object */ 21);
	var toObject = __webpack_require__(/*! ./_to-object */ 47);
	var toIObject = __webpack_require__(/*! ./_to-iobject */ 32);
	var toPrimitive = __webpack_require__(/*! ./_to-primitive */ 26);
	var createDesc = __webpack_require__(/*! ./_property-desc */ 27);
	var _create = __webpack_require__(/*! ./_object-create */ 74);
	var gOPNExt = __webpack_require__(/*! ./_object-gopn-ext */ 91);
	var $GOPD = __webpack_require__(/*! ./_object-gopd */ 93);
	var $GOPS = __webpack_require__(/*! ./_object-gops */ 45);
	var $DP = __webpack_require__(/*! ./_object-dp */ 19);
	var $keys = __webpack_require__(/*! ./_object-keys */ 30);
	var gOPD = $GOPD.f;
	var dP = $DP.f;
	var gOPN = gOPNExt.f;
	var $Symbol = global.Symbol;
	var $JSON = global.JSON;
	var _stringify = $JSON && $JSON.stringify;
	var PROTOTYPE = 'prototype';
	var HIDDEN = wks('_hidden');
	var TO_PRIMITIVE = wks('toPrimitive');
	var isEnum = {}.propertyIsEnumerable;
	var SymbolRegistry = shared('symbol-registry');
	var AllSymbols = shared('symbols');
	var OPSymbols = shared('op-symbols');
	var ObjectProto = Object[PROTOTYPE];
	var USE_NATIVE = typeof $Symbol == 'function' && !!$GOPS.f;
	var QObject = global.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;
	
	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function () {
	  return _create(dP({}, 'a', {
	    get: function () { return dP(this, 'a', { value: 7 }).a; }
	  })).a != 7;
	}) ? function (it, key, D) {
	  var protoDesc = gOPD(ObjectProto, key);
	  if (protoDesc) delete ObjectProto[key];
	  dP(it, key, D);
	  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
	} : dP;
	
	var wrap = function (tag) {
	  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
	  sym._k = tag;
	  return sym;
	};
	
	var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
	  return typeof it == 'symbol';
	} : function (it) {
	  return it instanceof $Symbol;
	};
	
	var $defineProperty = function defineProperty(it, key, D) {
	  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
	  anObject(it);
	  key = toPrimitive(key, true);
	  anObject(D);
	  if (has(AllSymbols, key)) {
	    if (!D.enumerable) {
	      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
	      D = _create(D, { enumerable: createDesc(0, false) });
	    } return setSymbolDesc(it, key, D);
	  } return dP(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P) {
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P));
	  var i = 0;
	  var l = keys.length;
	  var key;
	  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P) {
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key) {
	  var E = isEnum.call(this, key = toPrimitive(key, true));
	  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
	  it = toIObject(it);
	  key = toPrimitive(key, true);
	  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
	  var D = gOPD(it, key);
	  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it) {
	  var names = gOPN(toIObject(it));
	  var result = [];
	  var i = 0;
	  var key;
	  while (names.length > i) {
	    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
	  } return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
	  var IS_OP = it === ObjectProto;
	  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
	  var result = [];
	  var i = 0;
	  var key;
	  while (names.length > i) {
	    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
	  } return result;
	};
	
	// 19.4.1.1 Symbol([description])
	if (!USE_NATIVE) {
	  $Symbol = function Symbol() {
	    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
	    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
	    var $set = function (value) {
	      if (this === ObjectProto) $set.call(OPSymbols, value);
	      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    };
	    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
	    return wrap(tag);
	  };
	  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
	    return this._k;
	  });
	
	  $GOPD.f = $getOwnPropertyDescriptor;
	  $DP.f = $defineProperty;
	  __webpack_require__(/*! ./_object-gopn */ 92).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(/*! ./_object-pie */ 46).f = $propertyIsEnumerable;
	  $GOPS.f = $getOwnPropertySymbols;
	
	  if (DESCRIPTORS && !__webpack_require__(/*! ./_library */ 42)) {
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }
	
	  wksExt.f = function (name) {
	    return wrap(wks(name));
	  };
	}
	
	$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });
	
	for (var es6Symbols = (
	  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
	).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);
	
	for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);
	
	$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function (key) {
	    return has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(sym) {
	    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
	    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
	  },
	  useSetter: function () { setter = true; },
	  useSimple: function () { setter = false; }
	});
	
	$export($export.S + $export.F * !USE_NATIVE, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});
	
	// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
	// https://bugs.chromium.org/p/v8/issues/detail?id=3443
	var FAILS_ON_PRIMITIVES = $fails(function () { $GOPS.f(1); });
	
	$export($export.S + $export.F * FAILS_ON_PRIMITIVES, 'Object', {
	  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
	    return $GOPS.f(toObject(it));
	  }
	});
	
	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
	})), 'JSON', {
	  stringify: function stringify(it) {
	    var args = [it];
	    var i = 1;
	    var replacer, $replacer;
	    while (arguments.length > i) args.push(arguments[i++]);
	    $replacer = replacer = args[1];
	    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
	    if (!isArray(replacer)) replacer = function (key, value) {
	      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
	      if (!isSymbol(value)) return value;
	    };
	    args[1] = replacer;
	    return _stringify.apply($JSON, args);
	  }
	});
	
	// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(/*! ./_hide */ 18)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);


/***/ }),
/* 87 */
/*!********************************************!*\
  !*** ./~/core-js/library/modules/_meta.js ***!
  \********************************************/
/***/ (function(module, exports, __webpack_require__) {

	var META = __webpack_require__(/*! ./_uid */ 43)('meta');
	var isObject = __webpack_require__(/*! ./_is-object */ 21);
	var has = __webpack_require__(/*! ./_has */ 28);
	var setDesc = __webpack_require__(/*! ./_object-dp */ 19).f;
	var id = 0;
	var isExtensible = Object.isExtensible || function () {
	  return true;
	};
	var FREEZE = !__webpack_require__(/*! ./_fails */ 24)(function () {
	  return isExtensible(Object.preventExtensions({}));
	});
	var setMeta = function (it) {
	  setDesc(it, META, { value: {
	    i: 'O' + ++id, // object ID
	    w: {}          // weak collections IDs
	  } });
	};
	var fastKey = function (it, create) {
	  // return primitive with prefix
	  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if (!has(it, META)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible(it)) return 'F';
	    // not necessary to add metadata
	    if (!create) return 'E';
	    // add missing metadata
	    setMeta(it);
	  // return object ID
	  } return it[META].i;
	};
	var getWeak = function (it, create) {
	  if (!has(it, META)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible(it)) return true;
	    // not necessary to add metadata
	    if (!create) return false;
	    // add missing metadata
	    setMeta(it);
	  // return hash weak collections IDs
	  } return it[META].w;
	};
	// add metadata on freeze-family methods calling
	var onFreeze = function (it) {
	  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
	  return it;
	};
	var meta = module.exports = {
	  KEY: META,
	  NEED: false,
	  fastKey: fastKey,
	  getWeak: getWeak,
	  onFreeze: onFreeze
	};


/***/ }),
/* 88 */
/*!**************************************************!*\
  !*** ./~/core-js/library/modules/_wks-define.js ***!
  \**************************************************/
/***/ (function(module, exports, __webpack_require__) {

	var global = __webpack_require__(/*! ./_global */ 15);
	var core = __webpack_require__(/*! ./_core */ 9);
	var LIBRARY = __webpack_require__(/*! ./_library */ 42);
	var wksExt = __webpack_require__(/*! ./_wks-ext */ 83);
	var defineProperty = __webpack_require__(/*! ./_object-dp */ 19).f;
	module.exports = function (name) {
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
	};


/***/ }),
/* 89 */
/*!*************************************************!*\
  !*** ./~/core-js/library/modules/_enum-keys.js ***!
  \*************************************************/
/***/ (function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(/*! ./_object-keys */ 30);
	var gOPS = __webpack_require__(/*! ./_object-gops */ 45);
	var pIE = __webpack_require__(/*! ./_object-pie */ 46);
	module.exports = function (it) {
	  var result = getKeys(it);
	  var getSymbols = gOPS.f;
	  if (getSymbols) {
	    var symbols = getSymbols(it);
	    var isEnum = pIE.f;
	    var i = 0;
	    var key;
	    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
	  } return result;
	};


/***/ }),
/* 90 */
/*!************************************************!*\
  !*** ./~/core-js/library/modules/_is-array.js ***!
  \************************************************/
/***/ (function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(/*! ./_cof */ 34);
	module.exports = Array.isArray || function isArray(arg) {
	  return cof(arg) == 'Array';
	};


/***/ }),
/* 91 */
/*!*******************************************************!*\
  !*** ./~/core-js/library/modules/_object-gopn-ext.js ***!
  \*******************************************************/
/***/ (function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(/*! ./_to-iobject */ 32);
	var gOPN = __webpack_require__(/*! ./_object-gopn */ 92).f;
	var toString = {}.toString;
	
	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];
	
	var getWindowNames = function (it) {
	  try {
	    return gOPN(it);
	  } catch (e) {
	    return windowNames.slice();
	  }
	};
	
	module.exports.f = function getOwnPropertyNames(it) {
	  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
	};


/***/ }),
/* 92 */
/*!***************************************************!*\
  !*** ./~/core-js/library/modules/_object-gopn.js ***!
  \***************************************************/
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys = __webpack_require__(/*! ./_object-keys-internal */ 31);
	var hiddenKeys = __webpack_require__(/*! ./_enum-bug-keys */ 44).concat('length', 'prototype');
	
	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return $keys(O, hiddenKeys);
	};


/***/ }),
/* 93 */
/*!***************************************************!*\
  !*** ./~/core-js/library/modules/_object-gopd.js ***!
  \***************************************************/
/***/ (function(module, exports, __webpack_require__) {

	var pIE = __webpack_require__(/*! ./_object-pie */ 46);
	var createDesc = __webpack_require__(/*! ./_property-desc */ 27);
	var toIObject = __webpack_require__(/*! ./_to-iobject */ 32);
	var toPrimitive = __webpack_require__(/*! ./_to-primitive */ 26);
	var has = __webpack_require__(/*! ./_has */ 28);
	var IE8_DOM_DEFINE = __webpack_require__(/*! ./_ie8-dom-define */ 22);
	var gOPD = Object.getOwnPropertyDescriptor;
	
	exports.f = __webpack_require__(/*! ./_descriptors */ 23) ? gOPD : function getOwnPropertyDescriptor(O, P) {
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if (IE8_DOM_DEFINE) try {
	    return gOPD(O, P);
	  } catch (e) { /* empty */ }
	  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
	};


/***/ }),
/* 94 */
/*!***********************************************************!*\
  !*** ./~/core-js/library/modules/es6.object.to-string.js ***!
  \***********************************************************/
/***/ (function(module, exports) {



/***/ }),
/* 95 */
/*!****************************************************************!*\
  !*** ./~/core-js/library/modules/es7.symbol.async-iterator.js ***!
  \****************************************************************/
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(/*! ./_wks-define */ 88)('asyncIterator');


/***/ }),
/* 96 */
/*!************************************************************!*\
  !*** ./~/core-js/library/modules/es7.symbol.observable.js ***!
  \************************************************************/
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(/*! ./_wks-define */ 88)('observable');


/***/ }),
/* 97 */
/*!*****************************************!*\
  !*** ./src/js/getAllServicesAndFill.js ***!
  \*****************************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.getAllServicesAndFill = undefined;
	
	var _stringify = __webpack_require__(/*! babel-runtime/core-js/json/stringify */ 7);
	
	var _stringify2 = _interopRequireDefault(_stringify);
	
	var _typeof2 = __webpack_require__(/*! babel-runtime/helpers/typeof */ 65);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	var _api = __webpack_require__(/*! ./api */ 10);
	
	var _readByHandleAndFill = __webpack_require__(/*! ./readByHandleAndFill.js */ 98);
	
	var _writeByHandleAndFill = __webpack_require__(/*! ./writeByHandleAndFill.js */ 99);
	
	var _showmethod = __webpack_require__(/*! ./showmethod */ 48);
	
	var _showlog = __webpack_require__(/*! ./showlog */ 57);
	
	var _gattServices = __webpack_require__(/*! ./gattServices */ 100);
	
	var _gattCharacteristics = __webpack_require__(/*! ./gattCharacteristics */ 101);
	
	var _urlconfig = __webpack_require__(/*! ./urlconfig */ 56);
	
	var _formatServicesData = __webpack_require__(/*! ./formatServicesData */ 102);
	
	var _formatServicesData2 = _interopRequireDefault(_formatServicesData);
	
	var _mainHandle = __webpack_require__(/*! ./mainHandle */ 5);
	
	var mainHandle = _interopRequireWildcard(_mainHandle);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var hasGetServices = {};
	console.log("***********", mainHandle);
	
	function convertGattInfoByUUID(devicesServicesTree) {
		devicesServicesTree.forEach(function (deviceServiceTree) {
			deviceServiceTree.children.forEach(function (service) {
				var id = parseInt(service.uuid.split('-')[0], 16).toString(16).toUpperCase();
				if (_gattServices.gattServices[id]) {
					service.name = _gattServices.gattServices[id];
					service.children.unshift({ name: 'uuid:' + service.uuid });
				}
				service.name = _gattServices.gattServices[id] || service.name;
				service.children.forEach(function (serviceChild) {
					if (serviceChild.name === 'characteristics') {
						serviceChild.children.forEach(function (charChild) {
							var id = parseInt(charChild.uuid.split('-')[0], 16).toString(16).toUpperCase();
							if (_gattCharacteristics.gattCharacteristics[id]) {
								charChild.name = _gattCharacteristics.gattCharacteristics[id] || charChild.name;
								charChild.children.unshift({ name: 'uuid:' + charChild.uuid });
							}
						});
					}
				});
			});
		});
	}
	
	function getAllServicesAndFill(deviceMac) {
		layui.use(['tree', 'form', 'layer'], function () {
			var form = layui.form(),
			    layer = layui.layer,
			    $parent = $('.box .l3').find('ul.bb1>li div.tree > ul[data-mac=\'' + deviceMac + '\']'),
			    url = _urlconfig.urlArr.getAllServices.replace("*deviceMac*", deviceMac);
	
			if (hasGetServices[deviceMac] === 1) return;
			if ((0, _typeof3.default)(hasGetServices[deviceMac]) === 'object') {
				if ($parent.children().length !== 0) return;else {
					layui.tree({
						elem: $parent,
						nodes: hasGetServices[deviceMac]
					});
					setTimeout(function () {
						form.render();
					}, 500);
				}
				return;
			}
			hasGetServices[deviceMac] = 0;
			var ajaxResult = _api.api.getAllServices(url),
			    $parent2 = $('#getAllServices ul');
			console.log("getAllServices::", ajaxResult);
			(0, _showmethod.showMethod)('getAllServices');
			(function (deviceMac, form, layer, $parent, url, ajaxResult, $parent2) {
	
				ajaxResult.done(function (e) {
					console.log('getAllServicesAndFill.js  ajaxResult done', $.extend(true, {}, e));
					(0, _showlog.showLog)($parent2, {
						message: (0, _stringify2.default)(e, null, 2),
						class: 'success'
					});
					hasGetServices[deviceMac] = (0, _formatServicesData2.default)(e, deviceMac);
					console.log('getAllServicesAndFill.js', hasGetServices[deviceMac]);
					convertGattInfoByUUID(hasGetServices[deviceMac]);
					layui.tree({
						elem: $parent,
						nodes: hasGetServices[deviceMac]
					});
					clearTimeout($parent.timer);
					$parent.timer = setTimeout(function () {
						var $ul = $('.l3 ul[data-mac=\'' + deviceMac + '\']');
	
						form.render();
	
						$ul.find('button.js-try').click(function (e) {
							var handle = e.target.dataset.handle;
							var deviceMac = e.target.dataset.devicemac;
							if (e.target.dataset.action === 'read') {
								mainHandle.linkage(12);
								(0, _readByHandleAndFill.readByHandleAndFill)(e.target, { deviceMac: deviceMac, handle: handle });
							} else {
								var writeValue = void 0;
								mainHandle.linkage(6);
								if ($ul.find('input.js' + handle).length === 2 && e.target.dataset.action === 'writeWithoutRes') {
									writeValue = $ul.find('input.js' + handle).eq(0).val().trim();
								} else if ($ul.find('input.js' + handle).length === 2 && e.target.dataset.action === 'writeWithRes') {
									mainHandle.linkage(6);
									writeValue = $ul.find('input.js' + handle).eq(1).val().trim();
								} else {
									writeValue = $ul.find('input.js' + handle).eq(0).val().trim();
								}
								(0, _writeByHandleAndFill.writeByHandleAndFill)(e.target, { deviceMac: deviceMac, writeValue: writeValue, handle: handle });
							}
						});
	
						form.on('switch(notify)', function (e) {
							var handle = e.elem.dataset.handle,
							    writeValue = e.elem.checked ? '0100' : '0000',
							    deviceMac = e.elem.dataset.devicemac;
	
							(0, _writeByHandleAndFill.writeByHandleAndFill)(e.elem, {
								deviceMac: deviceMac,
								writeValue: writeValue,
								handle: handle
							});
						});
						form.on('switch(indicate)', function (e) {
							var handle = e.elem.dataset.handle,
							    writeValue = e.elem.checked ? '0200' : '0000',
							    deviceMac = e.elem.dataset.devicemac;
							(0, _writeByHandleAndFill.writeByHandleAndFill)(e.elem, {
								deviceMac: deviceMac,
								writeValue: writeValue,
								handle: handle
							});
						});
					}, 500);
				}).fail(function (e) {
					console.log("getAllServicesAndFill.js  fail :: ", e);
	
					if (e.responseText === 'DISCOVER WRONG') layer.open({
						title: '获取设备服务错误',
						content: deviceMac + '未连接!',
						icon: 2
					});
					hasGetServices[deviceMac] = 3;
					(0, _showlog.showLog)($parent2, {
						message: (0, _stringify2.default)(e, null, 2),
						class: 'fail'
					});
				});
			})(deviceMac, form, layer, $parent, url, ajaxResult, $parent2);
		});
	}
	
	exports.getAllServicesAndFill = getAllServicesAndFill;

/***/ }),
/* 98 */
/*!***************************************!*\
  !*** ./src/js/readByHandleAndFill.js ***!
  \***************************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.readByHandleAndFill = undefined;
	
	var _stringify = __webpack_require__(/*! babel-runtime/core-js/json/stringify */ 7);
	
	var _stringify2 = _interopRequireDefault(_stringify);
	
	var _api = __webpack_require__(/*! ./api */ 10);
	
	var _urlconfig = __webpack_require__(/*! ./urlconfig */ 56);
	
	var _showmethod = __webpack_require__(/*! ./showmethod */ 48);
	
	var _showlog = __webpack_require__(/*! ./showlog */ 57);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var readByHandleAndFill = function readByHandleAndFill(event, _ref) {
		var deviceMac = _ref.deviceMac,
		    handle = _ref.handle;
	
		var url = void 0,
		    action = event.dataset.action;
	
		url = _urlconfig.urlArr.readByHandle.replace(/\*((deviceMac)|(handle))\*/g, function (match, pos, originalText) {
			switch (match) {
				case '*deviceMac*':
					return deviceMac;
				case '*handle*':
					return handle;
			}
		});
	
		var ajaxResult = _api.api.readByHandle(url, null);
		(0, _showmethod.showMethod)('readByHandle');
	
		var $readResult = $($(event).parent().find('input')[0]);
		$readResult.val('reading');
		ajaxResult.done(function (e) {
			(0, _showlog.showLog)($('#readValueLog'), {
				message: deviceMac + ':' + (0, _stringify2.default)(e),
				class: 'success'
			});
			$readResult.val(e.value || '');
		}).fail(function (e) {
			(0, _showlog.showLog)($('#readValueLog'), {
				message: deviceMac + ':' + (0, _stringify2.default)(e, null, 2),
				class: 'fail'
			});
			$readResult.val('read failed');
		});
	};
	
	exports.readByHandleAndFill = readByHandleAndFill;

/***/ }),
/* 99 */
/*!****************************************!*\
  !*** ./src/js/writeByHandleAndFill.js ***!
  \****************************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.writeByHandleAndFill = undefined;
	
	var _stringify = __webpack_require__(/*! babel-runtime/core-js/json/stringify */ 7);
	
	var _stringify2 = _interopRequireDefault(_stringify);
	
	var _api = __webpack_require__(/*! ./api */ 10);
	
	var _urlconfig = __webpack_require__(/*! ./urlconfig */ 56);
	
	var _showmethod = __webpack_require__(/*! ./showmethod */ 48);
	
	var _showlog = __webpack_require__(/*! ./showlog */ 57);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var writeByHandleAndFill = function writeByHandleAndFill(event, _ref) {
		var deviceMac = _ref.deviceMac,
		    writeValue = _ref.writeValue,
		    handle = _ref.handle;
	
		var url = void 0,
		    ajaxResult = void 0,
		    action = event.dataset.action;
	
		url = _urlconfig.urlArr.writeByHandle.replace(/\*((deviceMac)|(handle)|(writeValue))\*/g, function (match, pos, originalText) {
			switch (match) {
				case '*deviceMac*':
					return deviceMac;
				case '*handle*':
					return handle;
				case '*writeValue*':
					return writeValue;
			}
		});
	
		if (action === 'writeWithRes') {
			ajaxResult = _api.api.writeByHandle(url, null);
		} else if (action === 'writeWithoutRes') {
			ajaxResult = _api.api.writeByHandle(url, {
				option: 'cmd'
			});
		} else if (action === 'notify') {
			ajaxResult = _api.api.writeByHandle(url, null);
		} else if (action === 'indicate') {
			ajaxResult = _api.api.writeByHandle(url, null);
		}
		(0, _showmethod.showMethod)('writeByHandle');
		ajaxResult.done(function (e) {
			(0, _showlog.showLog)($('#writeValueLog'), {
				message: deviceMac + ':' + (0, _stringify2.default)(e),
				class: 'success'
			});
		}).fail(function (e) {
			(0, _showlog.showLog)($('#writeValueLog'), {
				message: deviceMac + ':' + (0, _stringify2.default)(e, null, 2),
				class: 'fail'
			});
		});
	};
	
	exports.writeByHandleAndFill = writeByHandleAndFill;

/***/ }),
/* 100 */
/*!********************************!*\
  !*** ./src/js/gattServices.js ***!
  \********************************/
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var gattServices = {
	  '1800': 'Generic Access',
	  '1811': 'Alert Notification Service',
	  '1815': 'Automation IO',
	  '180F': 'Battery Service',
	  '183B': 'Binary Sensor',
	  '1810': 'Blood Pressure',
	  '181B': 'Body Composition',
	  '181E': 'Bond Management Service',
	  '181F': 'Continuous Glucose Monitoring',
	  '1805': 'Current Time Service',
	  '1818': 'Cycling Power',
	  '1816': 'Cycling Speed and Cadence',
	  '180A': 'Device Information',
	  '183C': 'Emergency Configuration',
	  '181A': 'Environmental Sensing',
	  '1826': 'Fitness Machine',
	  '1801': 'Generic Attribute',
	  '1808': 'Glucose',
	  '1809': 'Health Thermometer',
	  '180D': 'Heart Rate',
	  '1823': 'HTTP Proxy',
	  '1812': 'Human Interface Device',
	  '1802': 'Immediate Alert',
	  '1821': 'Indoor Positioning',
	  '183A': 'Insulin Delivery',
	  '1820': 'Internet Protocol Support Service',
	  '1803': 'Link Loss',
	  '1819': 'Location and Navigation',
	  '1827': 'Mesh Provisioning Service',
	  '1828': 'Mesh Proxy Service',
	  '1807': 'Next DST Change Service',
	  '1825': 'Object Transfer Service',
	  '180E': 'Phone Alert Status Service',
	  '1822': 'Pulse Oximeter Service',
	  '1829': 'Reconnection Configuration',
	  '1806': 'Reference Time Update Service',
	  '1814': 'Running Speed and Cadence',
	  '1813': 'Scan Parameters',
	  '1824': 'Transport Discovery',
	  '1804': 'User Data',
	  '181D': 'Weight Scale'
	};
	
	exports.gattServices = gattServices;

/***/ }),
/* 101 */
/*!***************************************!*\
  !*** ./src/js/gattCharacteristics.js ***!
  \***************************************/
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var gattCharacteristics = {
	  '2A7E': 'Aerobic Heart Rate Lower Limit',
	  '2A84': 'Aerobic Heart Rate Upper Limit',
	  '2A7F': 'Aerobic Threshold',
	  '2A80': 'Age',
	  '2A5A': 'Aggregate',
	  '2A43': 'Alert Category ID',
	  '2A42': 'Alert Category ID Bit Mask',
	  '2A06': 'Alert Level',
	  '2A44': 'Alert Notification Control Point',
	  '2A3F': 'Alert Status',
	  '2AB3': 'Altitude',
	  '2A81': 'Anaerobic Heart Rate Lower Limit',
	  '2A82': 'Anaerobic Heart Rate Upper Limit',
	  '2A83': 'Anaerobic Threshold',
	  '2A58': 'Analog',
	  '2A59': 'Analog Output',
	  '2A73': 'Apparent Wind Direction',
	  '2A72': 'Apparent Wind Speed',
	  '2A01': 'Appearance',
	  '2AA3': 'Barometric Pressure Trend',
	  '2A19': 'Battery Level',
	  '2A1B': 'Battery Level State',
	  '2A1A': 'Battery Power State',
	  '2A49': 'Blood Pressure Feature',
	  '2A35': 'Blood Pressure Measurement',
	  '2A9B': 'Body Composition Feature',
	  '2A9C': 'Body Composition Measurement',
	  '2A38': 'Body Sensor Location',
	  '2AA4': 'Bond Management Control Point',
	  '2AA5': 'Bond Management Features',
	  '2A22': 'Boot Keyboard Input Report',
	  '2A32': 'Boot Keyboard Output Report',
	  '2A33': 'Boot Mouse Input Report',
	  '2B2B': 'BSS Control Point',
	  '2B2C': 'BSS Response',
	  '2AA8': 'CGM Feature',
	  '2AA7': 'CGM Measurement',
	  '2AAB': 'CGM Session Run Time',
	  '2AAA': 'CGM Session Start Time',
	  '2AAC': 'CGM Specific Ops Control Point',
	  '2AA9': 'CGM Status',
	  '2B29': 'Client Supported Features',
	  '2ACE': 'Cross Trainer Data',
	  '2A5C': 'CSC Feature',
	  '2A5B': 'CSC Measurement',
	  '2A2B': 'Current Time',
	  '2A66': 'Cycling Power Control Point',
	  '2A65': 'Cycling Power Feature',
	  '2A63': 'Cycling Power Measurement',
	  '2A64': 'Cycling Power Vector',
	  '2A99': 'Database Change Increment',
	  '2B2A': 'Database Hash',
	  '2A85': 'Date of Birth',
	  '2A86': 'Date of Threshold Assessment',
	  '2A08': 'Date Time',
	  '2AED': 'Date UTC',
	  '2A0A': 'Day Date Time',
	  '2A09': 'Day of Week',
	  '2A7D': 'Descriptor Value Changed',
	  '2A7B': 'Dew Point',
	  '2A56': 'Digital',
	  '2A57': 'Digital Output',
	  '2A0D': 'DST Offset',
	  '2A6C': 'Elevation',
	  '2A87': 'Email Address',
	  '2B2D': 'Emergency ID',
	  '2B2E': 'Emergency Text',
	  '2A0B': 'Exact Time 100',
	  '2A0C': 'Exact Time 256',
	  '2A88': 'Fat Burn Heart Rate Lower Limit',
	  '2A89': 'Fat Burn Heart Rate Upper Limit',
	  '2A26': 'Firmware Revision String',
	  '2A8A': 'First Name',
	  '2AD9': 'Fitness Machine Control Point',
	  '2ACC': 'Fitness Machine Feature',
	  '2ADA': 'Fitness Machine Status',
	  '2A8B': 'Five Zone Heart Rate Limits',
	  '2AB2': 'Floor Number',
	  '2AA6': 'Central Address Resolution',
	  '2A00': 'Device Name',
	  '2A04': 'Peripheral Preferred Connection Parameters',
	  '2A02': 'Peripheral Privacy Flag',
	  '2A03': 'Reconnection Address',
	  '2A05': 'Service Changed',
	  '2A8C': 'Gender',
	  '2A51': 'Glucose Feature',
	  '2A18': 'Glucose Measurement',
	  '2A34': 'Glucose Measurement Context',
	  '2A74': 'Gust Factor',
	  '2A27': 'Hardware Revision String',
	  '2A39': 'Heart Rate Control Point',
	  '2A8D': 'Heart Rate Max',
	  '2A37': 'Heart Rate Measurement',
	  '2A7A': 'Heat Index',
	  '2A8E': 'Height',
	  '2A4C': 'HID Control Point',
	  '2A4A': 'HID Information',
	  '2A8F': 'Hip Circumference',
	  '2ABA': 'HTTP Control Point',
	  '2AB9': 'HTTP Entity Body',
	  '2AB7': 'HTTP Headers',
	  '2AB8': 'HTTP Status Code',
	  '2ABB': 'HTTPS Security',
	  '2A6F': 'Humidity',
	  '2B22': 'IDD Annunciation Status',
	  '2B25': 'IDD Command Control Point',
	  '2B26': 'IDD Command Data',
	  '2B23': 'IDD Features',
	  '2B28': 'IDD History Data',
	  '2B27': 'IDD Record Access Control Point',
	  '2B21': 'IDD Status',
	  '2B20': 'IDD Status Changed',
	  '2B24': 'IDD Status Reader Control Point',
	  '2A2A': 'IEEE 11073-20601 Regulatory Certification Data List',
	  '2AD2': 'Indoor Bike Data',
	  '2AAD': 'Indoor Positioning Configuration',
	  '2A36': 'Intermediate Cuff Pressure',
	  '2A1E': 'Intermediate Temperature',
	  '2A77': 'Irradiance',
	  '2AA2': 'Language',
	  '2A90': 'Last Name',
	  '2AAE': 'Latitude',
	  '2A6B': 'LN Control Point',
	  '2A6A': 'LN Feature',
	  '2AB1': 'Local East Coordinate',
	  '2AB0': 'Local North Coordinate',
	  '2A0F': 'Local Time Information',
	  '2A67': 'Location and Speed Characteristic',
	  '2AB5': 'Location Name',
	  '2AAF': 'Longitude',
	  '2A2C': 'Magnetic Declination',
	  '2AA0': 'Magnetic Flux Density – 2D',
	  '2AA1': 'Magnetic Flux Density – 3D',
	  '2A29': 'Manufacturer Name String',
	  '2A91': 'Maximum Recommended Heart Rate',
	  '2A21': 'Measurement Interval',
	  '2A24': 'Model Number String',
	  '2A68': 'Navigation',
	  '2A3E': 'Network Availability',
	  '2A46': 'New Alert',
	  '2AC5': 'Object Action Control Point',
	  '2AC8': 'Object Changed',
	  '2AC1': 'Object First-Created',
	  '2AC3': 'Object ID',
	  '2AC2': 'Object Last-Modified',
	  '2AC6': 'Object List Control Point',
	  '2AC7': 'Object List Filter',
	  '2ABE': 'Object Name',
	  '2AC4': 'Object Properties',
	  '2AC0': 'Object Size',
	  '2ABF': 'Object Type',
	  '2ABD': 'OTS Feature',
	  '2A5F': 'PLX Continuous Measurement Characteristic',
	  '2A60': 'PLX Features',
	  '2A5E': 'PLX Spot-Check Measurement',
	  '2A50': 'PnP ID',
	  '2A75': 'Pollen Concentration',
	  '2A2F': 'Position 2D',
	  '2A30': 'Position 3D',
	  '2A69': 'Position Quality',
	  '2A6D': 'Pressure',
	  '2A4E': 'Protocol Mode',
	  '2A62': 'Pulse Oximetry Control Point',
	  '2A78': 'Rainfall',
	  '2B1D': 'RC Feature',
	  '2B1E': 'RC Settings',
	  '2B1F': 'Reconnection Configuration Control Point',
	  '2A52': 'Record Access Control Point',
	  '2A14': 'Reference Time Information',
	  '2B37': 'Registered User Characteristic',
	  '2A3A': 'Removable',
	  '2A4D': 'Report',
	  '2A4B': 'Report Map',
	  '2AC9': 'Resolvable Private Address Only',
	  '2A92': 'Resting Heart Rate',
	  '2A40': 'Ringer Control point',
	  '2A41': 'Ringer Setting',
	  '2AD1': 'Rower Data',
	  '2A54': 'RSC Feature',
	  '2A53': 'RSC Measurement',
	  '2A55': 'SC Control Point',
	  '2A4F': 'Scan Interval Window',
	  '2A31': 'Scan Refresh',
	  '2A3C': 'Scientific Temperature Celsius',
	  '2A10': 'Secondary Time Zone',
	  '2A5D': 'Sensor Location',
	  '2A25': 'Serial Number String',
	  '2B3A': 'Server Supported Features',
	  '2A3B': 'Service Required',
	  '2A28': 'Software Revision String',
	  '2A93': 'Sport Type for Aerobic and Anaerobic Thresholds',
	  '2AD0': 'Stair Climber Data',
	  '2ACF': 'Step Climber Data',
	  '2A3D': 'String',
	  '2AD7': 'Supported Heart Rate Range',
	  '2AD5': 'Supported Inclination Range',
	  '2A47': 'Supported New Alert Category',
	  '2AD8': 'Supported Power Range',
	  '2AD6': 'Supported Resistance Level Range',
	  '2AD4': 'Supported Speed Range',
	  '2A48': 'Supported Unread Alert Category',
	  '2A23': 'System ID',
	  '2ABC': 'TDS Control Point',
	  '2A6E': 'Temperature',
	  '2A1F': 'Temperature Celsius',
	  '2A20': 'Temperature Fahrenheit',
	  '2A1C': 'Temperature Measurement',
	  '2A1D': 'Temperature Type',
	  '2A94': 'Three Zone Heart Rate Limits',
	  '2A12': 'Time Accuracy',
	  '2A15': 'Time Broadcast',
	  '2A13': 'Time Source',
	  '2A16': 'Time Update Control Point',
	  '2A17': 'Time Update State',
	  '2A11': 'Time with DST',
	  '2A0E': 'Time Zone',
	  '2AD3': 'Training Status',
	  '2ACD': 'Treadmill Data',
	  '2A71': 'True Wind Direction',
	  '2A70': 'True Wind Speed',
	  '2A95': 'Two Zone Heart Rate Limit',
	  '2A07': 'Tx Power Level',
	  '2AB4': 'Uncertainty',
	  '2A45': 'Unread Alert Status',
	  '2AB6': 'URI',
	  '2A9F': 'User Control Point',
	  '2A9A': 'User Index',
	  '2A76': 'UV Index',
	  '2A96': 'VO2 Max',
	  '2A97': 'Waist Circumference',
	  '2A98': 'Weight',
	  '2A9D': 'Weight Measurement',
	  '2A9E': 'Weight Scale Feature',
	  '2A79': 'Wind Chill'
	};
	
	exports.gattCharacteristics = gattCharacteristics;

/***/ }),
/* 102 */
/*!**************************************!*\
  !*** ./src/js/formatServicesData.js ***!
  \**************************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _typeof2 = __webpack_require__(/*! babel-runtime/helpers/typeof */ 65);
	
	var _typeof3 = _interopRequireDefault(_typeof2);
	
	var _keys = __webpack_require__(/*! babel-runtime/core-js/object/keys */ 103);
	
	var _keys2 = _interopRequireDefault(_keys);
	
	var _properties = __webpack_require__(/*! ./properties */ 107);
	
	var _properties2 = _interopRequireDefault(_properties);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function formatServicesData(data, deviceMac) {
		var nodes = [];
	
		function key2name(obj) {
			(0, _keys2.default)(obj).forEach(function (k) {
				if ((0, _typeof3.default)(obj[k]) === 'object') return;
				if (k === 'uuid') return;
				if (k === 'primary') return;
				if (k === 'endHandle') return;
				if (k === 'startHandle') {
					obj.children.push({
						name: 'handle:' + obj[k]
					});
					return;
				}
	
				if (k === 'handle') {
					obj.children.push({
						name: 'handle:' + obj[k]
					});
					return;
				}
	
				if (k === 'properties') {
					var method = (0, _properties2.default)(obj[k]);
	
					obj.children.push({
						name: 'properties:' + ('<span class=\'prop-msg\'>&nbsp;&nbsp;' + method + '</span>')
					});
					if (method.indexOf('read') !== -1) {
						obj.children.push({
							name: 'read:&nbsp;0x\n\t\t\t\t\t\t\t\t\t<span class="layui-form-item">\n\t\t\t\t\t\t\t\t\t\t<span class="layui-inline">\n\t\t\t\t\t\t\t\t\t\t\t<span class="layui-input-inline" style="width: 100px;">\n\t\t\t\t\t\t\t\t\t\t\t\t<input type="text" class="layui-input"  placeholder=\'\' readonly>\n\t\t\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t\t\t\t<span class="layui-form-mid"></span>\n\t\t\t\t\t\t\t\t\t\t\t<button class="layui-btn js-try" lay-submit lay-filter=\'read\'  data-devicemac=' + deviceMac + '  data-action=\'read\' data-handle=' + obj.valueHandle + '>try</button>\n\t\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t</span>',
							flag: 'read',
							valueHandle: obj.valueHandle
						});
					}
					if (method.indexOf('write without response') !== -1) {
						obj.children.push({
							name: 'write without response:&nbsp;0x\n\t\t\t\t\t\t\t\t\t<span class="layui-form-item">\n\t\t\t\t\t\t\t\t\t\t<span class="layui-inline">\n\t\t\t\t\t\t\t\t\t\t\t<span class="layui-input-inline" style="width: 100px;">\n\t\t\t\t\t\t\t\t\t\t\t\t<input type="text" class="layui-input js' + obj.valueHandle + '"  placeholder=\'0100\'>\n\t\t\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t\t\t\t<span class="layui-form-mid"></span>\n\t\t\t\t\t\t\t\t\t\t\t<button class="layui-btn js-try" lay-submit lay-filter=\'writeWithoutRes\'  data-devicemac=' + deviceMac + '  data-action=\'writeWithoutRes\' data-handle=' + obj.valueHandle + '>try</button>\n\t\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t</span>',
							flag: 'writeWithoutRes',
							valueHandle: obj.valueHandle
						});
						obj.children.push({
							name: '<span style="visibility:hidden">write without response:&nbsp;</span>(0x0100)</span>'
						});
					}
					if (method.indexOf('write with response') !== -1) {
						obj.children.push({
							name: 'write with response:&nbsp;0x\n\t\t\t\t\t\t\t\t\t<span class="layui-form-item">\n\t\t\t\t\t\t\t\t\t\t<span class="layui-inline">\n\t\t\t\t\t\t\t\t\t\t\t<span class="layui-input-inline" style="width: 100px;">\n\t\t\t\t\t\t\t\t\t\t\t\t<input type="text" class="layui-input js' + obj.valueHandle + '"  placeholder=\'0F04\'>\n\t\t\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t\t\t\t<span class="layui-form-mid"></span>\n\t\t\t\t\t\t\t\t\t\t\t<button class="layui-btn js-try" lay-submit lay-filter=\'writeWithRes\' data-devicemac=' + deviceMac + ' data-action=\'writeWithRes\' data-handle=' + obj.valueHandle + '>try</button>\n\t\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t</span>',
							flag: 'writeWithRes',
							valueHandle: obj.valueHandle
						});
						obj.children.push({
							name: '<span style="visibility:hidden">write with response:&nbsp;</span>(0x0100)</span>'
						});
					}
					if (method.indexOf('notify') !== -1) {
						var realHandle = obj.descriptors.filter(function (item) {
							return item.uuid.indexOf('2902') !== -1;
						});
						obj.children.push({
							name: 'notify\n\t\t\t\t\t\t\t\t\t<span class="layui-form-item">\n\t\t\t\t\t\t\t\t\t\t<span class="layui-inline">\n\t\t\t\t\t\t\t\t\t\t\t<span class="layui-form-mid"></span>\n\t\t\t\t\t\t\t\t\t\t\t<input type="checkbox"  lay-skin="switch" class=\'js-switch\' data-action=\'notify\' data-devicemac=' + deviceMac + ' data-handle=' + (realHandle[0] ? realHandle[0].handle : 'undefined') + ' lay-filter=\'notify\'>\n\t\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t</span>',
							flag: 'notify',
							handle: realHandle[0] ? realHandle[0].handle : 'undefined'
						});
					}
					if (method.indexOf('indicate') !== -1) {
						var _realHandle = obj.descriptors.filter(function (item) {
							return item.uuid.indexOf('2902') !== -1;
						});
						obj.children.push({
							name: 'indicate\n\t\t\t\t\t\t\t\t\t<span class="layui-form-item">\n\t\t\t\t\t\t\t\t\t\t<span class="layui-inline">\n\t\t\t\t\t\t\t\t\t\t\t<span class="layui-form-mid"></span>\n\t\t\t\t\t\t\t\t\t\t\t<input type="checkbox"  lay-skin="switch" class=\'js-switch\' data-devicemac=' + deviceMac + ' data-action=\'indicate\' data-handle=' + _realHandle[0].handle + ' lay-filter=\'indicate\'>\n\t\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t\t</span>',
							flag: 'indicate',
							handle: _realHandle[0].handle
						});
					}
	
	
					return;
				}
				obj.children.push({
	
					name: k + ':' + obj[k]
				});
			});
		}
		console.log('formatServicesData::', typeof data === 'undefined' ? 'undefined' : (0, _typeof3.default)(data), "data::", data);
		if (typeof data === 'string') data = JSON.parse(data);
	
		if (!data.services) {
			data.forEach(function (s) {
				nodes.push(s);
				s.children = [];
				key2name(s);
	
				s.name = s.uuid;
				if (!s.characteristics) s.characteristics = [];
				s.children.push({
					name: 'characteristics',
					children: s.characteristics.map(function (c) {
						if (c.handle) {
							c.valueHandle = c.handle;
						}
						c.children = [];
						key2name(c, 'c');
						if (c.descriptors.length !== 0) {
							c.children.push({
	
								name: 'descriptors',
								children: c.descriptors.map(function (d) {
									d.children = [];
									key2name(d);
									d.name = 'uuid:' + d.uuid;
									return d;
								})
							});
						}
						delete c.descriptors;
						c.name = 'uuid:' + c.uuid;
						return c;
					})
				});
			});
	
			return [{
				name: 'services',
				children: nodes
			}];
		}
		data.services.forEach(function (s) {
			nodes.push(s);
			s.children = [];
			key2name(s);
			s.children.push({
				name: 'characteristics',
				children: s.characteristics.map(function (c) {
					c.children = [];
					key2name(c, 'c');
					if (c.descriptors.length !== 0) {
						c.children.push({
	
							name: 'descriptors',
							children: c.descriptors.map(function (d) {
								d.children = [];
								key2name(d);
								d.name = 'uuid:' + d.uuid;
								return d;
							})
						});
					}
					delete c.descriptors;
					c.name = 'uuid:' + c.uuid;
					return c;
				})
			});
			delete s.characteristics;
			s.name = 'uuid:' + s.uuid;
		});
	
		return [{
			name: 'services',
			children: nodes
		}];
	}
	exports.default = formatServicesData;

/***/ }),
/* 103 */
/*!************************************************!*\
  !*** ./~/babel-runtime/core-js/object/keys.js ***!
  \************************************************/
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/keys */ 104), __esModule: true };

/***/ }),
/* 104 */
/*!*********************************************!*\
  !*** ./~/core-js/library/fn/object/keys.js ***!
  \*********************************************/
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(/*! ../../modules/es6.object.keys */ 105);
	module.exports = __webpack_require__(/*! ../../modules/_core */ 9).Object.keys;


/***/ }),
/* 105 */
/*!******************************************************!*\
  !*** ./~/core-js/library/modules/es6.object.keys.js ***!
  \******************************************************/
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.14 Object.keys(O)
	var toObject = __webpack_require__(/*! ./_to-object */ 47);
	var $keys = __webpack_require__(/*! ./_object-keys */ 30);
	
	__webpack_require__(/*! ./_object-sap */ 106)('keys', function () {
	  return function keys(it) {
	    return $keys(toObject(it));
	  };
	});


/***/ }),
/* 106 */
/*!**************************************************!*\
  !*** ./~/core-js/library/modules/_object-sap.js ***!
  \**************************************************/
/***/ (function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(/*! ./_export */ 14);
	var core = __webpack_require__(/*! ./_core */ 9);
	var fails = __webpack_require__(/*! ./_fails */ 24);
	module.exports = function (KEY, exec) {
	  var fn = (core.Object || {})[KEY] || Object[KEY];
	  var exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
	};


/***/ }),
/* 107 */
/*!******************************!*\
  !*** ./src/js/properties.js ***!
  \******************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _isInteger = __webpack_require__(/*! babel-runtime/core-js/number/is-integer */ 108);
	
	var _isInteger2 = _interopRequireDefault(_isInteger);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var checkProp = function checkProp(value) {
		var msg = [],
		    msgBox = {
			0X01: 'broadcasts',
			0X02: 'read',
			0X04: 'write without response',
			0X08: 'write with response',
			0X10: 'notify',
			0X20: 'indicate',
			0X40: 'authen',
			0X80: 'extended'
		};
		if (!(0, _isInteger2.default)(value)) return 'properties value must be integer';
		for (var i in msgBox) {
			if (value & i) msg.push(msgBox[i]);
		}
		return msg.join(',');
	};
	exports.default = checkProp;

/***/ }),
/* 108 */
/*!******************************************************!*\
  !*** ./~/babel-runtime/core-js/number/is-integer.js ***!
  \******************************************************/
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(/*! core-js/library/fn/number/is-integer */ 109), __esModule: true };

/***/ }),
/* 109 */
/*!***************************************************!*\
  !*** ./~/core-js/library/fn/number/is-integer.js ***!
  \***************************************************/
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(/*! ../../modules/es6.number.is-integer */ 110);
	module.exports = __webpack_require__(/*! ../../modules/_core */ 9).Number.isInteger;


/***/ }),
/* 110 */
/*!************************************************************!*\
  !*** ./~/core-js/library/modules/es6.number.is-integer.js ***!
  \************************************************************/
/***/ (function(module, exports, __webpack_require__) {

	// 20.1.2.3 Number.isInteger(number)
	var $export = __webpack_require__(/*! ./_export */ 14);
	
	$export($export.S, 'Number', { isInteger: __webpack_require__(/*! ./_is-integer */ 111) });


/***/ }),
/* 111 */
/*!**************************************************!*\
  !*** ./~/core-js/library/modules/_is-integer.js ***!
  \**************************************************/
/***/ (function(module, exports, __webpack_require__) {

	// 20.1.2.3 Number.isInteger(number)
	var isObject = __webpack_require__(/*! ./_is-object */ 21);
	var floor = Math.floor;
	module.exports = function isInteger(it) {
	  return !isObject(it) && isFinite(it) && floor(it) === it;
	};


/***/ }),
/* 112 */
/*!************************************!*\
  !*** ./src/js/notifyMsgAndFill.js ***!
  \************************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _stringify = __webpack_require__(/*! babel-runtime/core-js/json/stringify */ 7);
	
	var _stringify2 = _interopRequireDefault(_stringify);
	
	var _api = __webpack_require__(/*! ./api */ 10);
	
	var _showmethod = __webpack_require__(/*! ./showmethod */ 48);
	
	var _showlog = __webpack_require__(/*! ./showlog */ 57);
	
	var _urlconfig = __webpack_require__(/*! ./urlconfig */ 56);
	
	var _globalData = __webpack_require__(/*! ./globalData */ 50);
	
	var _globalData2 = _interopRequireDefault(_globalData);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var notifyMsgAndFill = {};
	notifyMsgAndFill.start = function () {
		if (_urlconfig.data.access_token) (0, _urlconfig.updateUrlArr)(_globalData2.default.saved.acaddress);
		_globalData2.default.neverSave.notifySSE.status = 'toOpen';
		if (_globalData2.default.neverSave.notifySSE.es !== '') {
			return;
		}
		var ajaxResult = _api.api.receiveNotification(_urlconfig.urlArr.notifyMsg, _globalData2.default.neverSave.notifySSE),
		    $parent1 = $('.l4 ul'),
		    $parent2 = $('#notify ul');
		ajaxResult.addEventListener('message', function (e) {
			var data = null;
			if (!e.data.match("keep-alive")) {
				data = JSON.parse(e.data);
				(0, _showlog.showLog)($parent1, {
					message: '<b>mac:' + data.id + '</b>&nbsp;&nbsp;&nbsp;' + data.value
				});
				(0, _showlog.showLog)($parent2, {
					message: (0, _stringify2.default)(data, null, 2)
				});
			} else {
				(0, _showlog.showLog)($parent2, {
					message: e.data
				});
			}
		});
		(0, _showmethod.showMethod)('notify');
	};
	
	notifyMsgAndFill.stop = function () {
		console.log(_globalData2.default);
		_globalData2.default.neverSave.notifySSE.status = 'toClosed';
		if (_globalData2.default.neverSave.notifySSE.es) {
			_globalData2.default.neverSave.notifySSE.es.close();
			_globalData2.default.neverSave.notifySSE.status = 'closed';
			_globalData2.default.neverSave.notifySSE.es = '';
		}
	};
	
	exports.default = notifyMsgAndFill;

/***/ }),
/* 113 */
/*!**************************************!*\
  !*** ./src/js/notifyStateAndFill.js ***!
  \**************************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _api = __webpack_require__(/*! ./api */ 10);
	
	var _showmethod = __webpack_require__(/*! ./showmethod */ 48);
	
	var _showlog = __webpack_require__(/*! ./showlog */ 57);
	
	var _getConnectList = __webpack_require__(/*! ./getConnectList */ 64);
	
	var _urlconfig = __webpack_require__(/*! ./urlconfig */ 56);
	
	var _globalData = __webpack_require__(/*! ./globalData */ 50);
	
	var _globalData2 = _interopRequireDefault(_globalData);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var notifyStateAndFill = {};
	notifyStateAndFill.start = function () {
		if (_urlconfig.data.access_token) (0, _urlconfig.updateUrlArr)(_globalData2.default.saved.acaddress);
		_globalData2.default.neverSave.stateSSE.status = 'toOpen';
		if (_globalData2.default.neverSave.stateSSE.es !== '') {
			return;
		}
		var url = _urlconfig.urlArr.getConnectState,
		    ajaxResult = _api.api.getConnectState(url, _globalData2.default.neverSave.stateSSE),
		    $parent = $('#connectState ul');
		var _data = '';
		ajaxResult.addEventListener('message', function (e) {
			(0, _showlog.showLog)($parent, {
				message: e.data
			});
			if (!e.data.match("keep-alive")) {
				_data = JSON.parse(e.data);
				stateNotifyHandle(_data);
			}
		});
		(0, _showmethod.showMethod)('getConnectState');
	};
	
	function stateNotifyHandle(data) {
		var state = data.connectionState,
		    mac = data.handle,
		    $l3 = $('.box .l3 ul.bb1'),
		    $li = $l3.children('li:has(span.layui-input:contains("' + mac + '"))');
	
		if (state === 'connected' && !$li[0]) {
			$l3.append((0, _getConnectList.htmlTemp)(mac, ''));
		} else if (state === 'disconnected') {
			$li[0] && $li.slideUp('normal', function () {
				this.parentNode.removeChild(this);
			});
		}
	}
	notifyStateAndFill.stop = function () {
		_globalData2.default.neverSave.stateSSE.status = 'toClosed';
		if (_globalData2.default.neverSave.stateSSE.es) {
			_globalData2.default.neverSave.stateSSE.es.close();
			console.log('has closed');
			_globalData2.default.neverSave.stateSSE.status = 'closed';
			_globalData2.default.neverSave.stateSSE.es = '';
		}
	};
	
	exports.default = notifyStateAndFill;

/***/ }),
/* 114 */
/*!******************************!*\
  !*** ./src/js/connectTip.js ***!
  \******************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.connectTips = undefined;
	
	var _globalData = __webpack_require__(/*! ./globalData */ 50);
	
	var _globalData2 = _interopRequireDefault(_globalData);
	
	var _connectDevice = __webpack_require__(/*! ./connectDevice */ 6);
	
	var _connectDevice2 = _interopRequireDefault(_connectDevice);
	
	var _tips = __webpack_require__(/*! ./tips */ 115);
	
	var _tips2 = _interopRequireDefault(_tips);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function htmlString() {
	  var temp = '<form class="layui-form  connect-tip tip" action="#">\n  <div class="layui-form-item">\n    <label class="layui-form-label">Connect a device\uFF1AGET</label>\n  </div>\n  <fieldset class="layui-elem-field layui-field-title">\n    <legend  i18n=\'arguments\'>\u53C2\u6570</legend>\n  </fieldset>\n  <div class="layui-form-item">\n    <label class="layui-form-label">chip:</label>\n    <div class="layui-input-inline">\n      <input type="text" name="chip"  placeholder="0 OR 1" lay-verify=\'zeroOne\'  value="' + (_globalData2.default.saved.chip ? _globalData2.default.saved.chip : '') + '" class="layui-input">\n    </div>\n     <div class="layui-form-mid layui-word-aux" i18n = \'required\'>(\u5FC5\u586B)</div>\n  </div>\n  <div class="layui-form-item">\n    <label class="layui-form-label">deviceMac:</label>\n    <div class="layui-input-inline">\n      <input type="text" name="deviceMac"  placeholder="CC:1B:E0:E0:10:C1" value="' + (_globalData2.default.saved.deviceMac ? _globalData2.default.saved.deviceMac : '') + '" lay-verify=\'deviceMac\'  class="layui-input">\n    </div>\n    <div class="layui-form-mid layui-word-aux" i18n = \'required\'>(\u5FC5\u586B)</div>\n  </div>\n  <div class="layui-form-item select">\n    <label class="layui-form-label">type:</label>\n    <div class="layui-inline">\n     <select name="type">\n      <option value="public" ' + (_globalData2.default.type === 'public' ? 'selected' : null) + '>public</option>\n      <option value="random" ' + (_globalData2.default.type === 'random' ? 'selected' : null) + '>random</option>\n     </select>\n    </div>\n  </div>\n  \n  <fieldset class="layui-elem-field layui-field-title">\n    <legend i18n = \'description\'>\u63CF\u8FF0</legend>\n  </fieldset>\n  <div class="layui-form-item layui-form-text">\n    <div class="descriptors connect-des">\n      <p i18n="connect-Tip-p1"><b>chip\uFF1A</b>\u84DD\u7259\u8DEF\u7531\u5668\u5171\u6709\u4E24\u4E2A\u82AF\u7247\uFF0C\u82AF\u72470\u548C\u82AF\u72471\uFF0C\u5728\u8C03\u7528\u63A5\u53E3\u65F6\u53EF\u4EE5\u901A\u8FC7\u6DFB\u52A0queryString\u6765\u9009\u62E9\u82AF\u7247(?chip=0\u6216\u8005?chip=1)\uFF0C\u6BCF\u4E2A\u82AF\u7247\u7684\u8FDE\u63A5\u4E0A\u9650\u662F11\u4E2A\u8BBE\u5907\uFF0C\u5982\u679C\u4E0D\u586B\u6B64\u53C2\u6570\uFF0C\u84DD\u7259\u8DEF\u7531\u5668\u4F1A\u6839\u636E\u8FDE\u63A5\u6570\u91CF\u81EA\u52A8\u5339\u914D\u82AF\u7247\u3002</p>\n      <p i18n="connect-Tip-p2"><b>deviceMac\uFF1A</b>\u8981\u8FDE\u63A5\u7684\u8BBE\u5907\u7684MAC\u5730\u5740\u3002</p>\n      <p i18n="connect-Tip-p3"><b>type\uFF1A</b>\u6B64\u53C2\u6570\u5728body\u4E2D\uFF0C\u662F\u5FC5\u586B\u9879\u3002\u84DD\u7259\u8BBE\u5907\u7684MAC\u5730\u5740\u5206\u4E3Arandom\u548Cpublic\u4E24\u79CD\uFF0C\u6240\u4EE5\u5728\u8FDE\u63A5\u8BBE\u5907\u65F6\uFF0C\u9700\u8981\u6307\u51FA\u8BBE\u5907\u7684\u5E7F\u64ADtype\uFF0C\u5E7F\u64ADtype\u53EF\u4EE5\u4ECE\u626B\u63CF\u6570\u636E\u4E2D\u83B7\u53D6\u3002</p>\n    </div>\n  </div>\n  <div class="layui-form-item">\n    <div class="layui-input-block">\n      <button class="layui-btn" lay-submit lay-filter="connect">do</button>\n    </div>\n  </div>\n</form>';
	  return temp;
	}
	
	function connectTips(layer, form, $dom) {
	  form.verify({
	    deviceMac: [/^([0-9a-f]{2}:){5}[0-9a-f]{2}$/gi, '请输入正确的mac地址'],
	    zeroOne: [/^[01]$/, '请输入chip,0或者1']
	  });
	
	  function dos(layer, form) {
	    form.on('submit(connect)', function (data) {
	      _globalData2.default.saved.chip = data.field.chip;
	      _globalData2.default.saved.deviceMac = data.field.deviceMac;
	      _globalData2.default.type = data.field.type;
	      var deviceMac = data.field.deviceMac,
	          type = data.field.type,
	          chip = data.field.chip;
	      (0, _connectDevice2.default)(chip, type, deviceMac);
	      layer.closeAll('tips');
	      return false;
	    });
	  }
	  (0, _tips2.default)(layer, htmlString, $dom, dos, form);
	  form.render();
	}
	
	exports.connectTips = connectTips;

/***/ }),
/* 115 */
/*!************************!*\
  !*** ./src/js/tips.js ***!
  \************************/
/***/ (function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	function tip(layer, htmlString, $dom, dos, form) {
	
		layer.open({
			type: 4,
			area: ['400px', 'auto'],
	
			closeBtn: 0,
			shadeClose: true,
			fixed: false,
			maxmin: false,
			anim: 5,
			tips: [2, '#2F4056'],
			content: [htmlString(), $dom],
			success: dos.bind(null, layer, form, $dom)
		});
	}
	
	exports.default = tip;

/***/ }),
/* 116 */
/*!***************************!*\
  !*** ./src/js/scanTip.js ***!
  \***************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _globalData = __webpack_require__(/*! ./globalData */ 50);
	
	var _globalData2 = _interopRequireDefault(_globalData);
	
	var _scan = __webpack_require__(/*! ./scan */ 117);
	
	var _scan2 = _interopRequireDefault(_scan);
	
	var _tips = __webpack_require__(/*! ./tips */ 115);
	
	var _tips2 = _interopRequireDefault(_tips);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function htmlString() {
	  var temp = '<form class="layui-form  scan-tip tip" action="#">\n  <div class="layui-form-item">\n    <label class="layui-form-label">Scan\uFF1AGET/SSE</label>\n  </div>\n  <fieldset class="layui-elem-field layui-field-title">\n    <legend i18n = \'arguments\'>\u53C2\u6570</legend>\n  </fieldset>\n  <div class="layui-form-item">\n    <label class="layui-form-label">chip:</label>\n    <div class="layui-input-inline">\n      <input type="text" name="chip"  value=' + (_globalData2.default.saved.chip !== '' ? _globalData2.default.saved.chip : '0') + ' placeholder="0\u6216\u80051" lay-verify=\'zeroOrOne\'  class="layui-input">\n    </div>\n     <div class="layui-form-mid layui-word-aux" i18n=\'optional\'>(\u9009\u586B)</div>\n  </div>\n  <fieldset class="layui-elem-field layui-field-title">\n    <legend i18n=\'description\'>\u63CF\u8FF0</legend>\n  </fieldset>\n  <div class="layui-form-item layui-form-text">\n    <div class="descriptors scan-des">\n      <p i18n="interfaceURL"><b>\u63A5\u53E3URL\uFF1A</b>\u8C03\u7528\u63A5\u53E3\u540E\uFF0C\u6B64URL\u4F1A\u81EA\u52A8\u751F\u6210\u5728\u4E0B\u9762\u7684\u201DAPI\u63A5\u53E3\u201D\u7684\u7A97\u53E3\u4E2D</p>\n      <p i18n="scan-Tip-p1"><b>\u63A5\u53E3\u63CF\u8FF0\uFF1A</b>\u6B64\u63A5\u53E3\u662Fsse\u957F\u94FE\u63A5\u8C03\u7528\u63A5\u53E3\u540E\uFF0C\u84DD\u7259\u8DEF\u7531\u5668\u4F1A\u626B\u63CF\u5468\u8FB9\u7684\u8BBE\u5907,\u5E76\u5C06\u84DD\u7259\u8BBE\u5907\u7684MAC\u5730\u5740(bdaddr)\u3001\u5E7F\u64ADtype\uFF08bdaddrType\uFF09\u3001\u5E7F\u64AD\u62A5\u6570\u636E\uFF08adData/scanData\uFF09\u3001\u8BBE\u5907\u540D\u79F0\uFF08name\uFF09\u3001\u4FE1\u53F7\u5F3A\u5EA6\uFF08rssi\uFF09\u7B49\u4FE1\u606F\u4EE5http response\u7684\u5F62\u5F0F\u8FD4\u56DE\uFF08\u539F\u59CB\u6570\u636E\u89C1\u201Chttp response\u201D\u7A97\u53E3\u3002</p>\n      <p i18n="scan-Tip-p2"><b> \u53C2\u6570\u89E3\u91CA\uFF1Achip\uFF1A</b>\u84DD\u7259\u8DEF\u7531\u5668\u5171\u6709\u4E24\u4E2A\u82AF\u7247\uFF0C\u82AF\u72470\u548C\u82AF\u72471\uFF0C\u5728\u8C03\u7528\u63A5\u53E3\u65F6\u53EF\u4EE5\u901A\u8FC7\u6DFB\u52A0queryString\u6765\u9009\u62E9\u82AF\u7247(?chip=0\u6216\u8005?chip=1)\uFF0C\u5982\u679C\u4E0D\u586B,\u4F1A\u9ED8\u8BA4\u7528\u82AF\u72470\u626B\u63CF\uFF0C\u82AF\u72470\u626B\u63CF\u8DDD\u79BB\u4F1A\u4F18\u4E8E\u82AF\u72471\uFF0C\u4E5F\u5EFA\u8BAE\u4E00\u822C\u60C5\u51B5\u4E0B\u4F7F\u7528\u82AF\u72470\u626B\u63CF\u3002</p>\n      <p i18n="notify-Tip-p2"><b>SSE\uFF1A</b>server-sent events\uFF0C\u7B80\u79F0\uFF1Asee\u3002\u662F\u4E00\u79CDhttp\u7684\u957F\u94FE\u63A5\uFF0C\u8BF7\u6C42\u9700\u8981\u624B\u52A8\u5173\u95ED\uFF0C\u5426\u5219\u7406\u8BBA\u4E0A\u5728\u4E0D\u62A5\u9519\u7684\u60C5\u51B5\u4E0B\u4F1A\u4E00\u76F4\u8FDB\u884C\uFF0C\u6BCF\u6761\u6570\u636E\u4F1A\u4EE5\u201Cdata: \u201D \u5F00\u5934\u3002\u5728\u8C03\u8BD5\u4E2D\u53EF\u4EE5\u76F4\u63A5\u5C06sse\u7684url\u8F93\u5165\u5728\u6D4F\u89C8\u5668\u4E2D\u8FDB\u884C\u8C03\u7528\u3002\u4F46\u662F\u5728\u7F16\u7A0B\u4E2D\u4F7F\u7528\u4E00\u822C\u7684http\u8BF7\u6C42\u65E0\u6CD5\u8BF7\u6C42\u5230\u6570\u636E(\u4E00\u822C\u7684http\u8BF7\u6C42\u90FD\u662F\u5728\u8BF7\u6C42\u7ED3\u675F\u540E\u8FD4\u56DE\u6240\u6709\u7684\u6570\u636E)\uFF0C\u6211\u4EEC\u76EE\u524D\u63D0\u4F9B\u4E86iOS/java/nodejs/js/c#\u7B49\u7684demo\u6765\u5B9E\u73B0sse\u7684\u8C03\u7528\uFF0C\u5982\u679C\u5728\u8FD9\u65B9\u9762\u9047\u5230\u56F0\u96BE\u53EF\u4EE5\u53C2\u8003\u3002\u53E6\u5916\uFF0C\u5F53\u8C03\u7528sse\u65F6\uFF0C\u6700\u597D\u5BF9\u8BE5\u957F\u94FE\u63A5\u8FDB\u884C\u76D1\u63A7\uFF0C\u4EE5\u4FBF\u5728\u957F\u94FE\u63A5\u51FA\u73B0\u9519\u8BEF\u6216\u610F\u5916\u505C\u6B62\u540E\u8FDB\u884C\u91CD\u542F\uFF0C\u6216\u8005\u5176\u4ED6\u64CD\u4F5C\u3002</p>\n    \n    </div>\n  </div>\n  \n  <div class="layui-form-item">\n    <div class="layui-input-block">\n      <button class="layui-btn" lay-submit lay-filter="scan">do</button>\n    </div>\n  </div>\n</form>';
	  return temp;
	}
	
	function scanTip(layer, form, $dom) {
	  form.verify({
	    zeroOrOne: function zeroOrOne(value) {
	      if (!(value === '0' || value === '1' || value === '')) {
	        return '必须是0或者1';
	      }
	    }
	  });
	
	  function dos(layer, form) {
	
	    form.on('submit(scan)', function (data) {
	      _globalData2.default.saved.chip = data.field.chip;
	      $('#scanSwitch').prop('checked', true);
	      _scan2.default.start({
	        chip: _globalData2.default.saved.chip || 0
	      }, _globalData2.default.timeOut);
	
	      form.render('checkbox');
	      layer.closeAll('tips');
	      return false;
	    });
	  }
	  (0, _tips2.default)(layer, htmlString, $dom, dos, form);
	}
	
	exports.default = scanTip;

/***/ }),
/* 117 */
/*!************************!*\
  !*** ./src/js/scan.js ***!
  \************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _api = __webpack_require__(/*! ./api */ 10);
	
	var _showlog = __webpack_require__(/*! ./showlog */ 57);
	
	var _globalData = __webpack_require__(/*! ./globalData */ 50);
	
	var _globalData2 = _interopRequireDefault(_globalData);
	
	var _showmethod = __webpack_require__(/*! ./showmethod */ 48);
	
	var _urlconfig = __webpack_require__(/*! ./urlconfig */ 56);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var scan = {
	    start: scanHandle,
	    stop: stop
	},
	    itemHandle = {},
	    $log = $('#scanLog ul');
	itemHandle.add = function (data) {
	    var _data = {
	        mac: data.mesg.bdaddrs[0].bdaddr,
	        name: data.mesg.name,
	        type: data.mesg.bdaddrs[0].bdaddrType,
	        rssi: data.mesg.rssi
	    };
	
	    if (data.allItem[_data.mac]) {
	        if (_data.name !== "(unknown)") data.allItem[_data.mac].name.innerHTML = _data.name;
	
	        if (data.allItem[_data.mac].lastUpdate !== data.allItem[_data.mac].flag) {
	            if (data.allItem[_data.mac].rssi.innerHTML !== _data.rssi) {
	                data.allItem[_data.mac].rssi.innerHTML = _data.rssi;
	                data.allItem[_data.mac].lastUpdate = data.allItem[_data.mac].flag;
	            }
	        }
	
	        data.allItem[_data.mac].rssi.style.color = '#5FB878';
	    } else {
	        data.allItem[_data.mac] = createItem(_data);
	        data.parentNode.appendChild(data.allItem[_data.mac].li);
	        data.allItem[_data.mac].rssi.style.color = 'red';
	    }
	    data.allItem[_data.mac].mesg = data.mesg;
	    data.allItem[_data.mac].flag = data.flag;
	    data.allItem[_data.mac].lastUpdate = data.flag;
	
	    function createItem(data) {
	
	        var li = document.createElement('li'),
	            result = {
	            li: li
	        },
	            temp = void 0,
	            divLayuiFormItem = void 0,
	            count = 0;
	        for (var i in data) {
	            temp = _createItem(i, data[i]);
	            if (count % 2 === 0) {
	                divLayuiFormItem = document.createElement('div');
	                divLayuiFormItem.className = "layui-form-item";
	            }
	
	            divLayuiFormItem.appendChild(temp.divLayuiInline);
	            li.appendChild(divLayuiFormItem);
	            result[i] = temp.spanLayuiInput;
	            count++;
	        }
	
	        divLayuiFormItem = document.createElement('div');
	        divLayuiFormItem.className = "layui-form-item";
	        divLayuiFormItem.innerHTML = '<div class="layui-input-inline">\n\t\t\t\t\t\t\t\t<button style="display:inline-block" class="layui-btn" data-action="connect" data-type=' + data.type + ' data-mac=' + data.mac + '>connect</button>\n\t\t\t\t\t\t\t</div>';
	        li.appendChild(divLayuiFormItem);
	
	        count = null;
	        temp = null;
	        divLayuiFormItem = null;
	
	        return result;
	
	        function _createItem(name, value) {
	
	            var divLayuiInline = document.createElement('div'),
	                labelLyauiFomrLabel = document.createElement('label'),
	                divlayuiInputInline = document.createElement('div'),
	                spanLayuiInput = document.createElement('span');
	
	            divLayuiInline.className = "layui-inline";
	            labelLyauiFomrLabel.className = "layui-form-label";
	            divlayuiInputInline.className = "layui-input-inline";
	            spanLayuiInput.className = "layui-input";
	
	            labelLyauiFomrLabel.innerHTML = name + ':';
	            spanLayuiInput.innerHTML = value;
	
	            divlayuiInputInline.appendChild(spanLayuiInput);
	            divLayuiInline.appendChild(labelLyauiFomrLabel);
	            divLayuiInline.appendChild(divlayuiInputInline);
	
	            return {
	                divLayuiInline: divLayuiInline,
	                labelLyauiFomrLabel: labelLyauiFomrLabel,
	                spanLayuiInput: spanLayuiInput
	            };
	        }
	    }
	};
	itemHandle.destroy = function (data) {
	    data.el.removeChild(data.allItem[data.mac].li);
	    delete data.allItem[data.mac];
	};
	
	function scanHandle(_data, timeout) {
	    if (_urlconfig.data.access_token) (0, _urlconfig.updateUrlArr)(_globalData2.default.saved.acaddress);
	    if (_globalData2.default.neverSave.scanSSE.es !== '') return;
	    _globalData2.default.neverSave.scanSSE.status = 'toOpen';
	    var _allItem = {},
	        parentNode = document.querySelector('.l2 ul.bb1'),
	        url = _urlconfig.urlArr.scan;
	    parentNode.innerHTML = '';
	    _globalData2.default.neverSave.scanSSE.timer = null;
	    _globalData2.default.neverSave.scanSSE.es = null;
	    _api.api.start(url, _data, _globalData2.default.neverSave.scanSSE, cb.bind(null, timeout));
	    (0, _showmethod.showMethod)('scan');
	
	    _globalData2.default.neverSave.scanSSE.timer = setInterval(function () {
	        checkDeviceTimeout(_allItem);
	    }, 1000);
	
	    function checkDeviceTimeout(obj) {
	        if (_globalData2.default.neverSave.scanSSE.status === 'toClosed') {
	            return;
	        }
	
	        for (var index in obj) {
	            if (obj[index].flag > 0) {
	                obj[index].flag--;
	            } else {
	                itemHandle.destroy({
	                    el: parentNode,
	                    mac: index,
	                    allItem: _allItem
	                });
	            }
	        }
	    }
	
	    function cb(timeout, item) {
	        itemHandle.add({
	            parentNode: parentNode,
	            mesg: JSON.parse(item),
	            allItem: _allItem,
	            flag: timeout
	
	        });
	    }
	}
	
	function stop() {
	    _globalData2.default.neverSave.scanSSE.status = 'toClosed';
	    _globalData2.default.neverSave.scanSSE.es && _globalData2.default.neverSave.scanSSE.es.close();
	    clearInterval(_globalData2.default.neverSave.scanSSE.timer);
	    _globalData2.default.neverSave.scanSSE.es = '';
	}
	
	exports.default = scan;

/***/ }),
/* 118 */
/*!**********************************!*\
  !*** ./src/js/connectListTip.js ***!
  \**********************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
			value: true
	});
	
	var _tips = __webpack_require__(/*! ./tips */ 115);
	
	var _tips2 = _interopRequireDefault(_tips);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function htmlString() {
			var temp = '<form class="layui-form  connect-tip tip" action="#">\n  <div class="layui-form-item">\n    <label class="layui-form-label">Get connected devices as list\uFF1AGET</label>\n  </div>\n  <fieldset class="layui-elem-field layui-field-title">\n    <legend i18n=\'arguments\'>\u63CF\u8FF0</legend>\n  </fieldset>\n  <div class="layui-form-item layui-form-text">\n    <div class="descriptors connect-des">\n      <p i18n="interfaceURL"><b>\u63A5\u53E3URL\uFF1A</b>\u8C03\u7528\u63A5\u53E3\u540E\uFF0C\u6B64URL\u4F1A\u81EA\u52A8\u751F\u6210\u5728\u4E0B\u9762\u7684\u201DAPI\u63A5\u53E3\u201D\u7684\u7A97\u53E3\u4E2D\u3002</p>\n      <p i18n="connectList-Tip-p2"><b>\u63A5\u53E3\u63CF\u8FF0\uFF1A</b>\u6B64\u63A5\u53E3\u662FGET\u8BF7\u6C42\uFF0C\u8C03\u7528\u63A5\u53E3\u540E\uFF0C\u84DD\u7259\u8DEF\u7531\u5668\u4F1A\u5C06\u76EE\u524D\u8FDE\u63A5\u7684\u8BBE\u5907\u7684\u5217\u8868\u8FD4\u56DE\u5230pc\u7AEF\u3002</p>\n    </div>\n  </div>\n  <div class="layui-form-item">\n    <div class="layui-input-block">\n      <button class="layui-btn" lay-submit lay-filter="connectList">do</button>\n    </div>\n  </div>\n</form>';
			return temp;
	}
	
	function connectListTip(layer, form, $dom) {
			form.verify({
					deviceMac: [/^([0-9a-f]{2}:){5}[0-9a-f]{2}$/gi, '请输入正确的mac地址'],
					zeroOne: [/^[01]$/, '请输入chip,0或者1']
			});
	
			function dos(layer, form, $dom) {
					$('form.connect-tip button[lay-filter="connectList"]')[0].fn = $dom.fn;
					form.on('submit(connectList)', function (data) {
							data.elem.fn && data.elem.fn();
							layer.closeAll('tips');
							return false;
					});
			}
	
			(0, _tips2.default)(layer, htmlString, $dom, dos, form);
			form.render();
	}
	
	exports.default = connectListTip;

/***/ }),
/* 119 */
/*!*************************************!*\
  !*** ./src/js/getAllServicesTip.js ***!
  \*************************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
			value: true
	});
	
	var _globalData = __webpack_require__(/*! ./globalData */ 50);
	
	var _globalData2 = _interopRequireDefault(_globalData);
	
	var _tips = __webpack_require__(/*! ./tips */ 115);
	
	var _tips2 = _interopRequireDefault(_tips);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function getAllServicesTip(layer, form, $dom) {
	
			function htmlString() {
					var temp = '<form class="layui-form  getAllServices-tip tip" action="#">\n  <div class="layui-form-item">\n    <label class="layui-form-label">Get all services\uFF1AGET</label>\n  </div>\n  <fieldset class="layui-elem-field layui-field-title">\n    <legend i18n =\'arguments\'>\u53C2\u6570</legend>\n  </fieldset>\n  <div class="layui-form-item">\n    <label class="layui-form-label">deviceMac:</label>\n    <div class="layui-input-inline">\n      <input type="text" name="deviceMac"  placeholder="CC:1B:E0:E0:10:C1" value="' + (_globalData2.default.saved.deviceMac ? _globalData2.default.saved.deviceMac : '') + '" lay-verify=\'deviceMac\'  class="layui-input">\n    </div>\n    <div class="layui-form-mid layui-word-aux" i18n = \'required\'>(\u5FC5\u586B)</div>\n  </div>\n  <fieldset class="layui-elem-field layui-field-title">\n    <legend i18n = \'description\'>\u63CF\u8FF0</legend>\n  </fieldset>\n  <div class="layui-form-item layui-form-text">\n    <div class="descriptors connect-des">\n      <p i18n="interfaceURL"><b>\u63A5\u53E3URL\uFF1A</b>\u8C03\u7528\u63A5\u53E3\u540E\uFF0C\u6B64URL\u4F1A\u81EA\u52A8\u751F\u6210\u5728\u4E0B\u9762\u7684\u201DAPI\u63A5\u53E3\u201D\u7684\u7A97\u53E3\u4E2D\u3002</p>\n      <p i18n="services-Tip-p1"><b>\u63A5\u53E3\u63CF\u8FF0\uFF1A</b>\u6B64\u63A5\u53E3\u662FGET\u8BF7\u6C42\uFF0C\u8C03\u7528\u63A5\u53E3\u540E\uFF0C\u84DD\u7259\u8DEF\u7531\u5668\u4F1A\u5411\u6307\u5B9A\u7684\u84DD\u7259\u8BBE\u5907\u8BF7\u6C42\u5176\u670D\u52A1\u7684\u6811\u5F62\u5217\u8868\uFF0C\u8C03\u7528\u6B21\u63A5\u53E3\u7684\u4E3B\u8981\u76EE\u7684\u662F\u4E3A\u5BF9\u84DD\u7259\u8BBE\u5907\u8FDB\u884C\u8BFB\u5199\u64CD\u4F5C\u65F6\uFF0C\u83B7\u53D6\u84DD\u7259\u8BBE\u5907\u7684characteristic\u6240\u5BF9\u5E94\u7684valueHandle\u6216\u8005handle\u3002</p>\n      <p i18n="services-Tip-p2"><b>\u53C2\u6570\u89E3\u91CA\uFF1AdeviceMac\uFF1A</b>\u8981\u8BF7\u6C42\u670D\u52A1\u5217\u8868\u7684\u8BBE\u5907\u7684MAC\u5730\u5740\u3002</p>\n    </div>\n  </div>\n  <div class="layui-form-item">\n    <div class="layui-input-block">\n      <button class="layui-btn" lay-submit lay-filter="bdiscoverSer">do</button>\n    </div>\n  </div>\n</form>';
					return temp;
			}
	
			form.verify({
					deviceMac: [/^([0-9a-f]{2}:){5}[0-9a-f]{2}$/gi, '请输入正确的mac地址'],
					zeroOne: [/^[01]$/, '请输入chip,0或者1']
			});
	
			function dos(layer, form, $dom) {
					$('form.getAllServices-tip button[lay-filter="bdiscoverSer"]')[0].fn = $dom.fn;
					form.on('submit(bdiscoverSer)', function (data) {
							_globalData2.default.saved.deviceMac = $('.getAllServices-tip input').val().trim();
							data.elem.fn && data.elem.fn(_globalData2.default.saved.deviceMac);
							layer.closeAll('tips');
							return false;
					});
			}
	
	
			(0, _tips2.default)(layer, htmlString, $dom, dos, form);
			form.render();
	}
	
	exports.default = getAllServicesTip;

/***/ }),
/* 120 */
/*!********************************!*\
  !*** ./src/js/notifyMsgTip.js ***!
  \********************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _globalData = __webpack_require__(/*! ./globalData */ 50);
	
	var _globalData2 = _interopRequireDefault(_globalData);
	
	var _tips = __webpack_require__(/*! ./tips */ 115);
	
	var _tips2 = _interopRequireDefault(_tips);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function htmlString() {
		console.log(_globalData2.default.neverSave.notifySSE.status);
		var temp = '<form class="layui-form  notifyMsg-tip tip" action="#">\n  <div class="layui-form-item">\n    <label class="layui-form-label">Receive indication &amp; notification\uFF1AGET/SSE</label>\n  </div>\n  <fieldset class="layui-elem-field layui-field-title">\n    <legend i18n =\'hubNotifyStatus\'>Hub\u901A\u77E5\u72B6\u6001</legend>\n  </fieldset>\n  <div class="layui-form-item">\n    <div class="layui-inline">\n\t\t<label class="layui-form-label" style="width:auto" i18n=\'openHubNotify\'>\u6253\u5F00Hub\u901A\u77E5</label>\n\t\t<input type="checkbox" lay-skin="switch" lay-filter="switchNotifyMsg1" title="\u6253\u5F00\u901A\u77E5" ' + (_globalData2.default.neverSave.notifySSE.status.indexOf('pen') !== -1 ? 'checked' : '') + '>\n\t</div>\n  </div>\n  <fieldset class="layui-elem-field layui-field-title">\n    <legend i18n=\'description\'>\u63CF\u8FF0</legend>\n  </fieldset>\n  <div class="layui-form-item layui-form-text">\n    <div class="descriptors connect-des">\n      <p i18n="interfaceURL"><b>\u63A5\u53E3URL\uFF1A</b>\u8C03\u7528\u63A5\u53E3\u540E\uFF0C\u6B64URL\u4F1A\u81EA\u52A8\u751F\u6210\u5728\u4E0B\u9762\u7684\u201DAPI\u63A5\u53E3\u201D\u7684\u7A97\u53E3\u4E2D\u3002</p>\n      <p i18n="notify-Tip-p1"><b>\u63A5\u53E3\u63CF\u8FF0\uFF1A</b>\u6B64\u63A5\u53E3\u662Fsse\u957F\u94FE\u63A5\uFF0C\u5F53\u6253\u5F00\u84DD\u7259\u8BBE\u5907\u7684notification/indication\u540E\uFF0C\u84DD\u7259\u8BBE\u5907\u4F1A\u5C06\u6D88\u606F\u4E0A\u62A5\u5230\u84DD\u7259\u8DEF\u7531\u5668\uFF0C\u4F46\u662F\u5982\u679C\u5728pc\u4E0A\u5E0C\u671B\u63A5\u6536\u5230\u6B64\u6D88\u606F\uFF0C\u8FD8\u9700\u8981\u8C03\u7528\u6B64\u63A5\u53E3\u6765\u5EFA\u7ACB\u84DD\u7259\u8DEF\u7531\u5668\u5230pc\u7AEF\u7684\u6570\u636E\u901A\u8DEF\uFF0C\u8FD9\u6837\u84DD\u7259\u8DEF\u7531\u5668\u624D\u4F1A\u5C06\u6536\u5230\u7684\u84DD\u7259\u8BBE\u5907\u7684\u6570\u636E\u8F6C\u53D1\u5230pc\u7AEF\u3002</p>\n      <p i18n="notify-Tip-p2"><b>SSE\uFF1A</b>server-sent events\uFF0C\u7B80\u79F0\uFF1Asee\u3002\u662F\u4E00\u79CDhttp\u7684\u957F\u94FE\u63A5\uFF0C\u8BF7\u6C42\u9700\u8981\u624B\u52A8\u5173\u95ED\uFF0C\u5426\u5219\u7406\u8BBA\u4E0A\u5728\u4E0D\u62A5\u9519\u7684\u60C5\u51B5\u4E0B\u4F1A\u4E00\u76F4\u8FDB\u884C\uFF0C\u6BCF\u6761\u6570\u636E\u4F1A\u4EE5\u201Cdata: \u201D \u5F00\u5934\u3002\u5728\u8C03\u8BD5\u4E2D\u53EF\u4EE5\u76F4\u63A5\u5C06sse\u7684url\u8F93\u5165\u5728\u6D4F\u89C8\u5668\u4E2D\u8FDB\u884C\u8C03\u7528\u3002\u4F46\u662F\u5728\u7F16\u7A0B\u4E2D\u4F7F\u7528\u4E00\u822C\u7684http\u8BF7\u6C42\u65E0\u6CD5\u8BF7\u6C42\u5230\u6570\u636E(\u4E00\u822C\u7684http\u8BF7\u6C42\u90FD\u662F\u5728\u8BF7\u6C42\u7ED3\u675F\u540E\u8FD4\u56DE\u6240\u6709\u7684\u6570\u636E)\uFF0C\u6211\u4EEC\u76EE\u524D\u63D0\u4F9B\u4E86iOS/java/nodejs/js/c#\u7B49\u7684demo\u6765\u5B9E\u73B0sse\u7684\u8C03\u7528\uFF0C\u5982\u679C\u5728\u8FD9\u65B9\u9762\u9047\u5230\u56F0\u96BE\u53EF\u4EE5\u53C2\u8003\u3002\u53E6\u5916\uFF0C\u5F53\u8C03\u7528sse\u65F6\uFF0C\u6700\u597D\u5BF9\u8BE5\u957F\u94FE\u63A5\u8FDB\u884C\u76D1\u63A7\uFF0C\u4EE5\u4FBF\u5728\u957F\u94FE\u63A5\u51FA\u73B0\u9519\u8BEF\u6216\u610F\u5916\u505C\u6B62\u540E\u8FDB\u884C\u91CD\u542F\uFF0C\u6216\u8005\u5176\u4ED6\u64CD\u4F5C\u3002</p>\n    </div>\n  </div>\n  <div class="layui-form-item">\n    <div class="layui-input-block">\n      <button class="layui-btn" lay-submit lay-filter="bnotify">do</button>\n    </div>\n  </div>\n</form>';
		return temp;
	}
	
	function notifyMsgTip(layer, form, $dom) {
		function dos(layer, form, $dom) {
			$('form.notifyMsg-tip button[lay-filter="bnotify"]')[0].start = $dom.start;
			$('form.notifyMsg-tip button[lay-filter="bnotify"]')[0].stop = $dom.stop;
			form.on('submit(bnotify)', function (data) {
				if ($('form.notifyMsg-tip input[type="checkbox"]').prop('checked')) {
	
					if (_globalData2.default.neverSave.notifySSE.es === '' && _globalData2.default.neverSave.notifySSE.status !== 'toOpen') {
						_globalData2.default.neverSave.notifySSE.status = 'toOpen';
						$('.l4 input[type="checkbox"]').prop('checked', true);
						form.render('checkbox');
						data.elem.start && data.elem.start();
						layer.closeAll('tips');
					}
				} else {
					$('.l4 input[type="checkbox"]').prop('checked', false);
					form.render('checkbox');
					data.elem.stop && data.elem.stop();
				}
				layer.closeAll('tips');
				return false;
			});
		}
	
		(0, _tips2.default)(layer, htmlString, $dom, dos, form);
		form.render();
	}
	
	exports.default = notifyMsgTip;

/***/ }),
/* 121 */
/*!***************************!*\
  !*** ./src/js/pairTip.js ***!
  \***************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.pairTips = undefined;
	
	var _globalData = __webpack_require__(/*! ./globalData */ 50);
	
	var _globalData2 = _interopRequireDefault(_globalData);
	
	var _pair = __webpack_require__(/*! ./pair */ 61);
	
	var _pair2 = _interopRequireDefault(_pair);
	
	var _tips = __webpack_require__(/*! ./tips */ 115);
	
	var _tips2 = _interopRequireDefault(_tips);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function htmlString() {
	  var temp = '<form class="layui-form  pair-tip tip" action="#">\n  <div class="layui-form-item">\n    <label class="layui-form-label">pair a device\uFF1AGET</label>\n  </div>\n  <fieldset class="layui-elem-field layui-field-title">\n    <legend  i18n=\'arguments\'>\u53C2\u6570</legend>\n  </fieldset>\n  <div class="layui-form-item">\n    <label class="layui-form-label">deviceMac:</label>\n    <div class="layui-input-inline">\n      <input type="text" name="deviceMac"  placeholder="CC:1B:E0:E0:10:C1" value="' + (_globalData2.default.saved.deviceMac ? _globalData2.default.saved.deviceMac : '') + '" lay-verify=\'deviceMac\'  class="layui-input">\n    </div>\n    <div class="layui-form-mid layui-word-aux" i18n = \'required\'>(\u5FC5\u586B)</div>\n  </div>\n  \n  \n  <fieldset class="layui-elem-field layui-field-title">\n    <legend i18n = \'description\'>\u63CF\u8FF0</legend>\n  </fieldset>\n  <div class="layui-form-item layui-form-text">\n    <div class="descriptors pair-des">\n      <p i18n="pair-Tip-p2"><b>deviceMac\uFF1A</b>\u8981\u914D\u5BF9\u7684\u8BBE\u5907\u7684MAC\u5730\u5740\u3002</p>\n    </div>\n  </div>\n  <div class="layui-form-item">\n    <div class="layui-input-block">\n      <button class="layui-btn" lay-submit lay-filter="pair">do</button>\n    </div>\n  </div>\n</form>';
	  return temp;
	}
	
	function pairTips(layer, form, $dom) {
	  form.verify({
	    deviceMac: [/^([0-9a-f]{2}:){5}[0-9a-f]{2}$/gi, '请输入正确的mac地址']
	  });
	
	  function dos(layer, form) {
	    form.on('submit(pair)', function (data) {
	      _globalData2.default.saved.deviceMac = data.field.deviceMac;
	      var deviceMac = data.field.deviceMac;
	      (0, _pair2.default)(deviceMac);
	      layer.closeAll('tips');
	      return false;
	    });
	  }
	  (0, _tips2.default)(layer, htmlString, $dom, dos, form);
	  form.render();
	}
	
	exports.pairTips = pairTips;

/***/ }),
/* 122 */
/*!*****************************!*\
  !*** ./src/js/unpairTip.js ***!
  \*****************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
			value: true
	});
	
	var _globalData = __webpack_require__(/*! ./globalData */ 50);
	
	var _globalData2 = _interopRequireDefault(_globalData);
	
	var _tips = __webpack_require__(/*! ./tips */ 115);
	
	var _tips2 = _interopRequireDefault(_tips);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function htmlString() {
			var temp = '<form class="layui-form  bunpair-tip tip" action="#">\n  <div class="layui-form-item">\n    <label class="layui-form-label">unpair a device\uFF1ADELETE</label>\n  </div>\n  <fieldset class="layui-elem-field layui-field-title">\n    <legend i18n =\'arguments\'>\u53C2\u6570</legend>\n  </fieldset>\n  <div class="layui-form-item">\n    <label class="layui-form-label">deviceMac:</label>\n    <div class="layui-input-inline">\n      <input type="text" name="deviceMac"  placeholder="CC:1B:E0:E0:10:C1" value="' + (_globalData2.default.saved.deviceMac ? _globalData2.default.saved.deviceMac : '') + '" lay-verify=\'deviceMac\'  class="layui-input">\n    </div>\n    <div class="layui-form-mid layui-word-aux" i18n = \'required\'>(\u5FC5\u586B)</div>\n  </div>\n  <fieldset class="layui-elem-field layui-field-title">\n    <legend i18n =\'description\'>\u63CF\u8FF0</legend>\n  </fieldset>\n  <div class="layui-form-item layui-form-text">\n    <div class="descriptors connect-des">\n      <p i18n="interfaceURL"><b>\u63A5\u53E3URL\uFF1A</b>\u8C03\u7528\u63A5\u53E3\u540E\uFF0C\u6B64URL\u4F1A\u81EA\u52A8\u751F\u6210\u5728\u4E0B\u9762\u7684\u201DAPI\u63A5\u53E3\u201D\u7684\u7A97\u53E3\u4E2D\u3002</p>\n      <p i18n="unpair-Tip-p2"><b>\u63A5\u53E3\u63CF\u8FF0\uFF1A</b>\u6B64\u63A5\u53E3\u662FDELETE\u8BF7\u6C42\uFF0C\u8C03\u7528\u63A5\u53E3\u540E\uFF0C\u84DD\u7259\u8DEF\u7531\u5668\u4F1A\u4E0E\u6307\u5B9AMAC\u5730\u5740\u7684\u84DD\u7259\u8BBE\u5907\u65AD\u8FDE\u3002</p>\n      <p i18n="unpair-Tip-p3"><b>\u53C2\u6570\u89E3\u91CA\uFF1AdeviceMac\uFF1A</b>\u8981\u53D6\u6D88\u914D\u5BF9\u7684\u8BBE\u5907\u7684MAC\u5730\u5740\u3002</p>\n    </div>\n  </div>\n  <div class="layui-form-item">\n    <div class="layui-input-block">\n      <button class="layui-btn" lay-submit lay-filter="bunpair">do</button>\n    </div>\n  </div>\n</form>';
			return temp;
	}
	
	function unpairTip(layer, form, $dom) {
			form.verify({
					deviceMac: [/^([0-9a-f]{2}:){5}[0-9a-f]{2}$/gi, '请输入正确的mac地址']
			});
	
			function dos(layer, form, $dom) {
					$('form.bunpair-tip button[lay-filter="bunpair"]')[0].fn = $dom.fn;
					form.on('submit(bunpair)', function (data) {
							var deviceMac = _globalData2.default.saved.deviceMac = $('.bunpair-tip input').val().trim();
							data.elem.fn && data.elem.fn(deviceMac);
							layer.closeAll('tips');
							return false;
					});
			}
	
			(0, _tips2.default)(layer, htmlString, $dom, dos, form);
			form.render();
	}
	
	exports.default = unpairTip;

/***/ }),
/* 123 */
/*!**********************************!*\
  !*** ./src/js/notifyStateTip.js ***!
  \**********************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _globalData = __webpack_require__(/*! ./globalData */ 50);
	
	var _globalData2 = _interopRequireDefault(_globalData);
	
	var _notifyMsgAndFill = __webpack_require__(/*! ./notifyMsgAndFill */ 112);
	
	var _notifyMsgAndFill2 = _interopRequireDefault(_notifyMsgAndFill);
	
	var _tips = __webpack_require__(/*! ./tips */ 115);
	
	var _tips2 = _interopRequireDefault(_tips);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function htmlString() {
		console.log(_globalData2.default.neverSave.stateSSE.status);
		var temp = '<form class="layui-form  notifyState-tip tip" action="#">\n  <div class="layui-form-item">\n    <label class="layui-form-label">Receive indication &amp; notification\uFF1AGET/SSE</label>\n  </div>\n  <fieldset class="layui-elem-field layui-field-title">\n    <legend i18n=\'hubNotifyStatus\'>Hub\u901A\u77E5\u72B6\u6001</legend>\n  </fieldset>\n  <div class="layui-form-item">\n    <div class="layui-inline">\n\t\t<label class="layui-form-label" style="width:auto" i18n=\'openHubNotify\'>\u6253\u5F00Hub\u901A\u77E5</label>\n\t\t<input type="checkbox" lay-skin="switch" lay-filter="" title="\u6253\u5F00\u901A\u77E5" ' + (_globalData2.default.neverSave.stateSSE.status.indexOf('pen') !== -1 ? 'checked' : '') + '>\n\t</div>\n  </div>\n  <fieldset class="layui-elem-field layui-field-title">\n    <legend i18n=\'description\'>\u63CF\u8FF0</legend>\n  </fieldset>\n  <div class="layui-form-item layui-form-text">\n    <div class="descriptors connect-des">\n      <p i18n="interfaceURL"><b>\u63A5\u53E3URL\uFF1A</b>\u8C03\u7528\u63A5\u53E3\u540E\uFF0C\u6B64URL\u4F1A\u81EA\u52A8\u751F\u6210\u5728\u4E0B\u9762\u7684\u201DAPI\u63A5\u53E3\u201D\u7684\u7A97\u53E3\u4E2D\u3002</p>\n      <p i18n="connState-Tip-p1"><b>\u63A5\u53E3\u63CF\u8FF0\uFF1A</b>\u6B64\u63A5\u53E3\u662Fsse\u957F\u94FE\u63A5\uFF0C\u5F53\u84DD\u7259\u8DEF\u7531\u5668\u4E0A\u7684\u84DD\u7259\u8BBE\u5907\u7684\u8FDE\u63A5\u72B6\u6001\u53D1\u751F\u6539\u53D8\u65F6\uFF08\u8FDE\u63A5\u6210\u529F\u6216\u8005\u53D1\u751F\u65AD\u8FDE\uFF09\uFF0C\u4F1A\u901A\u8FC7\u6B64\u63A5\u53E3\u5C06\u6D88\u606F\u901A\u77E5\u5230pc\u7AEF\u3002</p>\n      <p i18n="notify-Tip-p2"><b>SSE\uFF1A</b>server-sent events\uFF0C\u7B80\u79F0\uFF1Asee\u3002\u662F\u4E00\u79CDhttp\u7684\u957F\u94FE\u63A5\uFF0C\u8BF7\u6C42\u9700\u8981\u624B\u52A8\u5173\u95ED\uFF0C\u5426\u5219\u7406\u8BBA\u4E0A\u5728\u4E0D\u62A5\u9519\u7684\u60C5\u51B5\u4E0B\u4F1A\u4E00\u76F4\u8FDB\u884C\uFF0C\u6BCF\u6761\u6570\u636E\u4F1A\u4EE5\u201Cdata: \u201D \u5F00\u5934\u3002\u5728\u8C03\u8BD5\u4E2D\u53EF\u4EE5\u76F4\u63A5\u5C06sse\u7684url\u8F93\u5165\u5728\u6D4F\u89C8\u5668\u4E2D\u8FDB\u884C\u8C03\u7528\u3002\u4F46\u662F\u5728\u7F16\u7A0B\u4E2D\u4F7F\u7528\u4E00\u822C\u7684http\u8BF7\u6C42\u65E0\u6CD5\u8BF7\u6C42\u5230\u6570\u636E(\u4E00\u822C\u7684http\u8BF7\u6C42\u90FD\u662F\u5728\u8BF7\u6C42\u7ED3\u675F\u540E\u8FD4\u56DE\u6240\u6709\u7684\u6570\u636E)\uFF0C\u6211\u4EEC\u76EE\u524D\u63D0\u4F9B\u4E86iOS/java/nodejs/js/c#\u7B49\u7684demo\u6765\u5B9E\u73B0sse\u7684\u8C03\u7528\uFF0C\u5982\u679C\u5728\u8FD9\u65B9\u9762\u9047\u5230\u56F0\u96BE\u53EF\u4EE5\u53C2\u8003\u3002\u53E6\u5916\uFF0C\u5F53\u8C03\u7528sse\u65F6\uFF0C\u6700\u597D\u5BF9\u8BE5\u957F\u94FE\u63A5\u8FDB\u884C\u76D1\u63A7\uFF0C\u4EE5\u4FBF\u5728\u957F\u94FE\u63A5\u51FA\u73B0\u9519\u8BEF\u6216\u610F\u5916\u505C\u6B62\u540E\u8FDB\u884C\u91CD\u542F\uFF0C\u6216\u8005\u5176\u4ED6\u64CD\u4F5C\u3002</p>\n    </div>\n  </div>\n  <div class="layui-form-item">\n    <div class="layui-input-block">\n      <button class="layui-btn" lay-submit lay-filter="bnotifyState">do</button>\n    </div>\n  </div>\n</form>';
		return temp;
	}
	
	function notifyStateTip(layer, form, $dom) {
		function dos(layer, form, $dom) {
			$('form.notifyState-tip button[lay-filter="bnotifyState"]')[0].start = $dom.start;
			$('form.notifyState-tip button[lay-filter="bnotifyState"]')[0].stop = $dom.stop;
			form.on('submit(bnotifyState)', function (data) {
				if ($('form.notifyState-tip input[type="checkbox"]').prop('checked')) {
	
					if (_globalData2.default.neverSave.stateSSE.es === '' && _globalData2.default.neverSave.stateSSE.status !== 'toOpen') {
						_globalData2.default.neverSave.stateSSE.status = 'toOpen';
						$('.l3 .layui-form>.layui-form-item  input[type="checkbox"]').prop('checked', true);
						form.render('checkbox');
						data.elem.start && data.elem.start();
						layer.closeAll('tips');
					}
				} else {
					$('.l3 .layui-form>.layui-form-item  input[type="checkbox"]').prop('checked', false);
					form.render('checkbox');
					data.elem.stop && data.elem.stop();
				}
				layer.closeAll('tips');
				return false;
			});
		}
	
		(0, _tips2.default)(layer, htmlString, $dom, dos, form);
		form.render();
	}
	
	exports.default = notifyStateTip;

/***/ }),
/* 124 */
/*!*********************************!*\
  !*** ./src/js/disconnectTip.js ***!
  \*********************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
			value: true
	});
	
	var _globalData = __webpack_require__(/*! ./globalData */ 50);
	
	var _globalData2 = _interopRequireDefault(_globalData);
	
	var _tips = __webpack_require__(/*! ./tips */ 115);
	
	var _tips2 = _interopRequireDefault(_tips);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function htmlString() {
			var temp = '<form class="layui-form  disconnect-tip tip" action="#">\n  <div class="layui-form-item">\n    <label class="layui-form-label">Disconnect a device\uFF1ADELETE</label>\n  </div>\n  <fieldset class="layui-elem-field layui-field-title">\n    <legend i18n =\'arguments\'>\u53C2\u6570</legend>\n  </fieldset>\n  <div class="layui-form-item">\n    <label class="layui-form-label">deviceMac:</label>\n    <div class="layui-input-inline">\n      <input type="text" name="deviceMac"  placeholder="CC:1B:E0:E0:10:C1" value="' + (_globalData2.default.saved.deviceMac ? _globalData2.default.saved.deviceMac : '') + '" lay-verify=\'deviceMac\'  class="layui-input">\n    </div>\n    <div class="layui-form-mid layui-word-aux" i18n = \'required\'>(\u5FC5\u586B)</div>\n  </div>\n  <fieldset class="layui-elem-field layui-field-title">\n    <legend i18n =\'description\'>\u63CF\u8FF0</legend>\n  </fieldset>\n  <div class="layui-form-item layui-form-text">\n    <div class="descriptors connect-des">\n      <p i18n="interfaceURL"><b>\u63A5\u53E3URL\uFF1A</b>\u8C03\u7528\u63A5\u53E3\u540E\uFF0C\u6B64URL\u4F1A\u81EA\u52A8\u751F\u6210\u5728\u4E0B\u9762\u7684\u201DAPI\u63A5\u53E3\u201D\u7684\u7A97\u53E3\u4E2D\u3002</p>\n      <p i18n="disconn-Tip-p2"><b>\u63A5\u53E3\u63CF\u8FF0\uFF1A</b>\u6B64\u63A5\u53E3\u662FDELETE\u8BF7\u6C42\uFF0C\u8C03\u7528\u63A5\u53E3\u540E\uFF0C\u84DD\u7259\u8DEF\u7531\u5668\u4F1A\u4E0E\u6307\u5B9AMAC\u5730\u5740\u7684\u84DD\u7259\u8BBE\u5907\u65AD\u8FDE\u3002</p>\n      <p i18n="disconn-Tip-p3"><b>\u53C2\u6570\u89E3\u91CA\uFF1AdeviceMac\uFF1A</b>\u8981\u65AD\u8FDE\u7684\u8BBE\u5907\u7684MAC\u5730\u5740\u3002</p>\n    </div>\n  </div>\n  <div class="layui-form-item">\n    <div class="layui-input-block">\n      <button class="layui-btn" lay-submit lay-filter="bdisconnect">do</button>\n    </div>\n  </div>\n</form>';
			return temp;
	}
	
	function getAllServicesTip(layer, form, $dom) {
			form.verify({
					deviceMac: [/^([0-9a-f]{2}:){5}[0-9a-f]{2}$/gi, '请输入正确的mac地址']
			});
	
			function dos(layer, form, $dom) {
					$('form.disconnect-tip button[lay-filter="bdisconnect"]')[0].fn = $dom.fn;
					form.on('submit(bdisconnect)', function (data) {
							var deviceMac = _globalData2.default.saved.deviceMac = $('.disconnect-tip input').val().trim();
							data.elem.fn && data.elem.fn(deviceMac);
							layer.closeAll('tips');
							return false;
					});
			}
	
			(0, _tips2.default)(layer, htmlString, $dom, dos, form);
			form.render();
	}
	
	exports.default = getAllServicesTip;

/***/ }),
/* 125 */
/*!************************************!*\
  !*** ./src/js/writeByHandleTip.js ***!
  \************************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _globalData = __webpack_require__(/*! ./globalData */ 50);
	
	var _globalData2 = _interopRequireDefault(_globalData);
	
	var _writeByHandleDeferAndFill = __webpack_require__(/*! ./writeByHandleDeferAndFill */ 126);
	
	var _writeByHandleDeferAndFill2 = _interopRequireDefault(_writeByHandleDeferAndFill);
	
	var _tips = __webpack_require__(/*! ./tips */ 115);
	
	var _tips2 = _interopRequireDefault(_tips);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function htmlString() {
	  var temp = '<form class="layui-form  write-tip tip" action="#">\n  <div class="layui-form-item">\n    <label class="layui-form-label">Write by handle\uFF1AGET</label>\n  </div>\n  <fieldset class="layui-elem-field layui-field-title">\n    <legend i18n=\'arguments\'>\u53C2\u6570</legend>\n  </fieldset>\n  <div class="layui-form-item">\n    <label class="layui-form-label" >deviceMac:</label>\n    <div class="layui-input-inline">\n      <input type="text" name="deviceMac"  placeholder="CC:1B:E0:E0:10:C1" value="' + (_globalData2.default.saved.deviceMac ? _globalData2.default.saved.deviceMac : '') + '" lay-verify=\'deviceMac\'  class="layui-input">\n    </div>\n    <div class="layui-form-mid layui-word-aux" i18n=\'required\'>(\u5FC5\u586B)</div>\n  </div>\n   <div class="layui-form-item">\n    <label class="layui-form-label" style="width:auto">handle & value</label>\n    <div class="layui-form-mid layui-word-aux" i18n=\'required\'>(\u5FC5\u586B)</div>\n    <div class="">\n    <textarea placeholder="25:55AA101E\n27:55AA00FF"  class="layui-textarea" lay-verify="valueHandleArr">' + (_globalData2.default.saved.commond ? _globalData2.default.saved.commond : '') + '</textarea>\n    </div>\n  </div>\n<fieldset class="layui-elem-field layui-field-title">\n  <legend i18n=\'description\'>\u63CF\u8FF0</legend>\n</fieldset>\n<div class="layui-form-item layui-form-text">\n  <div class="descriptors connect-des">\n    <p i18n="interfaceURL"><b>\u63A5\u53E3URL\uFF1A</b>\u8C03\u7528\u63A5\u53E3\u540E\uFF0C\u6B64URL\u4F1A\u81EA\u52A8\u751F\u6210\u5728\u4E0B\u9762\u7684\u201DAPI\u63A5\u53E3\u201D\u7684\u7A97\u53E3\u4E2D\u3002</p>\n    <p i18n="write-Tip-p1"><b>\u63A5\u53E3\u63CF\u8FF0\uFF1A</b>\u672C\u63A5\u53E3\u662F\u8D1F\u8D23\u4E0E\u8BBE\u5907\u901A\u8BAF\u7684\u4E3B\u8981\u63A5\u53E3\uFF0C\u5177\u4F53\u8D1F\u8D23\u5411\u84DD\u7259\u8BBE\u5907\u5199\u5165\u6307\u4EE4\u4EE5\u53CA\u6253\u5F00\u84DD\u7259\u8BBE\u5907\u7684notification/indication\uFF0C\u4E0B\u9762\u4F1A\u5177\u4F53\u8BB2\u89E3\u4E24\u4E2A\u529F\u80FD\u5206\u522B\u5982\u4F55\u5B9E\u73B0\u3002</p>\n    <p i18n="write-Tip-p2"><b>1\u3001\u5BF9\u84DD\u7259\u8BBE\u5907\u5199\u5165\u6307\u4EE4\uFF1A</b>\u5F53\u9700\u8981\u5F80\u84DD\u7259\u8BBE\u5907\u6307\u5B9A\u7684characteristic\u5199\u5165\u6307\u4EE4\u65F6\uFF0C\u5148\u8C03\u7528\u201C\u53D1\u73B0\u670D\u52A1\u201D\u7684\u63A5\u53E3\uFF0C\u5F53\u8FD4\u56DE\u84DD\u7259\u8BBE\u5907\u670D\u52A1\u4FE1\u606F\u7684\u6811\u5F62\u5217\u8868\u540E\uFF0C\u5BFB\u627E\u6307\u5B9A\u7684characteristic\u6240\u5BF9\u5E94\u7684valueHandle\uFF08characteristic\u5185\u5305\u542Bhandle\u3001valueHandle\u3001properties\u3001descriptors\u7B49\u5C5E\u6027\uFF09\uFF0C\u7136\u540E\u8C03\u7528\u6B64\u63A5\u53E3\u65F6\uFF0Chandle\u5BF9\u5E94\u7684\u503C\u662Fcharacteristic\u7684valueHandle\uFF0Cvalue\u5BF9\u5E94\u7684\u503C\u662F\u9700\u8981\u5199\u5165\u7684\u6307\u4EE4\u5185\u5BB9\uFF08\u5C06\u6307\u4EE4\u7684\u6BCF\u4E2Abyte\u987A\u5E8F\u62FC\u5728\u4E00\u8D77\u5199\u6210\u4E00\u4E2A\u5B57\u7B26\u4E32\uFF09\u3002</p>\n    <p i18n="write-Tip-p3"><b>2\u3001\u6253\u5F00\u84DD\u7259\u8BBE\u5907\u7684notification/indication\uFF1A</b>\u5F53\u9700\u8981\u63A5\u6536\u84DD\u7259\u8BBE\u5907\u53D1\u6765\u7684\u6570\u636E\u65F6\uFF0C\u9700\u8981\u5148\u6253\u5F00\u84DD\u7259\u8BBE\u5907\u7684notification\u6216\u8005indication\uFF08\u6253\u5F00\u7684\u8FC7\u7A0B\u5728\u672C\u8D28\u4E0A\u4E5F\u662F\u5BF9\u84DD\u7259\u8BBE\u5907\u4E0B\u53D1\u7684\u4E00\u4E2A\u6307\u4EE4\uFF09\uFF0C\u5F53\u9700\u8981\u6253\u5F00\u6307\u5B9Acharacteristic\u7684notification\u6216\u8005indication\u65F6\uFF0C\u4E5F\u662F\u5148\u8C03\u7528\u201C\u53D1\u73B0\u670D\u52A1\u201D\u7684\u65B9\u6CD5\uFF0C\u627E\u5230\u6307\u5B9A\u7684characteristic\u6240\u5BF9\u5E94\u7684descriptors\uFF0C\u6253\u5F00descriptors\uFF0C\u627E\u5230uuid\u5305\u542B\u201C00002902\u201D\u6240\u5BF9\u5E94\u7684handle\uFF0C\u7136\u540E\u8C03\u7528\u6B64\u63A5\u53E3\uFF0C\u63A5\u53E3\u4E2D\u7684handle\u5C31\u662F\u4E0A\u9762descriptor\u7684handle\uFF0C\u5982\u679C\u662F\u6253\u5F00notification\uFF0Cvalue\u5BF9\u5E94\u7684\u662F\u201C0100\u201D\uFF0C\u5982\u679C\u662F\u6253\u5F00indication\uFF0Cvalue\u5BF9\u5E94\u7684\u662F\u201C0200\u201D\uFF0C\u5982\u679C\u662F\u5173\u95EDnotification/indication\uFF0Cvalue\u5BF9\u5E94\u7684\u662F\u201C0000\u201D\u3002</p>\n    <p i18n="write-Tip-p4"><b>\u53C2\u6570\u89E3\u91CA\uFF1A deviceMac\uFF1A</b>\u8981\u5199\u5165\u6307\u4EE4\u7684\u8BBE\u5907\u7684MAC\u5730\u5740\u3002</p>\n    <p i18n="write-Tip-p5"><b>handle\uFF1A</b>\u901A\u8FC7\u201C\u53D1\u73B0\u670D\u52A1\u63A5\u53E3\u201D\u6240\u627E\u5230\u7684characteristic\u6240\u5BF9\u5E94\u7684valueHandle\u6216\u8005handle\u3002</p>\n    <p i18n="write-Tip-p6"><b>value\uFF1A</b>\u8981\u5199\u5165\u7684\u6307\u4EE4\u7684\u503C\uFF0C\u6216\u8005\u201C0100\u201D\uFF08\u6253\u5F00notification\uFF09\u3001\u201C0200\u201D\uFF08\u6253\u5F00indication\uFF09\u3001\u201C0000\u201D\uFF08\u5173\u95EDnotification\u548Cindication\uFF09\u3002</p>\n    <p i18n="write-Tip-p7"><b>handle & value\u8F93\u5165\u683C\u5F0F</b>\n    <p i18n="write-Tip-p8">\u5355\u6761\u6307\u4EE4\u683C\u5F0F handle:value1,type</p>\n    <p i18n="write-Tip-p9">handle\u4E3A\u8981\u5199\u5165\u7684handle\u598220</p>\n    <p i18n="write-Tip-p10">value1 \u4E3A\u8981\u5199\u5165\u7684\u503C\uFF08\u5341\u516D\u8FDB\u5236\uFF09</p>\n    <p i18n="write-Tip-p11">type\u4E3A\u5199\u5165\u7C7B\u578B\uFF0C0\u4EE3\u8868write without response\uFF0C1\u4EE3\u8868write with response</p>\n    <p i18n="write-Tip-p12">\u591A\u6761\u8BED\u53E5\u4E4B\u95F4\u7528\u56DE\u8F66\u952E\u6362\u884C</p>\n  </div>\n</div>\n<div class="layui-form-item">\n  <div class="layui-input-block">\n    <button class="layui-btn" lay-submit lay-filter="write">do</button>\n  </div>\n</div>\n</form>';
	  return temp;
	}
	
	function writeByHnadleTip(layer, form, $dom) {
	  form.verify({
	    valueHandleArr: function valueHandleArr(value) {
	      var temp = value.split('\n').map(function (item) {
	        return item.trim();
	      }),
	          errMsg = '';
	      temp = temp.filter(function (item) {
	        return item;
	      });
	
	      if (temp.length === 0) return '请输入正确的指令';
	      temp.forEach(function (item, index) {
	        if (item.indexOf('interval') > -1) {
	          if (!/^[\u0030-\u0039]+\:[\u0030-\u0039\u0041-\u0046]+\,interval\:[\u0030-\u0039]+\,[\u0030-\u0039]+$/gi.test(item.trim())) {
	            errMsg += '\u7B2C' + (index + 1) + '\u6761\u6307\u4EE4\u9519\u8BEF</br>';
	          }
	        } else {
	          if (!/^[\u0030-\u0039]+\:[\u0030-\u0039\u0041-\u0046]+\,[\u0030-\u0039](\,[\u0030-\u0039]+)?$/gi.test(item.trim())) {
	            errMsg += '\u7B2C' + (index + 1) + '\u6761\u6307\u4EE4\u9519\u8BEF</br>';
	          }
	        }
	      });
	      if (errMsg) {
	        return errMsg;
	      }
	    },
	    deviceMac: function deviceMac(value) {
	      if (!/^([0-9a-f]{2}:){5}[0-9a-f]{2}$/gi.test(value)) {
	        return '请输入正确的MAC地址';
	      }
	    }
	  });
	
	  function dos(layer, form) {
	    form.on('submit(write)', function (data) {
	      var textareaValue = $('form.write-tip textarea').val();
	      _globalData2.default.saved.commond = textareaValue;
	      var arr = textareaValue.split('\n').filter(function (item) {
	        return item.trim();
	      }),
	          deviceMac = $('form.write-tip input').val();
	      _globalData2.default.saved.deviceMac = deviceMac;
	      (0, _writeByHandleDeferAndFill2.default)(arr, deviceMac);
	      layer.closeAll('tips');
	      return false;
	    });
	  }
	  (0, _tips2.default)(layer, htmlString, $dom, dos, form);
	  form.render();
	}
	exports.default = writeByHnadleTip;

/***/ }),
/* 126 */
/*!*********************************************!*\
  !*** ./src/js/writeByHandleDeferAndFill.js ***!
  \*********************************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _stringify = __webpack_require__(/*! babel-runtime/core-js/json/stringify */ 7);
	
	var _stringify2 = _interopRequireDefault(_stringify);
	
	var _api = __webpack_require__(/*! ./api */ 10);
	
	var _urlconfig = __webpack_require__(/*! ./urlconfig */ 56);
	
	var _showmethod = __webpack_require__(/*! ./showmethod */ 48);
	
	var _showlog = __webpack_require__(/*! ./showlog */ 57);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function writeByHandleDeferAndFill(arr, deviceMac) {
		var _this = this;
	
		var handle = void 0,
		    writeValue = void 0,
		    interval = void 0,
		    type = void 0,
		    defer = void 0,
		    ajaxResult = void 0,
		    url = void 0,
		    temp = void 0;
		arr.forEach(function (item, index, arr) {
			defer = null;
			interval = null;
	
			temp = item.split(',');
			handle = temp[0].split(':')[0].trim();
			writeValue = temp[0].split(':')[1].trim();
			if (temp[1].indexOf('interval') !== -1) {
				interval = parseInt(temp[1].split(':')[1], 10);
				type = temp[2];
			} else {
				type = temp[1];
				defer = temp[2];
			}
			type = type && parseInt(type.trim(), 10);
			defer = defer && parseInt(defer.trim(), 10);
			url = _urlconfig.urlArr.writeByHandle.replace(/\*((deviceMac)|(handle)|(writeValue))\*/g, function (match, pos, originalText) {
				switch (match) {
					case '*deviceMac*':
						return deviceMac;
					case '*handle*':
						return handle;
					case '*writeValue*':
						return writeValue;
				}
			});
	
			function fn(url, type) {
				console.log('url', url);
				console.log(new Date());
				ajaxResult = _api.api.writeByHandle(url, type ? null : {
					option: 'cmd'
				}).done(function (e) {
					(0, _showlog.showLog)($('#writeValueLog'), {
						message: deviceMac + ':' + (0, _stringify2.default)(e),
						class: 'success'
					});
				}).fail(function (e) {
					(0, _showlog.showLog)($('#writeValueLog'), {
						message: deviceMac + ':' + (0, _stringify2.default)(e, null, 2),
						class: 'fail'
					});
				}).always(function () {
					(0, _showmethod.showMethod)('writeByHandle');
				});
			}
	
			if (interval) {
				(function () {
					setInterval(fn.bind(this, url, type), interval);
				})();
			} else if (defer) {
				(function () {
					setTimeout(fn.bind(this, url, type), defer);
				})();
			} else {
				fn.call(_this, url, type);
			}
		});
	}
	
	exports.default = writeByHandleDeferAndFill;

/***/ }),
/* 127 */
/*!**************************!*\
  !*** ./src/js/oAuth2.js ***!
  \**************************/
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.control = undefined;
	
	var _stringify = __webpack_require__(/*! babel-runtime/core-js/json/stringify */ 7);
	
	var _stringify2 = _interopRequireDefault(_stringify);
	
	var _defineProperty2 = __webpack_require__(/*! babel-runtime/helpers/defineProperty */ 128);
	
	var _defineProperty3 = _interopRequireDefault(_defineProperty2);
	
	var _urlconfig = __webpack_require__(/*! ./urlconfig */ 56);
	
	var _showmethod = __webpack_require__(/*! ./showmethod */ 48);
	
	var _showlog = __webpack_require__(/*! ./showlog */ 57);
	
	var _globalData = __webpack_require__(/*! ./globalData */ 50);
	
	var _globalData2 = _interopRequireDefault(_globalData);
	
	var _i18n = __webpack_require__(/*! ./i18n */ 49);
	
	var _i18n2 = _interopRequireDefault(_i18n);
	
	var _mainHandle = __webpack_require__(/*! ./mainHandle */ 5);
	
	var mainHandle = _interopRequireWildcard(_mainHandle);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function control(val, form) {
		if (val === "local") {
			_urlconfig.data.access_token = '';
			(0, _urlconfig.updateUrlArr)(_urlconfig.data.hubIp);
		} else if (val === "remote") {
			var _layer$open;
	
			layer.open((_layer$open = {
				title: 'remote',
				type: 6,
				area: ['450px', 'auto'],
				shade: 0,
				shadeClose: true,
				closeBtn: 1
			}, (0, _defineProperty3.default)(_layer$open, 'shadeClose', true), (0, _defineProperty3.default)(_layer$open, 'fixed', true), (0, _defineProperty3.default)(_layer$open, 'maxmin', false), (0, _defineProperty3.default)(_layer$open, 'anim', 5), (0, _defineProperty3.default)(_layer$open, 'tips', [2, '#2F4056']), (0, _defineProperty3.default)(_layer$open, 'content', htmlString()), (0, _defineProperty3.default)(_layer$open, 'btn', ['ok', 'cancel']), (0, _defineProperty3.default)(_layer$open, 'btn1', yes), (0, _defineProperty3.default)(_layer$open, 'btn2', function btn2(index, layero) {
				$('#control').val('local');
				form.render();
			}), (0, _defineProperty3.default)(_layer$open, 'cancel', function cancel(index, layero) {
				$('#control').val('local');
				form.render();
			}), _layer$open));
		}
		(0, _i18n2.default)(_globalData2.default.lang);
		form.render();
	}
	
	var htmlString = function htmlString() {
		var temp = '<form class="layui-form  tip oAuth" action="#">\n  <fieldset class="layui-elem-field layui-field-title">\n\t\t<legend>oAuth</legend>\n  </fieldset>\n\t\t<div class="layui-form-item" style="text-align:center">\n\t\t  <label class="layui-form-label" i18n="username">Developer Key:</label>\n\t\t  <div class="layui-input-inline">\n\t\t    <input type="text" value="' + (_globalData2.default.saved.oAuth_dev ? _globalData2.default.saved.oAuth_dev : '') + '"  class="layui-input" id="userName" placeholder="tester">\n\t\t  </div>\n\t\t   \n\t\t</div>\n\t\t<div class="layui-form-item">\n\t\t  <label class="layui-form-label" i18n="password">Developer Secter:</label>\n\t\t  <div class="layui-input-inline">\n\t\t    <input type="password"  value="' + (_globalData2.default.saved.secret ? _globalData2.default.saved.secret : '') + '"  class="layui-input" id="password" placeholder="******">\n\t\t  </div>\n  \t\t</div>\n\t\t<div class="layui-form-item">\n\t\t  <label class="layui-form-label" i18n="host">AC Address:</label>\n\t\t  <div class="layui-input-inline">\n\t\t    <input type="text" value="' + (_globalData2.default.saved.acaddress ? _globalData2.default.saved.acaddress : '') + '" class="layui-input" id="host" placeholder="ac-cn.cassia.pro:8080/api">\n\t\t  </div>\n  \t\t</div>\n  <fieldset class="layui-elem-field layui-field-title">\n    <legend i18n="description">Description</legend>\n  </fieldset>\n  <div class="layui-form-item layui-form-text">\n    <div class="descriptors">\n      <p i18n="interfaceURL"><b>\u63A5\u53E3URL\uFF1A</b>\u8C03\u7528\u63A5\u53E3\u540E\uFF0C\u6B64URL\u4F1A\u81EA\u52A8\u751F\u6210\u5728\u4E0B\u9762\u7684\u201DAPI\u63A5\u53E3\u201D\u7684\u7A97\u53E3\u4E2D\u3002</p>\n      <p i18n="oAouh-Tip-p2"><b>\u63A5\u53E3\u63CF\u8FF0\uFF1A</b>\u6B64\u63A5\u53E3\u662F\u901A\u8FC7oAuth2.0\u8BA4\u8BC1\u5B9E\u73B0\u4E91\u7AEF\u8FDC\u7A0B\u63A7\u5236\u3002\u5C06\u7528\u6237\u540D\u548C\u5BC6\u7801\u4EE5base64\u7F16\u7801\u7684\u65B9\u5F0F\u6DFB\u52A0\u5728\u8BF7\u6C42\u53C2\u6570\u4E2D\uFF0C\u8BA4\u8BC1\u6210\u529F\u540E\u83B7\u5F971\u5C0F\u65F6\u6709\u6548\u671F\u7684access_token,\u4F60\u53EF\u4EE5\u6DFB\u52A0\u53C2\u6570access_token\u8BBF\u95EE\u5176\u4ED6API\uFF0C\u4ECE\u800C\u5B9E\u73B0\u8FDC\u7A0B\u63A7\u5236\u3002</p>\n      <p i18n="oAouh-Tip-p3"><b>\u53C2\u6570\u89E3\u91CA\uFF1A\u7528\u6237\u540D/\u5BC6\u7801\uFF1A</b>\u4ECECassia\u8BF7\u6C42\u7684\u5F00\u53D1\u8005\u8D26\u6237\u548C\u5BC6\u7801(\u4F1A\u4EE5base64\u7F16\u7801\u7684\u65B9\u5F0F\u6DFB\u52A0\u5728\u8BF7\u6C42\u4E2D)</p>\n      <p i18n="oAouh-Tip-p4"><b>AC Address</b>\u548C\u84DD\u7259\u8DEF\u7531\u5668\u4EA4\u4E92\u7684\u670D\u52A1\u5668\u5730\u5740</p>\n    </div>\n  </div>\n\n</form>';
	
		return temp;
	};
	var yes = function yes() {
	
		_globalData2.default.saved.oAuth_dev = $('#userName').val();
		_globalData2.default.saved.secret = $('#password').val();
		_globalData2.default.saved.acaddress = $('#host').val();
		if ($('#userName').val() === '' || $('#password').val() === '' || $('#host').val() === '') {
			layer.msg('输入不能为空', { icon: 5, title: 'oAuth2', time: 1000 });
			return;
		}
		_showmethod.methodConfig.oAuth.url = "http://" + $('#host').val() + "/oauth2/token";
		var parentoAuth = $('#oAuthLog ul');
		$.ajax({
			type: 'POST',
			url: "http://" + $('#host').val() + "/oauth2/token",
			data: { "grant_type": "client_credentials" },
			headers: {
				"Authorization": 'Basic ' + btoa($('#userName').val() + ':' + $('#password').val()),
				"Content-Type": "application/x-www-form-urlencoded"
			},
			success: function success(d) {
				mainHandle.linkage(8);
				console.log(d.access_token);
				if (d.access_token) {
					layer.alert('成功', { icon: 1, title: 'oAuth2' });
					_urlconfig.data.access_token = d.access_token;
					(0, _urlconfig.updateUrlArr)($('#host').val());
					layer.closeAll();
				} else {
					layer.msg('失败', { icon: 2, title: 'oAuth2', time: 1000 });
				}
				(0, _showlog.showLog)(parentoAuth, {
					message: (0, _stringify2.default)(d),
					class: 'success'
				});
			},
			error: function error(e) {
				layer.msg('失败', { icon: 2, title: 'oAuth2', time: 1000 });
				(0, _showlog.showLog)(parentoAuth, {
					message: (0, _stringify2.default)(e),
					class: 'fail'
				});
			}
		});
		(0, _showmethod.showMethod)('oAuth');
	};
	exports.control = control;

/***/ }),
/* 128 */
/*!***************************************************!*\
  !*** ./~/babel-runtime/helpers/defineProperty.js ***!
  \***************************************************/
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	
	exports.__esModule = true;
	
	var _defineProperty = __webpack_require__(/*! ../core-js/object/define-property */ 129);
	
	var _defineProperty2 = _interopRequireDefault(_defineProperty);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (obj, key, value) {
	  if (key in obj) {
	    (0, _defineProperty2.default)(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }
	
	  return obj;
	};

/***/ }),
/* 129 */
/*!***********************************************************!*\
  !*** ./~/babel-runtime/core-js/object/define-property.js ***!
  \***********************************************************/
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/define-property */ 130), __esModule: true };

/***/ }),
/* 130 */
/*!********************************************************!*\
  !*** ./~/core-js/library/fn/object/define-property.js ***!
  \********************************************************/
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(/*! ../../modules/es6.object.define-property */ 131);
	var $Object = __webpack_require__(/*! ../../modules/_core */ 9).Object;
	module.exports = function defineProperty(it, key, desc) {
	  return $Object.defineProperty(it, key, desc);
	};


/***/ }),
/* 131 */
/*!*****************************************************************!*\
  !*** ./~/core-js/library/modules/es6.object.define-property.js ***!
  \*****************************************************************/
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(/*! ./_export */ 14);
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__(/*! ./_descriptors */ 23), 'Object', { defineProperty: __webpack_require__(/*! ./_object-dp */ 19).f });


/***/ })
/******/ ]);
//# sourceMappingURL=index.js.map