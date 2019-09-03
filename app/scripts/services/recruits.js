'use strict';

/**
 * @ngdoc service
 * @name JFS_Admin.Recruits
 * @description
 * # Recruits
 * Factory in the JFS_Admin.
 */
angular.module('JFS_Admin')
  .factory('Recruits', function($q, $http, $rootScope, recruit,Functions, ENV) {
    var Recruits = {
      data: {
        settings:{
          stages:[]
        }
      }
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
        url: ENV.API + 'v2/Recruits/',
        params: {
          'access_token': $rootScope.currentUser.Token.access_token,
          client_id: 'testclient',
          client_secret: 'testpass'

        },
      }).then(function(data) {
        //console.log(data.data);
        Recruits.data.List = data.data;
        _.forEach(Recruits.data.List, function(recruit){
                      recruit.NextStepScheduled = moment(recruit.NextStepScheduled).toDate();
                      recruit.NextStepUpdated = moment(recruit.NextStepUpdated).format('Y-MM-D');
                    });
        deferred.resolve(data.data);
      }, function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };
    Recruits.getStages = function() {
      var deferred = $q.defer();
      $http({
        method: 'Get',
        url: ENV.API + 'v2/Recruits/Settings/Stages',
        params: {
          access_token: $rootScope.currentUser.Token.access_token,
          client_id: 'testclient',
          client_secret: 'testpass'
        },
      }).then(function(data) {
        Recruits.data.settings.stages = data.data;
        
        deferred.resolve(data.data);
      },function(){
        deferred.reject("Couldn't Load Global Settings");
      });
      return deferred.promise;
    };
    Recruits.addRecruit = function() {
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: ENV.API + 'Recruits/',
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
        url: ENV.API + 'v2/Recruits/' + recruit.INDV_ID + '/',
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
    Recruits.deleteRecruit = function(ID) {
       var index =  _.findIndex(Recruits.data.List, function(o) { return o.INDV_ID == ID; });
       $http({
         method: 'DELETE',
         url: ENV.API + 'v2/Recruits/' + ID + '/',
         params: {
           'access_token': $rootScope.currentUser.Token.access_token,
           client_id: 'testclient',
           client_secret: 'testpass'
         }
       }).then(function(data){
         Recruits.data.List.splice(index,1);
       });
    };
    Recruits.addTag = function(recruit,tagID){
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: ENV.API + 'v2/Recruits/'+recruit.INDV_ID+'/Tag/'+tagID,
        params: {
          'access_token': $rootScope.currentUser.Token.access_token,
          client_id: 'testclient',
          client_secret: 'testpass'
        },
      }).then(function(data){
        var message = {
								type: 'recruit',
                event: 'recruitupdated',
                data: recruit,
                AlertMessage: $rootScope.currentUser.Info.display_name + ' Edited ' + recruit.FNAME + ' ' + recruit.LNAME
            };
        Functions.SendSocket(angular.toJson(message));
        deferred.resolve(data.data);
      }, function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };
    Recruits.deleteTag = function(recruit,tagID) {
      var deferred = $q.defer();
       $http({
         method: 'DELETE',
         url: ENV.API + 'v2/Recruits/'+recruit.INDV_ID+'/Tag/'+tagID,
         params: {
           'access_token': $rootScope.currentUser.Token.access_token,
           client_id: 'testclient',
           client_secret: 'testpass'
         }
       }).then(function(data){
         deferred.resolve(data.data);
       }, function(error) {
         deferred.reject(error);
       });
       return deferred.promise;
    };
    Recruits.updateRecruits();
    Recruits.getStages();

    return Recruits;
  });
