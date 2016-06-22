'use strict';

/**
 * @ngdoc overview
 * @name jfsApp
 * @description
 * # jfsApp
 *
 * Main module of the application.
 */
angular
  .module('JFS_Admin', [
    'ngAnimate',
    'ngCookies',
    'ngSanitize',
    'ui.router'
  ]);
angular.module('JFS_Admin').config(function($stateProvider, $urlRouterProvider) {


  $urlRouterProvider.otherwise("/");

	$stateProvider
		.state('Recruiting', {
			url: "/Recruiting",
			templateUrl: "views/Recruiting/index.html",
			controller: 'RecruitingCtrl'
		});
});
