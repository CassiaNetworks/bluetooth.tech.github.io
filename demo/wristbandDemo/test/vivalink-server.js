const http = require('http');
const url = require('url');
const app = http.createServer(handle);

function handle(req, res) {
    var method = req.method;
    var urlObj = url.parse(req.url);
    const sseData1 = { "name": "(unknown)", "evt_type": 3, "rssi": -43, "adData": "0201041aff4c0002158f02010510984de7a0566976614c6e6bfe629bea9d", "bdaddrs": [{ "bdaddr": "B4:E7:82:00:81:77", "bdaddrType": "public" }] };
	 const sseData2 = { "name": "(unknown)", "evt_type": 3, "rssi": -43, "adData": "0201041aff4c0002158f02010510984de7a0566976614c6e6bfe629bea9d", "bdaddrs": [{ "bdaddr": "B4:E7:82:00:81:78", "bdaddrType": "public" }] }
	const sseData = JSON.stringify(sseData1)+'\n\n'+JSON.stringify(sseData2)
    if (method === 'GET') {
        res.sendSSE = sendSSE;
        if (urlObj.pathname === '/gap/nodes/') {
            req.socket.setKeepAlive(true);
            req.socket.setNoDelay(true);
            req.socket.setTimeout(0);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.flushHeaders();
            /*setTimeout(function () {
                delete sseData.adData
                sseData.scanData = '02010411076b6e4c61766956a0514d18640401008f09fffdfdef67189bfe4d'
            }, 5000)*/
            initKeepAlive(req, res)
            var timer = setInterval(function () {
                res.sendSSE(sseData)
            }, 1000);
            req.once('close', function () {
                clearInterval(timer);
            })
        }
    }
}

app.listen(9999, function () {
    console.log('the server is running at port:', this.address().port)
})

function initKeepAlive(req, res, interval = 5) {
    res.write(':keep-alive\n\n')
    var timer = setInterval(function () {
        res.write(':keep-alive\n\n')
    }, interval * 1e3)
    req.once('close', function () {
        console.log('request closed')
        clearInterval(timer)
    })
}

function sendSSE(str) {
    this.write('data: ' + str + '\n\n');
}
