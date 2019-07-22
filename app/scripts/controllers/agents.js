'use strict';

/**
 * @ngdoc function
 * @name JFS_Admin.controller:AgentsCtrl
 * @description
 * # AgentsCtrl
 * Controller of the JFS_Admin
 */
angular.module('JFS_Admin')
  .controller('AgentsCtrl', function ($scope, Agents, User, $state, $location, Functions) {
    if (angular.isDefined($location.search().AgentID)) {
      Agents.viewAgent($location.search().AgentID);
    }
    $scope.Agents = Agents.data;
    Agents.getAgents();
    $scope.print = function(statement){
      console.log(statement);
    }
    $scope.viewAgent = function (Agent_ID) {
      Agents.viewAgent(Agent_ID);
      $state.go('app.Agents.Agent', { AgentID: Agent_ID });
    };
    $scope.newAgent = function (date) {
      if (moment(date).add(9, 'months').isAfter(moment())) {
        return true;
      }
      return false;
    };
    $scope.getColor = function(completed,onTarget){
        if(completed){
          return "#25D366";
        } else if(onTarget){
          return "#379CE7";
        }
        return "#791010";
    };
    $scope.minimumStandardProgress = function (agentNumbers) {
      if (angular.isDefined(agentNumbers)) {
        var condition1 = Math.min(agentNumbers.PC_Units / 50, agentNumbers.Life_Paid_Premium_Ytd / 2000);
        var condition2 = Math.min(agentNumbers.PC_Premium_Ytd / 5000, agentNumbers.Life_Paid_Premium_Ytd / 2000);
        var condition3 = Math.min(agentNumbers.Life_Paid_Premium_Ytd / 15000);
        var progress = Math.max(condition1, condition2, condition3);
        var expectedProgress = (moment().week()) / 52.0;
        return {
          completed: Boolean(progress >= 1),
          onTarget: Boolean(progress >= expectedProgress),
          progress: progress,
          color: $scope.getColor(Boolean(progress >= 1),Boolean(progress >= expectedProgress))
        };
      }
      return {
        completed: false,
        onTarget: false,
        progress: 0.0,
      };
    };
    $scope.enhancedCommissionProgress = function (agentNumbers) {
      if (angular.isDefined(agentNumbers)) {
        var condition1 = Math.min(agentNumbers.PC_Units / 120, agentNumbers.Life_Paid_Premium_Ytd / 15000,agentNumbers.Life_Paid_Cases_Ytd / 25  );
        //var condition2 = Math.min(agentNumbers.PC_Premium_Ytd / 5000, agentNumbers.Life_Paid_Premium_Ytd / 2000);
        var condition3 = Math.min(agentNumbers.Life_Paid_Premium_Ytd / 25000);
        var progress = Math.max(condition1, condition3);
        var expectedProgress = moment().week() / 52.0;
        return {
          completed: Boolean(progress >= 1),
          onTarget: Boolean(progress >= expectedProgress),
          progress: progress,
          color: $scope.getColor(Boolean(progress >= 1),Boolean(progress >= expectedProgress))
        };
      }
      return {
        completed: false,
        onTarget: false,
        progress: 0.0,
      };
    };
    $scope.presidentsClubProgress = function (agentNumbers) {
      if (angular.isDefined(agentNumbers)) {
        var condition1 = Math.min(agentNumbers.PC_Units / 120, agentNumbers.Life_Paid_Premium_Ytd / 15000,agentNumbers.Life_Paid_Cases_Ytd / 25  );
        //var condition2 = Math.min(agentNumbers.PC_Premium_Ytd / 5000, agentNumbers.Life_Paid_Premium_Ytd / 2000);
        var condition3 = Math.min(agentNumbers.Life_Paid_Premium_Ytd / 25000);
        var progress = Math.max(condition1, condition3);
        var expectedProgress = moment().week() / 52.0;
        return {
          completed: Boolean(progress >= 1),
          onTarget: Boolean(progress >= expectedProgress),
          progress: progress,
          color: $scope.getColor(Boolean(progress >= 1),Boolean(progress >= expectedProgress))
        };
      }
      return {
        completed: false,
        onTarget: false,
        progress: 0.0,
      };
    };
    $scope.careerClubProgress = function (agentNumbers) {
      if (angular.isDefined(agentNumbers)) {
        var condition1 = Math.min(agentNumbers.PC_Units / 120, agentNumbers.Life_Paid_Premium_Ytd / 15000,agentNumbers.Life_Paid_Cases_Ytd / 25  );
        //var condition2 = Math.min(agentNumbers.PC_Premium_Ytd / 5000, agentNumbers.Life_Paid_Premium_Ytd / 2000);
        var condition3 = Math.min(agentNumbers.Life_Paid_Premium_Ytd / 25000);
        var progress = Math.max(condition1, condition3);
        var expectedProgress = moment().week() / 52.0;
        return {
          completed: Boolean(progress >= 1),
          onTarget: Boolean(progress >= expectedProgress),
          progress: progress,
          color: $scope.getColor(Boolean(progress >= 1),Boolean(progress >= expectedProgress))
        };
      }
      return {
        completed: false,
        onTarget: false,
        progress: 0.0,
      };
    };
    $scope.agentStatus = function (date) {
      if (moment(date).add(3, 'months').isAfter(moment())) {
        return "Intern";
      } else if (moment(date).add(12, 'months').isAfter(moment())) {
        return "NAPD";
      }
      return "Agent";
    };
    $scope.onTrack = function (target, current) {
      return {
        type: 'danger',
      };
    };

    $scope.isFollowUpSet = function (agent) {
      if (agent && agent.Next_Appointment && moment(agent.Next_Appointment).add(-1, 'days').isBefore(moment())) {
        return true;
      }
      return false;
    };
    $scope.agentListOptions = [
      ['Reset Password', function ($itemScope) {
      }, false],
      ['Delete', function ($itemScope) {
        //console.log($itemScope)
        Agents.deleteAgent($itemScope.agent);
      }, false],
    ];
    $scope.updateAgent = function (agent) {
      Agents.setAgent(agent);
    };
    $scope.addNewAgent = function (agent) {
      Agents.setAgent(agent).then(function (data) { $scope.newagent = {}; });

    };
    $scope.deleteAgent = function (agent) {
      Agents.deleteAgent(agent);
    };
    $scope.toggleAgent = function (agent) {
      Functions.toggleLoading();
      if (agent.Active === true) {
        User.removeUser(agent.User_ID).then(function (data) {
          agent.Active = false;
          agent.User_ID = null;
          Agents.setAgent(agent);
          Functions.toggleLoading();
        }, function (error) {
          Functions.toggleLoading();
        });
        //agent.Active = false;
      }
      else if (agent.Active === false) {
        var newUser = {
          firstname: agent.FirstName,
          lastname: agent.LastName,
          email: agent.Email,
          user_name: agent.FirstName + '.' + agent.LastName
        };
        User.AddUser(newUser).then(function (data) {
          agent.User_ID = data.User_ID;
          Agents.setAgent(agent);
          agent.Active = true;
          Functions.toggleLoading();
        }, function (error) {
          Functions.toggleLoading();
        });
      }
    };

  });
