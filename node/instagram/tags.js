var tagsApp = angular.module('tags', ['ngRoute']);
var controllers = {};

tagsApp.config(function ($routeProvider, $locationProvider){
    $routeProvider
        .when('/', {
            controller: 'searchController',
            templateUrl: 'index.html'
        })
        .when('#search/:param1', {
            controller: 'pageController'
        })

        .otherwise({ redirectTo: '/'});

    $locationProvider.html5Mode(true);
});

controllers['pageController'] = function ($rootScope, $scope, $routeParams, $route) {
        //If you want to use URL attributes before the website is loaded
        $rootScope.$on('$routeChangeSuccess', function () {
            console.log($routeParams.id);
            console.log($routeParams.type)
        });
};

controllers['searchController'] = function searchController($scope) {
    //todo
    function errorAlert() {
        $('body').prepend('<div class="alert alert-danger">' +
        '<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>' +
        '<strong>Error!</strong> You cannot input an empty search.' +
        '</div>');
    }

    function formList(result) {
        var modal_info = "";
        _.each(result.data, function(item) {
            modal_info += '<li><a href="#search/'+item.name+'" >' + item.name +'</a>: ' + item.media_count + ' posts</li>'

        }, this);
        return modal_info;
    }
    var access_token="276731370.ae7f986.84446bec657d447a9ffc07ec670559e0",
        client_id="ae7f986a9044407c833495fe680a78ca",
        client_secret="d1d03f416cc84b87bccee1b4d34ab9eb",
        website_url="http://www.github.com/tazzledazzle",
        redirect_uri="http://www.github.com/tazzledazzle";

    $scope.onSearchClick = function () {
        var query = $('.input').val().trim();

        if (query === "") {
             errorAlert();
            return;
        }

        var url = 'https://api.instagram.com/v1/tags/'+ query+'/media/recent?client_id=' + client_id;

        $.ajax({
            url: url,
            crossDomain: true,
            dataType: 'jsonp',
            type: 'GET',
            success: onSuccess,
            error: function(err) {
            }
        });
        function onSuccess(result) {
            var list = $('.results ul');
            list.html("");
            if (result.data) {

                $scope.instaData = result;
                var display = $('.results');
                _.each(result.data, function (item) {
                    // todo break this out and into angular
                    list.append("<div id='tag-item'>"+
                    "<div ng-click='onImageClick()'><img  src='" + item.images.low_resolution.url + "' /></div>" +
                    "</br>" +
                    "<div id='text'>" + item.caption.text + "</div>" +
                    "</div>");
                });
                //todo pagination

            }
        }


    };

    $scope.onGenInfo = function() {
        var query = $('.input').val().trim();

        if (query === "") {
            errorAlert();
            return;
        }

        var url = 'https://api.instagram.com/v1/tags/' + query + '?access_token=' + access_token;

        $.ajax({
            url: url,
            crossDomain: true,
            dataType: 'jsonp',
            type: 'GET',
            success: onInfoSuccess,
            async: false,
            error: function(err) {
            }
        });

        function onInfoSuccess(result) {
            var modal_info = result.data.name + ': ' + result.data.media_count;
            $('.modal-body p').html(modal_info);
        }

        url = 'https://api.instagram.com/v1/tags/search?q=' + query + '&access_token=' + access_token;


        $.ajax({
            url: url,
            crossDomain: true,
            dataType: 'jsonp',
            type: 'GET',
            success: function(result) {
                var modal_info = formList(result);
                $('.modal-body ul').append(modal_info);
            },
            async: false,
            error: function(err) {
            }
        });
    };

    $scope.onTagClicked = function() {
        debugger;
        var test = "";
        return test;

    };
};


tagsApp.controller(controllers);

