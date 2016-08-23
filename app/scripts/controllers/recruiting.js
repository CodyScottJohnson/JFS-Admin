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
    $scope.Recruits = Recruits.data;
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
            $scope.UpdateRecruit($itemScope.user.ID, {
              RecruitStatus_ID: 2
            });
            $itemScope.user.RecruitStatus_ID = 2;
          }],
          ['Not Interested', function($itemScope) {
            $scope.UpdateRecruit($itemScope.user.ID, {
              RecruitStatus_ID: 4
            });
            $itemScope.user.RecruitStatus_ID = 4;
          }],
          ['No Response', function($itemScope) {
            $scope.UpdateRecruit($itemScope.user.ID, {
              RecruitStatus_ID: 5
            });
            $itemScope.user.RecruitStatus_ID = 5;
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
  });
