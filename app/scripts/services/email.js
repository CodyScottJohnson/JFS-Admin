'use strict';

/**
 * @ngdoc service
 * @name JFS_Admin.Email
 * @description
 * # Email
 * Service in the JFS_Admin.
 */
angular.module('JFS_Admin')
  .factory('Email', function($rootScope, $http, $q, Functions, User) {
    var Email = {
      data: {}
    };
    Email.getMailingListPeople = function(ListID,Update) {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: 'https://jfsapp.com/Secure/API/Email/Lists/People',
        params: {
          'access_token': $rootScope.currentUser.Token.access_token,
          client_id: 'testclient',
          client_secret: 'testpass',
          ListID: ListID

        },
      }).then(function(data) {
        deferred.resolve(data.data);
        if(Update===true){
          Email.data.currentListPeople = data.data;
        }
      }, function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };
    Email.getMailingLists = function(ListID,Update) {
      var deferred = $q.defer();
      $http({
        method: 'GET',
        url: 'https://jfsapp.com/Secure/API/Email/Lists/',
        params: {
          'access_token': $rootScope.currentUser.Token.access_token,
          client_id: 'testclient',
          client_secret: 'testpass',
          ListID: ListID

        },
      }).then(function(data) {
        deferred.resolve(data.data);
        if(Update===true){
          Email.data.Lists = data.data;
        }
      }, function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };
    Email.addPerson = function(person) {
      var deferred = $q.defer();
      $http({
        method: 'POST',
        url: 'https://jfsapp.com/Secure/API/Email/Lists/People',
        params: {
          'access_token': $rootScope.currentUser.Token.access_token,
          client_id: 'testclient',
          client_secret: 'testpass',

        },
        data:person
      }).then(function(data) {
        deferred.resolve(data.data);
      }, function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };

    //Email.getMailingList();
    return Email;
  });
