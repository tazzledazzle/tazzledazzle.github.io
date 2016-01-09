// element controller pattern

var app = app || {};

app.AppView = Backbone.View.extend({
	el: '#video-collection',
	videoTemplate: _.template($('#app-template').html()),
	events: {
		'click #submitBtn' : '_onSearch',
		'click input[name="loadMore"]' : '_onLoadMore',
		'click .video-image': '_onVideoClick',
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
		var queryString = e.target.getAttribute('alt').slice( e.target.getAttribute('alt').indexOf('?') + 1);
		var queryVars = {"v": queryString.split("=")[1]};

			// if GET variable "v" exists. This is the Youtube Video ID
		if ( 'v' in queryVars )
		{
			// Prevent opening of external page
			e.preventDefault();

			// Variables for iFrame code. Width and height from data attributes, else use default.
			var vidWidth = 560; // default
			var vidHeight = 315; // default
			if ( $(this).attr('data-width') ) { vidWidth = parseInt($(this).attr('data-width')); }
			if ( $(this).attr('data-height') ) { vidHeight =  parseInt($(this).attr('data-height')); }
			var iFrameCode = '<iframe width="' + vidWidth + '" height="'+ vidHeight +'" scrolling="no" allowtransparency="true" allowfullscreen="true" src="http://www.youtube.com/embed/'+  queryVars['v'] +'?rel=0&wmode=transparent&showinfo=0" frameborder="0"></iframe>';

			// Replace Modal HTML with iFrame Embed
			$('#mediaModal .modal-body').html(iFrameCode);
			// Set new width of modal window, based on dynamic video content
			$('#mediaModal').on('show.bs.modal', function () {
				// Add video width to left and right padding, to get new width of modal window
				var modalBody = $(this).find('.modal-body');
				var modalDialog = $(this).find('.modal-dialog');
				var newModalWidth = vidWidth + parseInt(modalBody.css("padding-left")) + parseInt(modalBody.css("padding-right"));
				newModalWidth += parseInt(modalDialog.css("padding-left")) + parseInt(modalDialog.css("padding-right"));
				newModalWidth += 'px';
				// Set width of modal (Bootstrap 3.0)
			    $(this).find('.modal-dialog').css('width', newModalWidth);
			});

			// Open Modal
			$('#mediaModal').modal();
		}


		// Clear modal contents on close. 
		// There was mention of videos that kept playing in the background.
		$('#mediaModal').on('hidden.bs.modal', function () {
			$('#mediaModal .modal-body').html('');
		});
	}
});