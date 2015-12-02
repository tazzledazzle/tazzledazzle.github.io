
var todoListApp = angular.module('todoList', ['ngRoute']);
var controllers = {};

todoListApp.config(function ($routeProvider){
	$routeProvider
		.when('/', {
			controller: 'TodoController',
			templateUrl: 'list.html'
		})
		.otherwise({ redirectTo: '/'});
});

controllers['TodoController'] = function TodoController($scope){
	$scope.todoList = [{name: "Test", priority: "MUST"}];

	$scope.addToList = function(){
		$scope.todoList.push({item: $scope.item.name, priority: $scope.item.priority});
	};
};





// adding all the controllers here
todoListApp.controller(controllers);

