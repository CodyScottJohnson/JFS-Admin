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
    Task.Socket = function(data) {
      if (data.event === 'taskupdated') {
        if(data.for_id ==$rootScope.currentUser.Info.id){
          Task.getUsersTasks();
          Task.getTask(data.data.Task_ID);
        }
        Task.getAllTasks();


      }
    };
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
    Task.getRecruitTasks = function(RecruitID) {
        var deferred = $q.defer();
            $http({
                method: 'GET',
                url: 'https://jfsapp.com/Secure/API/Task/Recruit/'+RecruitID+'/',
                params: {
                    'access_token': $rootScope.currentUser.Token.access_token,
                    client_id: 'testclient',
                    client_secret: 'testpass'
                },
            }).then(function(data) {
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
              console.log(data.data[0]);
              data.data[0].Due_Date = Functions.SQLDate(data.data[0].Due_Date);
              data.data[0].Created_Date = Functions.SQLDate(data.data[0].Created_Date);
              data.data[0].Reminder_Date = Functions.SQLDate(data.data[0].Reminder_Date);
              if(!angular.isDefined(data.data[0].More_Detail) || data.data[0].More_Detail===null){
                data.data[0].More_Detail = {Comments:[]};
              }
              console.log(data.data[0]);
              Task.data.currentTask = data.data[0];
              deferred.resolve(data.data[0]);
          }, function(error) {
              deferred.reject(error);
          });
      return deferred.promise;
    };
    Task.updateTask = function(task,notify) {
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
        var message = {
								type: 'task',
                event: 'taskupdated',
                for_id: task.User_ID,
                data: task,
                          };
        if(notify){
        message.browsernotification={Title:$rootScope.currentUser.Info.display_name,
                             Body:'has assigned a new task to you',
                             Icon:'https://jfsapp.com/Images/ProfilePhotos/'+$rootScope.currentUser.Info.display_photo
                           };
        }
        Functions.SendSocket(angular.toJson(message));
        Task.getUsersTasks(true);
        Task.getTask(task.Task_ID);
        Task.getAllTasks(task.Task_ID);
      });
    };
    Task.newTask = function(task) {
      var deferred = $q.defer();
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
        Task.getTask(data.data.Task_ID);
        deferred.resolve(data.data[0]);
      });
      return deferred.promise;
    };
    Task.init = function(){
      Task.getUsersTasks();
    };
    Task.init();
    return Task;
  });
