/**
 * url参数包含了所有出现在URL中的参数，如芯片类型、设备MAC、路由MAC、AC Token等
 * apiParams包含了对应API body中的参数
 * TODO: 优化代码生成逻辑
 */

const auth = `
var request = require('request');
var options = {
  'method': 'POST',
  'url': '<%= url %>',
  'headers': {
    'Authorization': 'Basic <%= apiParams.base64 %>',
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  form: {
    'grant_type': 'client_credentials'
  }
};
request(options, function (error, response) { 
  if (error) console.error(error);
  else console.log(response.body);
});
`;

const scan = `
const EventSource = require('eventsource');

const url = '<%= url %>';

const sse = new EventSource(url);

sse.onerror = function(error) {
  console.log('open scan sse failed:', error);
};

sse.onmessage = function(message) {
  console.log('recevied scan sse message:', message);
};
`;

const connect = `
var request = require('request');
var options = {
  'method': 'POST',
  'url': '<%= url %>',
  'headers': {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({"timeout":5000,"type":"<%= apiParams.addrType %>"})

};
request(options, function (error, response) { 
  if (error) console.error(error);
  else console.log(response.body);
});
`;

const read = `
var request = require('request');
var options = {
  'method': 'GET',
  'url': '<%= url %>',
  'headers': {
  }
};
request(options, function (error, response) { 
  if (error) console.error(error);
  else console.log(response.body);
});
`;

const readPhy = `
var request = require('request');
var options = {
  'method': 'GET',
  'url': '<%= url %>',
  'headers': {
  }
};
request(options, function (error, response) { 
  if (error) console.error(error);
  else console.log(response.body);
});
`;

const updatePhy = `
var request = require('request');
var options = {
  'method': 'POST',
  'url': '<%= url %>',
  'headers': {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({"tx":"<%= apiParams.tx %>","rx":"<%= apiParams.rx %>","coded_option":"<%= apiParams.codedOption %>"})

};
request(options, function (error, response) { 
  if (error) console.error(error);
  else console.log(response.body);
});
`;

const write = `
var request = require('request');
var options = {
  'method': 'GET',
  'url': '<%= url %>',
  'headers': {
  }
};
request(options, function (error, response) { 
  if (error) console.error(error);
  else console.log(response.body);
});
`;

const disconnect = `
var request = require('request');
var options = {
  'method': 'DELETE',
  'url': '<%= url %>',
  'headers': {
  }
};
request(options, function (error, response) { 
  if (error) console.error(error);
  else console.log(response.body);
});
`;

const connectList = `
var request = require('request');
var options = {
  'method': 'GET',
  'url': '<%= url %>',
  'headers': {
  }
};
request(options, function (error, response) { 
  if (error) console.error(error);
  else console.log(response.body);
});
`;

const discover = `
var request = require('request');
var options = {
  'method': 'GET',
  'url': '<%= url %>',
  'headers': {
  }
};
request(options, function (error, response) { 
  if (error) console.error(error);
  else console.log(response.body);
});
`;

const connectStatus = `
const EventSource = require('eventsource');

const url = '<%= url %>';

const sse = new EventSource(url);

sse.onerror = function(error) {
  console.log('open connect status sse failed:', error);
};

sse.onmessage = function(message) {
  console.log('recevied connect status sse message:', message);
};
`;

const notify = `
const EventSource = require('eventsource');

const url = '<%= url %>';

const sse = new EventSource(url);

sse.onerror = function(error) {
  console.log('open notify sse failed:', error);
};

sse.onmessage = function(message) {
  console.log('recevied notify sse message:', message);
};
`;

const pair = `
var request = require('request');
var options = {
  'method': 'POST',
  'url': '<%= url %>',
  'headers': {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({"iocapability":"<%= apiParams.iocapability %>"})
};
request(options, function (error, response) { 
  if (error) console.error(error);
  else console.log(response.body);
});
`;

const pairInput = {
  Passkey: `
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': '<%= url %>',
    'headers': {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({"passkey":"<%= apiParams.passkey %>"})
  };
  request(options, function (error, response) { 
    if (error) console.error(error);
    else console.log(response.body);
  });
  `,
  LegacyOOB: `
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': '<%= url %>',
    'headers': {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({"tk":"<%= apiParams.tk %>"})
  };
  request(options, function (error, response) { 
    if (error) console.error(error);
    else console.log(response.body);
  });
  `,
  SecurityOOB: `
  var request = require('request');
  var options = {
    'method': 'POST',
    'url': '<%= url %>',
    'headers': {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({"rand":"<%= apiParams.rand %>", "confirm":"<%= apiParams.confirm %>"})
  };
  request(options, function (error, response) { 
    if (error) console.error(error);
    else console.log(response.body);
  });
  `
};

const unpair = `
var request = require('request');
var options = {
  'method': 'DELETE',
  'url': '<%= url %>',
  'headers': {
  }
};
request(options, function (error, response) { 
  if (error) console.error(error);
  else console.log(response.body);
});
`;

export default {
  auth,
  scan,
  connect,
  read,
  readPhy,
  updatePhy,
  write,
  disconnect,
  connectList,
  discover,
  connectStatus,
  notify,
  pair,
  pairInput,
  unpair
}

