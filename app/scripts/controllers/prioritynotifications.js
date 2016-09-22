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
  });
