'use strict';

/**
 * @ngdoc service
 * @name JFS_Admin.Agents
 * @description
 * # Agents
 * Factory in the JFS_Admin.
 */
angular.module('JFS_Admin')
  .factory('Agents', function ($rootScope,$q,$http) {
    var Agents = {};
    Agents.getAgents = function(){
      var deferred = $q.defer();

         $http({
             method: 'GET',
             url: 'https://jfsapp.com/Secure/API/Agents/',
             params: {
                 'access_token': $rootScope.currentUser.Token.access_token,
                 client_id: 'testclient',
                 client_secret: 'testpass'

             },
         }).then(function(data) {
             //console.log(data.data);
             deferred.resolve(data.data);
         }, function(error) {
             deferred.reject(error);
         });
     return deferred.promise;
   };

    return Agents;
  });
