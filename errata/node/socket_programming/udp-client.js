var dgram = require('dgram');
var client = dgram.createSocket("udp4");    //can be udp6

var server = 'localhost';
var serverPort = 9094;

// send message
var message = new Buffer("this is client message");
client.send(message, 0, message.length, serverPort, server, function(err,
                                                                     bytes) {
    if(err)
        console.log(err);
    else
        client.close();
});
