'use strict';

/**
 * @ngdoc service
 * @name JFS_Admin.Notifications
 * @description
 * # Notifications
 * Factory in the JFS_Admin.
 */
angular.module('JFS_Admin')
  .factory('Notifications', function (Functions,$q,$http,$rootScope) {
    var Notifications = {
      data: {}
    };
    Notifications.getPriority = function() {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: 'https://jfsapp.com/Secure/API/Notifications/Priority',
        params: {
          'access_token': $rootScope.currentUser.Token.access_token,
          client_id: 'testclient',
          client_secret: 'testpass'

        },
      }).then(function(data) {
        deferred.resolve(data.data);
        Notifications.data.Priority = data.data;
        Functions.OpenModal('views/Modals/Priority_Notifications.html', 'md',null,{backdrop:'static',windowClass:'notification_modal'});
      }, function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };
    //Notifications.getPriority();

    //Email.getMailingList();
    return Notifications;
  });
