//var mongo = require('mongodb'),
//    Server = mongo.Server,
//    Db = mongo.Db;
//
//var server = new Server('localhost', 27017, {auto_reconnect: true});
//var database = new Db('test', server);
//
//database.open(function(err, db) {
//   if (!err) {
//       console.log('connected');
//
//       db.close();
//   }
//});

var mongo = require('mongodb'),
    Server = mongo.Server,
    Db = mongo.Db;
var server = new Server('localhost', 27017, {auto_reconnect: true});
var database = new Db('test', server);
database.open(function(err, db) {
    if(!err) {
        console.log("connected");
        db.collection('employee',function(err,coll){
            var employee = {name:'user1',
                email:'user1@email.com',
                country: 'germany'};
//Insert.
            coll.insert(employee,function (err){
                if(err)
                    console.log(err);
                else
                    console.log('inserted data was success');
                // Close connection.
                db.close();
            });
        });
    }
});

