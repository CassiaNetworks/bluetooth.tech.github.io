/**
 * MQTT 代码生成模板
 * 使用 Node.js mqtt 库实现
 * 
 * 注意: 代码需兼容 Node.js v10，避免使用以下语法:
 * - 可选链 (?.)
 * - 空值合并 (??)
 * - Promise.allSettled()
 * - 私有类字段 (#)
 * - 顶层 await
 */

const connect = `
var mqtt = require('mqtt');

var BROKER_URL = '<%= mqttConfig.brokerUrl %>';
var GATEWAY_MAC = '<%= mqttConfig.gateway %>';
var DEVICE_MAC = '<%= apiParams.deviceMac %>';
var ADDR_TYPE = '<%= apiParams.addrType %>';
var TIMEOUT = 15000;

var client = mqtt.connect(BROKER_URL, {
  username: '<%= mqttConfig.username %>',
  password: '<%= mqttConfig.password %>',
  clientId: 'nodejs_' + Math.random().toString(16).substring(2, 10)
});

var requestId = Math.random().toString(16).substring(2, 10);

client.on('connect', function() {
  client.subscribe('up/' + GATEWAY_MAC + '/api_reply', function(err) {
    if (err) {
      console.error('Subscribe error:', err);
      return;
    }
    
    var message = {
      id: requestId,
      action: 'api',
      timestamp: Date.now(),
      gateway: GATEWAY_MAC,
      data: {
        url: '/gap/nodes/' + DEVICE_MAC + '/connection',
        method: 'POST',
        body: {
          type: ADDR_TYPE,
          timeout: TIMEOUT
        }
      }
    };
    
    client.publish('down/' + GATEWAY_MAC + '/api', JSON.stringify(message), { qos: 1 });
  });
});

client.on('message', function(topic, payload) {
  var msg = JSON.parse(payload.toString());
  if (msg.id === requestId && msg.action === 'api_reply') {
    if (msg.data.code === 200) {
      console.log('Connect success:', msg.data.body);
    } else {
      console.error('Connect failed:', msg.data.code, msg.data.body);
    }
    client.end();
  }
});

client.on('error', function(err) {
  console.error('Error:', err);
});
`;

const disconnect = `
var mqtt = require('mqtt');

var BROKER_URL = '<%= mqttConfig.brokerUrl %>';
var GATEWAY_MAC = '<%= mqttConfig.gateway %>';
var DEVICE_MAC = '<%= apiParams.deviceMac %>';

var client = mqtt.connect(BROKER_URL, {
  username: '<%= mqttConfig.username %>',
  password: '<%= mqttConfig.password %>'
});

var requestId = Math.random().toString(16).substring(2, 10);

client.on('connect', function() {
  client.subscribe('up/' + GATEWAY_MAC + '/api_reply');
  
  var message = {
    id: requestId,
    action: 'api',
    timestamp: Date.now(),
    gateway: GATEWAY_MAC,
    data: {
      url: '/gap/nodes/' + DEVICE_MAC + '/connection',
      method: 'DELETE',
      body: {}
    }
  };
  
  client.publish('down/' + GATEWAY_MAC + '/api', JSON.stringify(message), { qos: 1 });
});

client.on('message', function(topic, payload) {
  var msg = JSON.parse(payload.toString());
  if (msg.id === requestId && msg.action === 'api_reply') {
    console.log('Disconnect result:', msg.data.code, msg.data.body);
    client.end();
  }
});
`;

