


var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('mydatabase');

var database_data = "";
db.serialize(function () {
    //db.run('CREATE TABLE customer(id NUMERIC, name TEXT)');
    //db.run ('CREATE TABLE user(id NUMERIC AUTO_INCREMENT, name TEXT)');
    //db.run ('CREATE TABLE user(id NUMERIC AUTO_INCREMENT, url TEXT)');
    //var query = db.prepare('INSERT INTO customer VALUES(?,?)');
    //for (var i = 0; i < 5; i++) {
    //    query.run(i+1, 'customer ' + (i+1));
    //}
    //query.finalize();

    db.each('SELECT * FROM customer', function(err, row) {
        if (!err) {
            console.log(row.id + '----' + row.name);
            database_data += row.id + '----' + row.name + '</br>';
        }
        else {
            console.log(err);
        }
    });
});

db.close();


var express = require('express');
var app = express();
var fs = require('fs');


var access_token="276731370.ae7f986.84446bec657d447a9ffc07ec670559e0",
client_id="ae7f986a9044407c833495fe680a78ca",
client_secret="d1d03f416cc84b87bccee1b4d34ab9eb",
website_url="http://www.github.com/tazzledazzle",
redirect_uri="http://www.github.com/tazzledazzle";



// ============================================express-routes===========================================================
app.get('/', function(req, res) {
   //res.send('<p>' + database_data +'</p>');
    fs.readFile('./index.html', function (err, data) {
        res.write(data);
        res.end();

        //console.log(err);

    });
});
app.get('/customer', function(req, res) {
   res.send('Customer Expressjs');
});
app.get('/admin', function(req, res) {
   res.send('Admin Expressjs');
});


// ============================================socket-io================================================================

//
////app.listen(8098);
//console.log('server started on port 8098');
//function handler (req, res) {
//    fs.readFile(__dirname + '/index.html',
//        function (err, data) {
//            if (err) {
//                res.writeHead(500);
//                return res.end('Error loading index.html');
//            }
//            res.writeHead(200);
//            res.end(data);
//        });
//}
//
//io.sockets.on('connection', function(socket) {
//    socket.emit('news', {content: 'news from server'});
//    socket.on('feedback', function (data) {
//        console.log(data);
//        socket.emit('news', {content: 'news - ' + new Date() });
//    });
//});
//
app.listen(8084);
console.log('Server is running on port 8084');
