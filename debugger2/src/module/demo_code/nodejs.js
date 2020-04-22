/**
 * 使用lodash.template模板
 * TODO: 优化代码生成逻辑
 */

const demo1ByAp = `
const request = require('request');
const EventSource = require('eventsource');

// connect to device
function connect() {
  let options = {
    'method': 'POST',
    'url': '<%= params.connectUrl %>',
    'headers': {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({"timeout":5000, "type": "<%= params.connectParams.addrType %>"})
  };
  return new Promise((resolve, reject) => {
    request(options, function (error, response) { 
      console.log('connect:', error, response.body);
      if (error) reject(error);
      else if (response.body !== 'OK') reject(response.body);
      else resolve(response.body);
    });
  });
}

// write data to device
function write() {
  let options = {
    'method': 'GET',
    'url': '<%= params.writeUrl %>',
    'headers': {
    }
  };
  return new Promise((resolve, reject) => {
    request(options, function (error, response) { 
      console.log('write:', error, response.body);
      if (error) reject(error);
      else if (response.body !== 'OK') reject(response.body);
      else resolve(response.body);
    });
  });
}

function openNotifySse() {
  const url = '<%= params.notifyUrl %>';
  const sse = new EventSource(url);

  sse.onerror = function(error) {
    console.log('open notify sse failed:', error);
  };
  
  sse.onmessage = function(message) {
    console.log('recevied notify sse message:', message);
  };
  
  return Promise.resolve(sse);
}

// TODO: listen connect status sse, add retry when device disconnected

function main() {
  connect().then(write).then(openNotifySse).then(() => {
    console.log('success');
  }).catch(ex => {
    console.error('fail:', ex);
  });
}

main();
`;

const demo1ByAc = `
const request = require('request');
const EventSource = require('eventsource');

const key = '<%= params.devConf.acDevKey %>';
const secret = '<%= params.devConf.acDevSecret %>';

// oauth2
function oauth2(key, secret) {
  const auth = Buffer.from(key + ':' + secret).toString('base64');
  let options = {
    'method': 'POST',
    'url': '<%= params.oauth2Url %>',
    'headers': {
      'Authorization': 'Basic ' + auth,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({'grant_type': 'client_credentials'})
  };
  return new Promise((resolve, reject) => {
    request(options, function (error, response) { 
      console.log('oauth2:', error, response.body);
      if (error) reject(error);
      else if (response.statusCode !== 200) reject(response.body);
      else resolve(JSON.parse(response.body).access_token);
    });
  });
}

// connect to device
function connect(token) {
  let options = {
    'method': 'POST',
    'url': '<%= params.connectUrl %>&access_token=' + token,
    'headers': {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({"timeout":5000, "type": "<%= params.connectParams.addrType %>"})
  };
  return new Promise((resolve, reject) => {
    request(options, function (error, response) { 
      console.log('connect:', error, response.body);
      if (error) reject(error);
      else if (response.body !== 'OK') reject(response.body);
      else resolve(response.body);
    });
  });
}

// write data to device
function write(token) {
  let options = {
    'method': 'GET',
    'url': '<%= params.writeUrl %>&access_token=' + token,
    'headers': {
    }
  };
  return new Promise((resolve, reject) => {
    request(options, function (error, response) { 
      console.log('write:', error, response.body);
      if (error) reject(error);
      else if (response.body !== 'OK') reject(response.body);
      else resolve(response.body);
    });
  });
}

function openNotifySse(token) {
  const url = '<%= params.notifyUrl %>&access_token=' + token;
  const sse = new EventSource(url);

  sse.onerror = function(error) {
    console.log('open notify sse failed:', error);
  };
  
  sse.onmessage = function(message) {
    console.log('recevied notify sse message:', message);
  };
  
  return Promise.resolve(sse);
}

// TODO: listen connect status sse, add retry when device disconnected

(async () => {
  try {
    let token = await oauth2(key, secret);
    console.log('token:', token);
    await connect(token);
    await write(token);
    await openNotifySse(token);
    console.log('success');
  } catch(ex) {
    console.error('fail:', ex);
  }
})();
`;

