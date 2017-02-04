'use strict';

/**
 * @ngdoc function
 * @name JFS_Admin.controller:StyleCtrl
 * @description
 * # StyleCtrl
 * Controller of the JFS_Admin
 */
angular.module('JFS_Admin')
  .controller('StyleCtrl', function ($scope, $http,FileSaver,Blob,$rootScope) {
    $scope.log=function(a){
      console.log(a);
    };
    $scope.dowloadLogo = function(name){
      $rootScope.showLoading=!$rootScope.showLoading;
      //$rootScope.showLoading=false;
    $http.get('https://jfsapp.com/Open/API/Images/Brand/Logos/JFS/'+name, {responseType: 'arraybuffer'}).then(function(data){
      var mime = data.headers()['content-type'];
      var image = new Blob([data.data],{type:mime});
      FileSaver.saveAs(image,name);
      $rootScope.showLoading=!$rootScope.showLoading;
    });
  };
  });
