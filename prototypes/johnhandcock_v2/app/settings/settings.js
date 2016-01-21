(function(){
    'use strict';







    angular.module('settings', ['ui.bootstrap', 'ui.utils', 'ui.router', 'ngAnimate', 'restangular']);

    angular.module('settings').config(function($stateProvider) {

        $stateProvider.state('settings-template', {
            url: '/settings',
            templateUrl: 'settings/templates/settings-template.html',
            controller: 'settingsController',
            resolve: {
                loadContent: function( settingsService ){
                    return settingsService.getSettingsContent();
                }
            }
        });
        /* Add New States Above */

    });


})();
