(function(){
    'use strict';







    angular.module('post', ['ui.bootstrap', 'ui.utils', 'ui.router', 'ngAnimate', 'restangular']);

    angular.module('post').config(function($stateProvider) {

        $stateProvider.state('post-template', {
            url: '/post',
            templateUrl: 'post/templates/post-template.html',
            controller: 'postController',
            resolve: {
                loadContent: function( postService ){
                    return postService.getPostContent();
                }
            }
        });
        /* Add New States Above */

    });


})();
