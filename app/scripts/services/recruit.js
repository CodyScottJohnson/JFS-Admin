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
    var currentRecruit = {data:{popInfo:{}}};
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
    currentRecruit.save = function(){
      $http({
          method: 'PATCH',
          url: 'https://jfsapp.com/Secure/API/v2/Recruits/'+  currentRecruit.data.currentRecruit.INDV_ID+'/',
          params: {
              'access_token': $rootScope.currentUser.Token.access_token,
              client_id: 'testclient',
              client_secret: 'testpass'
          },
          data:currentRecruit.data.currentRecruit
      }).then(function(data) {
          //console.log(data.data);
          //currentRecruit.data.currentRecruit = data.data;
      }, function(error) {
          console.log(error);
      });
    }
    currentRecruit.popSent =function(){
      if(!angular.isDefined(currentRecruit.data.currentRecruit.Info.PopStatus)){
        currentRecruit.data.currentRecruit.Info.PopStatus = {Pops:[],TotalSent:0};
      }
      currentRecruit.data.currentRecruit.Info.PopStatus.TotalSent++;
      currentRecruit.data.currentRecruit.Info.PopStatus.LastSent = moment.utc().format();
      currentRecruit.data.currentRecruit.POP_Status='Test Sent';
      currentRecruit.save()

    }

    return currentRecruit;
  });
