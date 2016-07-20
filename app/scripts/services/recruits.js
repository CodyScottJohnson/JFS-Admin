'use strict';

/**
 * @ngdoc service
 * @name JFS_Admin.Recruits
 * @description
 * # Recruits
 * Factory in the JFS_Admin.
 */
angular.module('JFS_Admin')
  .factory('Recruits', function($q, $http, $rootScope, recruit) {
    var Recruits = {
      data: {}
    };
    Recruits.Socket = function(data) {
      if (data.event === 'recruitupdated') {
        var index = _.findIndex(Recruits.data.List, {
          'INDV_ID': data.data.ID
        });
        Recruits.data.List[index] = data.data;
        Recruits.updateRecruits();
        if (recruit.data.info.INDV_ID == data.data.ID) {
          recruit.setRecruit(data.data.ID);
        }
      }
    };
    Recruits.updateRecruits = function() {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: 'https://jfsapp.com/Secure/API/Recruits/',
        params: {
          'access_token': $rootScope.currentUser.Token.access_token,
          client_id: 'testclient',
          client_secret: 'testpass'

        },
      }).then(function(data) {
        //console.log(data.data);
        Recruits.data.List = data.data;
        deferred.resolve(data.data);
      }, function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };
    Recruits.updateRecruits();

    return Recruits;
  });
