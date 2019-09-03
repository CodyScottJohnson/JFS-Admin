'use strict';



/**
 * @ngdoc function
 * @name JFS_Admin.controller:AgentsEnternumbersCtrl
 * @description
 * # AgentsEnternumbersCtrl
 * Controller of the JFS_Admin
 */
angular.module('JFS_Admin')
  .controller('AgentsEnternumbersCtrl', function ($scope, hotRegisterer, Agents,Functions) {
    $scope.AgentsData = Agents.data;
    $scope.changedRows = new Set();
    $scope.afterInit = function (data) {
      setTimeout(function () {
        this.htable = hotRegisterer.getInstance('my-handsontable')
        console.log(this.htable)
        this.htable.selectCell($scope.AgentsData.SalesNumbers.length - 300, 0)
      }, 100)
    };
    $scope.afterChange = function (data, event) {

      if (event == "edit" || event == "autofill" || event == "paste") {
        data.forEach(function (change) {
          if(change[2] != change[3]){
            $scope.changedRows.add(change[0])
          }
          //console.log(Agents.data.SalesNumbers[data[0][0]]);
        });
      }
    };
    $scope.validAgent = function(value, callback){
      var valid = _.some(Agents.data.AgentList, function(o) { return o.LastName + ', '+ o.FirstName == value; });
      if(value =="" || value == null){
        valid = true;
      }
      callback(valid);
    }
    $scope.changesMade =function(){
      if( $scope.changedRows.size > 0){
        return true;
      }
      return false;
    }
    $scope.saveChanges = function(){
      this.htable = hotRegisterer.getInstance('my-handsontable')
      this.htable.validateCells(function(valid){
        if(valid){
          $scope.changedRows.forEach(function(row){
            var agent = Agents.data.SalesNumbers[row]
            var index = _.findIndex(Agents.data.AgentList, function(o) { return o.LastName + ', '+ o.FirstName == agent.AgentName });
            console.log(index)
            agent.Agent_ID = Agents.data.AgentList[index].Agent_ID
            Agents.saveAgents_SalesNumbers(agent).then(function(data){
              $scope.changedRows.delete(row) 
            },function(error){
              Functions.Toast('error',"Unable to Save",error);
            })
            
          });
        }
        else{
          Functions.Toast('error',"Unable to Save","There are invalid values in some cells");
        }
      })
    }
  });  //Controller