const read = `
var mqtt = require('mqtt');

var BROKER_URL = '<%= mqttConfig.brokerUrl %>';
var GATEWAY_MAC = '<%= mqttConfig.gateway %>';
var DEVICE_MAC = '<%= apiParams.deviceMac %>';
var HANDLE = '<%= apiParams.handle %>';

var client = mqtt.connect(BROKER_URL, {
  username: '<%= mqttConfig.username %>',
  password: '<%= mqttConfig.password %>'
});

var requestId = Math.random().toString(16).substring(2, 10);

client.on('connect', function() {
  client.subscribe('up/' + GATEWAY_MAC + '/api_reply');
  
  var message = {
    id: requestId,
    action: 'api',
    timestamp: Date.now(),
    gateway: GATEWAY_MAC,
    data: {
      url: '/gatt/nodes/' + DEVICE_MAC + '/handle/' + HANDLE + '/value',
      method: 'GET',
      body: {}
    }
  };
  
  client.publish('down/' + GATEWAY_MAC + '/api', JSON.stringify(message), { qos: 1 });
});

client.on('message', function(topic, payload) {
  var msg = JSON.parse(payload.toString());
  if (msg.id === requestId && msg.action === 'api_reply') {
    if (msg.data.code === 200) {
      console.log('Read success, value:', msg.data.body.value);
    } else {
      console.error('Read failed:', msg.data.code, msg.data.body);
    }
    client.end();
  }
});
`;

const write = `
var mqtt = require('mqtt');

var BROKER_URL = '<%= mqttConfig.brokerUrl %>';
var GATEWAY_MAC = '<%= mqttConfig.gateway %>';
var DEVICE_MAC = '<%= apiParams.deviceMac %>';
var HANDLE = '<%= apiParams.handle %>';
var VALUE = '<%= apiParams.value %>';
var NO_RESPONSE = <%= apiParams.noresponse ? 'true' : 'false' %>;

var client = mqtt.connect(BROKER_URL, {
  username: '<%= mqttConfig.username %>',
  password: '<%= mqttConfig.password %>'
});

var requestId = Math.random().toString(16).substring(2, 10);

client.on('connect', function() {
  client.subscribe('up/' + GATEWAY_MAC + '/api_reply');
  
  var url = '/gatt/nodes/' + DEVICE_MAC + '/handle/' + HANDLE + '/value/' + VALUE;
  if (NO_RESPONSE) {
    url += '?noresponse=1';
  }
  
  var message = {
    id: requestId,
    action: 'api',
    timestamp: Date.now(),
    gateway: GATEWAY_MAC,
    data: {
      url: url,
      method: 'GET',
      body: {}
    }
  };
  
  client.publish('down/' + GATEWAY_MAC + '/api', JSON.stringify(message), { qos: 1 });
});

client.on('message', function(topic, payload) {
  var msg = JSON.parse(payload.toString());
  if (msg.id === requestId && msg.action === 'api_reply') {
    if (msg.data.code === 200) {
      console.log('Write success');
    } else {
      console.error('Write failed:', msg.data.code, msg.data.body);
    }
    client.end();
  }
});
`;

const scan = `
var mqtt = require('mqtt');

var BROKER_URL = '<%= mqttConfig.brokerUrl %>';
var GATEWAY_MAC = '<%= mqttConfig.gateway %>';

var client = mqtt.connect(BROKER_URL, {
  username: '<%= mqttConfig.username %>',
  password: '<%= mqttConfig.password %>'
});

client.on('connect', function() {
  client.subscribe('up/' + GATEWAY_MAC + '/scan', function(err) {
    if (err) {
      console.error('Subscribe error:', err);
    }
  });
});

client.on('message', function(topic, payload) {
  if (topic.includes('/scan')) {
    var msg = JSON.parse(payload.toString());
    var scanData = msg.data || [];
    scanData.forEach(function(device) {
      console.log('Device:', device.bdaddr, 'Name:', device.name, 'RSSI:', device.rssi);
    });
  }
});

setTimeout(function() {
  client.end();
}, 60000);
`;

const notify = `
var mqtt = require('mqtt');

var BROKER_URL = '<%= mqttConfig.brokerUrl %>';
var GATEWAY_MAC = '<%= mqttConfig.gateway %>';

var client = mqtt.connect(BROKER_URL, {
  username: '<%= mqttConfig.username %>',
  password: '<%= mqttConfig.password %>'
});

client.on('connect', function() {
  client.subscribe('up/' + GATEWAY_MAC + '/notification', function(err) {
    if (err) {
      console.error('Subscribe error:', err);
    }
  });
});

client.on('message', function(topic, payload) {
  if (topic.includes('/notification')) {
    var msg = JSON.parse(payload.toString());
    var notifications = msg.data || [];
    notifications.forEach(function(item) {
      console.log('Notification from:', item.id, 'handle:', item.handle, 'value:', item.value);
    });
  }
});

process.on('SIGINT', function() {
  client.end();
  process.exit();
});
`;