const demo2ByAp = `
/**
 * 1.scanned device -> async connect
 * 2.connect result reported by connect status sse: 
 *  - connected: connect success, then write data
 *  - disconnected: device disconnected, if the write is not successful, recall async connect
 *  - timeout: connect timeout, recall async connect
 * caution: 
 *  - please confirm AP version support
 *  - connect status event only triggered when event happened, its means already connected devices 
 *    before sse created will not trigger connect status event
 */
const request = require('request');
const EventSource = require('eventsource');

const devicesWriteFlag = {};
const devicesInfo = {};

function openScanSse() {
  const url = '<%= params.scanUrl %>';
  const sse = new EventSource(url);

  sse.onerror = function(error) {
    console.log('open notify sse failed:', error);
  };
  
  // async connect device when scanned it
  sse.onmessage = function(message) {
    // console.log('recevied scan sse message:', message);
    const data = JSON.parse(message.data);
    const deviceAddr = data.bdaddrs[0];
    const deviceMac = deviceAddr.bdaddr;
    if (devicesWriteFlag[deviceMac]) return;
    const deviceAddrType = deviceAddr.bdaddrType;
    console.log('scanned device:', deviceMac, deviceAddrType);

    devicesInfo[deviceMac] = deviceAddrType;
    connect(deviceMac, deviceAddrType);
  };
  
  return Promise.resolve(sse);
}

// async connect to device
function connect(deviceMac, addrType) {
  let options = {
    'method': 'POST',
    'url': '<%= params.connectUrl %>',
    'headers': {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({"list":[{"type": addrType,"addr": deviceMac}],"timeout":5000,"per_dev_timeout":10000})
  };

  // if connect failed, retry when scanned it
  return new Promise((resolve, reject) => {
    request(options, function (error, response) { 
      console.log('connect:', error, response.body);
      if (error) reject(error);
      else if (response.body !== 'OK') reject(response.body);
      else resolve(response.body);
    });
  });
}

// write data to device
function write(deviceMac, handle, value, noresponse=false) {
  let url = '<%= params.devConf.baseURI %>/gatt/nodes/' + deviceMac + '/handle/' + handle + '/value/' + value + '?mac=<%= params.devConf.mac %>';
  if (noresponse) url += '&noresponse=1';
  let options = {
    'method': 'GET',
    'url': url,
    'headers': {}
  };
  return new Promise((resolve, reject) => {
    request(options, function (error, response) { 
      console.log('write:', error, response.body, url);
      if (error) reject(error);
      else if (response.body !== 'OK') reject(response.body);
      else resolve(response.body);
    });
  });
}

Promise.wait = function (time) { 
  return new Promise(function (resolve) { 
    return setTimeout(resolve, time || 0); 
  }); 
}; 

Promise.retry = function (fn, cont, delay, ...p) { 
  return fn(...p).catch(function (err) { 
    return cont > 0 ? Promise.wait(delay).then(function() { 
      return Promise.retry(fn, cont - 1, delay, ...p); 
    }) : Promise.reject('failed'); 
  }); 
}; 

function openConnectStateSse() {
  const url = '<%= params.connectStatusUrl %>';
  const sse = new EventSource(url);

  sse.onerror = function(error) {
    console.log('open connect status sse failed:', error);
  };
  
  sse.onmessage = function(message) {
    console.log('recevied connect status sse message:', message);
    const data = JSON.parse(message.data);
    const deviceMac = data.handle;
    if (devicesWriteFlag[deviceMac]) return;
    if (data.connectionState === 'connected') {
      Promise.retry(write, 2, 200, deviceMac, <%= params.writeParams.handle %>, '<%= params.writeParams.value %>', <%= params.writeParams.noresponse %>).then(() => {
        devicesWriteFlag[deviceMac] = true;
        Promise.retry(disconnect, 2, 50, deviceMac);
      }).catch(ex => {
        console.error(ex);
      });
    } else if (data.connectionState === 'disconnected') {
      // retry connect when scanned
    } else if (data.connectionState === 'timeout') {
      // retry connect when scanned
    }
  };
  
  return Promise.resolve(sse);
}

function disconnect(deviceMac) {
  const url = '<%= params.devConf.baseURI %>/gap/nodes/' + deviceMac + '/connection?';
  let options = {
    'method': 'DELETE',
    'url': url,
    'headers': {
    }
  };
  return new Promise((resolve, reject) => {
    request(options, function (error, response) { 
      console.log('disconnect:', error, response.body, url);
      if (error) reject(error);
      else if (response.body !== 'OK') reject(response.body);
      else resolve(response.body);
    });
  });
}

function main() {
  openScanSse().then(openConnectStateSse).then(() => {
    console.log('start success');
  }).catch(ex => {
    console.error('start failed:', ex);
  });
}

main();
`;

