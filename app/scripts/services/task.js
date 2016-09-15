'use strict';

/**
 * @ngdoc service
 * @name JFS_Admin.Task
 * @description
 * # Task
 * Factory in the JFS_Admin.
 */
angular.module('JFS_Admin')
  .factory('Task', function($rootScope,$http,$q,Functions) {
    var Task = {data:{}};
    Task.getUsersTasks = function(detail) {
        detail = typeof detail !== 'undefined' ? detail : false;
        var deferred = $q.defer();
            $http({
                method: 'GET',
                url: 'https://jfsapp.com/Secure/API/User/Assigned/',
                params: {
                    'access_token': $rootScope.currentUser.Token.access_token,
                    client_id: 'testclient',
                    client_secret: 'testpass',
                    detail: detail
                },
            }).then(function(data) {
                //console.log(data.data);
                Task.data.currentUsersTasks = data.data;
                deferred.resolve(data.data);
            }, function(error) {
                deferred.reject(error);
            });
        return deferred.promise;
    };
    Task.getAllTasks = function(detail) {
        detail = typeof detail !== 'undefined' ? detail : false;
        var deferred = $q.defer();
            $http({
                method: 'GET',
                url: 'https://jfsapp.com/Secure/API/Tasks/',
                params: {
                    'access_token': $rootScope.currentUser.Token.access_token,
                    client_id: 'testclient',
                    client_secret: 'testpass',
                    detail: detail
                },
            }).then(function(data) {
                //console.log(data.data);
                Task.data.allTasks = data.data;
                deferred.resolve(data.data);
            }, function(error) {
                deferred.reject(error);
            });
        return deferred.promise;
    };
    Task.getTask = function(taskID){
      var deferred = $q.defer();
          $http({
              method: 'GET',
              url: 'https://jfsapp.com/Secure/API/Task/'+taskID+'/',
              params: {
                  'access_token': $rootScope.currentUser.Token.access_token,
                  client_id: 'testclient',
                  client_secret: 'testpass'
              },
          }).then(function(data) {
              //console.log(data.data);
              data.data[0].Due_Date = Functions.SQLDate(data.data[0].Due_Date);
              data.data[0].Created_Date = Functions.SQLDate(data.data[0].Created_Date);
              data.data[0].Reminder_Date = Functions.SQLDate(data.data[0].Reminder_Date);
              Task.data.currentTask = data.data[0];
              deferred.resolve(data.data[0]);
          }, function(error) {
              deferred.reject(error);
          });
      return deferred.promise;
    };
    Task.updateTask = function(task) {
      $http({
        method: 'PATCH',
        url: 'https://jfsapp.com/Secure/API/Task/',
        params: {
          'access_token': $rootScope.currentUser.Token.access_token,
          client_id: 'testclient',
          client_secret: 'testpass'
        },
        data: task
      }).then(function(data){
        Task.getUsersTasks();
        Task.getTask(task.Task_ID);
        Task.getAllTasks(task.Task_ID);
      });
    };
    Task.newTask = function(task) {
      task.AssignedBy_ID = $rootScope.currentUser.Info.id;
      $http({
        method: 'POST',
        url: 'https://jfsapp.com/Secure/API/Task/',
        params: {
          'access_token': $rootScope.currentUser.Token.access_token,
          client_id: 'testclient',
          client_secret: 'testpass'
        },
        data: task
      }).then(function(data){
        console.log(data);
        Task.getTask(data.data.Task_ID);

      });
    };
    Task.init = function(){
      Task.getUsersTasks();
    };
    Task.init();
    return Task;
  });
