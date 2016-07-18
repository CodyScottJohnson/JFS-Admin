'use strict';

/**
 * @ngdoc function
 * @name jfsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the jfsApp
 */
angular.module('JFS_Admin')
  .controller('MainCtrl', function ($scope,User,recruit) {
    $scope.Visibility= {sidebar:true}
    $scope.User= User;
    recruit.setRecruit(10336);
  });
