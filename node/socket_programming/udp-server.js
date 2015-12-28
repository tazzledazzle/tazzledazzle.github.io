var dgram = require('dgram');
var server = dgram.createSocket('udp4');    //can be udp6

var message = 'this server message';

server.on('message', function (data, client) {
    console.log('received data: ' + data);
    console.log('client ' + client.address + ':' + client.port);
});

server.on('listening', function () {
    var address = server.address();
    console.log('server listening on ' + address.address + ':' +
    address.port);
});

server.bind(9094);
