"use strict";
exports.__esModule = true;
var ws_1 = require("ws");
var wss = new ws_1.WebSocketServer({ port: 8080 });
wss.on('connection', function (ws) {
    ws.on('message', function (data) {
        console.log('received: %s', data);
    });
    ws.send('something');
});
setInterval(function () {
    wss.clients.forEach(function (ws) {
        ws.send("Server: ".concat(Date.now()));
    });
}, 10000);
