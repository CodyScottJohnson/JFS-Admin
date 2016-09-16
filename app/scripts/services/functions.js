'use strict';

/**
 * @ngdoc service
 * @name JFS_Admin.Functions
 * @description
 * # Functions
 * Factory in the JFS_Admin.
 */
angular.module('JFS_Admin')
  .factory('Functions', function(toastr,$uibModal,$rootScope) {
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
    Functions.Toast = function(type,title,message){
      toastr.info(message);
    };
    Functions.SendSocket = function(data){
        $rootScope.conn.send(data);
    };
    Functions.SQLDate = function(date){
      if (date === null || date===''){
        return null;
      }
      else{
        return new Date(date+'z');
      }
    };
    Functions.OpenModal = function(modalname,size,data){
      var modalInstance = $uibModal.open({
       animation: true,
       templateUrl: modalname,
       controller: 'ModalCtrl',
       size: size,
       resolve: {
         items: function () {
           return data;
         }
       }
     });
     modalInstance.result.then(function (selectedItem) {
       //console.log(selectedItem);
     }, function () {
       console.log('done');
     });

    };




    // Public API here
    return Functions;
  });
