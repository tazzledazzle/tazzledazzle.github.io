// element controller pattern

var app = app || {};

app.AppView = Backbone.View.extend({
	el: '#video-collection',
	videoTemplate: _.template($('#app-template').html()),
	events: {
		'click #submitBtn' : '_onSearch',
		'click input[name="loadMore"]' : '_onLoadMore',
		'click .video-image': '_onVideoClick',
		'keyup ': '_onKeyUp',
		'click #generate': '_onClickGenerate'
	},
	initialize: function() {
		this.$container = this.$('#video-collection');
		this.$videoData = [1,2,3,4,5];

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

			var template = _.template($('#modal-template').html());
			$(this.$el).append(template);
			$(this.$el).append('<script src="https://www.youtube.com/iframe_api"></script>');
			// Variables for iFrame code. Width and height from data attributes, else use default.
			var vidWidth = 560; // default
			var vidHeight = 315; // default
			if ( $(this).attr('data-width') ) { vidWidth = parseInt($(this).attr('data-width')); }
			if ( $(this).attr('data-height') ) { vidHeight =  parseInt($(this).attr('data-height')); }
			//var iFrameCode = '<iframe width="' + vidWidth + '" height="'+ vidHeight +'" scrolling="no" allowtransparency="true" allowfullscreen="true" src="http://www.youtube.com/embed/'+  queryVars['v'] +'?rel=0&wmode=transparent&showinfo=0&enablejsapi=1&playerapiid=ytplayer&version=3" frameborder="0"></iframe>';
			var SWFCode = '<embed id="my-video" style="height: 300px" width="100%" height="100%" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen allowfullscreen="true" allowscriptaccess="always" quality="high" bgcolor="#000000" name="my-video" style="" src="http://www.youtube.com/v/'+ queryVars['v'] +'?enablejsapi=1&version=3&playerapiid=ytplayer" type="application/x-shockwave-flash">';
			// Replace Modal HTML with iFrame Embed
			$('#mediaModal .modal-body').html(SWFCode);

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
			var ytplayer, startTime = 0, stopTime = 0;
			function triggerTimeCapture(player) {
				var genButton = $('#generate'), elapsed = 0;
				
				if (genButton.val() === "Start Recording") {
					genButton.val("Stop Recording");
					startTime = player.getCurrentTime();
					stopTime = 0;
				}
				else {
					genButton.val("Start Recording");
					stopTime = player.getCurrentTime();
					return (stopTime - startTime);
				}
			}
function getUrl(){

	var vidUrl = $('#my-video').attr('src');
	console.log(vidUrl);

	return vidUrl;
}
			$('#generate').click(function () {
				ytplayer = document.getElementById("my-video");
				ytplayer.playVideo();
				var elapsed = triggerTimeCapture(ytplayer);
				$('#startTime').val(startTime);
				$('#endTime').val(stopTime);
				$('#totalTime').val(elapsed);
				//todo actually generate on stop of video
				//send over to https://giflayer.com/dashboard api

				if (elapsed !== 0){
					console.log(getUrl());
					console.log("Start Time=" +parseInt(startTime, 10));
					console.log("Stop Time=" + parseInt(stopTime, 10));
			    	var api = 'http://apilayer.net/api/capture',
			    		key = '?access_key=df2428455970d83566bb7a81bdc330af',
				    	url = '&url=' + getUrl(),
				    	//start = '&start=' + parseInt(startTime, 10),
				    	start = '&start=' + parseInt(4, 10),
				    	//end = '& end=' + parseInt(stopTime, 10);
				    	end = '& end=' + parseInt(7, 10);
			    	// GET gif (ajax call?)
                    //$.when(
						$.ajax({
							type: 'GET',
							url: api + key + url + start + end,
							async: false,
							dataType: 'image/gif',
							beforeStart: {
								"Access-Control-Allow-Headers": "Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name",
								'Access-Control-Allow-Origin': 'http://localhost:9000',
								"Access-Control-Allow-Credentials": true,
								"Access-Control-Allow-Methods": "POST, GET, PUT, DELETE, OPTIONS"
							},
							headers: {
								"Access-Control-Allow-Headers": "Content-Type,X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5,  Date, X-Api-Version, X-File-Name",
								'Access-Control-Allow-Origin': 'http://localhost:9000',
								"Access-Control-Allow-Credentials": true,
								"Access-Control-Allow-Methods": "POST, GET, PUT, DELETE, OPTIONS"
							},
							success: function(data) {

								debugger;
								console.log(data);
								//$('#my-video').append($(data).html());
							}
						});
					//).then(function (sentData) {
					//	debugger;
					//	console.log(sentData);
					//})
				}
				//key = 'http://apilayer.net/api/capture?access_key=df2428455970d83566bb7a81bdc330af&url=http://www.youtube.com/v/tntOCGkgt98?enablejsapi=1&version=3&playerapiid=ytplayer&start=0&end=7.654' ;
			});
		}


		// Clear modal contents on close. 
		// There was mention of videos that kept playing in the background.
		$('#mediaModal').on('hidden.bs.modal', function () {
			$('#mediaModal .modal-body').html('');
		});
	}
});