'use strict';

/**
 * @ngdoc service
 * @name JFS_Admin.recruit
 * @description
 * # recruit
 * Factory in the JFS_Admin.
 */
angular.module('JFS_Admin')
  .factory('recruit', function ($rootScope,$http) {
    var currentRecruit = {data:{}};
    currentRecruit.setRecruit = function(id){
      $http({
          method: 'GET',
          url: 'https://jfsapp.com/Secure/API/Recruit/'+id+'/',
          params: {
              'access_token': $rootScope.currentUser.Token.access_token,
              client_id: 'testclient',
              client_secret: 'testpass'
          },
      }).then(function(data) {
          //console.log(data.data);
          currentRecruit.data.currentRecruit = data.data;
      }, function(error) {
          console.log(error);
      });
    };

    return currentRecruit;
  });
