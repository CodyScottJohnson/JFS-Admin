'use strict';

/**
 * @ngdoc service
 * @name JFS_Admin.recruit
 * @description
 * # recruit
 * Factory in the JFS_Admin.
 */
angular.module('JFS_Admin')
  .factory('recruit', function($rootScope, $http,$filter) {
    var currentRecruit = {
      data: {
        popInfo: {}
      }
    };
    currentRecruit.setRecruit = function(id) {
      $http({
        method: 'GET',
        url: 'https://jfsapp.com/Secure/API/Recruit/' + id + '/',
        params: {
          'access_token': $rootScope.currentUser.Token.access_token,
          client_id: 'testclient',
          client_secret: 'testpass'
        },
      }).then(function(data) {
        //console.log(data.data);
        currentRecruit.data.currentRecruit = data.data;
        currentRecruit.getConversationHistory();
      }, function(error) {
        console.log(error);
      });
    };
    currentRecruit.getConversationHistory = function() {
      $http({
        method: 'GET',
        url: 'https://jfsapp.com/Secure/API/Recruits/' + currentRecruit.data.currentRecruit.INDV_ID + '/sms/',
        params: {
          access_token: $rootScope.currentUser.Token.access_token,
          client_id: 'testclient',
          client_secret: 'testpass'
        },
      }).then(function(data) {
        currentRecruit.data.currentRecruit.texts = data.data;
      }, function(error) {});
    };
    currentRecruit.save = function() {
      $http({
        method: 'PATCH',
        url: 'https://jfsapp.com/Secure/API/v2/Recruits/' + currentRecruit.data.currentRecruit.INDV_ID + '/',
        params: {
          'access_token': $rootScope.currentUser.Token.access_token,
          client_id: 'testclient',
          client_secret: 'testpass'
        },
        data: currentRecruit.data.currentRecruit
      }).then(function(data) {
        //console.log(data.data);
        //currentRecruit.data.currentRecruit = data.data;
      }, function(error) {
        console.log(error);
      });
    };
    currentRecruit.popSent = function() {
      if (!angular.isDefined(currentRecruit.data.currentRecruit.Info.PopStatus)) {
        currentRecruit.data.currentRecruit.Info.PopStatus = {
          Pops: [],
          TotalSent: 0
        };
      }
      currentRecruit.data.currentRecruit.Info.PopStatus.TotalSent++;
      currentRecruit.data.currentRecruit.Info.PopStatus.LastSent = moment.utc().format();
      currentRecruit.data.currentRecruit.POP_Status = 'Test Sent';
      currentRecruit.save();

    };
    currentRecruit.updateToDo = function() {
      var NextStep = $filter('filter')(currentRecruit.data.currentRecruit.Info.Task, {
        completed: 'false'
      })[0];
      console.log(NextStep);
      var scheduled;
      if (angular.isUndefined(NextStep.scheduled)) {
        scheduled = null;
      } else {
        scheduled = NextStep.scheduled;
      }
      currentRecruit.data.currentRecruit.NextStep = NextStep.title;
      currentRecruit.data.currentRecruit.NextStepScheduled = scheduled;
      currentRecruit.save();
    };
    return currentRecruit;
  });
