'use strict';

/**
 * @ngdoc service
 * @name jfsApp.User
 * @description
 * # User
 * Factory in the jfsApp.
 */
angular.module('JFS_Admin')
  .factory('User', function($q, $http, $cookies, $rootScope, $state, $filter, Functions, UUID, localStorageService, ENV) {
    var currentUser = {
      data: {
        currentTextConversation: -1,
        visibility: {},
        Ready: false,
        GlobalSettings:$rootScope.GlobalSettings
      }
    };
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
    currentUser.logout = function() {
      $rootScope.currentUser = null;
      localStorageService.cookie.clearAll();
      $rootScope.state = $state.current;
      $state.go('login');
    };
    currentUser.getGlobalSettings = function() {
      var deferred = $q.defer();
      $http({
        method: 'Get',
        url: 'https://jfsapp.com/Secure/API/User/Settings/Global',
        params: {
          access_token: $rootScope.currentUser.Token.access_token,
          client_id: 'testclient',
          client_secret: 'testpass'
        },
      }).then(function(data) {
        console.log('here');
        $rootScope.GlobalSettings = data.data;
        currentUser.data.GlobalSettings = data.data;
        deferred.resolve(data.data);
      },function(){
        deferred.reject("Couldn't Load Global Settings");
      });
      return deferred.promise;
    };
    currentUser.saveGlobalSettings = function() {
      $http({
        method: 'Post',
        url: 'https://jfsapp.com/Secure/API/User/Settings/Global',
        params: {
          access_token: $rootScope.currentUser.Token.access_token,
          client_id: 'testclient',
          client_secret: 'testpass'
        },
        data: {
          Settings: currentUser.data.GlobalSettings
        }
      }).then(function(data) {
        $rootScope.GlobalSettings = currentUser.data.GlobalSettings;
        Functions.Toast('success', 'Settings Saved', '', {
          iconClass: 'jfsToast_success'
        });
      });
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
    currentUser.Socket = function(data) {
      if (data.event == 'newsms') {
        currentUser.data.TextMessages.push(data.data);
      }
    };
    currentUser.setCurrentConversation = function(ConversationID) {
      currentUser.data.currentTextConversation = ConversationID;
      $http({
        method: 'PATCH',
        url: 'https://jfsapp.com/Secure/API/Messages/MarkConversation/' + ConversationID + '/',
        params: {
          access_token: $rootScope.currentUser.Token.access_token,
          client_id: 'testclient',
          client_secret: 'testpass'
        },
      }).then(function() {
        currentUser.getTexts();
      });
    };
    currentUser.deleteConversation = function(ConversationID) {
      currentUser.data.currentTextConversation = ConversationID;
      $http({
        method: 'delete',
        url: 'https://jfsapp.com/Secure/API/Messages/DeleteConversation/' + ConversationID + '/',
        params: {
          access_token: $rootScope.currentUser.Token.access_token,
          client_id: 'testclient',
          client_secret: 'testpass'
        },
      }).then(function() {
        currentUser.getTexts();
      });
    };
    currentUser.addText = function(text) {};
    currentUser.getTexts = function() {
      $http({
        method: 'GET',
        url: 'https://jfsapp.com/Secure/API/Texts/',
        params: {
          access_token: $rootScope.currentUser.Token.access_token,
          client_id: 'testclient',
          client_secret: 'testpass'
        },
      }).then(function(data) {
        currentUser.data.TextMessages = data.data;
      }, function(error) {});
    };
    currentUser.sendText = function(Message, To) {
      var deferred = $q.defer();
      var phone = To.replace(/\D/g, '');
      if (phone.length >= 10 && phone.length <= 11) {

        if (phone.length == 10) {
          phone = '1' + phone;
        }
        var newMessage = {
          to: phone,
          text: Message
        };
        $http({
          method: 'post',
          url: 'https://jfsapp.com/Secure/API/Text/',
          params: {
            'access_token': $rootScope.currentUser.Token.access_token,
            client_id: 'testclient',
            client_secret: 'testpass'

          },
          data: newMessage
        }).then(function(data) {
          //console.log(data.data);
          currentUser.getTexts();
          deferred.resolve(data.data);
        }, function(error) {
          deferred.reject(error);
        });
      } else {
        Functions.Toast('error', 'toast', To + ' Is not a valid number');
        deferred.reject('Invalid Number');
      }

      return deferred.promise;
    };
    currentUser.getUserList = function() {
      var deferred = $q.defer();
      if (angular.isDefined(AllUsers)) {
        deferred.resolve(AllUsers);
      } else {
        $http({
          method: 'GET',
          url: 'https://jfsapp.com/Secure/API/Users/',
          params: {
            'access_token': $rootScope.currentUser.Token.access_token,
            client_id: 'testclient',
            client_secret: 'testpass'
          },
        }).then(function(data) {
          deferred.resolve(data.data);
          currentUser.data.userList = data.data;
        }, function(error) {
          deferred.reject(error);
        });
      }
      return deferred.promise;
    };
    currentUser.getInfo = function() {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: 'https://jfsapp.com/Secure/API/User/Info',
        params: {
          'access_token': $rootScope.currentUser.Token.access_token,
          client_id: 'testclient',
          client_secret: 'testpass'
        },
      }).then(function(data) {
        deferred.resolve(data.data);
        currentUser.data.Info = data.data;

      }, function(error) {
        deferred.reject(error);
      });
      return deferred.resolve;
    };
    currentUser.removeUser = function(UserID){
      var deferred = $q.defer();
      $http({
        method: 'DELETE',
        url: 'https://jfsapp.com/Secure/API/UserManagement/Remove/'+UserID+'/',
        params: {
          'access_token': $rootScope.currentUser.Token.access_token,
          client_id: 'testclient',
          client_secret: 'testpass',
        },

      }).then(function(user) {
        deferred.resolve(user.data);
        //Functions.Toast('success', 'Removed User', user.data.display_name, {
          //iconClass: 'jfsToast_success'
        //});
        currentUser.getUserList();
      }, function(error) {
        deferred.reject(error);
        _(error.data).forEach(function(value) {
          Functions.Toast('error', value);
          //Functions.toast.error(value);
        });
      });
      return deferred.promise;
    };
    currentUser.AddUser = function(newUser,type) {
      var deferred = $q.defer();
      newUser.password = UUID.newuuid();
      $http({
        method: 'post',
        url: 'https://jfsapp.com/Secure/API/UserManagement/user/?Type='+type,
        params: {
          'access_token': $rootScope.currentUser.Token.access_token,
          client_id: 'testclient',
          client_secret: 'testpass',
        },
        data: newUser
      }).then(function(user) {
        deferred.resolve(user.data);
        Functions.Toast('success', 'Added User', user.data.display_name, {
          iconClass: 'jfsToast_success'
        });
        currentUser.getUserList();
      }, function(error) {
        deferred.reject(error);
        _(error.data).forEach(function(value) {
          Functions.Toast('error', value);

          //Functions.toast.error(value);
        });
      });
      return deferred.promise;
    };
    currentUser.getNotes = function() {
        var deferred = $q.defer();
        $http({
                method: 'GET',
                url: 'https://jfsapp.com/Secure/API/User/Notes/',
                params: {
                    'access_token': $rootScope.currentUser.Token.access_token,
                    client_id: 'testclient',
                    client_secret: 'testpass'

                },
            }).then(function(data) {
                //console.log(data.data);
                deferred.resolve(data.data);
            }, function(error) {
                deferred.reject(error);
            });

        return deferred.promise;
    };
    currentUser.setNotes = function(notes) {
        var deferred = $q.defer();

            $http({
                method: 'post',
                url: 'https://jfsapp.com/Secure/API/User/Notes/',
                params: {
                    'access_token': $rootScope.currentUser.Token.access_token,
                    client_id: 'testclient',
                    client_secret: 'testpass'

                },
                data: {
                    notes: notes,
                    User_ID: $rootScope.currentUser.Info.id
                }
            }).then(function(data) {
                //console.log(data.data);
                deferred.resolve(data.data);
            }, function(error) {
                deferred.reject(error);
            });
        return deferred.promise;
    };
    currentUser.changePassword = function(password){
      var deferred = $q.defer();
       $http({
           method: 'POST',
           url: ENV.API + 'UserManagement/user/changepassword',
           params: {
          'access_token': $rootScope.currentUser.Token.access_token,
          client_id: 'testclient',
          client_secret: 'testpass'
        },
        data: {password:password}
       }).then(function(data) {
         $rootScope.currentUser.Info.password = data.data.password;
         $rootScope.currentUser.Info.password_reset = 0;
         localStorageService.cookie.set('user',$rootScope.currentUser,1);
         deferred.resolve(data.data);
       }, function(error) {
         console.log(error.data.message);
       });

       return deferred.promise;

    };
    //currentUser.getColumns = function(){return ColumnsToShow}
    //Initialize
    //currentUser.getGlobalSettings();
    currentUser.getTexts();
    currentUser.getUserList();
    currentUser.getInfo();
    return currentUser;
  });