const connectList = `
var mqtt = require('mqtt');

var BROKER_URL = '<%= mqttConfig.brokerUrl %>';
var GATEWAY_MAC = '<%= mqttConfig.gateway %>';

var client = mqtt.connect(BROKER_URL, {
  username: '<%= mqttConfig.username %>',
  password: '<%= mqttConfig.password %>'
});

var requestId = Math.random().toString(16).substring(2, 10);

client.on('connect', function() {
  client.subscribe('up/' + GATEWAY_MAC + '/api_reply');
  
  var message = {
    id: requestId,
    action: 'api',
    timestamp: Date.now(),
    gateway: GATEWAY_MAC,
    data: {
      url: '/gap/nodes?connection_state=connected',
      method: 'GET',
      body: {}
    }
  };
  
  client.publish('down/' + GATEWAY_MAC + '/api', JSON.stringify(message), { qos: 1 });
});

client.on('message', function(topic, payload) {
  var msg = JSON.parse(payload.toString());
  if (msg.id === requestId && msg.action === 'api_reply') {
    if (msg.data.code === 200) {
      var nodes = msg.data.body.nodes || [];
      console.log('Connected devices (' + nodes.length + '):');
      nodes.forEach(function(node) {
        console.log('  -', node.id, 'type:', node.type, 'chip:', node.chipId);
      });
    } else {
      console.error('Get connection list failed:', msg.data.code);
    }
    client.end();
  }
});
`;

const discover = `
var mqtt = require('mqtt');

var BROKER_URL = '<%= mqttConfig.brokerUrl %>';
var GATEWAY_MAC = '<%= mqttConfig.gateway %>';
var DEVICE_MAC = '<%= apiParams.deviceMac %>';

var client = mqtt.connect(BROKER_URL, {
  username: '<%= mqttConfig.username %>',
  password: '<%= mqttConfig.password %>'
});

var requestId = Math.random().toString(16).substring(2, 10);

client.on('connect', function() {
  client.subscribe('up/' + GATEWAY_MAC + '/api_reply');
  
  var message = {
    id: requestId,
    action: 'api',
    timestamp: Date.now(),
    gateway: GATEWAY_MAC,
    data: {
      url: '/gatt/nodes/' + DEVICE_MAC + '/services/characteristics/descriptors',
      method: 'GET',
      body: {}
    }
  };
  
  client.publish('down/' + GATEWAY_MAC + '/api', JSON.stringify(message), { qos: 1 });
});

client.on('message', function(topic, payload) {
  var msg = JSON.parse(payload.toString());
  if (msg.id === requestId && msg.action === 'api_reply') {
    if (msg.data.code === 200) {
      console.log('Services discovered:');
      console.log(JSON.stringify(msg.data.body, null, 2));
    } else {
      console.error('Discover failed:', msg.data.code, msg.data.body);
    }
    client.end();
  }
});
`;

const connectionState = `
var mqtt = require('mqtt');

var BROKER_URL = '<%= mqttConfig.brokerUrl %>';
var GATEWAY_MAC = '<%= mqttConfig.gateway %>';

var client = mqtt.connect(BROKER_URL, {
  username: '<%= mqttConfig.username %>',
  password: '<%= mqttConfig.password %>'
});

client.on('connect', function() {
  client.subscribe('up/' + GATEWAY_MAC + '/connection_state', function(err) {
    if (err) {
      console.error('Subscribe error:', err);
    }
  });
});

client.on('message', function(topic, payload) {
  if (topic.includes('/connection_state')) {
    var msg = JSON.parse(payload.toString());
    var events = msg.data || [];
    events.forEach(function(event) {
      console.log('Connection state:', event.handle, '->', event.connectionState);
    });
  }
});

process.on('SIGINT', function() {
  client.end();
  process.exit();
});
`;

export default {
  connect: connect,
  disconnect: disconnect,
  read: read,
  write: write,
  scan: scan,
  notify: notify,
  connectList: connectList,
  discover: discover,
  connectionState: connectionState
}
