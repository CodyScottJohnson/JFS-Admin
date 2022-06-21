'use strict';

/**
 * @ngdoc service
 * @name JFS_Admin.Notifications
 * @description
 * # Notifications
 * Factory in the JFS_Admin.
 */
angular.module('JFS_Admin')
  .factory('Notifications', function (Functions,$q,$http,$rootScope,ENV) {
    var Notifications = {
      data: {}
    };
    Notifications.getPriority = function() {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: ENV.API_v2 + '/Settings/Notifications/',
        params: {
          'access_token': $rootScope.currentUser.Token.access_token,
          client_id: 'testclient',
          client_secret: 'testpass'

        },
      }).then(function(result) {
        deferred.resolve(result.data.data);
        Notifications.data.Priority = result.data.data;
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
