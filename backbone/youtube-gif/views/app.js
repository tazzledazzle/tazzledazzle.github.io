// element controller pattern

var app = app || {};

app.AppView = Backbone.View.extend({
	el: '#video-collection',
	videoTemplate: _.template($('#app-template').html()),
	events: {},
	initialize: function() {
		this.$container = this.$('#video-collection');
		this.$videoData = this.grabVideos()
		// app.Videos.fetch();
		this.render();
	},
	render: function() {
		
		_.each(this.$videoData.length, function (i){
			this.$el.append(this.videoTemplate({
				title: 'Hello ' + i,
				url: 'weee'
			}));
		}, this);
	},
	grabVideos: function () {
		
		var api_key = 'AIzaSyA18m9fi3OZydepSNskAs_jMmRH77HPy9I';
		var OAUTH2_CLIENT_ID = '174759681990-rrdpr48oaj49c56h94ku5gb38837dhsu.apps.googleusercontent.com';
		var OAUTH2_SCOPES = [
			'https://tazzledazzle.github.io'
		];
		function onClientLoad() {
			gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
		}	
		function onYouTubeApiLoad() {
			gapi.client.setApiKey(api_key);
			search();
		}
		function search() {
			var q = 'zelda'; //todo: this should be the input on the top of the screen
			var request = gapi.client.youtube.search.list({
				q:q,
				part: 'snippet'
			});

			request.execute(function(response) {
				var str = JSON.stringify(response.result);
				debugger;
				$('#results').html('<pre>' + str + '</pre>');
			});
		}
		var url = "https://www.googleapis.com/youtube/v3/search?part=snippet&key="+api_key;
		//url = "https://accounts.google.com/o/oauth2/auth?client_id=" + OAUTH2_CLIENT_ID;
		$.ajax({
			type: "GET",
			dataType: "jsonp",
			url: url
		}).success(function(r,d){
			debugger;
		});
		return {length: 5};
	}
});