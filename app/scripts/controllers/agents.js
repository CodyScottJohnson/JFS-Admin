'use strict';

/**
 * @ngdoc function
 * @name JFS_Admin.controller:AgentsCtrl
 * @description
 * # AgentsCtrl
 * Controller of the JFS_Admin
 */
angular.module('JFS_Admin')
  .controller('AgentsCtrl', function ($scope,Agents, User, $state,$location) {
    if(angular.isDefined($location.search().AgentID))
    {
      Agents.viewAgent($location.search().AgentID);
    }
    $scope.Agents = Agents.data;
    Agents.getAgents();
    $scope.viewAgent = function(Agent_ID){
      Agents.viewAgent(Agent_ID)
      $state.go('app.Agents.Agent', {AgentID:Agent_ID});
    };
    $scope.agentListOptions = [
      ['Reset Password', function($itemScope){
      },false],
      ['Delete', function($itemScope){
        //console.log($itemScope)
        Agents.deleteAgent($itemScope.agent);
      },false],
    ];
    $scope.updateAgent =function(agent){
      Agents.setAgent(agent);
    };
    $scope.addNewAgent = function(agent){
      Agents.setAgent(agent).then(function(data){$scope.newagent ={};});

    };
    $scope.deleteAgent =function(agent){
      Agents.deleteAgent(agent);
    };
    $scope.toggleAgent = function(agent){
      console.log(agent);
      if(agent.Active === true){
        User.removeUser(agent.User_ID).then(function(data){
          agent.Active = false;
          agent.User_ID = null;
          Agents.setAgent(agent);
        });
        //agent.Active = false;
      }
      else if(agent.Active === false){
        var newUser = {
          firstname:agent.FirstName,
          lastname:agent.LastName,
          email:agent.Email,
          user_name:agent.FirstName+'.'+agent.LastName
        };
        User.AddUser(newUser).then(function(data){
          agent.User_ID = data.User_ID;
          Agents.setAgent(agent);
          agent.Active = true;
        });
      }
    };
  });
