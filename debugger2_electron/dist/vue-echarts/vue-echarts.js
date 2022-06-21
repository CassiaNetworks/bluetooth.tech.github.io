/**
 * Skipped minification because the original files appears to be already minified.
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t(require("echarts/lib/echarts")):"function"==typeof define&&define.amd?define(["echarts/lib/echarts"],t):(e=e||self).VueECharts=t(e.echarts)}(this,(function(e){"use strict";e=e&&e.hasOwnProperty("default")?e.default:e;var t=function(e){var t=typeof e;return null!=e&&("object"==t||"function"==t)},i="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n="object"==typeof i&&i&&i.Object===Object&&i,r="object"==typeof self&&self&&self.Object===Object&&self,o=n||r||Function("return this")(),s=function(){return o.Date.now()},a=o.Symbol,d=Object.prototype,c=d.hasOwnProperty,h=d.toString,l=a?a.toStringTag:void 0;var u=function(e){var t=c.call(e,l),i=e[l];try{e[l]=void 0;var n=!0}catch(e){}var r=h.call(e);return n&&(t?e[l]=i:delete e[l]),r},_=Object.prototype.toString;var f=function(e){return _.call(e)},p=a?a.toStringTag:void 0;var g=function(e){return null==e?void 0===e?"[object Undefined]":"[object Null]":p&&p in Object(e)?u(e):f(e)};var v=function(e){return null!=e&&"object"==typeof e};var m=function(e){return"symbol"==typeof e||v(e)&&"[object Symbol]"==g(e)},z=/^\s+|\s+$/g,b=/^[-+]0x[0-9a-f]+$/i,w=/^0b[01]+$/i,y=/^0o[0-7]+$/i,O=parseInt;var x=function(e){if("number"==typeof e)return e;if(m(e))return NaN;if(t(e)){var i="function"==typeof e.valueOf?e.valueOf():e;e=t(i)?i+"":i}if("string"!=typeof e)return 0===e?e:+e;e=e.replace(z,"");var n=w.test(e);return n||y.test(e)?O(e.slice(2),n?2:8):b.test(e)?NaN:+e},C=Math.max,E=Math.min;var T=function(e,i,n){var r,o,a,d,c,h,l=0,u=!1,_=!1,f=!0;if("function"!=typeof e)throw new TypeError("Expected a function");function p(t){var i=r,n=o;return r=o=void 0,l=t,d=e.apply(n,i)}function g(e){return l=e,c=setTimeout(m,i),u?p(e):d}function v(e){var t=e-h;return void 0===h||t>=i||t<0||_&&e-l>=a}function m(){var e=s();if(v(e))return z(e);c=setTimeout(m,function(e){var t=i-(e-h);return _?E(t,a-(e-l)):t}(e))}function z(e){return c=void 0,f&&r?p(e):(r=o=void 0,d)}function b(){var e=s(),t=v(e);if(r=arguments,o=this,h=e,t){if(void 0===c)return g(h);if(_)return clearTimeout(c),c=setTimeout(m,i),p(h)}return void 0===c&&(c=setTimeout(m,i)),d}return i=x(i)||0,t(n)&&(u=!!n.leading,a=(_="maxWait"in n)?C(x(n.maxWait)||0,i):a,f="trailing"in n?!!n.trailing:f),b.cancel=function(){void 0!==c&&clearTimeout(c),l=0,r=h=o=c=void 0},b.flush=function(){return void 0===c?d:z(s())},b},M=null;var S=null;function j(e,t){void 0===t&&(t={});var i=document.createElement(e);return Object.keys(t).forEach((function(e){i[e]=t[e]})),i}function L(e,t,i){return(window.getComputedStyle(e,i||null)||{display:"none"})[t]}function $(e){if(!document.documentElement.contains(e))return{detached:!0,rendered:!1};for(var t=e;t!==document;){if("none"===L(t,"display"))return{detached:!1,rendered:!1};t=t.parentNode}return{detached:!1,rendered:!0}}var R=0,A=null;function N(e,t){if(e.__resize_mutation_handler__||(e.__resize_mutation_handler__=U.bind(e)),!e.__resize_listeners__)if(e.__resize_listeners__=[],window.ResizeObserver){var i=e.offsetWidth,n=e.offsetHeight,r=new ResizeObserver((function(){(e.__resize_observer_triggered__||(e.__resize_observer_triggered__=!0,e.offsetWidth!==i||e.offsetHeight!==n))&&D(e)})),o=$(e),s=o.detached,a=o.rendered;e.__resize_observer_triggered__=!1===s&&!1===a,e.__resize_observer__=r,r.observe(e)}else if(e.attachEvent&&e.addEventListener)e.__resize_legacy_resize_handler__=function(){D(e)},e.attachEvent("onresize",e.__resize_legacy_resize_handler__),document.addEventListener("DOMSubtreeModified",e.__resize_mutation_handler__);else if(R||(A=function(e){var t=document.createElement("style");return t.type="text/css",t.styleSheet?t.styleSheet.cssText=e:t.appendChild(document.createTextNode(e)),(document.querySelector("head")||document.body).appendChild(t),t}('.resize-triggers{visibility:hidden;opacity:0}.resize-contract-trigger,.resize-contract-trigger:before,.resize-expand-trigger,.resize-triggers{content:"";position:absolute;top:0;left:0;height:100%;width:100%;overflow:hidden}.resize-contract-trigger,.resize-expand-trigger{background:#eee;overflow:auto}.resize-contract-trigger:before{width:200%;height:200%}')),function(e){var t=L(e,"position");t&&"static"!==t||(e.style.position="relative");e.__resize_old_position__=t,e.__resize_last__={};var i=j("div",{className:"resize-triggers"}),n=j("div",{className:"resize-expand-trigger"}),r=j("div"),o=j("div",{className:"resize-contract-trigger"});n.appendChild(r),i.appendChild(n),i.appendChild(o),e.appendChild(i),e.__resize_triggers__={triggers:i,expand:n,expandChild:r,contract:o},F(e),e.addEventListener("scroll",W,!0),e.__resize_last__={width:e.offsetWidth,height:e.offsetHeight}}(e),e.__resize_rendered__=$(e).rendered,window.MutationObserver){var d=new MutationObserver(e.__resize_mutation_handler__);d.observe(document,{attributes:!0,childList:!0,characterData:!0,subtree:!0}),e.__resize_mutation_observer__=d}e.__resize_listeners__.push(t),R++}function U(){var e=$(this),t=e.rendered,i=e.detached;t!==this.__resize_rendered__&&(!i&&this.__resize_triggers__&&(F(this),this.addEventListener("scroll",W,!0)),this.__resize_rendered__=t,D(this))}function W(){var e,t,i=this;F(this),this.__resize_raf__&&(e=this.__resize_raf__,S||(S=(window.cancelAnimationFrame||window.webkitCancelAnimationFrame||window.mozCancelAnimationFrame||function(e){clearTimeout(e)}).bind(window)),S(e)),this.__resize_raf__=(t=function(){var e,t,n,r,o,s,a=(t=(e=i).__resize_last__,n=t.width,r=t.height,o=e.offsetWidth,s=e.offsetHeight,o!==n||s!==r?{width:o,height:s}:null);a&&(i.__resize_last__=a,D(i))},M||(M=(window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(e){return setTimeout(e,16)}).bind(window)),M(t))}function D(e){e&&e.__resize_listeners__&&e.__resize_listeners__.forEach((function(t){t.call(e)}))}function F(e){var t=e.__resize_triggers__,i=t.expand,n=t.expandChild,r=t.contract,o=r.scrollWidth,s=r.scrollHeight,a=i.offsetWidth,d=i.offsetHeight,c=i.scrollWidth,h=i.scrollHeight;r.scrollLeft=o,r.scrollTop=s,n.style.width=a+1+"px",n.style.height=d+1+"px",i.scrollLeft=c,i.scrollTop=h}var H=["theme","initOptions","autoresize"],P=["manualUpdate","watchShallow"],B={props:{options:Object,theme:[String,Object],initOptions:Object,group:String,autoresize:Boolean,watchShallow:Boolean,manualUpdate:Boolean},data:function(){return{lastArea:0}},watch:{group:function(e){this.chart.group=e}},methods:{mergeOptions:function(e,t,i){this.manualUpdate&&(this.manualOptions=e),this.chart?this.delegateMethod("setOption",e,t,i):this.init(e)},appendData:function(e){this.delegateMethod("appendData",e)},resize:function(e){this.delegateMethod("resize",e)},dispatchAction:function(e){this.delegateMethod("dispatchAction",e)},convertToPixel:function(e,t){return this.delegateMethod("convertToPixel",e,t)},convertFromPixel:function(e,t){return this.delegateMethod("convertFromPixel",e,t)},containPixel:function(e,t){return this.delegateMethod("containPixel",e,t)},showLoading:function(e,t){this.delegateMethod("showLoading",e,t)},hideLoading:function(){this.delegateMethod("hideLoading")},getDataURL:function(e){return this.delegateMethod("getDataURL",e)},getConnectedDataURL:function(e){return this.delegateMethod("getConnectedDataURL",e)},clear:function(){this.delegateMethod("clear")},dispose:function(){this.delegateMethod("dispose")},delegateMethod:function(e){for(var t,i=[],n=arguments.length-1;n-- >0;)i[n]=arguments[n+1];return this.chart||this.init(),(t=this.chart)[e].apply(t,i)},delegateGet:function(e){return this.chart||this.init(),this.chart[e]()},getArea:function(){return this.$el.offsetWidth*this.$el.offsetHeight},init:function(t){var i=this;if(!this.chart){var n=e.init(this.$el,this.theme,this.initOptions);this.group&&(n.group=this.group),n.setOption(t||this.manualOptions||this.options||{},!0),Object.keys(this.$listeners).forEach((function(e){var t=i.$listeners[e];0===e.indexOf("zr:")?n.getZr().on(e.slice(3),t):n.on(e,t)})),this.autoresize&&(this.lastArea=this.getArea(),this.__resizeHandler=T((function(){0===i.lastArea?(i.mergeOptions({},!0),i.resize(),i.mergeOptions(i.options||i.manualOptions||{},!0)):i.resize(),i.lastArea=i.getArea()}),100,{leading:!0}),N(this.$el,this.__resizeHandler)),Object.defineProperties(this,{width:{configurable:!0,get:function(){return i.delegateGet("getWidth")}},height:{configurable:!0,get:function(){return i.delegateGet("getHeight")}},isDisposed:{configurable:!0,get:function(){return!!i.delegateGet("isDisposed")}},computedOptions:{configurable:!0,get:function(){return i.delegateGet("getOption")}}}),this.chart=n}},initOptionsWatcher:function(){var e=this;this.__unwatchOptions&&(this.__unwatchOptions(),this.__unwatchOptions=null),this.manualUpdate||(this.__unwatchOptions=this.$watch("options",(function(t,i){!e.chart&&t?e.init():e.chart.setOption(t,t!==i)}),{deep:!this.watchShallow}))},destroy:function(){this.autoresize&&function(e,t){if(e.detachEvent&&e.removeEventListener)return e.detachEvent("onresize",e.__resize_legacy_resize_handler__),void document.removeEventListener("DOMSubtreeModified",e.__resize_mutation_handler__);var i=e.__resize_listeners__;i&&(i.splice(i.indexOf(t),1),i.length||(e.__resize_observer__?(e.__resize_observer__.unobserve(e),e.__resize_observer__.disconnect(),e.__resize_observer__=null):(e.__resize_mutation_observer__&&(e.__resize_mutation_observer__.disconnect(),e.__resize_mutation_observer__=null),e.removeEventListener("scroll",W),e.removeChild(e.__resize_triggers__.triggers),e.__resize_triggers__=null),e.__resize_listeners__=null),!--R&&A&&A.parentNode.removeChild(A))}(this.$el,this.__resizeHandler),this.dispose(),this.chart=null},refresh:function(){this.chart&&(this.destroy(),this.init())}},created:function(){var e=this;this.initOptionsWatcher(),H.forEach((function(t){e.$watch(t,(function(){e.refresh()}),{deep:!0})})),P.forEach((function(t){e.$watch(t,(function(){e.initOptionsWatcher(),e.refresh()}))}))},mounted:function(){this.options&&this.init()},activated:function(){this.autoresize&&this.chart&&this.chart.resize()},destroyed:function(){this.chart&&this.destroy()},connect:function(t){"string"!=typeof t&&(t=t.map((function(e){return e.chart}))),e.connect(t)},disconnect:function(t){e.disConnect(t)},registerMap:function(t,i,n){e.registerMap(t,i,n)},registerTheme:function(t,i){e.registerTheme(t,i)},graphic:e.graphic};var k,q="undefined"!=typeof navigator&&/msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());var G={};return function(e,t,i,n,r,o,s,a,d,c){"boolean"!=typeof s&&(d=a,a=s,s=!1);var h,l="function"==typeof i?i.options:i;if(e&&e.render&&(l.render=e.render,l.staticRenderFns=e.staticRenderFns,l._compiled=!0,r&&(l.functional=!0)),n&&(l._scopeId=n),o?(h=function(e){(e=e||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(e=__VUE_SSR_CONTEXT__),t&&t.call(this,d(e)),e&&e._registeredComponents&&e._registeredComponents.add(o)},l._ssrRegister=h):t&&(h=s?function(e){t.call(this,c(e,this.$root.$options.shadowRoot))}:function(e){t.call(this,a(e))}),h)if(l.functional){var u=l.render;l.render=function(e,t){return h.call(t),u(e,t)}}else{var _=l.beforeCreate;l.beforeCreate=_?[].concat(_,h):[h]}return i}({render:function(){var e=this.$createElement;return(this._self._c||e)("div",{staticClass:"echarts"})},staticRenderFns:[]},(function(e){e&&e("data-v-1e347cc8_0",{source:".echarts{width:600px;height:400px}",map:void 0,media:void 0})}),B,void 0,!1,void 0,!1,(function(e){return function(e,t){return function(e,t){var i=q?t.media||"default":e,n=G[i]||(G[i]={ids:new Set,styles:[]});if(!n.ids.has(e)){n.ids.add(e);var r=t.source;if(t.map&&(r+="\n/*# sourceURL="+t.map.sources[0]+" */",r+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(t.map))))+" */"),n.element||(n.element=document.createElement("style"),n.element.type="text/css",t.media&&n.element.setAttribute("media",t.media),void 0===k&&(k=document.head||document.getElementsByTagName("head")[0]),k.appendChild(n.element)),"styleSheet"in n.element)n.styles.push(r),n.element.styleSheet.cssText=n.styles.filter(Boolean).join("\n");else{var o=n.ids.size-1,s=document.createTextNode(r),a=n.element.childNodes;a[o]&&n.element.removeChild(a[o]),a.length?n.element.insertBefore(s,a[o]):n.element.appendChild(s)}}}(e,t)}}),void 0,void 0)}));
