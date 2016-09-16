'use strict';

/**
 * @ngdoc function
 * @name JFS_Admin.controller:AgentsCtrl
 * @description
 * # AgentsCtrl
 * Controller of the JFS_Admin
 */
angular.module('JFS_Admin')
  .controller('AgentsCtrl', function ($scope,Agents) {
    $scope.Agents = [];
    Agents.getAgents().then(function(data){$scope.Agents = data;});
  });
