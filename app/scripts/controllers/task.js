'use strict';

/**
 * @ngdoc function
 * @name JFS_Admin.controller:TaskCtrl
 * @description
 * # TaskCtrl
 * Controller of the JFS_Admin
 */
angular.module('JFS_Admin')
  .controller('TaskCtrl', function ($rootScope,$scope,User,Functions,Task, $sce) {
    $scope.ExpandedView ={};
    $scope.sort = function(keyname) {
       $scope.sortKey = keyname; //set the sortKey to the param passed
       $scope.reverse = !$scope.reverse; //if true make it false and vice versa
     }
    $scope.User = User.data;
    $scope.Tasks = Task.data;
    $scope.comments=[];
    $scope.addComment = function(text) {
        var date = new Date();
        ////console.log(date);
        var comment = {
            text: text,
            date: date,
            User_ID: $rootScope.currentUser.Info.user_id,
            photo: $rootScope.currentUser.Info.display_photo,
            User: $rootScope.currentUser.Info.display_name
        }
        $scope.comments.push(comment);
        $scope.text='';
    }
    Task.getAllTasks();
    $scope.updateTask = function(task){
      Task.updateTask(task);
    };
    $scope.to_trusted = function(html_code) {
        return $sce.trustAsHtml(html_code);
    };
    $scope.showTask = function(task) {
     $scope.ExpandedView.show = true;
     Task.getTask(task.Task_ID);
 }
  });
