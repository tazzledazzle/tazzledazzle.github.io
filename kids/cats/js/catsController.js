var myApp = angular.module('catsApp', ['ngRoute']);

myApp.config(function ($routeProvider){
	$routeProvider
		.when('/', {
			controller: 'BaseController',
			templateUrl: 'partials/welcome.html'
		})
		.when('/types', {
			controller: 'BaseController',
			templateUrl: 'partials/types.html'
		})
		.when('/facts', {
			controller: 'BaseController',
			templateUrl: 'partials/facts.html'
		})
		.when('/photos', {
			controller: 'PhotoController',
			templateUrl: 'partials/photos.html'
		})
		.otherwise({ redirectTo: '/'});
});

var controllers = {};

controllers['BaseController'] = function BaseController($scope) {

};
controllers['TypesController'] = function TypesController($scope) {

}
controllers['FactsController'] = function FactsController($scope) {

}
controllers['PhotoController'] = function PhotoController($scope) {
	$scope.photoList = ['Photo 1','Photo 2','Photo 3'];
}

myApp.controller(controllers);