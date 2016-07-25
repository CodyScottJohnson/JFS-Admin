'use strict';

/**
 * @ngdoc function
 * @name JFS_Admin.controller:ModalCtrl
 * @description
 * # ModalCtrl
 * Controller of the JFS_Admin
 */
angular.module('JFS_Admin')
  .controller('ModalCtrl', function ($scope,$uibModalInstance,items,$sce) {
    $scope.items=items;
    $scope.CloseModal = function () {
        $uibModalInstance.dismiss('cancel');
      };
  });
