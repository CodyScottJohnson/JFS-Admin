'use strict';

/**
 * @ngdoc function
 * @name JFS_Admin.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the JFS_Admin
 */
angular.module('JFS_Admin')
  .controller('UserCtrl', function ($scope,Functions, User, $sce) {
    $scope.UserData = User.data;
    $scope.Settings = {state:'account'};
    $scope.to_trusted = function(html_code) {
        return $sce.trustAsHtml(html_code);
    };
    $scope.saveGlobalSettings = function() {
      console.log('here');
      User.saveGlobalSettings();
    };
    $scope.OpenSettingsModal = function(setting){
      Functions.OpenModal('views/Modals/Settings/'+setting+'.html','lg');
    };
  });
