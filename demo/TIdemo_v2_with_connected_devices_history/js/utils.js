/*
 * utils.js
 * Cleaned up by Kevin Yang
 * kevin@cassianetworks.us
 */

/* 
Creates an object of functions with encapsulated key "TIdemo" for localStorage.
存储localstorage时候最好是封装一个自己的键值，在这个值里存储自己的内容对象，封装一个方法针对自己对象进行操作。避免冲突也会在开发中更方便。
*/
var mystorage = (function mystorage(){
  var ms = "TIdemo";
  
  var storage=window.localStorage;
  if(!window.localStorage){
    alert("Browser doesn't support localstorage");
    return false;
  }

  var set = function(key,value){
    // Store (存储).
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
    // Read (读取).
    var mydata = storage.getItem(ms);
    if(!mydata){
      return false;
    }
    mydata = JSON.parse(mydata);

    return mydata.data[key];
  };

  var remove = function(key){
    // Read (读取).
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
    // Clear out storage (清除对象).
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