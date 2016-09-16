'use strict';

/**
 * @ngdoc function
 * @name JFS_Admin.controller:ArchivedrecruitsCtrl
 * @description
 * # ArchivedrecruitsCtrl
 * Controller of the JFS_Admin
 */
angular.module('JFS_Admin')
  .controller('ArchivedRecruitsCtrl', function($rootScope,$scope, $filter, $http, $state, $window, $stateParams,Recruits) {
    $scope.search3 = $stateParams.search;
    $scope.ArchivedRecruits = [];
    $scope.archivedRecruitOptions = [
      ['email', function($itemScope) {
          console.log($itemScope);
        },
        [
          ['Favorites'], null, ['All Emails', function($itemScope) {

          }]
        ]
      ],
      ['Archive', function($itemScope) {
          console.log($itemScope);
        },
        [
          ['Mailing List', function($itemScope) {
            $scope.UpdateRecruit($itemScope.user.INDV_ID, {
              RecruitStatus_ID: 2
            });
            $itemScope.user.RecruitStatus_ID = 2;
          }],
          ['Not Interested', function($itemScope) {
            $scope.UpdateRecruit($itemScope.user.INDV_ID, {
              RecruitStatus_ID: 4
            });
            $itemScope.user.RecruitStatus_ID = 4;
          }],
          ['No Response', function($itemScope) {
            $scope.UpdateRecruit($itemScope.user.INDV_ID, {
              RecruitStatus_ID: 5
            });
            $itemScope.user.RecruitStatus_ID = 5;
          }]
        ]
      ],
      ['Un-Archive', function($itemScope) {
        $scope.UpdateRecruit($itemScope.recruit.INDV_ID, {
          RecruitStatus_ID: 1
        });
        $itemScope.recruit.RecruitStatus_ID=1;
        Recruits.updateRecruits();
      }],
      null, // Dividier
      ['Remove', function($itemScope) {
        $scope.items.splice($itemScope.$index, 1);
      }]
    ];
    $scope.GetArchivedRecruits = function(id) {
        $http({
          method: 'GET',
          url: 'https://jfsapp.com/Secure/API/Recruits/' + id,
          params: {
            'access_token': $rootScope.currentUser.Token.access_token,
            client_id: 'testclient',
            client_secret: 'testpass'
          }
        }).then(function(data) {
          $scope.ArchivedRecruits = data.data;
        });

    };
    $scope.UpdateRecruit = function(id, recruit_data) {
      $http({
                  method: 'PATCH',
                  url:  'https://jfsapp.com/Secure/API/Recruits/'+id,
                  data:recruit_data,
                  params: {
                      'access_token': $rootScope.currentUser.Token.access_token,
                      client_id: 'testclient',
                      client_secret: 'testpass'
                  }
              });
    };
    $scope.deleteRecruit = function(ID){
      Recruits.deleteRecruit(ID);
    };
    $scope.GetArchivedRecruits($scope.search3.RecruitStatus_ID);
  });
