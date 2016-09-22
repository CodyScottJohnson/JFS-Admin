'use strict';

/**
 * @ngdoc function
 * @name JFS_Admin.controller:PrioritynotificationsCtrl
 * @description
 * # PrioritynotificationsCtrl
 * Controller of the JFS_Admin
 */
angular.module('JFS_Admin')
  .controller('PrioritynotificationsCtrl', function ($scope,Notifications) {
    $scope.Notifications = Notifications.data;
    $scope.PostPone= function(data){
      var index =  _.findIndex($scope.Notifications.Priority, function(o) { return o.ImportantNotifications_ID == data.ImportantNotifications_ID; });
      $scope.Notifications.Priority.splice(index,1);
      if($scope.Notifications.Priority.length===0){
        $scope.CloseModal();
      }
    };
  });
