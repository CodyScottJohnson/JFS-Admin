'use strict';



/**
 * @ngdoc function
 * @name JFS_Admin.controller:AgentsEnternumbersCtrl
 * @description
 * # AgentsEnternumbersCtrl
 * Controller of the JFS_Admin
 */
angular.module('JFS_Admin')
  .controller('AgentsEnternumbersCtrl', function ($scope, hotRegisterer,Agents) { 
    $scope.AgentsData = Agents.data;
    $scope.afterInit = function(data) {
      setTimeout( function(){
        this.htable = hotRegisterer.getInstance('my-handsontable')
        console.log(this.htable)
        this.htable.selectCell($scope.AgentsData.SalesNumbers.length-300,0)
    }, 100)
     

    };
  }
  );
