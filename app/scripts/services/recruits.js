"use strict";

/**
 * @ngdoc service
 * @name JFS_Admin.Recruits
 * @description
 * # Recruits
 * Factory in the JFS_Admin.
 */
angular
  .module("JFS_Admin")
  .factory("Recruits", function(
    $q,
    $http,
    $rootScope,
    recruit,
    Functions,
    ENV
  ) {
    var Recruits = {
      data: {
        settings: {
          stages: []
        },
        candidates:{
          stages:{}
        }
      }
    };
    Recruits.Socket = function(data) {
      if (data.event === "recruitupdated") {
        var index = _.findIndex(Recruits.data.List, {
          INDV_ID: data.data.ID
        });

        Recruits.data.List[index] = data.data;
        Recruits.updateRecruits();
        Functions.Toast("info", data.AlertTitle, data.AlertMessage);
        if (
          angular.isDefined(recruit.data.currentRecruit) &&
          recruit.data.currentRecruit.INDV_ID == data.data.INDV_ID
        ) {
          recruit.setRecruit(data.data.INDV_ID);
        }
      }
    };
    Recruits.updateRecruits = function() {
      var deferred = $q.defer();
      $http({
        method: "GET",
        url: ENV.API_v2 + "Recruits/",
        params: {
          access_token: $rootScope.currentUser.Token.access_token,
          client_id: "testclient",
          client_secret: "testpass"
        }
      }).then(
        function(result) {
          //console.log(data.data);
          Recruits.data.List = result.data.data;
          _.forEach(Recruits.data.List, function(recruit) {
            recruit.NextStepScheduled = moment(
              recruit.NextStepScheduled
            ).format('YYYY-MM-DD HH:mm:ss');
            
            if(recruit.NextStepUpdated==null){
              console.log(recruit.NextStepUpdated);
              recruit.NextStepUpdated = moment().format(
                "Y-MM-D"
              );
            } else{
            recruit.NextStepUpdated = moment(recruit.NextStepUpdated).format(
              "Y-MM-D"
            
            );
            }
          });
          Recruits.data.candidates.stages = _.groupBy(
                                                      _.filter(result.data.data,function(value){return value.Archived == 0}),
                                                      function(value){return value.Stage_Name});
          console.log( Recruits.data.candidates.stages)
          deferred.resolve(result.data.data);
        },
        function(error) {
          deferred.reject(error);
        }
      );
      return deferred.promise;
    };
    Recruits.getStages = function() {
      var deferred = $q.defer();
      $http({
        method: "Get",
        url: ENV.API_v2 + "Recruits/Settings/Stages/",
        params: {
          access_token: $rootScope.currentUser.Token.access_token,
          client_id: "testclient",
          client_secret: "testpass"
        }
      }).then(
        function(result) {
          Recruits.data.settings.stages = result.data.data;

          deferred.resolve(result.data.data);
        },
        function() {
          deferred.reject("Couldn't Load Global Settings");
        }
      );
      return deferred.promise;
    };
    Recruits.addRecruit = function() {
      var deferred = $q.defer();
      $http({
        method: "POST",
        url: ENV.API_v2 + "Recruits/",
        params: {
          access_token: $rootScope.currentUser.Token.access_token,
          client_id: "testclient",
          client_secret: "testpass"
        },
        data: {}
      }).then(
        function(result) {
          Recruits.data.List.splice(0, 0, result.data.data);
          //console.log(data.data);
          //Recruits.data.List = data.data;
          //deferred.resolve(data.data);
        },
        function(error) {
          deferred.reject(error);
        }
      );
      return deferred.promise;
    };
    Recruits.save = function(recruit) {
      var deferred = $q.defer();
      $http({
        method: "PATCH",
        url: ENV.API_v2 + "Recruits/" + recruit.INDV_ID + "/",
        params: {
          access_token: $rootScope.currentUser.Token.access_token,
          client_id: "testclient",
          client_secret: "testpass"
        },
        data: recruit
      }).then(
        function(data) {
          var message = {
            type: "recruit",
            event: "recruitupdated",
            data: recruit,
            AlertMessage:
              $rootScope.currentUser.Info.display_name +
              " Edited " +
              recruit.FNAME +
              " " +
              recruit.LNAME
          };
          Functions.SendSocket(angular.toJson(message));
          deferred.resolve(data.data);
        },
        function(error) {
          console.log(error);
          deferred.reject(error);
        }
      );
      return deferred.promise;
    };
    Recruits.deleteRecruit = function(ID) {
      var index = _.findIndex(Recruits.data.List, function(o) {
        return o.INDV_ID == ID;
      });
      $http({
        method: "DELETE",
        url: ENV.API_v2 + "Recruits/" + ID + "/",
        params: {
          access_token: $rootScope.currentUser.Token.access_token,
          client_id: "testclient",
          client_secret: "testpass"
        }
      }).then(function(data) {
        Recruits.data.List.splice(index, 1);
      });
    };
    Recruits.addTag = function(recruit, tagID) {
      var deferred = $q.defer();
      $http({
        method: "POST",
        url: ENV.API_v2 + "Recruits/" + recruit.INDV_ID + "/Tag/" + tagID,
        params: {
          access_token: $rootScope.currentUser.Token.access_token,
          client_id: "testclient",
          client_secret: "testpass"
        }
      }).then(
        function(result) {
          var message = {
            type: "recruit",
            event: "recruitupdated",
            data: recruit,
            AlertMessage:
              $rootScope.currentUser.Info.display_name +
              " Edited " +
              recruit.FNAME +
              " " +
              recruit.LNAME
          };
          Functions.SendSocket(angular.toJson(message));
          deferred.resolve(data.data);
        },
        function(error) {
          deferred.reject(error);
        }
      );
      return deferred.promise;
    };
    Recruits.deleteTag = function(recruit, tagID) {
      var deferred = $q.defer();
      $http({
        method: "DELETE",
        url: ENV.API_v2 + "Recruits/" + recruit.INDV_ID + "/Tag/" + tagID,
        params: {
          access_token: $rootScope.currentUser.Token.access_token,
          client_id: "testclient",
          client_secret: "testpass"
        }
      }).then(
        function(result) {
          deferred.resolve(result.data.data);
        },
        function(error) {
          deferred.reject(error);
        }
      );
      return deferred.promise;
    };
    Recruits.updateRecruits();
    Recruits.getStages();

    return Recruits;
  });
