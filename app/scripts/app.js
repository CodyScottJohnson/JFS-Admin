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
    'angular.filter',
    'angularMoment',
    'chart.js',
    'FBAngular',
    'luegg.directives',
    'ngAnimate',
    'ngCookies',
    'ngFileSaver',
    'ngIdle',
    'ngSanitize',
    'summernote',
    'toastr',
    'ui.bootstrap',
    'ui.bootstrap.contextMenu',
    'ui.router',
    'xeditable'
  ]);
angular.module('JFS_Admin').run(function($rootScope, $state, $cookies, Idle, editableOptions) {
  Idle.watch();
  editableOptions.theme = 'bs3';
  $rootScope.conn = new WebSocket('wss://jfsapp.com/WebSocket');
  $rootScope.conn.onopen = function(e) {
    console.log("Connection established!");
  };

  $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
    if ($state.current.name != "login") {
      $rootScope.state = $state.current;
    }
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

  $urlRouterProvider.otherwise("/");
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
      url: '/',
      templateUrl: 'views/Recruiting/index.html',

    })
    .state('app.Messages', {
      url: '/Messages',
      templateUrl: 'views/MessageCenter/index.html',
      controller: 'MessagesCtrl',

    })
    .state('app.Tasks', {
      url: '/Tasks',
      templateUrl: 'views/Task/index.html',
      controller: 'TaskCtrl',

    })
    .state('app.Recruiting', {
      url: '',
      templateUrl: 'views/Recruiting/index.html',
      controller: 'RecruitingCtrl',

    })
    .state('app.Recruiting.Dashboard', {
      url: '/Recruiting',
      templateUrl: 'views/Recruiting/dashboard.html',

    })
    .state('app.Recruiting.Assigned', {
      url: '/Recruiting/Assigned',
      templateUrl: 'views/Recruiting/assigned.html',

    })
    .state('app.Recruiting.Recruit', {
      url: '/Recruiting/Recruit',
      templateUrl: 'views/Recruiting/recruitportal.html',
      controller: 'RecruitCtrl',

    })
    .state('app.Agents', {
      url: '',
      templateUrl: 'views/Agents/index.html',
      controller: 'AgentsCtrl',

    })
    .state('app.Agents.Dashboard', {
      url: '/Agents',
      templateUrl: 'views/Agents/dashboard.html',

    })
    .state('app.Reporting', {
            url: "/Reporting",
            templateUrl: 'views/Reporting/index.html',
            controller: 'ReportCtrl'
        })
    .state('app.Reporting.Dashboard', {
      url: "/Reporting/Dashboard",
      templateUrl: 'views/Reporting/Dashboard.html'
    })
    .state('app.Reporting.ColorTest', {
      url: "/Reporting/ColorTest",
      templateUrl: 'views/Reporting/Color_Test.html'
    })
    .state('app.Reporting.PopTest', {
      url: "/Reporting/PopTest",
      templateUrl: 'views/Reporting/Pop_Test.html'
    });
});
