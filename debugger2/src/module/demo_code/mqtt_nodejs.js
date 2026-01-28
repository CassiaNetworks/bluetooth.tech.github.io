/**
 * MQTT Demo 代码模板
 * 使用 lodash.template 模板引擎
 * 兼容 Node.js v10
 */

// Demo1: 连接设备 -> 写入数据 -> 监听通知
var demo1 = '// MQTT Demo: Connect -> Write -> Listen Notification\n' +
'// Requires: npm install mqtt\n' +
'// Compatible with Node.js v10+\n' +
'\n' +
'var mqtt = require(\'mqtt\');\n' +
'\n' +
'// MQTT Configuration\n' +
'var brokerUrl = \'<%= params.brokerUrl %>\';\n' +
'var username = \'<%= params.username %>\';\n' +
'var password = \'<%= params.password %>\';\n' +
'var gateway = \'<%= params.gateway %>\';\n' +
'var deviceMac = \'<%= params.connectParams.deviceMac %>\';\n' +
'var addrType = \'<%= params.connectParams.addrType %>\';\n' +
'var writeHandle = <%= params.writeParams.handle %>;\n' +
'var writeValue = \'<%= params.writeParams.value %>\';\n' +
'var noresponse = <%= params.writeParams.noresponse %>;\n' +
'\n' +
'// MQTT Topics\n' +
'var TOPIC_API_DOWN = \'down/\' + gateway + \'/api\';\n' +
'var TOPIC_API_UP = \'up/\' + gateway + \'/api_reply\';\n' +
'var TOPIC_NOTIFICATION = \'up/\' + gateway + \'/notification\';\n' +
'var TOPIC_CONNECTION_STATE = \'up/\' + gateway + \'/connection_state\';\n' +
'\n' +
'// Request tracking\n' +
'var pendingRequests = {};\n' +
'var requestId = 0;\n' +
'\n' +
'// Generate unique request ID\n' +
'function generateId() {\n' +
'  requestId++;\n' +
'  return \'req-\' + Date.now() + \'-\' + requestId;\n' +
'}\n' +
'\n' +
'// Send API request via MQTT\n' +
'function sendApiRequest(client, method, url, body) {\n' +
'  return new Promise(function(resolve, reject) {\n' +
'    var id = generateId();\n' +
'    var message = {\n' +
'      id: id,\n' +
'      action: \'api\',\n' +
'      timestamp: Date.now(),\n' +
'      gateway: gateway,\n' +
'      data: {\n' +
'        method: method,\n' +
'        url: url,\n' +
'        body: body || {}\n' +
'      }\n' +
'    };\n' +
'    \n' +
'    // Set timeout\n' +
'    var timeout = setTimeout(function() {\n' +
'      delete pendingRequests[id];\n' +
'      reject(new Error(\'Request timeout: \' + id));\n' +
'    }, 30000);\n' +
'    \n' +
'    pendingRequests[id] = {\n' +
'      resolve: resolve,\n' +
'      reject: reject,\n' +
'      timeout: timeout\n' +
'    };\n' +
'    \n' +
'    console.log(\'Sending request:\', JSON.stringify(message));\n' +
'    client.publish(TOPIC_API_DOWN, JSON.stringify(message));\n' +
'  });\n' +
'}\n' +
'\n' +
'// Connect to device\n' +
'function connectDevice(client) {\n' +
'  var url = \'/gap/nodes/\' + deviceMac + \'/connection\';\n' +
'  var body = {\n' +
'    type: addrType,\n' +
'    timeout: 5000\n' +
'  };\n' +
'  return sendApiRequest(client, \'POST\', url, body);\n' +
'}\n' +
'\n' +
'// Write data to device\n' +
'function writeData(client) {\n' +
'  var url = \'/gatt/nodes/\' + deviceMac + \'/handle/\' + writeHandle + \'/value/\' + writeValue;\n' +
'  if (noresponse) {\n' +
'    url += \'?noresponse=1\';\n' +
'  }\n' +
'  return sendApiRequest(client, \'GET\', url, {});\n' +
'}\n' +
'\n' +
'// Main\n' +
'var client = mqtt.connect(brokerUrl, {\n' +
'  username: username,\n' +
'  password: password,\n' +
'  clientId: \'demo_\' + Math.random().toString(16).substring(2, 10)\n' +
'});\n' +
'\n' +
'client.on(\'connect\', function() {\n' +
'  console.log(\'Connected to MQTT broker\');\n' +
'  \n' +
'  // Subscribe to topics\n' +
'  client.subscribe([TOPIC_API_UP, TOPIC_NOTIFICATION, TOPIC_CONNECTION_STATE], function(err) {\n' +
'    if (err) {\n' +
'      console.error(\'Subscribe error:\', err);\n' +
'      return;\n' +
'    }\n' +
'    console.log(\'Subscribed to topics\');\n' +
'    \n' +
'    // Start connection\n' +
'    connectDevice(client).then(function(result) {\n' +
'      console.log(\'Connect result:\', result);\n' +
'      return writeData(client);\n' +
'    }).then(function(result) {\n' +
'      console.log(\'Write result:\', result);\n' +
'      console.log(\'Waiting for notifications...\');\n' +
'    }).catch(function(err) {\n' +
'      console.error(\'Error:\', err);\n' +
'    });\n' +
'  });\n' +
'});\n' +
'\n' +
'client.on(\'message\', function(topic, message) {\n' +
'  try {\n' +
'    var data = JSON.parse(message.toString());\n' +
'    \n' +
'    if (topic === TOPIC_API_UP) {\n' +
'      // Handle API response\n' +
'      var id = data.id;\n' +
'      var pending = pendingRequests[id];\n' +
'      if (pending) {\n' +
'        clearTimeout(pending.timeout);\n' +
'        delete pendingRequests[id];\n' +
'        if (data.data && data.data.code === 200) {\n' +
'          pending.resolve(data.data.body);\n' +
'        } else {\n' +
'          pending.reject(new Error(\'API error: \' + JSON.stringify(data.data)));\n' +
'        }\n' +
'      }\n' +
'    } else if (topic === TOPIC_NOTIFICATION) {\n' +
'      // Handle notification data\n' +
'      console.log(\'Notification received:\', JSON.stringify(data));\n' +
'    } else if (topic === TOPIC_CONNECTION_STATE) {\n' +
'      // Handle connection state\n' +
'      console.log(\'Connection state:\', JSON.stringify(data));\n' +
'    }\n' +
'  } catch (e) {\n' +
'    console.error(\'Parse message error:\', e);\n' +
'  }\n' +
'});\n' +
'\n' +
'client.on(\'error\', function(err) {\n' +
'  console.error(\'MQTT error:\', err);\n' +
'});\n' +
'\n' +
'// Handle exit\n' +
'process.on(\'SIGINT\', function() {\n' +
'  console.log(\'Disconnecting...\');\n' +
'  client.end();\n' +
'  process.exit();\n' +
'});\n';

