
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var BookSchema = new Schema({
	name: {type: String, default: ''},
	description: {type: String, default: ''},
	inventoryAmount: {type: Number, default: 0},
	price: {type: Number, default: 0.0},
	category: {type: String, default: ''},
	publishDate: {type: Date},
	reviewRating: {type: Number, default: 0},
	authors: [
		{type: String, default: ''}
	],
	pages: {type: Number, default: 0},
	version: {type: Number, default: 0},
	publisher: {type: String, default: ''},
	coverPhoto: {type: String, default: ''}
});

module.exports = mongoose.model('Book', BookSchema);