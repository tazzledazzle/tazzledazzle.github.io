(function(){
    'use strict';

    angular.module('disclosures').service('disclosuresService', function($http, $q) {

        var disclosuresContent = [];

        this.getDisclosuresContent = function(){
            var deferred = $q.defer();

            if(disclosuresContent.length === 0) {
                disclosuresContent = "You have made it happen on disclosures";
                deferred.resolve(disclosuresContent);
            }else{
                deferred.resolve(disclosuresContent);
            }

            return deferred.promise;
        };

    });

})();

