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
    $scope.opened = {};
    $scope.open = function($event, elementOpened) {
      $event.preventDefault();
      $event.stopPropagation();
  
      $scope.opened[elementOpened] = !$scope.opened[elementOpened];
    };
    Agents.getAgents();
    $scope.print = function(statement){
      console.log(statement);
    }
    $scope.viewAgent = function (Agent_ID) {
      Agents.viewAgent(Agent_ID);
      $state.go('app.Agents.Agent.Overview', { AgentID: Agent_ID });
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
    $scope.getClass = function(completed,onTarget){
      if(completed){
        return "done";
      } else if(onTarget){
        return "on-target";
      }
      return "behind";
  };
  $scope.minimumStandardOrder = function(agentNumbers){
    return $scope.minimumStandardProgress(agentNumbers).progress;
  }
    $scope.minimumStandardProgress = function (agentNumbers) {
      if (angular.isDefined(agentNumbers)) {
        var condition1 = Math.min(agentNumbers.PC_Premium_Ytd / 35000, agentNumbers.Life_Paid_Premium_Ytd / 3000);
        var condition2 = Math.min(agentNumbers.Life_Paid_Premium_Ytd / 15000);
        var progress = Math.max(condition1, condition2);
        var expectedProgress = (moment().week()) / 52.0;
        return {
          completed: Boolean(progress >= 1),
          onTarget: Boolean(progress >= expectedProgress),
          progress: progress,
          class:$scope.getClass(Boolean(progress >= 1),Boolean(progress >= expectedProgress)),
          color: $scope.getColor(Boolean(progress >= 1),Boolean(progress >= expectedProgress))
        };
      }
      return {
        completed: false,
        onTarget: false,
        progress: 0.0,
      };
    };
    $scope.AverageWeekly = function (value) {
      return value / (moment().week() - 1)
    };
    $scope.WeeklytoTarget = function (current,target) {
      return Math.max((target-current) / (52 - (moment().week() - 1)),0)
    };
    $scope.enhancedCommissionOrder = function(agentNumbers){
      return $scope.enhancedCommissionProgress(agentNumbers).progress;
    }
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
          class:$scope.getClass(Boolean(progress >= 1),Boolean(progress >= expectedProgress)),
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
        var condition1 = Math.min(agentNumbers.Career_Points / 7000, agentNumbers.Career_Points_Life / 3500);
        //var condition2 = Math.min(agentNumbers.PC_Premium_Ytd / 5000, agentNumbers.Life_Paid_Premium_Ytd / 2000);
        var condition3 = Math.min(agentNumbers.Career_Points_Life / 6000);
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
    $scope.CareerClubOrder = function(agentNumbers){
      return $scope.careerClubProgress(agentNumbers).progress;
    }
    $scope.careerClubProgress = function (agentNumbers) {
      if (angular.isDefined(agentNumbers)) {
        if(angular.isDefined(agentNumbers.CareerClubProgress)){
          return(agentNumbers.CareerClubProgress);
        }
        var condition1 = Math.min(agentNumbers.Career_Points / 3500, agentNumbers.Career_Points_Life / 1750);
        //var condition2 = Math.min(agentNumbers.PC_Premium_Ytd / 5000, agentNumbers.Life_Paid_Premium_Ytd / 2000);
        var condition3 = Math.min(agentNumbers.Career_Points_Life / 2800);
        var progress = Math.max(condition1, condition3);

        var expectedProgress = moment().week() / 52.0;
        return {
          completed: Boolean(progress >= 1),
          onTarget: Boolean(progress >= expectedProgress),
          progress: progress,
          class:$scope.getClass(Boolean(progress >= 1),Boolean(progress >= expectedProgress)),
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
    $scope.WeeklyPerformance = function(curWeek,prevWeek,avgWeek){
   
      if((curWeek - prevWeek) >  avgWeek +50){
        return "up";
      }
      if((curWeek - prevWeek) <  avgWeek - 50){
        return "down";
      }
      return "neutral";
    }
    $scope.agentListOptions = [
      ['Reset Password', function ($itemScope) {
      }, false],
      ['Delete', function ($itemScope) {
        //console.log($itemScope)
        Agents.deleteAgent($itemScope.agent);
      }, false],
    ];
    $scope.updateAgent = function (agent) {
      Agents.setAgent(agent).then(function(data){
        Agents.viewAgent(agent.Agent_ID);
      });
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
          user_name: agent.FirstName + '.' + agent.LastName,
          title: "Agent"
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
   
    $scope.events = {
 
      created: function(obj) {
        var seq=0;
        var stop;
        var i;
        var len;
        var defs = obj.svg.elem('defs');
        defs.elem('radialGradient', {
          id: 'gradient2',
          cx: '0%',
          cy: '50%',
          fx: '0%',
          fy: '50%',
          r: '111.803399%'
        }).elem('stop', {
          offset: 0,
          'stop-color': '#FBDA61'
        }).parent().elem('stop', {
          offset: 1,
          'stop-color': '#F76B1C'
        });
        defs.elem('radialGradient', {
          id: 'gradient',
          cx: '100%',
          cy: '6.5652725%',
          fx: '100%',
          fy: '6.5652725%',
          r: '147.233961%'
        }).elem('stop', {
          offset: 0,
          'stop-color': '#6F94FF'
        }).parent().elem('stop', {
          offset: 1,
          'stop-color': '#6fdcff'
        });
 
        //console.log(obj);
      },
      draw:function(data) {
 
        if(data.type === 'area') {
          data.element.animate({
          d: {
            begin: 1000 * (data.index+1),
            dur: 2000,
            from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
          }
      }
    };
    $scope.lineOptions = {
      scaleMinSpace: 50,
      showPoint: false,
      showArea: true,
      lineSmooth: true,
      fullWidth: true,
      low:0,
      high: $scope.Agents.CurrentAgent.Info.Life_Goal + 10000,
      labelOffset: {
        x: -20
      },
    
      chartPadding: {
        top: 20,
        right: 10,
        bottom: 5,
        left: 0
      },
      axisX: {
        //type: Chartist.FixedScaleAxis,
        showGrid: true,
        showLabel: true,
        labelInterpolationFnc: function(value) {
          return moment(value).format('MMM D');
        }
        //offset: 0
      },
      axisY: {
        showGrid: true,
        showLabel: true,
        ticks:{
          padding:100
        }
        //offset: 5
      }
    };
  });