// Demo2: 扫描 -> 连接 -> 写入
var demo2 = '// MQTT Demo: Scan -> Connect -> Write\n' +
'// Requires: npm install mqtt\n' +
'// Compatible with Node.js v10+\n' +
'\n' +
'var mqtt = require(\'mqtt\');\n' +
'\n' +
'// MQTT Configuration\n' +
'var brokerUrl = \'<%= params.brokerUrl %>\';\n' +
'var username = \'<%= params.username %>\';\n' +
'var password = \'<%= params.password %>\';\n' +
'var gateway = \'<%= params.gateway %>\';\n' +
'var writeHandle = <%= params.writeParams.handle %>;\n' +
'var writeValue = \'<%= params.writeParams.value %>\';\n' +
'var noresponse = <%= params.writeParams.noresponse %>;\n' +
'\n' +
'// MQTT Topics\n' +
'var TOPIC_API_DOWN = \'down/\' + gateway + \'/api\';\n' +
'var TOPIC_API_UP = \'up/\' + gateway + \'/api_reply\';\n' +
'var TOPIC_SCAN = \'up/\' + gateway + \'/scan\';\n' +
'var TOPIC_CONNECTION_STATE = \'up/\' + gateway + \'/connection_state\';\n' +
'\n' +
'// Device tracking\n' +
'var devicesWriteFlag = {};\n' +
'var pendingRequests = {};\n' +
'var requestId = 0;\n' +
'\n' +
'// Generate unique request ID\n' +
'function generateId() {\n' +
'  requestId++;\n' +
'  return \'req-\' + Date.now() + \'-\' + requestId;\n' +
'}\n' +
'\n' +
'// Send API request via MQTT\n' +
'function sendApiRequest(client, method, url, body) {\n' +
'  return new Promise(function(resolve, reject) {\n' +
'    var id = generateId();\n' +
'    var message = {\n' +
'      id: id,\n' +
'      action: \'api\',\n' +
'      timestamp: Date.now(),\n' +
'      gateway: gateway,\n' +
'      data: {\n' +
'        method: method,\n' +
'        url: url,\n' +
'        body: body || {}\n' +
'      }\n' +
'    };\n' +
'    \n' +
'    var timeout = setTimeout(function() {\n' +
'      delete pendingRequests[id];\n' +
'      reject(new Error(\'Request timeout: \' + id));\n' +
'    }, 30000);\n' +
'    \n' +
'    pendingRequests[id] = {\n' +
'      resolve: resolve,\n' +
'      reject: reject,\n' +
'      timeout: timeout\n' +
'    };\n' +
'    \n' +
'    console.log(\'Sending request:\', JSON.stringify(message));\n' +
'    client.publish(TOPIC_API_DOWN, JSON.stringify(message));\n' +
'  });\n' +
'}\n' +
'\n' +
'// Connect to device\n' +
'function connectDevice(client, deviceMac, addrType) {\n' +
'  var url = \'/gap/nodes/\' + deviceMac + \'/connection\';\n' +
'  var body = {\n' +
'    type: addrType,\n' +
'    timeout: 5000\n' +
'  };\n' +
'  return sendApiRequest(client, \'POST\', url, body);\n' +
'}\n' +
'\n' +
'// Write data to device\n' +
'function writeData(client, deviceMac) {\n' +
'  var url = \'/gatt/nodes/\' + deviceMac + \'/handle/\' + writeHandle + \'/value/\' + writeValue;\n' +
'  if (noresponse) {\n' +
'    url += \'?noresponse=1\';\n' +
'  }\n' +
'  return sendApiRequest(client, \'GET\', url, {});\n' +
'}\n' +
'\n' +
'// Disconnect device\n' +
'function disconnectDevice(client, deviceMac) {\n' +
'  var url = \'/gap/nodes/\' + deviceMac + \'/connection\';\n' +
'  return sendApiRequest(client, \'DELETE\', url, {});\n' +
'}\n' +
'\n' +
'// Main\n' +
'var client = mqtt.connect(brokerUrl, {\n' +
'  username: username,\n' +
'  password: password,\n' +
'  clientId: \'demo_\' + Math.random().toString(16).substring(2, 10)\n' +
'});\n' +
'\n' +
'client.on(\'connect\', function() {\n' +
'  console.log(\'Connected to MQTT broker\');\n' +
'  \n' +
'  // Subscribe to topics\n' +
'  client.subscribe([TOPIC_API_UP, TOPIC_SCAN, TOPIC_CONNECTION_STATE], function(err) {\n' +
'    if (err) {\n' +
'      console.error(\'Subscribe error:\', err);\n' +
'      return;\n' +
'    }\n' +
'    console.log(\'Subscribed to topics\');\n' +
'    console.log(\'Waiting for scan data...\');\n' +
'    console.log(\'Note: Scan must be configured on the gateway side for MQTT mode.\');\n' +
'  });\n' +
'});\n' +
'\n' +
'client.on(\'message\', function(topic, message) {\n' +
'  try {\n' +
'    var data = JSON.parse(message.toString());\n' +
'    \n' +
'    if (topic === TOPIC_API_UP) {\n' +
'      // Handle API response\n' +
'      var id = data.id;\n' +
'      var pending = pendingRequests[id];\n' +
'      if (pending) {\n' +
'        clearTimeout(pending.timeout);\n' +
'        delete pendingRequests[id];\n' +
'        if (data.data && data.data.code === 200) {\n' +
'          pending.resolve(data.data.body);\n' +
'        } else {\n' +
'          pending.reject(new Error(\'API error: \' + JSON.stringify(data.data)));\n' +
'        }\n' +
'      }\n' +
'    } else if (topic === TOPIC_SCAN) {\n' +
'      // Handle scan data\n' +
'      var scanData = data.data || data;\n' +
'      if (!scanData.bdaddrs || !scanData.bdaddrs[0]) return;\n' +
'      \n' +
'      var deviceMac = scanData.bdaddrs[0].bdaddr;\n' +
'      var addrType = scanData.bdaddrs[0].bdaddrType;\n' +
'      \n' +
'      if (devicesWriteFlag[deviceMac]) return;\n' +
'      \n' +
'      console.log(\'Scanned device:\', deviceMac, addrType);\n' +
'      \n' +
'      // Connect and write\n' +
'      connectDevice(client, deviceMac, addrType).then(function() {\n' +
'        console.log(\'Connected to:\', deviceMac);\n' +
'        return writeData(client, deviceMac);\n' +
'      }).then(function() {\n' +
'        console.log(\'Write success:\', deviceMac);\n' +
'        devicesWriteFlag[deviceMac] = true;\n' +
'        return disconnectDevice(client, deviceMac);\n' +
'      }).then(function() {\n' +
'        console.log(\'Disconnected:\', deviceMac);\n' +
'      }).catch(function(err) {\n' +
'        console.error(\'Error for device\', deviceMac, \':\', err);\n' +
'      });\n' +
'    } else if (topic === TOPIC_CONNECTION_STATE) {\n' +
'      // Handle connection state\n' +
'      console.log(\'Connection state:\', JSON.stringify(data));\n' +
'    }\n' +
'  } catch (e) {\n' +
'    console.error(\'Parse message error:\', e);\n' +
'  }\n' +
'});\n' +
'\n' +
'client.on(\'error\', function(err) {\n' +
'  console.error(\'MQTT error:\', err);\n' +
'});\n' +
'\n' +
'// Handle exit\n' +
'process.on(\'SIGINT\', function() {\n' +
'  console.log(\'Disconnecting...\');\n' +
'  client.end();\n' +
'  process.exit();\n' +
'});\n';

export default {
  demo1: demo1,
  demo2: demo2
};
