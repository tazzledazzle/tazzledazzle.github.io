// element controller pattern

var app = app || {};

app.AppView = Backbone.View.extend({
	el: '#video-collection',
	videoTemplate: _.template($('#app-template').html()),
	events: {
		'click #submitBtn' : '_onSearch',
		'click input[name="loadMore"]' : '_onLoadMore',
		'click a[href^="http://www.youtube.com"]': '_onVideoClick',
		'keyup ': '_onKeyUp'
	},
	initialize: function() {
		this.$container = this.$('#video-collection');
		// this.$videoData = this.grabVideos();
		this.$videoData = [1,2,3,4,5];
		// app.Videos.fetch();
		
		this.render();
	},
	render: function() {
		this.$el.append(this.videoTemplate({
			// title: 'Hello ',
			// url: 'weee'
		}));
	},
	_onKeyUp: function(e){
		if (e.keyCode == 13){
			this._onSearch();
		}
	},
	_onSearch: function () {
		var query = this.$el.find('#search').val();
		
		var request = gapi.client.youtube.search.list({   
		    q: query,
		    part: 'snippet',
		    maxResults: 30
		  });
		  request.execute(function(response) {
		    var template = _.template($('#video-template').html());
		    var list = $('#results');
		    list.html('');
		    for (var i = 0; i < response.items.length; i++) {
		    	list.append(template({
	    			title: response.items[i].snippet.title,
	    			url: response.items[i].snippet.thumbnails.default.url,
	    			description: response.items[i].snippet.description,
	    			source: "https://www.youtube.com/watch?v=" + response.items[i].id.videoId
		    	}));
		    }
	    	
	    	$('input[name="loadMore"]').attr('next', response.nextPageToken);
		  }, this);
	},
	_onLoadMore: function (e) {
		var query = this.$el.find('#search').val();

		var request = gapi.client.youtube.search.list({
			q: query,
			part: 'snippet',
			pageToken: e.target.getAttribute('next'),
			maxResults: 20
		});

		request.execute(function(response) {
		    var template = _.template($('#video-template').html());
		    var list = $('#results');
		    // list.html('');
		    for (var i = 0; i < response.items.length; i++) {
		    	list.append(template({
	    			title: response.items[i].snippet.title,
	    			url: response.items[i].snippet.thumbnails.default.url,
	    			description: response.items[i].snippet.description,
	    			source: "https://www.youtube.com/watch?v=" + response.items[i].id.videoId
		    	}));
		    }
	    	
	    	$('input[name="loadMore"]').attr('next', response.nextPageToken);
		  }, this);
	},
	_onVideoClick: function (e) {
		debugger;
		e.preventDefault();
	}
});