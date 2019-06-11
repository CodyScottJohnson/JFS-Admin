'use strict';

/**
 * @ngdoc function
 * @name JFS_Admin.controller:EmailPeopleCtrl
 * @description
 * # EmailPeopleCtrl
 * Controller of the JFS_Admin
 */
angular.module('JFS_Admin')
  .controller('EmailPeopleCtrl', function(Email,Functions, $scope,$timeout) {
    $scope.peopleOptions = [
      ['Info', function($itemScope){
        //console.log($itemScope.recruit.INDV_ID);
        Email.getPerson($itemScope.contact.EmailPeople_ID).then(function(data){
        console.log(data);
        Functions.OpenModal('views/Modals/Email/People_Modal.html', 'md');
      });
      }]
    ];
    $scope.getPeople = function(ListID) {
      Email.getMailingListPeople(ListID).then(function(data) {
        $scope.MailingListPeople = data;
      });
    };
    $scope.getPeople();
    Email.getMailingLists().then(function(data) {
      $scope.MailingLists = data;
    });
    $scope.editPerson = function(person){
      Email.editPerson(person);
    };
    $scope.Email = Email.data;
    $scope.CurrentList = 'All';
    $scope.setList = function(List) {
      $scope.getPeople(List.MailingList_ID);
      $scope.CurrentList = List.Name;
    };
    $scope.addPerson = function(Person) {
      Email.addPerson(Person).then(function(data){$scope.MailingListPeople.splice(0,0,data);});
      console.log($scope);
    };
    $scope.deletePerson = function(person){
      Email.deletePerson(person).then(function(data){
        console.log(data);
         var index =  _.findIndex($scope.MailingListPeople, function(o) { return o.EmailPeople_ID == data.EmailPeople_ID; });
         $scope.MailingListPeople.splice(index,1);
      });
    };
    $scope.listAdded = function(list){
      console.log(list);
      Email.personAddList(list);
    };
    $scope.listRemoved = function(list){
      console.log(list);
      Email.personDeleteList(list);
    };
  });
