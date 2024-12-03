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
        var data = $('#data').html();
        var max = 250;
        var cities = [max];
        data = data.split('\n');
        for (var i = 0; i < data.length; i += 1){
            var city = data[i].split("	");
            if (city.length === 3) {
                var city_obj = {
                    "name": city[0],
                    "population": parseInt(city[1],10),
                    "area": parseInt(city[2],10)
                };

                city_obj["density"] = calculateDensity(city_obj);
                insertSorted(city_obj, cities);
                cities.push(city_obj);
            }
        }
        debugger;

        traverseAndDisplay(cities);

        function calculateDensity(obj) {
            if (obj.area > 0) {
                return obj.population / obj.area;
            }
            else {
                return obj.population;
            }
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

        function insertSorted(city_obj, list) {
            for (var i = list.length-1; i > 0; i--) {
                if (city_obj["density"] < list[i].density){

                }
                else if (city_obj.density === list[i].density && city_obj.name) {

                }
            }
        }
    }
};

LabApp.controller(controllers);
