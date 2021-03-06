(function(){
    'use strict';

    /**
     * This is a sample module
     * Generated by ng-appgen Yeomen/Angular generator.
     *
     * @author: Tapas Jena
     * @copyright: Anitech Consulting Services Pvt Ltd.
     */
    angular.module('help', ['ui.bootstrap', 'ui.utils', 'ui.router', 'ngAnimate', 'restangular']);
    
    angular.module('help').config(function($stateProvider) {

        $stateProvider.state('help-template', {
            url: '/help',
            templateUrl: 'help/templates/help-template.html',
            controller: 'helpController',
            resolve: {
                loadContent: function( helpService ){
                    return helpService.getHelpContent();
                }
            }
        });
        /* Add New States Above */

    });
    

})();
