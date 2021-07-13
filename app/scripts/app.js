"use strict";

/**
 * @ngdoc overview
 * @name jfsApp
 * @description
 * # jfsApp
 *
 * Main module of the application.
 */
angular.module("JFS_Admin", [
  "angular-chartist",
  "angular.filter",
  "angularFileUpload",
  "angularMoment",
  "angular-sortable-view",
  "angular-svg-round-progressbar",
  "chart.js",
  "config",
  "dndLists",
  "FBAngular",
  "LocalStorageModule",
  "luegg.directives",
  "ngAnimate",
  "ngCookies",
  "ngCropper",
  "ngFileSaver",
  "ngIdle",
  "ngSanitize",
  "ngTagsInput",
  "summernote",
  "toastr",
  "ui.bootstrap",
  "ui.bootstrap.contextMenu",
  "ui.router",
  "xeditable",
  "uiSwitch",
  "ngHandsontable"
]);
angular
  .module("JFS_Admin")
  .run(function(
    $rootScope,
    $state,
    localStorageService,
    Idle,
    editableOptions,
    $http
  ) {
    Idle.watch();
    var Ready = true;
    editableOptions.theme = "bs3";
    $rootScope.conn = new WebSocket("wss://jfsapp.com/WebSocket");
    $rootScope.conn.onopen = function(e) {
      console.log("Connection established!");
    };
    $rootScope.showLoading = true;
    $rootScope.$on("$stateChangeStart", function(
      event,
      toState,
      toParams,
      $window
    ) {
      if ($state.current.name != "login") {
        $rootScope.state = $state.current;
      }
      var requireLogin = toState.data.requireLogin;
      if (typeof $rootScope.currentUser === "undefined") {
        $rootScope.currentUser = localStorageService.cookie.get("user");
      }
      if (requireLogin && typeof $rootScope.currentUser === "undefined") {
        event.preventDefault();
        $rootScope.LastLocation = location.href;
        $state.go("login");
      } else if (
        toState.name != "login" &&
        toState.name !== "" &&
        $rootScope.currentUser === null
      ) {
        event.preventDefault();
        $rootScope.LastLocation = location.href;
        $state.go("login");
      } else if (
        angular.isDefined($rootScope.currentUser) &&
        $rootScope.currentUser !== null
      ) {
        if ($rootScope.currentUser.Info.title != "Administrator") {
          //event.preventDefault();
          //location.href ='https://jfsapp.com/Admin/Portal/Agent/#/';
        }
      }
    });
  });
