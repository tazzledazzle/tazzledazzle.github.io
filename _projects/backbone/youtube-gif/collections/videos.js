var app = app || {};

var VideoSets = Backbone.Collection.extend({
	model: app.Video,
	localstorage: new Backbone.LocalStorage('videos-backbone'),
	total: function() {
		return 1;
	}
});

app.Videos = new VideoSets();