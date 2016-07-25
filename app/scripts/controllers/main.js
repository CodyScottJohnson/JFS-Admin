'use strict';

/**
 * @ngdoc function
 * @name jfsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the jfsApp
 */
angular.module('JFS_Admin')
  .controller('MainCtrl', function($scope, $state, User, recruit, Functions, Task, $filter, Socket,Dropbox) {
    $scope.Functions = Functions;
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
    $scope.ViewTask = function(taskID) {
      Task.getTask(taskID);
      Functions.OpenModal('views/Modals/TaskModal.html', 'md');
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
    recruit.setRecruit(10336);
  });
