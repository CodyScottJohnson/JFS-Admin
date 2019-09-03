'use strict';

/**
 * @ngdoc service
 * @name JFS_Admin.Agents
 * @description
 * # Agents
 * Factory in the JFS_Admin.
 */
angular.module('JFS_Admin')
  .factory('Agents', function ($rootScope,$q,$http,Functions, User,ENV) {
    var Agents = {data:{
                      CurrentAgent:{
                                    Info:{},
                                    SalesInfo:{
                                                History:{}
                                              }
                                    },
                        
                        AllAgents:{
                          SalesNumbers:[]
                        },
                        ScoreCard:{

                        }
                      }
                    };
    Agents.Socket = function(data) {
      if (data.event === 'agentupdated') {
        var index = _.findIndex(Agents.data.AgentList, {
          'Agent_ID': data.data.Agent_ID
        });

        Agents.data.AgentList[index] = data.data;
        $rootScope.$apply();
        Functions.Toast('info',data.AlertTitle,data.AlertMessage);

      }
      if (data.event === 'agentdeleted') {
        var deleteindex = _.findIndex(Agents.data.AgentList, {
          'Agent_ID': data.data.Agent_ID
        });

        Agents.data.AgentList.splice(deleteindex,1);
        $rootScope.$apply();
        Functions.Toast('info',data.AlertTitle,data.AlertMessage);

      }
      if (data.event === 'agentadded') {
        Agents.data.AgentList.push(data.data);
        $rootScope.$apply();
        Functions.Toast('info',data.AlertTitle,data.AlertMessage);
      }
    };
    Agents.getAgents = function(){
      var deferred = $q.defer();

         $http({
             method: 'GET',
             url: ENV.API + 'Agents/',
             params: {
                 'access_token': $rootScope.currentUser.Token.access_token,
                 client_id: 'testclient',
                 client_secret: 'testpass'

             },
         }).then(function(data) {
              data.data.forEach(function(agent){
                  agent.Hire_Date = new Date(agent.Hire_Date);
              });
             Agents.data.AgentList = data.data;
             $http({
              method: 'GET',
              url: ENV.API + 'Agents/CurrentSalesNumbers',
              params: {
                  'access_token': $rootScope.currentUser.Token.access_token,
                  client_id: 'testclient',
                  client_secret: 'testpass'
 
              },
             }).then(function(data) {
              Agents.data.AllAgents.SalesNumbers= data.data;
              });
             deferred.resolve(data.data);
         }, function(error) {
             deferred.reject(error);
         });
     return deferred.promise;
    };
    Agents.getAgent = function(AgentID){
      var deferred = $q.defer();
         $http({
             method: 'GET',
             url: ENV.API + 'Agents/Agent/'+AgentID,
             params: {
                 'access_token': $rootScope.currentUser.Token.access_token,
                 client_id: 'testclient',
                 client_secret: 'testpass'

             },
         }).then(function(data) {
             deferred.resolve(data.data);
         }, function(error) {
             deferred.reject(error);
         });
     return deferred.promise;
    };

    Agents.viewAgent = function(Agent_ID){
      var index = _.findIndex(Agents.data.AgentList, {
        'Agent_ID': Agent_ID
      });
      if(index != -1){
        Agents.data.CurrentAgent.Info = Agents.data.AgentList[index];
      }
      else{
        Agents.getAgent(Agent_ID).then(function(data){
          Agents.data.CurrentAgent.Info = data;
        });
      }
      Agents.getAgent_DailyNumbers(Agent_ID);
      Agents.getAgent_SalesNumbers(Agent_ID);
    };
    Agents.getScorecard = function(Agent_ID){
      var deferred = $q.defer();

         $http({
             method: 'GET',
             url: ENV.API + 'Agents/Scorecard',
             params: {
                 'access_token': $rootScope.currentUser.Token.access_token,
                 client_id: 'testclient',
                 client_secret: 'testpass'

             },
         }).then(function(data) {
             //console.log(data.data);
             Agents.data.ScoreCard = {
                                      Current: data.data[0],
                                      History: data.data
                                      }
           
             deferred.resolve(data.data);
         }, function(error) {
             deferred.reject(error);
         });
     return deferred.promise;
    };

    Agents.getAgent_DailyNumbers = function(Agent_ID){
      var deferred = $q.defer();

         $http({
             method: 'GET',
             url: ENV.API + 'Agents/Agent/'+Agent_ID+'/DailyNumbers',
             params: {
                 'access_token': $rootScope.currentUser.Token.access_token,
                 client_id: 'testclient',
                 client_secret: 'testpass'

             },
         }).then(function(data) {
             //console.log(data.data);
             Agents.data.CurrentAgent.DailyNumbers = data.data;
             deferred.resolve(data.data);
         }, function(error) {
             deferred.reject(error);
         });
     return deferred.promise;
    };
    Agents.getAgent_SalesNumbers = function(Agent_ID){
      var deferred = $q.defer();

         $http({
             method: 'GET',
             url: ENV.API + 'Agents/Agent/'+Agent_ID+'/SalesNumbers',
             params: {
                 'access_token': $rootScope.currentUser.Token.access_token,
                 client_id: 'testclient',
                 client_secret: 'testpass'

             },
         }).then(function(data) {
             //console.log(data.data);
             Agents.data.CurrentAgent.SalesNumbers = data.data.CurrentNumbers;
             Agents.data.CurrentAgent.SalesInfo = data.data;
             _.each(Agents.data.CurrentAgent.SalesInfo.History, function(item){item.Life_Paid_Premium_Ytd = parseInt(item.Life_Paid_Premium_Ytd, 10)});
             Agents.data.CurrentAgent.Plot = {};
             Agents.data.CurrentAgent.Plot = {
               series:[_.map(Agents.data.CurrentAgent.SalesInfo.History,'Life_Paid_Premium_Ytd').reverse(),
                        _.fill(Array(Agents.data.CurrentAgent.SalesInfo.History.length), 0),
                        _.fill(Array(Agents.data.CurrentAgent.SalesInfo.History.length), Agents.data.CurrentAgent.Info.Life_Goal)],
               labels:_.map(Agents.data.CurrentAgent.SalesInfo.History,'As_Of').reverse()
             };
             Agents.data.CurrentAgent.PCPlot = {};
             Agents.data.CurrentAgent.PCPlot = {
              series:[_.map(Agents.data.CurrentAgent.SalesInfo.History,'PC_Premium_Ytd').reverse(),
                       _.fill(Array(Agents.data.CurrentAgent.SalesInfo.History.length), 0),
                       _.fill(Array(Agents.data.CurrentAgent.SalesInfo.History.length), Agents.data.CurrentAgent.Info.PandC_Goal)],
              labels:_.map(Agents.data.CurrentAgent.SalesInfo.History,'As_Of').reverse()
            };
            Agents.data.CurrentAgent.lifeOptions = {}
            Agents.data.CurrentAgent.lifeOptions = {
              scaleMinSpace: 50,
              showPoint: false,
              showArea: true,
              lineSmooth: true,
              fullWidth: true,
              low:0,
             // high: Agents.data.CurrentAgent.Info.Life_Goal + 10000,
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
            Agents.data.CurrentAgent.pcOptions = {}
            Agents.data.CurrentAgent.pcOptions = {
              scaleMinSpace: 50,
              showPoint: false,
              showArea: true,
              lineSmooth: true,
              fullWidth: true,
              low:0,
              //high: Agents.data.CurrentAgent.Info.PandC_Goal + 10000,
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
             deferred.resolve(data.data);
         }, function(error) {
             deferred.reject(error);
         });
     return deferred.promise;
    };

    Agents.setAgent = function(Agent){
     var deferred = $q.defer();

        $http({
            method: 'patch',
            url: ENV.API + 'Agents/',
            params: {
                'access_token': $rootScope.currentUser.Token.access_token,
                client_id: 'testclient',
                client_secret: 'testpass'

            },
            data:Agent
        }).then(function(data) {
            console.log(data.data);
            var index = _.findIndex(Agents.data.AgentList, {
              'Agent_ID': Agent.Agent_ID
            });
            if(index === -1){
                Agents.data.AgentList.push(data.data);
                Agent = data.data;
            }
            else{
              Agents.data.AgentList[index] = Agent;
            }
            var message = {
    								type: 'agent',
                    event: 'agentupdated',
                    data: Agent,
                    AlertMessage: $rootScope.currentUser.Info.display_name + ' Edited ' + Agent.FirstName + ' ' + Agent.LastName
                };
            Functions.SendSocket(angular.toJson(message));
            deferred.resolve(data.data);
        }, function(error) {
            deferred.reject(error);
        });
    return deferred.promise;
    };
    Agents.deleteAgent = function(Agent){
      var deferred = $q.defer();

         $http({
             method: 'delete',
             url: ENV.API + 'Agents/'+Agent.Agent_ID,
             params: {
                 'access_token': $rootScope.currentUser.Token.access_token,
                 client_id: 'testclient',
                 client_secret: 'testpass'

             }
         }).then(function(data) {
             var index =  _.findIndex(Agents.data.AgentList, function(o) { return o.Agent_ID == Agent.Agent_ID; });
             Agents.data.AgentList.splice(index,1);
             if(Agent.Active){
               User.removeUser(Agent.User_ID);
             }
             var message = {
                     type: 'agent',
                     event: 'agentdeleted',
                     data: Agent,
                     AlertMessage: $rootScope.currentUser.Info.display_name + ' Deleted ' + Agent.FirstName + ' ' + Agent.LastName
                 };
             Functions.SendSocket(angular.toJson(message));
             deferred.resolve(data.data);
         }, function(error) {
             deferred.reject(error);
         });
     return deferred.promise;
     };
     Agents.getAgents_SalesNumbers = function(Agent_ID){
      var deferred = $q.defer();

         $http({
             method: 'GET',
             url: ENV.API + 'Agents/SalesNumbers',
             params: {
                 'access_token': $rootScope.currentUser.Token.access_token,
                 client_id: 'testclient',
                 client_secret: 'testpass'

             },
         }).then(function(data) {
             //console.log(data.data);
             Agents.data.SalesNumbers = data.data;
             deferred.resolve(data.data);
             //console.log(Agents.data.SalesNumbers);
         }, function(error) {
             deferred.reject(error);
         });
     return deferred.promise;
    };
    Agents.saveAgents_SalesNumbers = function(number){
      var deferred = $q.defer();
         $http({
             method: 'patch',
             url: ENV.API + 'Agents/SalesNumbers',
             params: {
                 'access_token': $rootScope.currentUser.Token.access_token,
                 client_id: 'testclient',
                 client_secret: 'testpass'

             },
             data:number
         }).then(function(data) {
             if(data.data.operation == 'insert'){
               number.id = data.data.id;
             }
             deferred.resolve(data.data);
             
         }, function(error) {
             deferred.reject(error);
         });
     return deferred.promise;
    };
  Agents.getAgents();
  Agents.getAgents_SalesNumbers();
  Agents.getScorecard();
  return Agents;

  });
