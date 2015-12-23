var LabApp = angular.module("labs", ['ngRoute']),
    controllers = {};

LabApp.config(function ($routeProvider){
    $routeProvider
        .when('/density', {
            controller: 'densityController',
            templateUrl: 'lab1Density.html'
        })
        .otherwise({ redirectTo: '/density'});
});

controllers["densityController"] = function densityController($scope) {
    $scope.compute = function(){
        debugger;
        var data = $('#data').html();

        function calculateDensity(obj) {

        }

        function displayMedianDensity(list) {

        }

        function displayCountry(obj) {

        }

        function traverseAndDisplay(list) {

        }

        function displayMostDense(list) {

        }

        function displayLeastDense(list) {

        }

        function displayTotalDensity(populationTotal, areaTotal) {

        }

        function calculateAverage(numerator, denominator) {

        }

        function displayArithmeticAverage(densityTotal, size) {

        }

        function moveEntries(list, insertPoint) {

        }

        function insertSorted(list) {

        }
    }
};

LabApp.controller(controllers);
