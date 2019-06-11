'use strict';

/**
 * @ngdoc function
 * @name JFS_Admin.controller:RecruitFollowupCtrl
 * @description
 * # RecruitFollowupCtrl
 * Controller of the JFS_Admin
 */
angular.module('JFS_Admin')
  .controller('RecruitFollowupCtrl', function ($scope,Agents, User, $state,$location,Functions) {
    $scope.Agents = Agents.data;
    $scope.followUp_History = [];
    $scope.NewFollowUp = function(){
      var followUp = {
        Agent_ID:  $scope.Agents.CurrentAgent.Info.Agent_ID,
        date: moment(),
        detail:{}
      };
      $scope.currentFollowUp = followUp;
      $scope.followUp_History.push( $scope.currentFollowUp);
    };
    $scope.setCurrent = function(followup){
      $scope.followUp_History= _.map($scope.followUp_History, function(x) {
        x.selected = false;
        return x;
      });
      followup.selected = true;
     
      $scope.currentFollowUp = followup;
    };
  });
