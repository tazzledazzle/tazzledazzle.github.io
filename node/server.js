var http = require('http'),
    url = require('url'),
    fs = require('fs');

var messages = ["testing"];
var clients = [];

http.createServer(function (req, res){

    var url_parts = url.parse(req.url);
    console.log(url_parts);
    if (url_parts.pathname == '/') {
        fs.readFile('./index.html', function (err, data) {
            res.end(data);
            console.log(err);

        });
        //res.end("hello world");
    }
    else if (url_parts.pathname.substr(0, 5) == '/poll') {
        var count = url_parts.pathname.replace(/[^0-9]*/, '');
        console.log(count);
        if (messages.length > count) {
            res.end(JSON.stringify( {
                count: messages.length,
                append: messages.slice(parseInt(count, 10)).join("\n") + "\n"
            }));
        }
        else {
            clients.push(res);
        }
    }
    else if (url_parts.pathname.substr(0, 5) == '/msg/') {
        var msg = unescape(url_parts.pathname.substr(5));
        messages.push(msg);
        while (clients.length > 0) {
            var client = client.pop();
            client.end(JSON.stringify( {
                count: messages.length,
                append: msg + "\n"
            }));
        }
        res.end();
    }
}).listen(8081, 'localhost');
console.log('Server Running');





