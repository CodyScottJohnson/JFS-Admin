'use strict';

/**
 * @ngdoc service
 * @name JFS_Admin.Socket
 * @description
 * # Socket
 * Factory in the JFS_Admin.
 */
angular.module('JFS_Admin')
  .factory('Socket', function ($rootScope,Recruits,User,Functions) {
    // Service logic
    // ...
    var Socket = {};
    $rootScope.conn.onmessage = function(event) {
      var temp = angular.fromJson(event.data);
      console.log(temp);
      if (angular.isDefined(temp.browsernotification)) {
        Functions.browserNotify(temp.browsernotification.Title, temp.browsernotification.Body, temp.browsernotification.Icon);
      }
      if (temp.type == 'recruit') {
        Recruits.Socket(temp);
      }
      if (temp.type == 'user') {
        User.Socket(temp);
      }

    };
    // Public API here
    return Socket;
  });
