'use strict';

/**
 * @ngdoc service
 * @name jfsApp.User
 * @description
 * # User
 * Factory in the jfsApp.
 */
angular.module('JFS_Admin')
  .factory('User', function ($q,$http,$cookies,$rootScope) {
    var currentUser = {};
    var loggedin;
    var Token;
    var UserInfo;
    var AllUsers;
    var ColumnsToShow = {
        fname: {
            displayName: "First Name",
            Show: true
        },
        lname: {
            displayName: "Last Name",
            Show: true
        },
        email: {
            displayName: "Email",
            Show: true
        },
        colortest: {
            displayName: "Color Test",
            Show: true
        },
        photo: {
            displayName: "Profile Pic",
            Show: false
        },
        pop: {
            displayName: "POP",
            Show: true
        },
        type: {
            displayName: "Type",
            Show: true
        },
        phone: {
            displayName: "Phone",
            Show: true
        },
        address: {
            displayName: "Address",
            Show: true
        },
        city: {
            displayName: "City",
            Show: true
        },
        state: {
            displayName: "State",
            Show: true
        },
        zip: {
            displayName: "Zip",
            Show: true
        },
        nextstep: {
            displayName: "Next Step",
            Show: true
        },
        AdvancedSearch: {
            Show: true
        },
        OpenInNewTab: false
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
    currentUser.getColumnsToShow = function() {
        var Settings = $cookies.getObject('JFSColumnSettings');
        if (Settings === null) {
            return ColumnsToShow;
        } else {
            return Settings;
        }
    };
    currentUser.setColumnsToShow = function(data) {
        $cookies.putObject('JFSColumnSettings', data);

    };
    currentUser.restoreColumnsToShow = function() {
        $cookies.putObject('JFSColumnSettings', ColumnsToShow);

    };
    currentUser.getAssigned = function(detail) {
      	detail = typeof detail !== 'undefined' ? detail : false;
        var deferred = $q.defer();
        currentUser.getToken().then(function() {
            $http({
                method: 'GET',
                url: 'https://jfsapp.com/Secure/API/User/Assigned/',
                params: {
                    'access_token': Token.access_token,
                    client_id: 'testclient',
                    client_secret: 'testpass',
                    detail: detail
                },
            }).then(function(data) {
                //console.log(data.data);
                deferred.resolve(data.data);
            }, function(error) {
                deferred.reject(error);
            });
        });
        return deferred.promise;
    };
    currentUser.getNotes = function() {
        var deferred = $q.defer();
        currentUser.getToken().then(function() {
            $http({
                method: 'GET',
                url: 'https://jfsapp.com/Secure/API/User/Notes/',
                params: {
                    'access_token': Token.access_token,
                    client_id: 'testclient',
                    client_secret: 'testpass'

                },
            }).then(function(data) {
                //console.log(data.data);
                deferred.resolve(data.data);
            }, function(error) {
                deferred.reject(error);
            });
        });
        return deferred.promise;
    };
    currentUser.setNotes = function(notes) {
        var deferred = $q.defer();
        currentUser.getToken().then(function() {
            $http({
                method: 'post',
                url: 'https://jfsapp.com/Secure/API/User/Notes/',
                params: {
                    'access_token': Token.access_token,
                    client_id: 'testclient',
                    client_secret: 'testpass'

                },
                data: {
                    notes: notes,
                    User_ID: loggedin.user_id
                }
            }).then(function(data) {
                //console.log(data.data);
                deferred.resolve(data.data);
            }, function(error) {
                deferred.reject(error);
            });
        });
        return deferred.promise;
    };
    currentUser.AssignColorQuizNotes = function(data) {
        var deferred = $q.defer();
        currentUser.getToken().then(function() {
            $http({
                method: 'post',
                url: 'https://jfsapp.com/Secure/API/assignColorQuiz/',
                params: {
                    'access_token': Token.access_token,
                    client_id: 'testclient',
                    client_secret: 'testpass'

                },
                data: data
            }).then(function(data) {
                //console.log(data.data);
                deferred.resolve(data.data);
            }, function(error) {
                deferred.reject(error);
            });
        });
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
                    'access_token': 'e07a6ebeb934d3d60410713ef5809405ac0723c3',
                    client_id: 'testclient',
                    client_secret: 'testpass'
                },
            }).then(function(data) {
                deferred.resolve(data.data);
                AllUsers = data.data;
            }, function(error) {
                deferred.reject(error);
            });
        }
        return deferred.promise;
    };
    currentUser.getCurrent = function() {
        var deferred = $q.defer();
        if (angular.isDefined(loggedin)) {
            deferred.resolve(loggedin);
        } else {
            $http.get('/phpscripts/getSessionData.php').success(function(data) {
                // Store your data or what ever....
                // Then resolve
                loggedin = data;
                deferred.resolve(data);
            }).error(function(data, status, headers, config) {
                deferred.reject("Error: request returned status " + status);
            });
            $rootScope.JFSCurrentUser = $cookies.getObject('JFSCurrentUser');
        }
        return deferred.promise;
    };
    currentUser.updateCurrent = function(data) {
        var deferred = $q.defer();
        currentUser.getToken().then(function() {
            $http({
                method: 'patch',
                url: 'https://jfsapp.com/Secure/API/User/',
                params: {
                    'access_token': Token.access_token,
                    client_id: 'testclient',
                    client_secret: 'testpass'

                },
                data: data
            }).then(function(data) {
                //console.log(data.data);
                deferred.resolve(data.data);
            }, function(error) {
                deferred.reject(error);
            });
        });
        return deferred.promise;
    };
    //currentUser.getColumns = function(){return ColumnsToShow}

    return currentUser;


  });
