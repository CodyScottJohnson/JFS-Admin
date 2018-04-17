'use strict';

/**
 * @ngdoc service
 * @name JFS_Admin.Functions
 * @description
 * # Functions
 * Factory in the JFS_Admin.
 */
angular.module('JFS_Admin')
  .factory('Functions', function(toastr,$uibModal,$rootScope, $http, $q) {
    // Service logic
    // ...
    var Functions = {data:{Tags:[]}};
    var notification = window.Notification || window.mozNotification || window.webkitNotification;
    if(angular.isDefined(notification)){
    notification.requestPermission();
    }
    Functions.toggleLoading = function(){
      $rootScope.showLoading = !$rootScope.showLoading;
    };
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
    Functions.Toast = function(type,title,message,options){
      toastr[type](message,title,options);
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
    Functions.OpenModal = function(modalname,size,data,options){
      var default_options = {
       animation: true,
       templateUrl: modalname,
       controller: 'ModalCtrl',
       size: size,
       resolve: {
         items: function () {
           return data;
         }
       }
     };
     default_options = _.assign(default_options,options);
      var modalInstance = $uibModal.open(default_options);
     modalInstance.result.then(function (selectedItem) {
       //console.log(selectedItem);
     }, function () {
       console.log('done');
     });

    };
    Functions.getTags = function() {
        var deferred = $q.defer();
            $http({
                method: 'get',
                url: 'https://jfsapp.com/Secure/API/Tags/',
                params: {
                    'access_token': $rootScope.currentUser.Token.access_token,
                    client_id: 'testclient',
                    client_secret: 'testpass'

                },
            }).then(function(data) {
                //console.log(data.data);
                Functions.data.Tags = data.data;
                deferred.resolve(data.data);
            }, function(error) {
                deferred.reject(error);
            });
        return deferred.promise;
    };
    Functions.editTags = function(tag) {
        var deferred = $q.defer();
            $http({
                method: 'patch',
                url: 'https://jfsapp.com/Secure/API/Tags/',
                params: {
                    'access_token': $rootScope.currentUser.Token.access_token,
                    client_id: 'testclient',
                    client_secret: 'testpass'

                },
                data:tag
            }).then(function(data) {
                console.log(data.data);
                Functions.data.Tags.push(data.data);
                //console.log()
                deferred.resolve(data.data);
            }, function(error) {
                deferred.reject(error);
            });
        return deferred.promise;
    };
    Functions.loadTags = function(query) {
        var deferred = $q.defer();
        var Tags = Functions.data.Tags;
        var Subset = Tags.filter(function(tag) {
        console.log(tag.Name.toLowerCase().indexOf(query.toLowerCase()) != -1);
        return tag.Name.toLowerCase().indexOf(query.toLowerCase()) != -1;
        });
        //deferred.resolve(Functions.data.Tags);
        deferred.resolve(Subset);
        return deferred.promise;
    };
    Functions.getTags();


    // Public API here
    return Functions;
  });
