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
    'ui.bootstrap',
    'ui.router',
    'ngIdle'
  ]);
angular.module('JFS_Admin').run(function($rootScope, $state, $cookies, Idle) {
  Idle.watch();
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
    var requireLogin = toState.data.requireLogin;
    if (typeof $rootScope.currentUser === 'undefined') {
      $rootScope.currentUser = $cookies.getObject('user');
    }
    if (requireLogin && typeof $rootScope.currentUser === 'undefined') {
      event.preventDefault();
      $state.go('login');
    }
  });

});
angular.module('JFS_Admin').config(function($stateProvider, $urlRouterProvider, KeepaliveProvider, IdleProvider) {

  // configure Idle settings
  IdleProvider.idle(10000); // in seconds
  IdleProvider.timeout(10000); // in seconds
  KeepaliveProvider.interval(2); // in seconds

  $urlRouterProvider.otherwise("/Challenge/Dashboard");
  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'views/Login/index.html',
      controller: 'LoginCtrl',
      data: {
        requireLogin: false
      }
    })
    .state('app', {
      url: '',
      templateUrl: 'views/index.html',
      controller: 'MainCtrl',
      data: {
        requireLogin: true
      }

    })
    .state('app.Home', {
      url: '/Home',
      templateUrl: 'views/Recruiting/index.html',

    })
});
