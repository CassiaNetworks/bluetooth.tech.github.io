/**
 * mosquitto_pub/sub 命令模板
 * 用于 MQTT 模式下的 API 调试
 * 
 * 每个操作包含:
 * 1. mosquitto_sub 命令 - 先订阅响应 (在终端1执行)
 * 2. mosquitto_pub 命令 - 再发送请求 (在终端2执行)
 */

const connect = `
# ====== 1. Subscribe (run in terminal 1) ======
mosquitto_sub -h '<%= mqttConfig.server %>' -p <%= mqttConfig.tcpPort %><% if (mqttConfig.username) { %> \\
  -u '<%= mqttConfig.username %>' -P '<%= mqttConfig.password %>'<% } %> \\
  -t 'up/<%= mqttConfig.gateway %>/api_reply' -v

# ====== 2. Publish (run in terminal 2) ======
mosquitto_pub -h '<%= mqttConfig.server %>' -p <%= mqttConfig.tcpPort %><% if (mqttConfig.username) { %> \\
  -u '<%= mqttConfig.username %>' -P '<%= mqttConfig.password %>'<% } %> \\
  -t 'down/<%= mqttConfig.gateway %>/api' \\
  -m '{"id":"<%= requestId %>","action":"api","timestamp":<%= timestamp %>,"gateway":"<%= mqttConfig.gateway %>","data":{"url":"/gap/nodes/<%= apiParams.deviceMac %>/connection","method":"POST","body":{"type":"<%= apiParams.addrType %>","timeout":15000}}}'
`;

const disconnect = `
# ====== 1. Subscribe (run in terminal 1) ======
mosquitto_sub -h '<%= mqttConfig.server %>' -p <%= mqttConfig.tcpPort %><% if (mqttConfig.username) { %> \\
  -u '<%= mqttConfig.username %>' -P '<%= mqttConfig.password %>'<% } %> \\
  -t 'up/<%= mqttConfig.gateway %>/api_reply' -v

# ====== 2. Publish (run in terminal 2) ======
mosquitto_pub -h '<%= mqttConfig.server %>' -p <%= mqttConfig.tcpPort %><% if (mqttConfig.username) { %> \\
  -u '<%= mqttConfig.username %>' -P '<%= mqttConfig.password %>'<% } %> \\
  -t 'down/<%= mqttConfig.gateway %>/api' \\
  -m '{"id":"<%= requestId %>","action":"api","timestamp":<%= timestamp %>,"gateway":"<%= mqttConfig.gateway %>","data":{"url":"/gap/nodes/<%= apiParams.deviceMac %>/connection","method":"DELETE","body":{}}}'
`;

const read = `
# ====== 1. Subscribe (run in terminal 1) ======
mosquitto_sub -h '<%= mqttConfig.server %>' -p <%= mqttConfig.tcpPort %><% if (mqttConfig.username) { %> \\
  -u '<%= mqttConfig.username %>' -P '<%= mqttConfig.password %>'<% } %> \\
  -t 'up/<%= mqttConfig.gateway %>/api_reply' -v

# ====== 2. Publish (run in terminal 2) ======
mosquitto_pub -h '<%= mqttConfig.server %>' -p <%= mqttConfig.tcpPort %><% if (mqttConfig.username) { %> \\
  -u '<%= mqttConfig.username %>' -P '<%= mqttConfig.password %>'<% } %> \\
  -t 'down/<%= mqttConfig.gateway %>/api' \\
  -m '{"id":"<%= requestId %>","action":"api","timestamp":<%= timestamp %>,"gateway":"<%= mqttConfig.gateway %>","data":{"url":"/gatt/nodes/<%= apiParams.deviceMac %>/handle/<%= apiParams.handle %>/value","method":"GET","body":{}}}'
`;

