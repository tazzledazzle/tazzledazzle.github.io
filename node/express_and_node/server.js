//// http example
////==========================
//var http = require('http');
//
//
//var server = http.createServer(function (req, res) {
//    //print request header
//    console.log(req.url);
//
//    if (req.url == '/') {
//        res.write('Welcome to http nodejs');
//        res.end();
//    }
//    else if (req.url == '/customer') {
//        res.write('Welcome to Customer page');
//        res.end();
//    }
//    else if (req.url == '/admin') {
//        res.write('Welcome to Admin page');
//        res.end();
//    }
//    else {
//        res.write('Page not found');
//        res.end();
//
//    }
//
//});

//// https example
////====================
//var https = require('https');
//var fs = require('fs');
//var options = {
//    key: fs.readFileSync('myserver.key'),
//    cert: fs.readFileSync('myserver.crt'),
//    passphrase: 'test'
//};
//
//
//var server = https.createServer(options, function (req, res) {
//    //print request header
//    console.log(req.url);
//
//    if (req.url == '/') {
//        res.write('Welcome to http nodejs');
//        res.end();
//    }
//    else if (req.url == '/customer') {
//        res.write('Welcome to Customer page');
//        res.end();
//    }
//    else if (req.url == '/admin') {
//        res.write('Welcome to Admin page');
//        res.end();
//    }
//    else {
//        res.write('Page not found');
//        res.end();
//
//    }
//
//});
//
//server.listen(8084);
//console.log('Server is running on port 8084');

////express example
///=====================================
//var express = require('express');
//var app = express();
//
//app.get('/', function(req, res) {
//   res.send('Hello World Expressjs');
//});
//app.get('/customer', function(req, res) {
//   res.send('Customer Expressjs');
//});
//app.get('/admin', function(req, res) {
//   res.send('Admin Expressjs');
//});
//
//app.listen(8084);
//console.log('Server is running on port 8084');


var https = require('https');
var fs = require('fs');
var options = {
    key: fs.readFileSync('myserver.key'),
    cert: fs.readFileSync('myserver.crt'),
    passphrase: 'test'
};

var express = require('express');
var app = express();

app.get('/', function(req, res) {
    res.send('Hello World Expressjs');
});
app.get('/customer', function(req, res) {
    res.send('Customer Expressjs');
});
app.get('/admin', function(req, res) {
    res.send('Admin Expressjs');
});

var server = https.createServer(options,app);
server.listen(8084);
console.log('Server is running on port 8084');