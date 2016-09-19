'use strict';

/**
 * @ngdoc function
 * @name JFS_Admin.controller:EmailPeopleCtrl
 * @description
 * # EmailPeopleCtrl
 * Controller of the JFS_Admin
 */
angular.module('JFS_Admin')
  .controller('EmailPeopleCtrl', function(Email, $scope) {
    $scope.getPeople = function(ListID) {
      Email.getMailingListPeople(ListID).then(function(data) {
        $scope.MailingListPeople = data;
      });
    };
    $scope.getPeople();
    Email.getMailingLists().then(function(data) {
      $scope.MailingLists = data;
    });
    $scope.Email = Email.data;
    $scope.CurrentList = 'All';
    $scope.setList = function(List) {
      $scope.getPeople(List.MailingList_ID);
      $scope.CurrentList = List.Name;
    };
    $scope.addPerson = function(Person) {
      Email.addPerson(Person).then(function(data){$scope.MailingListPeople.splice(0,data);});
    };
  });
