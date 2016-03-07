$('.search').click(function(e){
	debugger;	
	var query = $('.query').val();
	//api-key
	var apiKey = 'AIzaSyDbpM0CkVgnQQaHhvufkFO_74W_JxH6mBA';
	//part 
	var part = 'snippet';

	// //username
	// MIT

	//channel info
	var channelInfo = 'https://www.googleapis.com/youtube/v3/channels?part='+part+'&forUsername='+query+'&key='+apiKey;
	var channelId, playlistInfo = "", playlistList =[], playlistId, videoInfo = "", videoList = [], videoId, channelObj = {};

	function _getExtraResults(url, data){
		$.when(
			$.get({
				url: url + '&pageToken=' + data.nextPageToken,
				dataType: 'jsonp',
				success: function(data){
				}
			})
			).then(function(result){
				_.each(result.items, function(item){
					playlistList.push(item);
				}, this);

				if(!_.isUndefined(data.nextPageToken)){
					_getExtraResults(url, result);
				}
				else if(data.pageInfo.totalResults === playlistList.length){
					_toChannelObj();
				}
			});
	}
	function _toChannelObj() {
		_.each(playlistList, function (playlist){
			playlistId = playlist.id;
			$.when(
				$.get({
					url: 'https://www.googleapis.com/youtube/v3/playlistItems?part='+part
					+'&key='+apiKey+'&playlistId='+playlistId+'&maxResults=50',
					dataType: 'jsonp',
					async: false,
					success: function (data) {
						videoList = [];
						_.each(data.items, function (item) {
							videoList.push(item);
						});
						
						channelObj[playlist.snippet.title] = _.clone(videoList);
					}
				})
			).then(function (result){
				// videoId = videoList[0].id;
				if(_.keys(channelObj).length === playlistList.length ){
					//TODO: 
					var template = '<div class="channelResult">';
						template += '<ul class="resultList">';
				
					_.each(_.keys(channelObj), function (key){
						template += '<li>';
						template += '<span>';
						template += key;
						template += '</span><br>';
						_.each(channelObj[key], function (video){
							// debugger;
							// template += '<div class="video-'+video.id+' panel">';
							// template += 'id: '+ video.id + '<br>'; 
							// template += 'title: '+ video.snippet.title + '<br>'; 
							// template += 'description: '+ video.snippet.description + '<br>'; 
							// if(video.snippet.thumbnails){
								// template += 'vid thumbnail: '+ video.snippet.thumbnails.default.url + '<br>'; 
							// }
							// template += 'resource id: ' + video.snippet.resourceId.videoId + '<br>';
							template += video.snippet.title + ':= http://www.youtube.com/watch?v=' + video.snippet.resourceId.videoId+ '<br>';
							// template += '<br>';
							
							template += '</div>';
						}, this);						
						template += '</li>';	
						template += '<br>';				
					}, this);

					template += '	</ul>'
					template += '</div>';
					$('.results').html(template);
				}
			});
		}, this);
	}

	if(!_.isUndefined(query) && query !== "") {
		$.when(
			$.get({
			url: channelInfo,
			dataType: 'jsonp',
			// async: false,
			success: function(data){
				// var template = '<div class="channelResult">';
				// 	template += '<ul class="resultList">';
				// _.each(data.items, function(item){
				// 	// template += '<li style="text-decoration: none;">';
				// 	template += '	<li>';
				// 	template += '		<div class="channelInfo">';
				// 	template += 'ChannelId = "<span class="channelId">'+item.id+'</a>"</br>';
				// 	channelId = item.id;
				// 	template += 'ChannelTitle = "'+item.snippet.title+'"</br>';
				// 	template += 'ChannelDescription = "'+item.snippet.description+'"</br>';
				// 	template += 'ChannelThumbnailUrl = "'+item.snippet.thumbnails.default.url+'"</br>';
				// 	template += '		</div>';
				// 	template += '	</li>';

				// }, this);
				// template += '	</ul>'
				// template += '</div>';
				// $('.results').html(template);

				// _toPlaylists(channelId);
				_.each(data.items, function (item){
						channelId = item.id;
				});
				playlistInfo = 'https://www.googleapis.com/youtube/v3/playlists?part='+part
						+'&key='+apiKey+'&channelId='+channelId+'&maxResults=50';
				$.when(
					$.get({
						url: playlistInfo,
						dataType: 'jsonp',
						async: false,
						success: function (data) {
							if(!_.isUndefined(data.nextPageToken)){
								_getExtraResults(playlistInfo , data);
							}
						}
					})
				).then(function (result){
					_.each(result.items, function (item) {
						playlistList.push(item);
					});
				});
			}
		})
		
		).then(function (result){
			debugger;
		},this);
	}

	debugger;
});
