
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
	$scope.todoList = [];
	$scope.options = ["MUST", "SHOULD", "UNKNOWN", "COULD"];

	$scope.addToList = function(){
		var select = document.getElementById('selectOptions');
		$scope.todoList.push({name: $scope.item.name, priority: select[select.selectedIndex].value});
		$scope.item.name = "";
		$scope.item.priority = "";
	};
};





// adding all the controllers here
todoListApp.controller(controllers);

