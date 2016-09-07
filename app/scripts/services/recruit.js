'use strict';

/**
 * @ngdoc service
 * @name JFS_Admin.recruit
 * @description
 * # recruit
 * Factory in the JFS_Admin.
 */
angular.module('JFS_Admin')
  .factory('recruit', function($rootScope, $http, $filter, UUID, Functions, User) {
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
    currentRecruit.popRecieved = function() {
      currentRecruit.data.currentRecruit.Info.PopStatus.TestCompleted = moment.utc().format();
      currentRecruit.data.currentRecruit.POP_Status = 'Test Completed';
      currentRecruit.save();
    };
    currentRecruit.sendColor = function() {
      console.log(_.omit(currentRecruit.data.currentRecruit,'Info'));
      var testdata = {
        Recruit_ID: currentRecruit.data.currentRecruit.INDV_ID,
        Test_Token: UUID.newuuid(),
        User_ID: $rootScope.currentUser.Info.id,
        Date_Assigned: new Date()
      };
      var formData = {
        to: {fname:currentRecruit.data.currentRecruit.FNAME,email:currentRecruit.data.currentRecruit.EMAIL},
        from: $rootScope.currentUser.Info,
        subject: 'Color Test',
        Test_Token: testdata.Test_Token
      };
      var postData = 'datas=' + JSON.stringify(formData);
      $http({
        method: 'post',
        url: 'https://jfsapp.com/Secure/API/assignColorQuiz/',
        params: {
          'access_token': $rootScope.currentUser.Token.access_token,
          client_id: 'testclient',
          client_secret: 'testpass'
        },
        data: testdata
      }).then(function(data) {
        $http({
          method: 'post',
          url: 'https://jfsapp.com/Secure/API/sendColorTestEmail/',
          params: {
            'access_token': $rootScope.currentUser.Token.access_token,
            client_id: 'testclient',
            client_secret: 'testpass'
          },
          data: formData
        }).then(function(data) {
          var message = currentRecruit.data.currentRecruit.FNAME + ",\n This is Scott Johnson it was great talking with you. I've emailed you the color test we talked about. If you don't see it please check your spam folder";
          User.sendText(message, currentRecruit.data.currentRecruit.BUS_PH_NBR);
          Functions.Toast('', '', 'Color Test Sent');
          if (!angular.isDefined(currentRecruit.data.currentRecruit.Info.ColorStatus)) {
            currentRecruit.data.currentRecruit.Info.ColorStatus = {
              ColorTests: [],
              TotalSent: 0
            };
          }
          var newTest = {
            DateSent:moment.utc().format(),
            url:"https://www.JFSApp.com/ColorQuiz/dist/#/"+testdata.Test_Token
          };
          currentRecruit.data.currentRecruit.Info.ColorStatus.ColorTests.push(newTest);
          currentRecruit.data.currentRecruit.Info.ColorStatus.TotalSent++;
          currentRecruit.data.currentRecruit.Info.ColorStatus.LastSent = moment.utc().format();
          currentRecruit.data.currentRecruit.Color_Status = 'Test Sent';
          currentRecruit.save();
        });
      });
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
