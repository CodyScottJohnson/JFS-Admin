'use strict';

/**
 * @ngdoc function
 * @name JFS_AgentPortal.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the JFS_AgentPortal
 */
angular.module('JFS_Admin')
  .controller('LoginCtrl', function($scope, $http,$rootScope,$state,$cookies, $window, localStorageService, ENV) {
    $scope.User = {};
    $scope.login = function(username, password) {
      $http({
        method: 'POST',
        url: ENV.Oauth + 'getToken/',
        data: {
          grant_type: 'password',
          client_id: ENV.APP_ID,
          client_secret: ENV.APP_Secret,
          username: username,
          password: password
        }
      }).then(function(data) {
        // Store your data or what ever....
        // Then resolve
        var Token = data.data;
        $http({
                method: 'GET',
                url: ENV.API +'User/',
                params: {
                    'access_token': Token.access_token,
                    client_id: ENV.APP_ID,
                    client_secret: ENV.APP_Secret

                },
            }).then(function(data) {
                  var state = $rootScope.state || 'app.Home';
                  if(state.name===""){
                    state = 'app.Home';
                  }
                  $scope.User.Info= data.data;
                  $scope.User.Token= Token;
                  $rootScope.currentUser =$scope.User;
                  //$cookies.putObject('user',$scope.User,{"expires":moment().add(24,'hours').format(),secure:false});
                  console.log($scope.User.Info.PermissionLevel);
                  localStorageService.cookie.set('user', $scope.User,1);
                  if($rootScope.currentUser.Info.PermissionLevel == 3){
                    $window.location.href ='https://jfsapp.com/Admin/Portal/Agent/#/';
                  }
                  else{
                    if(angular.isDefined($rootScope.LastLocation)){
                      var lastLocation = $rootScope.LastLocation;
                      delete $rootScope.LastLocation;
                      location.href = lastLocation;
                    }
                    else{
                      $state.go(state);
                    }
                  }
            }, function(error) {

            });

      }, function(data, status, headers, config) {

      });
    };

  });
