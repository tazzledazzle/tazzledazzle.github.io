(function(){
    'use strict';

    angular.module('post').service('postService', function($http, $q) {

        var postContent = [];

        this.getPostContent = function(){
            var deferred = $q.defer();

            if(postContent.length === 0) {
               postContent = "You have made it happen on Posts";
                deferred.resolve(postContent);
            }else{
                deferred.resolve(postContent);
            }

            return deferred.promise;
        };

    });

})();