const write = `
# ====== 1. Subscribe (run in terminal 1) ======
mosquitto_sub -h '<%= mqttConfig.server %>' -p <%= mqttConfig.tcpPort %><% if (mqttConfig.username) { %> \\
  -u '<%= mqttConfig.username %>' -P '<%= mqttConfig.password %>'<% } %> \\
  -t 'up/<%= mqttConfig.gateway %>/api_reply' -v

# ====== 2. Publish (run in terminal 2) ======
mosquitto_pub -h '<%= mqttConfig.server %>' -p <%= mqttConfig.tcpPort %><% if (mqttConfig.username) { %> \\
  -u '<%= mqttConfig.username %>' -P '<%= mqttConfig.password %>'<% } %> \\
  -t 'down/<%= mqttConfig.gateway %>/api' \\
  -m '{"id":"<%= requestId %>","action":"api","timestamp":<%= timestamp %>,"gateway":"<%= mqttConfig.gateway %>","data":{"url":"/gatt/nodes/<%= apiParams.deviceMac %>/handle/<%= apiParams.handle %>/value/<%= apiParams.value %><% if (apiParams.noresponse) { %>?noresponse=1<% } %>","method":"GET","body":{}}}'
`;

const connectList = `
# ====== 1. Subscribe (run in terminal 1) ======
mosquitto_sub -h '<%= mqttConfig.server %>' -p <%= mqttConfig.tcpPort %><% if (mqttConfig.username) { %> \\
  -u '<%= mqttConfig.username %>' -P '<%= mqttConfig.password %>'<% } %> \\
  -t 'up/<%= mqttConfig.gateway %>/api_reply' -v

# ====== 2. Publish (run in terminal 2) ======
mosquitto_pub -h '<%= mqttConfig.server %>' -p <%= mqttConfig.tcpPort %><% if (mqttConfig.username) { %> \\
  -u '<%= mqttConfig.username %>' -P '<%= mqttConfig.password %>'<% } %> \\
  -t 'down/<%= mqttConfig.gateway %>/api' \\
  -m '{"id":"<%= requestId %>","action":"api","timestamp":<%= timestamp %>,"gateway":"<%= mqttConfig.gateway %>","data":{"url":"/gap/nodes?connection_state=connected","method":"GET","body":{}}}'
`;

const discover = `
# ====== 1. Subscribe (run in terminal 1) ======
mosquitto_sub -h '<%= mqttConfig.server %>' -p <%= mqttConfig.tcpPort %><% if (mqttConfig.username) { %> \\
  -u '<%= mqttConfig.username %>' -P '<%= mqttConfig.password %>'<% } %> \\
  -t 'up/<%= mqttConfig.gateway %>/api_reply' -v

# ====== 2. Publish (run in terminal 2) ======
mosquitto_pub -h '<%= mqttConfig.server %>' -p <%= mqttConfig.tcpPort %><% if (mqttConfig.username) { %> \\
  -u '<%= mqttConfig.username %>' -P '<%= mqttConfig.password %>'<% } %> \\
  -t 'down/<%= mqttConfig.gateway %>/api' \\
  -m '{"id":"<%= requestId %>","action":"api","timestamp":<%= timestamp %>,"gateway":"<%= mqttConfig.gateway %>","data":{"url":"/gatt/nodes/<%= apiParams.deviceMac %>/services/characteristics/descriptors","method":"GET","body":{}}}'
`;

const scan = `
# ====== Subscribe scan data ======
# Note: Scan data is pushed by gateway, just subscribe to receive
mosquitto_sub -h '<%= mqttConfig.server %>' -p <%= mqttConfig.tcpPort %><% if (mqttConfig.username) { %> \\
  -u '<%= mqttConfig.username %>' -P '<%= mqttConfig.password %>'<% } %> \\
  -t 'up/<%= mqttConfig.gateway %>/scan' -v
`;

const notify = `
# ====== Subscribe notification data ======
# Note: Notification data is pushed by gateway, just subscribe to receive
mosquitto_sub -h '<%= mqttConfig.server %>' -p <%= mqttConfig.tcpPort %><% if (mqttConfig.username) { %> \\
  -u '<%= mqttConfig.username %>' -P '<%= mqttConfig.password %>'<% } %> \\
  -t 'up/<%= mqttConfig.gateway %>/notification' -v
`;

const connectStatus = `
# ====== Subscribe connection state ======
# Note: Connection state is pushed by gateway, just subscribe to receive
mosquitto_sub -h '<%= mqttConfig.server %>' -p <%= mqttConfig.tcpPort %><% if (mqttConfig.username) { %> \\
  -u '<%= mqttConfig.username %>' -P '<%= mqttConfig.password %>'<% } %> \\
  -t 'up/<%= mqttConfig.gateway %>/connection_state' -v
`;

