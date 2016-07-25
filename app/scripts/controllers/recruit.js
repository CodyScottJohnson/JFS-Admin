'use strict';

/**
 * @ngdoc function
 * @name JFS_Admin.controller:RecruitCtrl
 * @description
 * # RecruitCtrl
 * Controller of the JFS_Admin
 */
angular.module('JFS_Admin')
  .controller('RecruitCtrl', function ($scope,Task,Recruits,recruit) {
    $scope.Task =Task.data;
    $scope.Recruit = recruit.data;
    $scope.options2 = {
        segmentStrokeWidth: 1
    };
    $scope.colors2 = ['#97BBCD', '#DCDCDC', '#F7464A', '#FDB45C'];
    $scope.labels2 = ['', '', '', ''];
    recruit.setRecruit(10336);
  });
