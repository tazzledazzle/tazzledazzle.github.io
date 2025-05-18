// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://node:node@ds045785.mongolab.com:045785/sample-db');
// Schema definitions
var Book = require('./server/models/book');

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
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.route('/books')
// GET /books
	.get(function(req, res){
		//TODO
	})
// POST /books
	.post(function(req, res) {
		var book = new Book();

		book.name = req.body.name;
		book.description = req.body.description;
		book.inventoryAmount = req.body.inventoryAmount;
		book.price = req.body.price;
		book.category = req.body.category;
		book.publishDate = req.body.publishDate;
		book.reviewRating = req.body.reviewRating;
		book.authors = req.body.authors;
		book.pages = req.body.pages;
		book.version = req.body.version;
		book.publisher = req.body.publisher;
		book.coverPhoto = req.body.coverPhoto;

		book.save(function(err) {
			if (err) {
				console.log(err);
				res.send(err);
			}

			res.json({message: 'Book saved successfully!'});
		});

	});
// GET /books/:book_id
// PUT /books/:book_id
// DELETE /books/:book_id
// GET /books/search/:params
// POST /books/search/:params
// ====================================================================================
// GET /users
// POST /users
// GET /users/:user_id
// PUT /users/:user_id
// DELETE /users/:user_id
// GET /users/search/:params
// POST /users/search/:params
// ====================================================================================
// GET /ratings
// POST /ratings
// GET /ratings/:rating_id
// PUT /ratings/:rating_id
// DELETE /ratings/:rating_id
// GET /ratings/search/:params
// POST /ratings/search/:params
// ====================================================================================
// GET /transactions
// POST /transactions
// GET /transactions/:transaction_id
// PUT /transactions/:transaction_id
// DELETE /transactions/:transaction_id
// GET /transactions/search/:params
// POST /transactions/search/:params






// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);



