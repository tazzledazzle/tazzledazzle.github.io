var http = require('http');
var net = require('net');
var path = require('path');
var fs = require('fs');
var port = 9088;

// Create an HTTP server.
var srv = http.createServer(function (req, res) {
    console.log('request starting...');
    var filePath = '.' + req.url;
    console.log(filePath);
    if (filePath == './')
        filePath = './realtime-demo.html';
    var extname = path.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
    }
    console.log(filePath);
    path.exists(filePath, function(exists) {
        if (exists) {
            fs.readFile(filePath, function(error, content) {
                if (error) {
                    res.writeHead(500);
                    res.end();
                } else {
                    res.writeHead(200, {
                        'Content-Type' : contentType
                    });
                    res.end(content, 'utf-8');
                }
            });
        } else {
            res.writeHead(404);
            res.end();
        }
    });
});
gw_srv = require('socket.io').listen(srv);
srv.listen(port);
console.log('server started');
gw_srv.sockets.on('connection', function(socket) {
    var dataPusher = setInterval(function () {
        socket.volatile.emit('data', Math.random() * 100);
    }, 1000);
    socket.on('disconnect', function() {
        console.log('closing');
        //gw_srv.close();
        srv.close();
    });
}); // On connection
