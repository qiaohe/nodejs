var http = require("http");
http.createServer(function (req, res) {
    res.writeHeader(200, {'Content-Type': "text/plain"});
    res.end("hello world \n");
}).listen(3000);

console.log("Http Server is running on port 3000");
var options = {
    hostname: '127.0.0.1',
    port: 3000,
    path: '/',
    method: 'GET'
};
var request = http.request(options, function (response) {
    response.on("data", function (data) {
        console.log("data is coming from request:" + data.toString());
    });
    response.on("end", function () {
        console.log("end function called by")
    })
});
request.end();
function TestEmit(x, y) {
    this.x = x;
    this.y = y;
}
var util = require("util");
var EventEmitter = require("events").EventEmitter;
util.inherits(TestEmit, EventEmitter);


var test = new TestEmit(100, 100);
test.on("click", function (x, y) {
    console.log("x=:%s , y =%s", x, y);
});
test.emit("click", 10, 10);

//setInterval(function () {
//    console.log(new Date().toLocaleTimeString());
//}, 1000);

//create socket server vy following codes by Johnson on 22 April, 2013

var sockets = [];
var server = require('net').createServer();
server.on("connection", function (socket) {
    console.log("new connection created");
    sockets.push(socket);
    socket.on("data", function (data) {
        console.log(data.toString());
        sockets.forEach(function (item) {
            if (item != socket) {
                item.write(data);
            }
        })
    });
    socket.on("end", function (data) {
        console.log(data.toString());
    });
    socket.on('close', function () {
        console.log('connection closed');
        var index = sockets.indexOf(socket);
        sockets.splice(index, 1);
    });
});

server.listen(8888);
var express = require('express');
var app = express();

app.get('/', function (req, res) {
    res.send('hello world');
});

app.listen(3001);

var httpd = require('http').createServer(handler);
var io = require('socket.io').listen(httpd);
var fs = require('fs');
httpd.listen(4001);
function handler(req, res) {
    fs.readFile(__dirname + '/index.html',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }
            res.writeHead(200);
            res.end(data);
        }
    );
}
io.sockets.on('connection', function (socket) {
    socket.on('clientMessage', function (content) {
        socket.emit("serverMessage", "you said:" + content);
        socket.get('username', function (err, username) {
            if (!username) {
                username = socket.id;
            }
            socket.broadcast.emit('serverMessage', username + ' said: ' + content);
        });
    });
    socket.on('login', function (username) {
        socket.set('username', username, function (err) {
            if (err) {
                throw err;
            }
            socket.emit('serverMessage', 'Currently logged in as ' + username);
            socket.broadcast.emit('serverMessage', 'User ' + username + ' logged in');
        });
    });
    socket.emit('login');
});