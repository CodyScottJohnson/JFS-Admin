'use strict';

/**
 * @ngdoc function
 * @name JFS_Admin.controller:ReportCtrl
 * @description
 * # ReportCtrl
 * Controller of the JFS_Admin
 */
angular.module('JFS_Admin')
  .controller('ReportCtrl', function($scope, $rootScope, $http, $state, User, FileSaver, Blob) {
    $scope.ColorTests = {};
    $scope.getColorStatus = function() {

      $http({
        method: 'GET',
        url: 'https://jfsapp.com/Secure/API/Recruits/NextStep/color/',
        params: {
          'access_token': $rootScope.currentUser.Token.access_token,
          client_id: 'testclient',
          client_secret: 'testpass'

        },
      }).then(function(data) {
        $scope.ColorStatus = data.data;
        //console.log(data.data);

      }, function(error) {

      });

    };
    $scope.getColorStatus();
    $http({
      method: 'GET',
      url: 'https://jfsapp.com/Secure/API/ColorQuiz/',
      params: {
        'access_token': $rootScope.currentUser.Token.access_token,
        client_id: 'testclient',
        client_secret: 'testpass'

      },
    }).then(function(data) {
      $scope.ColorTests = data.data;

    }, function(error) {

    });

    $scope.downloadTest = function(test) {
      test.statusspinner = "fa fa-spinner fa-spin";

      $http({
        method: 'GET',
        url: 'https://jfsapp.com/Secure/API/ColorQuiz/Print/' + test.Test_Token + '/',
        responseType: 'arraybuffer',
        params: {
          'access_token': $rootScope.currentUser.Token.access_token,
          client_id: 'testclient',
          client_secret: 'testpass'

        },
      }).then(function(data) {
        var myBlob = new Blob([data.data], {
          type: 'application/pdf'
        });
        FileSaver.saveAs(myBlob, test.FNAME + '_' + test.LNAME + '_ColorTest.pdf');
        test.statusspinner = "";
      });

    };
    $scope.downloadReport = function(test) {
      test.statusspinner = "fa fa-spinner fa-spin";

      $http({
        method: 'GET',
        url: 'https://jfsapp.com/Secure/API/PrintReport/' + test.url + '/',
        responseType: 'arraybuffer',
        params: {
          'access_token': $rootScope.currentUser.Token.access_token,
          client_id: 'testclient',
          client_secret: 'testpass'

        },
      }).then(function(data) {
        var myBlob = new Blob([data.data], {
          type: 'application/pdf'
        });
        FileSaver.saveAs(myBlob, test.name + '.pdf');
        test.statusspinner = "";
      });

    };

    $scope.deleteColorTest = function(id) {
      $http({
        method: 'DELETE',
        url: 'https://jfsapp.com/Secure/API/ColorQuiz/' + id + '/',
        params: {
          'access_token': $rootScope.currentUser.Token.access_token,
          client_id: 'testclient',
          client_secret: 'testpass'

        },
      }).then(function(data) {
        var index = _.findIndex($scope.ColorTests, {
          'Test_Token': id
        });

        //console.log(index);
        $scope.ColorTests.splice(index, 1);

      }, function(error) {

      });

    };

    $scope.goToState = function(state, data) {
      $state.go(state, data);
    };
    $scope.getPopStatus = function() {
      $http({
        method: 'GET',
        url: 'https://jfsapp.com/Secure/API/Recruits/NextStep/pop/',
        params: {
          'access_token': $rootScope.currentUser.Token.access_token,
          client_id: 'testclient',
          client_secret: 'testpass'

        },
      }).then(function(data) {
        $scope.PopStatus = data.data;

      }, function(error) {

      });
    };
    $scope.getPopStatus();
    $scope.reportColorListOptions = [
      ['Delete Test', function($itemScope) {
        //console.log($itemScope.test.ColorTest_ID);
        $scope.deleteColorTest($itemScope.test.Test_Token);
      }, false],

      null, // Dividier
      ['Mark as Reviewed', function($itemScope) {
        $scope.items.splice($itemScope.$index, 1);
      }]
    ];
  });
