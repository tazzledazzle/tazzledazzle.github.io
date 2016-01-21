(function(){
    'use strict';







    angular.module('disclosures', ['ui.bootstrap', 'ui.utils', 'ui.router', 'ngAnimate', 'restangular']);

    angular.module('disclosures').config(function($stateProvider) {

        $stateProvider.state('disclosures-template', {
            url: '/disclosures',
            templateUrl: 'disclosures/templates/disclosures-template.html',
            controller: 'disclosuresController',
            resolve: {
                loadContent: function( disclosuresService ){
                    return disclosuresService.getDisclosuresContent();
                }
            }
        });
        /* Add New States Above */

    });


})();