angular
  .module("JFS_Admin")
  .config(function(
    $stateProvider,
    $urlRouterProvider,
    KeepaliveProvider,
    IdleProvider,
    localStorageServiceProvider
  ) {
    // configure Idle settings

    IdleProvider.idle(10000); // in seconds
    IdleProvider.timeout(10000); // in seconds
    KeepaliveProvider.interval(2); // in seconds
    localStorageServiceProvider.setPrefix("JFS");
    $urlRouterProvider.otherwise("/");
    $stateProvider
      .state("login", {
        url: "/login",
        templateUrl: "views/Login/index.html",
        controller: "LoginCtrl",
        data: {
          requireLogin: false
        }
      })
      .state("app", {
        url: "",
        abstract: true,
        templateUrl: "views/index.html",
        controller: "MainCtrl",
        resolve: {
          GlobalSettings: function(User) {
            return User.getGlobalSettings();
          }
        },
        data: {
          requireLogin: true
        }
      })
      .state("app.Home", {
        url: "/",
        templateUrl: "views/Dashboard/index.html"
      })
      .state("app.Messages", {
        url: "/Messages",
        templateUrl: "views/MessageCenter/index.html",
        controller: "MessagesCtrl"
      })
      .state("app.Tasks", {
        url: "/Tasks",
        templateUrl: "views/Task/index.html",
        controller: "TaskCtrl"
      })
      .state("app.Recruiting", {
        url: "",
        abstract: true,
        templateUrl: "views/Recruiting/index.html",
        controller: "RecruitingCtrl"
      })
      .state("app.Recruiting.Dashboard", {
        url: "/Recruiting",
        params: {
          Archived: 0
        },
        templateUrl: "views/Recruiting/dashboard_new.html",
        controller: "RecruitingCtrl"
      })
      .state("app.Recruiting.Dashboard2", {
        url: "/Recruiting/v2",
        params: {
          Archived: 0
        },
        templateUrl: "views/Recruiting/dashboard_new.html",
        controller: "RecruitingCtrl"
      })
      .state("app.Recruiting.Archived", {
        url: "/Recruiting/Archived",
        params: {
          Archived: 1
        },
        views: {
          "": {
            templateUrl: "views/Recruiting/dashboard.html",
            controller: "RecruitingCtrl"
          }
        }
      })
      .state("app.Recruiting.Stages", {
        url: "/Recruiting/Stages",
       
        views: {
          "": {
            templateUrl: "views/Recruiting/stages.html",
            controller: "RecruitingCtrl"
          }
        }
      })
      .state("app.User", {
        url: "/User",
        templateUrl: "views/User/index.html",
        controller: "UserCtrl"
      })
      .state("app.User.Landing", {
        url: "/Landing",
        controller: "MainCtrl",
        templateUrl: "views/User/Pages/landing.html"
      })
      .state("app.User.Settings", {
        url: "/Settings",
        templateUrl: "views/User/Pages/settings.html"
      })
      .state("app.Recruiting.Assigned", {
        url: "/Recruiting/Assigned",
        templateUrl: "views/Recruiting/assigned.html"
      })
      .state("app.Recruiting.Recruit", {
        url: "/Recruiting/Recruit?RecruitID",
        templateUrl: "views/Recruiting/recruitportal.html",
        controller: "RecruitCtrl"
      })
      .state("app.Agents", {
        url: "/Agents",
        abstract: true,
        templateUrl: "views/Agents/index.html",
        controller: "AgentsCtrl"
      })
      .state("app.Agents.Landing", {
        url: "/Landing",
        abstract: true,
        templateUrl: "views/Agents/Landing.html"
      })
      .state("app.Agents.Landing.Career", {
        url: "",
        templateUrl: "views/Agents/Partials/CareerClub.html"
      })
      .state("app.Agents.Landing.NewHire", {
        url: "/NewHire",
        templateUrl: "views/Agents/Partials/CareerClub.html"
      })
      .state("app.Agents.Landing.Life", {
        url: "/Life",
        templateUrl: "views/Agents/Landing.html"
      })
      .state("app.Agents.Landing.PC", {
        url: "/PC",
        templateUrl: "views/Agents/Landing.html"
      })
      .state("app.Agents.Landing.Profitability", {
        url: "/Profitability",
        templateUrl: "views/Agents/Landing.html"
      })
      .state("app.Agents.Dashboard", {
        url: "/Agents",
        templateUrl: "views/Agents/dashboard.html"
      })
      .state("app.Agents.EnterNumbers", {
        url: "/EnterNumbers",
        templateUrl: "views/Agents/EnterNumbers.html",
        controller: "AgentsEnternumbersCtrl"
      })
      .state("app.Agents.Agent", {
        url: "/Agents/Agent?AgentID",
        abstract: true,
        templateUrl: "views/Agents/agentPortal.html",
        controller: "AgentsCtrl"
      })
      .state("app.Agents.Agent.Overview", {
        url: "",
        templateUrl: "views/Agents/Partials/PortalOverview.html"
      })
      .state("app.Agents.Agent.History", {
        url: "/History",
        templateUrl: "views/Agents/Partials/PortalHistory.html",
        controller: "AgentsCtrl"
      })
      .state("app.Reporting", {
        url: "/Reporting",
        templateUrl: "views/Reporting/index.html",
        controller: "ReportCtrl"
      })
      .state("app.Reporting.Dashboard", {
        url: "/Reporting/Dashboard",
        templateUrl: "views/Reporting/Dashboard.html"
      })
      .state("app.Reporting.ColorTest", {
        url: "/Reporting/ColorTest",
        templateUrl: "views/Reporting/Color_Test.html"
      })
      .state("app.Reporting.PopTest", {
        url: "/Reporting/PopTest",
        templateUrl: "views/Reporting/Pop_Test.html"
      })
      .state("app.Style", {
        url: "/Style",
        templateUrl: "views/Style/index.html",
        controller: "StyleCtrl"
      })
      .state("app.Style.Guide", {
        url: "/Style/Guide",
        templateUrl: "views/Style/guide.html"
      })
      .state("app.Email", {
        url: "/Email",
        templateUrl: "views/Email/index.html"
      })
      .state("app.Email.Dashboard", {
        url: "/Email/Dashboard",
        templateUrl: "views/Email/dashboard.html"
      })
      .state("app.Email.People", {
        url: "/Email/Dashboard",
        templateUrl: "views/Email/people.html",
        controller: "EmailPeopleCtrl"
      });
  });
