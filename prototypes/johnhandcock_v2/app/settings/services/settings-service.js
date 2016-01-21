(function(){
    'use strict';

    angular.module('settings').service('settingsService', function($http, $q) {

        var settingsContent = [];

        this.getSettingsContent = function(){
            var deferred = $q.defer();

            if(settingsContent.length === 0) {
                settingsContent = "You have made it happen on Posts";
                deferred.resolve(settingsContent);
            }else{
                deferred.resolve(settingsContent);
            }

            return deferred.promise;
        };

    });

})();

