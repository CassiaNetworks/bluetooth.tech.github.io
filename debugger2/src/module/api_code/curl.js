/**
 * url参数包含了所有出现在URL中的参数，如芯片类型、设备MAC、路由MAC、AC Token等
 * apiParams包含了对应API body中的参数
 * TODO: 优化代码生成逻辑
 */

const auth = `
curl --location --request POST '<%= url %>' \
--header 'Authorization: Basic <%= apiParams.base64 %>' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'grant_type=client_credentials'
`;

const scan = `
curl -H "Accept: text/event-stream" '<%= url %>'
`;

const connect = `
curl --location --request POST '<%= url %>' \
--header 'Content-Type: application/json' \
--data-raw '{
  "timeout": 5000,
  "type": "<%= apiParams.addrType %>"
}'
`;

const read = `
curl --location --request GET '<%= url %>'
`;

const write = `
curl --location --request GET '<%= url %>'
`;

const disconnect = `
curl --location --request DELETE '<%= url %>'
`;

const connectList = `
curl --location --request GET '<%= url %>'
`;

const discover = `
curl --location --request GET '<%= url %>'
`;

const connectStatus = `
curl -H "Accept: text/event-stream" '<%= url %>'
`;

const notify = `
curl -H "Accept: text/event-stream" '<%= url %>'
`;

const pair = `
curl --location --request POST '<%= url %>' \
--header 'Content-Type: application/json' \
--data-raw '{
  "iocapability": "<%= apiParams.iocapability %>"
}'
`;

const pairInput = {
  Passkey: `
  curl --location --request POST '<%= url %>' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "passkey": "<%= apiParams.passkey %>"
  }'
  `,
  LegacyOOB: `
  curl --location --request POST '<%= url %>' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "tk": "<%= apiParams.tk %>"
  }'
  `,
  SecurityOOB: `
  curl --location --request POST '<%= url %>' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "rand": "<%= apiParams.rand %>",
    "confirm": "<%= apiParams.confirm %>"
  }'
  `
};

const unpair = `
curl --location --request DELETE '<%= url %>'
`;

export default {
  auth,
  scan,
  connect,
  read,
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

