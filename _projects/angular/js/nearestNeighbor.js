var nearestNeighborApp = angular.module('nearestNeighbor', ['ngRoute']);
var controllers = {};

nearestNeighborApp.config(function ($routeProvider){
	$routeProvider
		.when('/', {
			controller: 'nearestNeighborController',
			templateUrl: 'nearestNeighbor.html'
		})
		.when('/minkowski', {
			controller: 'minkowskiController',
			templateUrl: 'minkowskiDistance.html'
		})
		.otherwise({ redirectTo: '/'});
});

controllers['nearestNeighborController'] = function nearestNeighborController($scope) {
	$scope.artists = [];
	$scope.users = [];
	$scope.userRatings = {};
	$scope.knearest = [];

	for(var i = 0; i < 10; i +=1){
		$scope.artists.push(chance.word());
		$scope.users.push(chance.name());
	}
	$scope.users.forEach(function(user){
		var ratingList = {};
		$scope.artists.forEach(function(artist){
			ratingList[artist] = chance.integer({min: 0, max: 10});

		});
		$scope.userRatings[user] = ratingList;
	});
	function manhattan(user1, user2){
		var distance = 0;
		_.each(_.keys(user1), function(key){
			if (user2[key]){
				distance += Math.abs(user1[key] - user2[key]);
			}
		});
			return distance;
	}
	var computeNN = function(username, userlist){
		var distances = [];
		_.each(_.keys(userlist), function(user){
			if (username !== user){
				var distance = manhattan(userlist[user], userlist[username]);
				distances.push({username: user, distance: distance});
			}
		});
		_.sortBy(distances, 'distance');
		return distances;

	};
	var appendResults = function (results){

	};

	$scope.compute = function (){
		var user = $('.success');
		if(user.length === 1) {
			user = user.attr('id');
			var knearest = computeNN(user, this.userRatings);
			_.each(_.sortBy(knearest, 'distance'), function (k) {
				$('.results').append("<li>" + k.username + "-" + k.distance + "</li>");
			});
		}
		else {
			alert('Must only select one user');
			_.each(user, function(user){
				user.removeClass('success');
			});
		}
		
	};
	$scope.onClick = function (){
		console.log(this.i + ' - ' + this.n);
		$('tr[id="'+this.i+'"').addClass('success');

	};
	$scope.selectUser = function (){
		var row = $('tr[id="'+this.i+'"');
		if(row.hasClass('success')){
			row.removeClass('success');
		}
		else{
			row.addClass('success');
			$('.results').html('');
		}
	};
};

controllers['minkowskiController'] = function($scope) {
	$scope.artists = [];
	$scope.users = [];
	$scope.userRatings = {};

	for(var i = 0; i < 10; i +=1){
		$scope.artists.push(chance.word());
		$scope.users.push(chance.name());
	}
	$scope.users.forEach(function(user){
		var ratingList = {};
		$scope.artists.forEach(function(artist){
			ratingList[artist] = chance.integer({min: 0, max: 10});

		});
		$scope.userRatings[user] = ratingList;
	});

	function manhattan(user1, user2){
		var distance = 0;
		_.each(_.keys(user1), function(key){
			if (user2[key]){
				distance += Math.abs(user1[key] - user2[key]);
			}
		});
		return distance;
	}

	function euclidian(user1, user2){
		var distance = 0;
		_.each(_.keys(user1), function(key){
			if (user2[key]){
				distance += Math.pow(Math.pow(Math.abs(user1[key] - user2[key]), 2), (1/2));
			}
		});
		return distance;
	}

	function minkowski(user1, user2, r){
		var distance = 0;
		_.each(_.keys(user1), function(key){
			if(user2[key]){
				distance += Math.pow(Math.pow(Math.abs(user1[key] - user2[key]), r), (1/r));
			}
		});

		return distance;
	}


};

nearestNeighborApp.controller(controllers);
//
//var navApp = angular.module('nav', ['ngRoute']);
//var navControllers = {};
//
//navApp.config(function ($routeProvider){
//	$routeProvider
//		.when('/', {
//			controller: 'navigationController',
//			templateUrl: 'nav.html'
//		})
//		.otherwise({ redirectTo: '/'});
//});
//
//navControllers['navigationController'] = function($scope){
//	$scope.links = {};
//
//};
//
//navApp.controller(controllers);