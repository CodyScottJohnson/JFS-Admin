'use strict';

/**
 * @ngdoc service
 * @name JFS_Admin.Recruits
 * @description
 * # Recruits
 * Factory in the JFS_Admin.
 */
angular.module('JFS_Admin')
  .factory('Recruits', function($q, $http, $rootScope, recruit,Functions) {
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
        Functions.Toast('info',data.AlertTitle,data.AlertMessage);
        if (angular.isDefined(recruit.data.currentRecruit) && recruit.data.currentRecruit.INDV_ID == data.data.INDV_ID) {
          recruit.setRecruit(data.data.INDV_ID);
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
    Recruits.addRecruit = function() {
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: 'https://jfsapp.com/Secure/API/Recruits/',
        params: {
          'access_token': $rootScope.currentUser.Token.access_token,
          client_id: 'testclient',
          client_secret: 'testpass'
        },
        data:{}

      }).then(function(data) {
         Recruits.data.List.splice(0, 0, data.data);
        //console.log(data.data);
        //Recruits.data.List = data.data;
        //deferred.resolve(data.data);
      }, function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };
    Recruits.save = function(recruit) {
      $http({
        method: 'PATCH',
        url: 'https://jfsapp.com/Secure/API/v2/Recruits/' + recruit.INDV_ID + '/',
        params: {
          'access_token': $rootScope.currentUser.Token.access_token,
          client_id: 'testclient',
          client_secret: 'testpass'
        },
        data: recruit
      }).then(function(data) {
        var message = {
								type: 'recruit',
                event: 'recruitupdated',
                data: recruit,
                AlertMessage: $rootScope.currentUser.Info.display_name + ' Edited ' + recruit.FNAME + ' ' + recruit.LNAME
            };
        Functions.SendSocket(angular.toJson(message));
      }, function(error) {
        console.log(error);
      });
    };
    Recruits.updateRecruits();

    return Recruits;
  });
