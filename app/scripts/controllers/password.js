'use strict';

/**
 * @ngdoc function
 * @name JFS_Admin.controller:PasswordCtrl
 * @description
 * # PasswordCtrl
 * Controller of the JFS_Admin
 */
angular.module('JFS_Admin')
.controller('PasswordCtrl', function ($scope,User, $rootScope) {
    $scope.passwordState = "main";
    $scope.NewPassword = '';
    $scope.NewPasswordConfirm = '';
    $scope.PasswordsMatch = function(){
    if($scope.NewPassword == $scope.NewPasswordConfirm || $scope.NewPasswordConfirm.length === 0){
      return true;

    }
    else{

      return false;

    }
  };
  $scope.changePassword = function(password){
    User.changePassword(password).then(function(data){
      $scope.passwordState = 'success';
      $rootScope.currentUser.Info.password_reset = 0;
      console.log('yes');
    },function(data){console.log('oops');});
  };
  });
