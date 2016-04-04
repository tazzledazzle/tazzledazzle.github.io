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
		.when('/toy/:id', {
			controller: 'BaseController',
			templateUrl: 'partials/toy.html'
		})
		.otherwise({ redirectTo: '/'});
});

var controllers = {};

controllers['BaseController'] = function BaseController($scope) {
	$scope.toys = [{id: 1, src: "https://placehold.it/250x250", title: "a bear", desc: "something about the cuddly bear"},
		{id: 2, src: "https://placehold.it/250x250", title: "a bear", desc: "something about the cuddly bear"},
		{id: 2, src: "https://placehold.it/250x250", title: "a bear", desc: "something about the cuddly bear"},
		{id: 2, src: "https://placehold.it/250x250", title: "a bear", desc: "something about the cuddly bear"},
		{id: 2, src: "https://placehold.it/250x250", title: "a bear", desc: "something about the cuddly bear"},
		{id: 2, src: "https://placehold.it/250x250", title: "a bear", desc: "something about the cuddly bear"},
		{id: 2, src: "https://placehold.it/250x250", title: "a bear", desc: "something about the cuddly bear"},
		{id: 2, src: "https://placehold.it/250x250", title: "a bear", desc: "something about the cuddly bear"},
		{id: 3, src: "https://placehold.it/250x250", title: "a bear", desc: "something about the cuddly bear"},
		{id: 4, src: "https://placehold.it/250x250", title: "a bear", desc: "something about the cuddly bear"}]
};
controllers['BrowseController'] = function BrowseController($scope) {

}
controllers['ContactController'] = function ContactController($scope) {

}
controllers['UploadController'] = function UploadController($scope) {

}

myApp.controller(controllers);