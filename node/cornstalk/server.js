// server.js

// BASE SETUP
// =============================================================================
// call the packages we need

var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/corn-db');
var Bear = require('./app/models/bear');
var User = require('./app/models/user');
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    //res.json({ message: 'hooray! welcome to our api!' });
    var t = "";
    t += '<form>';
    t += '  <label>First Name:</label>';
    t += '  <input type="text" id="firstName" placeholder="First Name"></br>';
    t += '  <label>Last Name:</label>';
    t += '  <input type="text" id="lastName" placeholder="Last Name"></br>';
    t += '  <label>Userame:</label>';
    t += '  <input type="text" id="userame" placeholder="Userame"></br>';
    t += '  <label>Password:</label>';
    t += '  <input type="text" id="password" placeholder="Password"></br>';
    t += '  <label>Password:</label>';
    t += '  <input type="text" id="password" placeholder="Password"></br>';
    t += '  <label>Is Admin:</label>';
    t += '  <input type="checkbox" id="isAdmin" placeholder="isAdmin"></br>';
    t += '  <input formmethod="POST" type="submit" id="submit_user" value="Submit"></br>';
    t += '</form>';
    res.send(t);
});

// more routes for our API will happen here

// on routes that end in /bears
// ----------------------------------------------------
router.route('/register')

    // create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function(req, res) {

        var user = new User({
            id: 0,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            isAdmin: req.body.isAdmin,
            isActivated: req.body.isActivated,
            lastLogIn: req.body.lastLogIn
        });      // create a new instance of the Bear model

        // save the bear and check for errors
        user.save(function(err, user) {
            if (err)
                res.send(err);

            res.json({ message: 'User '+ user +' created!' });
        });
    })

    // get all the bears (accessed at GET http://localhost:8080/api/bears)
    .get(function(req, res) {
        User.find(function (err, users) {
            if (err)
                res.send(err);

            res.json(users);
        });
    });
// on routes that end in  /login/:username
router.route('/login/:username')
.get(function(req,res){
       User.findOne({'username':req.params.username}, function(err,bear){
           if (err)
               res.send(err);
           res.json(bear);
       });
    });

router.route('/forgotpassword/:username')
.get(function(req,res){
        User.findOne({'username': req.params.username}), 'password', function(err,user){}
        if(err)
            res.send(err);
        res.json(user);
    });
// on routes that end in /bears/:bear_id
// ----------------------------------------------------
router.route('/bears/:bear_id')

    // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
    .get(function(req, res) {
        Bear.findById(req.params.bear_id, function(err, bear) {
            if (err)
                res.send(err);
            res.json(bear);
        });
    })

    // update the bear with this id (accessed at PUT http://localhost:8080/api/bears/:bear_id)
    .put(function(req, res) {

        // use our bear model to find the bear we want
        Bear.findById(req.params.bear_id, function (err, bear) {

            if (err)
                res.send(err);

            bear.name = req.body.name;  // update the bears info

            // save the bear
            bear.save(function (err) {
                if (err)
                    res.send(err);

                res.json({message: 'Bear updated!'});
            });

        });
    })

    // delete the bear with this id (accessed at DELETE http://localhost:8080/api/bears/:bear_id)
    .delete(function(req, res) {
        Bear.remove({
            _id: req.params.bear_id
        }, function(err, bear) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });

////store an img in binary in mongo
//var a = new A;
//a.img.data = fs.readFileSync(imgPath);
//a.img.contentType = 'image/png';
//a.save(function (err, a) {
//    if (err) throw err;
//
//    console.error('saved img to mongo');


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/cornstalk', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Listening on port ' + port);