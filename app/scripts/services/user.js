'use strict';

/**
 * @ngdoc service
 * @name jfsApp.User
 * @description
 * # User
 * Factory in the jfsApp.
 */
angular.module('JFS_Admin')
  .factory('User', function ($q,$http,$cookies,$rootScope,$state) {
    var currentUser = {};
    var loggedin;
    var Token;
    var UserInfo;
    var AllUsers;
    $rootScope.$on('IdleStart', function() {
      console.log('start');
    });

    $rootScope.$on('IdleWarn', function(e, countdown) {
      console.log(countdown);
        // follows after the IdleStart event, but includes a countdown until the user is considered timed out
        // the countdown arg is the number of seconds remaining until then.
        // you can change the title or display a warning dialog from here.
        // you can let them resume their session by calling Idle.watch()
    });

    $rootScope.$on('IdleTimeout', function() {
      console.log('timeout');
      currentUser.logout();
        // the user has timed out (meaning idleDuration + timeout has passed without any activity)
        // this is where you'd log them
    });

    $rootScope.$on('IdleEnd', function() {
      console.log('end');
        // the user has come back from AFK and is doing stuff. if you are warning them, you can use this to hide the dialog
    });
    currentUser.logout = function(){
      $rootScope.User = null;
      $cookies.remove('user');
      $state.go('login');
    };
    currentUser.getToken = function() {
        var deferred = $q.defer();
        if (angular.isDefined(Token)) {
            deferred.resolve(Token);
        } else {
            currentUser.getCurrent().then(function() {
                $http({
                    method: 'POST',
                    url: '/Secure/OAUTH/getToken/',
                    data: {
                        grant_type: 'password',
                        client_id: 'testclient',
                        client_secret: 'testpass',
                        username: loggedin.username,
                        password: loggedin.hash_pw
                    }
                }).then(function(data) {
                    // Store your data or what ever....
                    // Then resolve
                    Token = data.data;
                    deferred.resolve(data);
                }, function(data, status, headers, config) {
                    deferred.reject("Error: request returned status " + status);
                });
            });
        }
        return deferred.promise;
    };
    //currentUser.getColumns = function(){return ColumnsToShow}

    return currentUser;


  });
