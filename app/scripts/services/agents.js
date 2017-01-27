'use strict';

/**
 * @ngdoc service
 * @name JFS_Admin.Agents
 * @description
 * # Agents
 * Factory in the JFS_Admin.
 */
angular.module('JFS_Admin')
  .factory('Agents', function ($rootScope,$q,$http,Functions, User) {
    var Agents = {data:{}};
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
             url: 'https://jfsapp.com/Secure/API/Agents/',
             params: {
                 'access_token': $rootScope.currentUser.Token.access_token,
                 client_id: 'testclient',
                 client_secret: 'testpass'

             },
         }).then(function(data) {
             //console.log(data.data);
             Agents.data.AgentList = data.data;
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
            url: 'https://jfsapp.com/Secure/API/Agents/',
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
            console.log(index);
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
             url: 'https://jfsapp.com/Secure/API/Agents/'+Agent.Agent_ID,
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
  return Agents;

  });
