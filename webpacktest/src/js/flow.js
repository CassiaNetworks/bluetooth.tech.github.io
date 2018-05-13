let d = {
    "startId": [1, 4],
    "1": {
      "toolFile": "httpServer",
      "inputType": "auto",
      "outputType": "http_server",
      "todoList": [{
        "params": "",
        "function": "return {method:'',path:''}",
        "nextIds": {
          "success": [2, 6],
          "fail": []
        }
      }]
    },
    "2": {
      "toolFile": "connect",
      "inputType": "http_server",
      "outputType": "status",
      "todoList": [{
        "params": "",
        "function": "return ",
        "nextIds": {
          "success": [3],
          "fail": []
        }
      }]
    },
      "3": {
        "toolFile": "write",
        "inputType": "status",
        "outputType": "status",
        "todoList": [{
          "params": "",
          "function": "return [{handle: 10,value:[0100,0200]}]", // 数组 
          "nextIds": {
            "success": [4],
            "fail": []
          }
        }]
      },
      "4": {
        "toolFile": "disConnect ",
        " inputType": "status",
        "outputType": "status", // 
        "todoList": [{
          "params": "",
          "函数": "store.data.push（value）if（store.data.length === 3）return store.data",
          "nextIds": {
            "success": [5],
            "fail": []
          }
        }]
      },
      "5": {
        "toolFile": "httpClient",
        "inputType": "status",
        "outputType": "",
        "todoList": [{
          "params": "",
          "function": "return {'url':''}", // 
          "nextIds": {
            "success": [],
            "fail": []
          }
        }]
      },
      "6": {
        "toolFile": "function",
        "inputType": "httpServer",
        "outputType": "", // 
        "todoList": [{
          "params": "",
          "function": "store.data.push value）if（store.data.length === 3）return store.data",
          "nextIds": {
            "success": [],
            "fail": []
          }
        }]
      }
    };