const readPhy = `
# ====== 1. Subscribe (run in terminal 1) ======
mosquitto_sub -h '<%= mqttConfig.server %>' -p <%= mqttConfig.tcpPort %><% if (mqttConfig.username) { %> \\
  -u '<%= mqttConfig.username %>' -P '<%= mqttConfig.password %>'<% } %> \\
  -t 'up/<%= mqttConfig.gateway %>/api_reply' -v

# ====== 2. Publish (run in terminal 2) ======
mosquitto_pub -h '<%= mqttConfig.server %>' -p <%= mqttConfig.tcpPort %><% if (mqttConfig.username) { %> \\
  -u '<%= mqttConfig.username %>' -P '<%= mqttConfig.password %>'<% } %> \\
  -t 'down/<%= mqttConfig.gateway %>/api' \\
  -m '{"id":"<%= requestId %>","action":"api","timestamp":<%= timestamp %>,"gateway":"<%= mqttConfig.gateway %>","data":{"url":"/gap/nodes/<%= apiParams.deviceMac %>/phy","method":"GET","body":{}}}'
`;

const updatePhy = `
# ====== 1. Subscribe (run in terminal 1) ======
mosquitto_sub -h '<%= mqttConfig.server %>' -p <%= mqttConfig.tcpPort %><% if (mqttConfig.username) { %> \\
  -u '<%= mqttConfig.username %>' -P '<%= mqttConfig.password %>'<% } %> \\
  -t 'up/<%= mqttConfig.gateway %>/api_reply' -v

# ====== 2. Publish (run in terminal 2) ======
mosquitto_pub -h '<%= mqttConfig.server %>' -p <%= mqttConfig.tcpPort %><% if (mqttConfig.username) { %> \\
  -u '<%= mqttConfig.username %>' -P '<%= mqttConfig.password %>'<% } %> \\
  -t 'down/<%= mqttConfig.gateway %>/api' \\
  -m '{"id":"<%= requestId %>","action":"api","timestamp":<%= timestamp %>,"gateway":"<%= mqttConfig.gateway %>","data":{"url":"/gap/nodes/<%= apiParams.deviceMac %>/phy","method":"POST","body":{"tx":"<%= apiParams.tx %>","rx":"<%= apiParams.rx %>","coded_option":"<%= apiParams.codedOption %>"}}}'
`;

const pair = `
# ====== 1. Subscribe (run in terminal 1) ======
mosquitto_sub -h '<%= mqttConfig.server %>' -p <%= mqttConfig.tcpPort %><% if (mqttConfig.username) { %> \\
  -u '<%= mqttConfig.username %>' -P '<%= mqttConfig.password %>'<% } %> \\
  -t 'up/<%= mqttConfig.gateway %>/api_reply' -v

# ====== 2. Publish (run in terminal 2) ======
mosquitto_pub -h '<%= mqttConfig.server %>' -p <%= mqttConfig.tcpPort %><% if (mqttConfig.username) { %> \\
  -u '<%= mqttConfig.username %>' -P '<%= mqttConfig.password %>'<% } %> \\
  -t 'down/<%= mqttConfig.gateway %>/api' \\
  -m '{"id":"<%= requestId %>","action":"api","timestamp":<%= timestamp %>,"gateway":"<%= mqttConfig.gateway %>","data":{"url":"/management/nodes/<%= apiParams.deviceMac %>/pair","method":"POST","body":{"iocapability":"<%= apiParams.iocapability %>"}}}'
`;

