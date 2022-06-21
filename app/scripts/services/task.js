'use strict';

/**
 * @ngdoc service
 * @name JFS_Admin.Task
 * @description
 * # Task
 * Factory in the JFS_Admin.
 */
angular.module('JFS_Admin')
  .factory('Task', function($rootScope,$http,$q,Functions, ENV) {
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
                url: ENV.API_v2 +'User/Assigned/',
                params: {
                    'access_token': $rootScope.currentUser.Token.access_token,
                    client_id: 'testclient',
                    client_secret: 'testpass',
                    detail: detail
                },
            }).then(function(result) {
                //console.log(data.data);
                Task.data.currentUsersTasks = result.data.data;
                var array = _.countBy(Task.data.currentUsersTasks, function(t){
                    return t.Group;
                });
                Task.data.currentUsersTaskGroups = {GroupList:array};
                deferred.resolve(result.data.data);
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
                url: ENV.API_v2 +'Tasks/',
                params: {
                    'access_token': $rootScope.currentUser.Token.access_token,
                    client_id: 'testclient',
                    client_secret: 'testpass',
                    detail: detail
                },
            }).then(function(result) {
                //console.log(data.data);
                Task.data.allTasks = result.data.data;
                deferred.resolve(result.data.data);
            }, function(error) {
                deferred.reject(error);
            });
        return deferred.promise;
    };
    Task.getRecruitTasks = function(RecruitID) {
        var deferred = $q.defer();
            $http({
                method: 'GET',
                url: ENV.API_v2 +'Tasks/Recruit/'+RecruitID+'/',
                params: {
                    'access_token': $rootScope.currentUser.Token.access_token,
                    client_id: 'testclient',
                    client_secret: 'testpass'
                },
            }).then(function(result) {
                deferred.resolve(result.data.data);
            }, function(error) {
                deferred.reject(error);
            });
        return deferred.promise;
    };
    Task.getTask = function(taskID){
      var deferred = $q.defer();
          $http({
              method: 'GET',
              url: ENV.API_v2 +'Tasks/'+taskID+'/',
              params: {
                  'access_token': $rootScope.currentUser.Token.access_token,
                  client_id: 'testclient',
                  client_secret: 'testpass'
              },
          }).then(function(result) {
   
            result.data.data[0].Due_Date = Functions.SQLDate(result.data.data[0].Due_Date);
            result.data.data[0].Created_Date = Functions.SQLDate(result.data.data[0].Created_Date);
            result.data.data[0].Reminder_Date = Functions.SQLDate(result.data.data[0].Reminder_Date);
              if(!angular.isDefined(result.data.data[0].More_Detail) || result.data.data[0].More_Detail===null){
                result.data.data[0].More_Detail = {Comments:[]};
              }

              Task.data.currentTask = result.data.data[0];
              deferred.resolve(result.data.data[0]);
          }, function(error) {
              deferred.reject(error);
          });
      return deferred.promise;
    };
    Task.updateTask = function(task,notify) {
      $http({
        method: 'PATCH',
        url: ENV.API + 'Task/',
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
        url: ENV.API +'Task/',
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
