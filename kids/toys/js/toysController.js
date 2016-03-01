var myApp = angular.module('toysApp', ['ngRoute']);

myApp.config(function ($routeProvider){
	$routeProvider
		.when('/', {
			controller: 'BaseController',
			templateUrl: 'partials/welcome.html'
		})
		.when('/browse', {
			controller: 'BrowseController',
			templateUrl: 'partials/browse.html'
		})
		.when('/contact', {
			controller: 'BaseController',
			templateUrl: 'partials/contact.html'
		})
		.when('/upload', {
			controller: 'BaseController',
			templateUrl: 'partials/upload.html'
		})
		.otherwise({ redirectTo: '/'});
});

var controllers = {};

controllers['BaseController'] = function BaseController($scope) {

};
controllers['BrowseController'] = function BrowseController($scope) {

}
controllers['ContactController'] = function ContactController($scope) {

}
controllers['UploadController'] = function UploadController($scope) {

}

myApp.controller(controllers);