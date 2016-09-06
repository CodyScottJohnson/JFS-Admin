'use strict';

/**
 * @ngdoc function
 * @name jfsApp.controller:RecruitingCtrl
 * @description
 * # RecruitingCtrl
 * Controller of the jfsApp
 */
angular.module('JFS_Admin')
  .controller('RecruitingCtrl', function($scope, Recruits, Task) {
    Task.getUsersTasks(true);
    $scope.Task = Task.data;
    $scope.removeFlag = function(task) {
      task.Status = 'Completed';
      Task.updateTask(task);
    };

    $scope.itemsPerPage = 10;
    $scope.Recruits = Recruits.data;
    $scope.Recruits.currentPage = 1;
    $scope.addRecruit =function(){
      Recruits.addRecruit();
    };
    $scope.recruitListOptions = [
      ['email', function($itemScope) {
          console.log($itemScope);
        },
        [
          ['Favorites'], null, ['All Emails', function($itemScope) {
            console.log($itemScope.user);
          }]
        ]
      ],
      ['Archive', function($itemScope) {
          console.log($itemScope);
        },
        [
          ['Mailing List', function($itemScope) {
            $itemScope.recruit.RecruitStatus_ID = '2';
            Recruits.save($itemScope.recruit);
          }],
          ['Not Interested', function($itemScope) {
            $itemScope.recruit.RecruitStatus_ID = '4';
            Recruits.save($itemScope.recruit);
          }],
          ['No Response', function($itemScope) {
            $itemScope.recruit.RecruitStatus_ID = '5';
            Recruits.save($itemScope.recruit);
          }]
        ]
      ],
      null, // Dividier
      ['Remove', function($itemScope) {
        $scope.items.splice($itemScope.$index, 1);
      }]
    ];
    $scope.saveRecruit = function(recruit){
      Recruits.save(recruit);
    };
    $scope.deleteRecruit = function(ID){
      Recruits.deleteRecruit(ID);
    };
  });
