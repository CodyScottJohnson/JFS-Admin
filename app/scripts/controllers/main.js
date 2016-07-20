'use strict';

/**
 * @ngdoc function
 * @name jfsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the jfsApp
 */
angular.module('JFS_Admin')
  .controller('MainCtrl', function ($scope,User,recruit,Functions,$filter) {
    $scope.newestText = function(arr) {
      return $filter('min')
      ($filter('map')(arr, 'date_recieved'));
    };
    $scope.Visibility= {sidebar:true};
    $scope.User= User;
    $scope.UserData = User.data;
    recruit.setRecruit(10336);
  });
