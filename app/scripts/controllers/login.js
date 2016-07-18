'use strict';

/**
 * @ngdoc function
 * @name JFS_AgentPortal.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the JFS_AgentPortal
 */
angular.module('JFS_Admin')
  .controller('LoginCtrl', function($scope, $http,$rootScope,$state,$cookies) {
    $scope.User = {};
    $scope.login = function(username, password) {
      $http({
        method: 'POST',
        url: 'https://jfsapp.com/Secure/OAUTH/getToken/',
        data: {
          grant_type: 'password',
          client_id: 'testclient',
          client_secret: 'testpass',
          username: username,
          password: password
        }
      }).then(function(data) {
        // Store your data or what ever....
        // Then resolve
        var Token = data.data;
        $http({
                method: 'GET',
                url: 'https://jfsapp.com/Secure/API/User/',
                params: {
                    'access_token': Token.access_token,
                    client_id: 'testclient',
                    client_secret: 'testpass'

                },
            }).then(function(data) {
                  $scope.User.Info= data.data;
                  $scope.User.Token= Token;
                  $rootScope.currentUser =$scope.User;
                  $cookies.putObject('user',$scope.User,{"expires":moment().add(1,'hours').format(),secure:false});
                  $state.go('app.Home');
            }, function(error) {

            });

      }, function(data, status, headers, config) {

      });
    };

  });
