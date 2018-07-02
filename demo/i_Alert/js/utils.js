/*x
存储localstorage时候最好是封装一个自己的键值，在这个值里存储自己的内容对象，封装一个方法针对自己对象进行操作。避免冲突也会在开发中更方便。
*/
var mystorage = (function mystorage(){
    var ms = "mystorage";
    var storage=window.localStorage;
    if(!window.localStorage){
        alert("浏览器支持localstorage");
        return false;
    }
    var set = function(key,value){
        //存储
        var mydata = storage.getItem(ms);
        if(!mydata){
            this.init();
            mydata = storage.getItem(ms);
        }
        mydata = JSON.parse(mydata);
        mydata.data[key] = value;
        storage.setItem(ms,JSON.stringify(mydata));
        return mydata.data;

    };
    var get = function(key){
        //读取
        var mydata = storage.getItem(ms);
        if(!mydata){
            return false;
        }
        mydata = JSON.parse(mydata);

        return mydata.data[key];
    };

    var remove = function(key){
        //读取
        var mydata = storage.getItem(ms);
        if(!mydata){
            return false;
        }

        mydata = JSON.parse(mydata);
        delete mydata.data[key];
        storage.setItem(ms,JSON.stringify(mydata));
        return mydata.data;
    };
 
    var clear = function(){
        //清除对象
        storage.removeItem(ms);
    };

    var init = function(){
        storage.setItem(ms,'{"data":{}}');
    };

    return {
        set : set,
        get : get,
        remove : remove,
        init : init,
        clear : clear
    };
})();

/*
function setCookie(c_name, value, expiredays) {
    var exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = c_name + "=" + escape(value) +
        ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=")
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1) c_end = document.cookie.length
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return ""
}*/