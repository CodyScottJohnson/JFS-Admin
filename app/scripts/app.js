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
    'angularFileUpload',
    'angularMoment',
    'angular-sortable-view',
    'chart.js',
    'FBAngular',
    'LocalStorageModule',
    'luegg.directives',
    'ngAnimate',
    'ngCookies',
    'ngFileSaver',
    'ngIdle',
    'ngSanitize',
    'ngTagsInput',
    'summernote',
    'toastr',
    'ui.bootstrap',
    'ui.bootstrap.contextMenu',
    'ui.router',
    'xeditable',
    'uiSwitch'
  ]);
angular.module('JFS_Admin').run(function($rootScope, $state, localStorageService, Idle, editableOptions) {
  Idle.watch();
  editableOptions.theme = 'bs3';
  $rootScope.conn = new WebSocket('wss://jfsapp.com/WebSocket');
  $rootScope.conn.onopen = function(e) {
    console.log("Connection established!");
  };

  $rootScope.$on('$stateChangeStart', function(event, toState, toParams,$window) {
    if ($state.current.name != "login") {
      $rootScope.state = $state.current;
    }
    var requireLogin = toState.data.requireLogin;
    if (typeof $rootScope.currentUser === 'undefined') {
      $rootScope.currentUser = localStorageService.cookie.get('user');
    }
    if (requireLogin && typeof $rootScope.currentUser === 'undefined') {
      event.preventDefault();
      $state.go('login');
    }
    else if (toState.name !='login' && toState.name !== '' && ($rootScope.currentUser === null))
    {
      console.log('here');
      event.preventDefault();
      $state.go('login');
    }
    else if(angular.isDefined($rootScope.currentUser) && $rootScope.currentUser !== null) {
      if($rootScope.currentUser.Info.PermissionLevel == 3){
      location.href ='https://jfsapp.com/Admin/Portal/Agent/#/';
    }
    }


  });

});
angular.module('JFS_Admin').config(function($stateProvider, $urlRouterProvider, KeepaliveProvider, IdleProvider,localStorageServiceProvider) {
  // configure Idle settings
  IdleProvider.idle(10000); // in seconds
  IdleProvider.timeout(10000); // in seconds
  KeepaliveProvider.interval(2); // in seconds
  localStorageServiceProvider.setPrefix('JFS');
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
      abstract: true,
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
      abstract: true,
      templateUrl: 'views/Recruiting/index.html',
      controller: 'RecruitingCtrl',

    })
    .state('app.Recruiting.Dashboard', {
      url: '/Recruiting',
      templateUrl: 'views/Recruiting/dashboard.html',

    })
    .state('app.User', {
      url: '/User',
      templateUrl: 'views/User/index.html',
      controller: 'UserCtrl',

    })
    .state('app.User.Settings', {
      url: '/Settings',
      templateUrl: 'views/User/Pages/settings.html',

    })

    .state('app.Recruiting.Archived', {
      url: "/ArchivedRecruits",
      params: {
        search: {
          RecruitStatus_ID: 2
        }
      },
      views: {
        '': {
          templateUrl: 'views/Recruiting/ArchivedRecruits.html',
          controller: 'ArchivedRecruitsCtrl'
        }
      }
    })
    .state('app.Recruiting.Assigned', {
      url: '/Recruiting/Assigned',
      templateUrl: 'views/Recruiting/assigned.html',

    })
    .state('app.Recruiting.Recruit', {
      url: '/Recruiting/Recruit?RecruitID',
      templateUrl: 'views/Recruiting/recruitportal.html',
      controller: 'RecruitCtrl',

    })
    .state('app.Agents', {
      url: '',
      abstract: true,
      templateUrl: 'views/Agents/index.html',
      controller: 'AgentsCtrl',

    })
    .state('app.Agents.Dashboard', {
      url: '/Agents',
      templateUrl: 'views/Agents/dashboard.html',

    })
    .state('app.Agents.Agent', {
      url: '/Agents/Agent?AgentID',
      templateUrl: 'views/Agents/agentPortal.html',
      controller: 'AgentsCtrl',

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
    })
    .state('app.Style', {
      url: "/Style",
      templateUrl: 'views/Style/index.html',
      controller: 'StyleCtrl'
    })
    .state('app.Style.Guide', {
      url: "/Style/Guide",
      templateUrl: 'views/Style/guide.html'
    })
    .state('app.Email', {
      url: "/Email",
      templateUrl: 'views/Email/index.html'
    })
    .state('app.Email.People', {
      url: "/Email/Dashboard",
      templateUrl: 'views/Email/people.html',
      controller: 'EmailPeopleCtrl'
    });
});