const demo2ByAc = `
/**
 * 1.scanned device -> async connect
 * 2.connect result reported by connect status sse: 
 *  - connected: connect success, then write data
 *  - disconnected: device disconnected, if the write is not successful, recall async connect
 *  - timeout: connect timeout, recall async connect
 * caution: 
 *  - please confirm AC version support
 *  - connect status event only triggered when event happened, its means already connected devices 
 *    before sse created will not trigger connect status event
 */
const request = require('request');
const EventSource = require('eventsource');

const key = '<%= params.devConf.acDevKey %>';
const secret = '<%= params.devConf.acDevSecret %>';

const devicesWriteFlag = {};
const devicesInfo = {};

// oauth2
function oauth2(key, secret) {
  const auth = Buffer.from(key + ':' + secret).toString('base64');
  let options = {
    'method': 'POST',
    'url': '<%= params.oauth2Url %>',
    'headers': {
      'Authorization': 'Basic ' + auth,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({'grant_type': 'client_credentials'})
  };
  return new Promise((resolve, reject) => {
    request(options, function (error, response) { 
      console.log('oauth2:', error, response.body);
      if (error) reject(error);
      else if (response.statusCode !== 200) reject(response.body);
      else resolve(JSON.parse(response.body).access_token);
    });
  });
}

function openScanSse(token) {
  const url = '<%= params.scanUrl %>&access_token=' + token;
  const sse = new EventSource(url);

  sse.onerror = function(error) {
    console.log('open notify sse failed:', error);
  };
  
  // async connect device when scanned it
  sse.onmessage = function(message) {
    // console.log('recevied scan sse message:', message);
    const data = JSON.parse(message.data);
    const deviceAddr = data.bdaddrs[0];
    const deviceMac = deviceAddr.bdaddr;
    if (devicesWriteFlag[deviceMac]) return;
    const deviceAddrType = deviceAddr.bdaddrType;
    console.log('scanned device:', deviceMac, deviceAddrType);

    devicesInfo[deviceMac] = deviceAddrType;
    connect(token, deviceMac, deviceAddrType);
  };
  
  return Promise.resolve(sse);
}

// async connect to device
function connect(token, deviceMac, addrType) {
  let options = {
    'method': 'POST',
    'url': '<%= params.connectUrl %>&access_token=' + token,
    'headers': {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({"list":[{"type": addrType,"addr": deviceMac}],"timeout":5000,"per_dev_timeout":10000})
  };

  // if connect failed, retry when scanned it
  return new Promise((resolve, reject) => {
    request(options, function (error, response) { 
      console.log('connect:', error, response.body);
      if (error) reject(error);
      else if (response.body !== 'OK') reject(response.body);
      else resolve(response.body);
    });
  });
}

// write data to device
function write(token, deviceMac, handle, value, noresponse=false) {
  let url = '<%= params.devConf.baseURI %>/gatt/nodes/' + deviceMac + '/handle/' + handle + '/value/' + value + '?mac=<%= params.devConf.mac %>&access_token=' + token;
  if (noresponse) url += '&noresponse=1';
  let options = {
    'method': 'GET',
    'url': url,
    'headers': {}
  };
  return new Promise((resolve, reject) => {
    request(options, function (error, response) { 
      console.log('write:', error, response.body, url);
      if (error) reject(error);
      else if (response.body !== 'OK') reject(response.body);
      else resolve(response.body);
    });
  });
}

Promise.wait = function (time) { 
  return new Promise(function (resolve) { 
    return setTimeout(resolve, time || 0); 
  }); 
}; 

Promise.retry = function (fn, cont, delay, ...p) { 
  return fn(...p).catch(function (err) { 
    return cont > 0 ? Promise.wait(delay).then(function() { 
      return Promise.retry(fn, cont - 1, delay, ...p); 
    }) : Promise.reject('failed'); 
  }); 
}; 

function openConnectStateSse(token) {
  const url = '<%= params.connectStatusUrl %>&access_token=' + token;
  const sse = new EventSource(url);

  sse.onerror = function(error) {
    console.log('open connect status sse failed:', error);
  };
  
  sse.onmessage = function(message) {
    console.log('recevied connect status sse message:', message);
    const data = JSON.parse(message.data);
    const deviceMac = data.handle;
    if (devicesWriteFlag[deviceMac]) return;
    if (data.connectionState === 'connected') {
      Promise.retry(write, 2, 200, token, deviceMac, <%= params.writeParams.handle %>, '<%= params.writeParams.value %>', <%= params.writeParams.noresponse %>).then(() => {
        devicesWriteFlag[deviceMac] = true;
        Promise.retry(disconnect, 2, 50, token, deviceMac);
      }).catch(ex => {
        console.error(ex);
      });
    } else if (data.connectionState === 'disconnected') {
      // retry connect when scanned
    } else if (data.connectionState === 'timeout') {
      // retry connect when scanned
    }
  };
  
  return Promise.resolve(sse);
}

function disconnect(token, deviceMac) {
  const url = '<%= params.devConf.baseURI %>/gap/nodes/' + deviceMac + '/connection?mac=<%= params.devConf.mac %>&access_token=' + token;

  let options = {
    'method': 'DELETE',
    'url': url,
    'headers': {
    }
  };
  return new Promise((resolve, reject) => {
    request(options, function (error, response) { 
      console.log('disconnect:', error, response.body, url);
      if (error) reject(error);
      else if (response.body !== 'OK') reject(response.body);
      else resolve(response.body);
    });
  });
}

(async () => {
  try {
    let token = await oauth2(key, secret);
    console.log('token:', token);
    await openScanSse(token);
    await openConnectStateSse(token);
    console.log('success');
  } catch(ex) {
    console.error('fail:', ex);
  }
})();
`;

export default {
  demo1: {
    AP: demo1ByAp,
    AC: demo1ByAc,
  },
  demo2: {
    AP: demo2ByAp,
    AC: demo2ByAc,
  }
};