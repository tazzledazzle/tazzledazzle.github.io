/**
 * Created by tazzledazzle on 1/15/16.
 */


var mongoose = require('mongoose');
var json2csv = require('json2csv');

var mongodbUri = 'mongodb://iseo:topcoder@candidate.60.mongolayer.com:10408/ibmgo20151222';

mongoose.connect(mongodbUri);

var conn = mongoose.connection;

conn.on('error', console.error.bind(console, 'connection error:'));

conn.once('open', function(err, db){
    console.log('err ' + err);
    console.log('db ' + db);
    console.log('success');
    conn.find('')
});