const pairInput = {
  Passkey: `
# ====== 1. Subscribe (run in terminal 1) ======
mosquitto_sub -h '<%= mqttConfig.server %>' -p <%= mqttConfig.tcpPort %><% if (mqttConfig.username) { %> \\
  -u '<%= mqttConfig.username %>' -P '<%= mqttConfig.password %>'<% } %> \\
  -t 'up/<%= mqttConfig.gateway %>/api_reply' -v

# ====== 2. Publish (run in terminal 2) ======
mosquitto_pub -h '<%= mqttConfig.server %>' -p <%= mqttConfig.tcpPort %><% if (mqttConfig.username) { %> \\
  -u '<%= mqttConfig.username %>' -P '<%= mqttConfig.password %>'<% } %> \\
  -t 'down/<%= mqttConfig.gateway %>/api' \\
  -m '{"id":"<%= requestId %>","action":"api","timestamp":<%= timestamp %>,"gateway":"<%= mqttConfig.gateway %>","data":{"url":"/management/nodes/<%= apiParams.deviceMac %>/pair-input","method":"POST","body":{"passkey":"<%= apiParams.passkey %>"}}}'
`,
  LegacyOOB: `
# ====== 1. Subscribe (run in terminal 1) ======
mosquitto_sub -h '<%= mqttConfig.server %>' -p <%= mqttConfig.tcpPort %><% if (mqttConfig.username) { %> \\
  -u '<%= mqttConfig.username %>' -P '<%= mqttConfig.password %>'<% } %> \\
  -t 'up/<%= mqttConfig.gateway %>/api_reply' -v

# ====== 2. Publish (run in terminal 2) ======
mosquitto_pub -h '<%= mqttConfig.server %>' -p <%= mqttConfig.tcpPort %><% if (mqttConfig.username) { %> \\
  -u '<%= mqttConfig.username %>' -P '<%= mqttConfig.password %>'<% } %> \\
  -t 'down/<%= mqttConfig.gateway %>/api' \\
  -m '{"id":"<%= requestId %>","action":"api","timestamp":<%= timestamp %>,"gateway":"<%= mqttConfig.gateway %>","data":{"url":"/management/nodes/<%= apiParams.deviceMac %>/pair-input","method":"POST","body":{"tk":"<%= apiParams.tk %>"}}}'
`,
  SecurityOOB: `
# ====== 1. Subscribe (run in terminal 1) ======
mosquitto_sub -h '<%= mqttConfig.server %>' -p <%= mqttConfig.tcpPort %><% if (mqttConfig.username) { %> \\
  -u '<%= mqttConfig.username %>' -P '<%= mqttConfig.password %>'<% } %> \\
  -t 'up/<%= mqttConfig.gateway %>/api_reply' -v

# ====== 2. Publish (run in terminal 2) ======
mosquitto_pub -h '<%= mqttConfig.server %>' -p <%= mqttConfig.tcpPort %><% if (mqttConfig.username) { %> \\
  -u '<%= mqttConfig.username %>' -P '<%= mqttConfig.password %>'<% } %> \\
  -t 'down/<%= mqttConfig.gateway %>/api' \\
  -m '{"id":"<%= requestId %>","action":"api","timestamp":<%= timestamp %>,"gateway":"<%= mqttConfig.gateway %>","data":{"url":"/management/nodes/<%= apiParams.deviceMac %>/pair-input","method":"POST","body":{"rand":"<%= apiParams.rand %>","confirm":"<%= apiParams.confirm %>"}}}'
`
};

const unpair = `
# ====== 1. Subscribe (run in terminal 1) ======
mosquitto_sub -h '<%= mqttConfig.server %>' -p <%= mqttConfig.tcpPort %><% if (mqttConfig.username) { %> \\
  -u '<%= mqttConfig.username %>' -P '<%= mqttConfig.password %>'<% } %> \\
  -t 'up/<%= mqttConfig.gateway %>/api_reply' -v

# ====== 2. Publish (run in terminal 2) ======
mosquitto_pub -h '<%= mqttConfig.server %>' -p <%= mqttConfig.tcpPort %><% if (mqttConfig.username) { %> \\
  -u '<%= mqttConfig.username %>' -P '<%= mqttConfig.password %>'<% } %> \\
  -t 'down/<%= mqttConfig.gateway %>/api' \\
  -m '{"id":"<%= requestId %>","action":"api","timestamp":<%= timestamp %>,"gateway":"<%= mqttConfig.gateway %>","data":{"url":"/management/nodes/<%= apiParams.deviceMac %>/bond","method":"DELETE","body":{}}}'
`;

export default {
  connect,
  disconnect,
  read,
  write,
  connectList,
  discover,
  scan,
  notify,
  connectStatus,
  readPhy,
  updatePhy,
  pair,
  pairInput,
  unpair
}
