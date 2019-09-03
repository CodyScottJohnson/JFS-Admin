'use strict';

/**
 * @ngdoc function
 * @name JFS_Admin.controller:ManageuserCtrl
 * @description
 * # ManageuserCtrl
 * Controller of the JFS_Admin
 */
angular.module('JFS_Admin')
  .controller('ManageUserCtrl', function ($scope, $http, User, $rootScope,ENV) {
    $scope.keypress = function(e, form) {
          if (e.which === 13) {
              form.$submit();
          }
      };
    $scope.Users = User.data;
  	$scope.newUser={};
    User.getUserList().then(function(users) {

          }, function(error) {

    });
  	$scope.AddUser =function(){
  		 User.AddUser($scope.newUser, 'admin');
    };
    $scope.RemoveUser = function(user){
        User.removeUser(user.id)
    }
    $scope.checkvalue = function(data) {
  		 console.log(data);
      if (!angular.isDefined(data) || data === '') {
        return "Please Enter a Value";
      }
    };/*
  	$scope.removeUser= function(username){
  		$scope.newUser.password=uuid2.newuuid();
  		 currentUser.getToken().then(function(data) {
          //console.log(data);
          $http({
              method: 'post',
              url: ENV.API + 'UserManagement/user/',
              params: {
                  'access_token': data.access_token,
                  client_id: 'testclient',
                  client_secret: 'testpass',
              },
  					data:$scope.newUser
          }).then(function(user) {
             $scope.Users.push(user.data);
  					 $scope.newUser={};
          }, function(error) {
  					_(error.data).forEach(function(value) {
    					toastr.error(value);
  						});
  					 //$scope.newUser={};

          });
      });
  	};*/
  	$scope.resetPassword= function(username){

          $http({
              method: 'post',
              url: ENV.API + 'UserManagement/'+username+'/user/resetpassword/',
              params: {
                  'access_token': $rootScope.currentUser.Token.access_token,
                  client_id: 'testclient',
                  client_secret: 'testpass',
              },
  					data:$scope.newUser
          }).then(function(user) {

          }, function(error) {
  					_(error.data).forEach(function(value) {
    					//toastr.error(value);
  						});
            });
  	};
  });
