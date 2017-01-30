'use strict';

/**
 * @ngdoc function
 * @name JFS_Admin.controller:MessagesCtrl
 * @description
 * # MessagesCtrl
 * Controller of the JFS_Admin
 */
angular.module('JFS_Admin')
  .controller('MessagesCtrl', function ($scope,User) {
    $scope.User = User.data;
    $scope.showConversation = function(ConversationID){
      //User.MarkConversation(ConversationID)
      User.setCurrentConversation(ConversationID);
    };
    $scope.sendText=function(message,to){
      User.sendText(to,message);
      $scope.newTextMessage ='';
    };

    $scope.messageListOptions = [
      ['Delete Conversation', function($itemScope) {
        //console.log($itemScope);
        User.deleteConversation($itemScope.key);
      }, false]
    ];
  });
