'use strict';

/**
 * @ngdoc function
 * @name jfsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the jfsApp
 */
angular.module('JFS_Admin')
  .controller('MainCtrl', function($rootScope,$scope, $state, User, recruit, Functions, Task, $filter, Socket,Dropbox,Notifications, Recruits, $sce, $location, $window) {
    //Functions.OpenModal('views/Modals/Email/Client.html','lg');
    //Functions.OpenModal('views/Modals/FileExplorer.html','lg');
    if($rootScope.currentUser.Info.password_reset == 1){
      Functions.OpenModal('views/Modals/User/PasswordReset.html','md');
    }
    $scope.mailTo = function(email){
      $window.open("mailto:"+ email + "?_self");
    };
    $scope.changeProfile = function(){
      Functions.OpenModal('views/Modals/ImageUploadUser.html','md');
    };
    $scope.ViewTask = function(taskID) {
      Task.getTask(taskID);
      Functions.OpenModal('views/Modals/TaskModal.html', 'md');
    };
    if(angular.isDefined($location.search().Task_ID))
    {
      if(angular.isDefined($location.search().Task_Completed) && $location.search().Task_Completed == 1){
        Task.getTask($location.search().Task_ID).then(function(data){
          data.Status = "Completed";
          Task.updateTask(data);
          Functions.OpenModal('views/Modals/TaskCompleted.html', 'sm');
        });
      }
      else{
        $scope.ViewTask($location.search().Task_ID);
      }
      $location.search('Task_ID', null);
      $location.search('Task_Completed', null);
    }
    $scope.Functions = Functions;
    //Functions.OpenModal('views/Modals/User/notes.html','md',null,{windowClass:'notification_modal'});
    $scope.Recruits = Recruits.data;
    $scope.to_trusted = function(html_code) {
        return $sce.trustAsHtml(html_code);
    };
    $scope.viewRecruit =function(ID){
      recruit.setRecruit(ID);
      $state.go('app.Recruiting.Recruit', {RecruitID:ID});
    };
    $scope.newestText = function(arr) {
      return $filter('min')
        ($filter('map')(arr, 'date_recieved'));
    };
    $scope.Visibility = {
      sidebar: true
    };
    $scope.User = User;
    $scope.UserData = User.data;
    $scope.Task = Task.data;
    $scope.ViewMessage = function(messageid) {
      User.setCurrentConversation(messageid);
      $state.go('app.Messages');
    };
    $scope.TaskOptions = [
      ['Mark as Seen', function($itemScope) {
        $itemScope.task.Status = "Started";
        Task.updateTask($itemScope.task);
      }],
      ['Mark as Done', function($itemScope) {
        $itemScope.task.Status = "Completed";
        Task.updateTask($itemScope.task);
      }],
      null, // Dividier
      ['Remove', function($itemScope) {
        $scope.items.splice($itemScope.$index, 1);
      }]
    ];
    $scope.Task_Seen = function(task){
      task.Status = "Started";
      Task.updateTask(task);
    };
    $scope.Task_Completed = function(task){
      task.Status = "Completed";
      Task.updateTask(task);
    };
    $scope.newGenericTask = function(){
      Task.newTask({});
      Functions.OpenModal('views/Modals/TaskModal.html', 'md');
    };
    recruit.setRecruit(10336);
  });
