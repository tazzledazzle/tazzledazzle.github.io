
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
	$scope.id_index = 0;
	$scope.addToList = function(){
		var select = document.getElementById('selectOptions');
		$scope.todoList.push({id: $scope.id_index, name: $scope.item.name,
			priority: select[select.selectedIndex].value, deleted: false});
		$scope.id_index += 1;
		$scope.item.name = "";
		$scope.item.priority = "";
	};

	$scope.completeItem = function (){
		var row_index = '.row_'+ this.i.id;
		$(row_index).addClass('success');
		$(row_index + ' #doneBtn').addClass('hidden');
		$(row_index + ' #deleteBtn').addClass('hidden');
	};

	$scope.deleteItem = function () {
		var row_index = '.row_'+ this.i.id;
		$(row_index).addClass('hidden');
		$scope.todoList[this.i.id].deleted = true;
	};
};





// adding all the controllers here
todoListApp.controller(controllers);

