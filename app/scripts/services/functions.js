'use strict';

/**
 * @ngdoc service
 * @name JFS_Admin.Functions
 * @description
 * # Functions
 * Factory in the JFS_Admin.
 */
angular.module('JFS_Admin')
  .factory('Functions', function(Recruits,User) {
    // Service logic
    // ...
    var Functions = {};
    var notification = window.Notification || window.mozNotification || window.webkitNotification;
    notification.requestPermission();
    Functions.browserNotify = function(title, body, icon) {
      if ('undefined' === typeof notification){
        return false;
      }
      if ('undefined' !== typeof notification){
        notification.requestPermission(function(permission) {});
      }
      if (typeof(icon) === 'undefined') {
        //console.log('default');
        icon = 'https://jfsapp.com/Images/Logos/icon50.png';
      }
      var trackNotification = new notification(
        title, {
          body: body,
          dir: 'auto',
          lang: 'EN',
          tag: 'JFSNotification',
          icon: icon
        }
      );

      return true;
    };
    var conn = new WebSocket('wss://jfsapp.com/WebSocket');
    conn.onopen = function(e) {
      console.log("Connection established!");
    };
    conn.onmessage = function(event) {

      var temp = angular.fromJson(event.data);
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
    var meaningOfLife = 42;

    // Public API here
    return {
      someMethod: function() {
        return meaningOfLife;
      }
    };
  });
