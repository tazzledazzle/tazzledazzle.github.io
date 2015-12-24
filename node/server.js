var http = require('http'),
    url = require('url'),
    fs = require('fs');

var messages = ["testing"];
var clients = [];

//todo improvements
//todo  -persistent message storage (setInterval or database)
//todo  -improve client (interface, client side javascript, add name of user)
//todo  -improve server (support multiple channels, user nicknames, user and channel class)

http.createServer(function (req, res){

    var url_parts = url.parse(req.url);
    console.log(url_parts);
    if (url_parts.pathname == '/') {
        fs.readFile('./index.html', function (err, data) {
            res.end(data);
            //console.log(err);

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
            console.log(clients);
        }
    }
    else if (url_parts.pathname.substr(0, 5) == '/msg/') {
        var msg = unescape(url_parts.pathname.substr(5));
        if (msg === ""){
            //todo make check against empty url '/msg/'
            console.log("found")
        }
        messages.push("*"+msg);
        while (clients.length > 0) {
            var client = clients.pop();
            client.end(JSON.stringify( {
                count: messages.length,
                append: msg + "\n"
            }));
        }
        fs.readFile('./client.html', function (err, data) {
            res.end(data);
            //console.log(err);
            if (messages.length > count) {
                res.end(JSON.stringify( {
                    count: messages.length,
                    append: messages.slice(parseInt(count, 10)).join("\n") + "\n"
                }));
            }

        });
    }
}).listen(8081, 'localhost');
console.log('Server Running on http://localhost:8081');





