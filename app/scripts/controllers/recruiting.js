'use strict';

/**
 * @ngdoc function
 * @name jfsApp.controller:RecruitingCtrl
 * @description
 * # RecruitingCtrl
 * Controller of the jfsApp
 */
angular.module('JFS_Admin')
  .controller('RecruitingCtrl', function($scope, recruit, Recruits, Task, Functions, Email,$location,$stateParams) {
    $scope.Archived = 0;
    if(angular.isDefined($stateParams.Archived))
    {
      $scope.Archived = $stateParams.Archived;
    }
    $scope.TagSearch = [];
    // => true
    $scope.tags = Functions.loadTags;
    $scope.colors2 = ['#97BBCD', '#DCDCDC', '#F7464A', '#FDB45C'];
    $scope.labels2 = ['', '', '', ''];
    Task.getUsersTasks(true);
    $scope.Task = Task.data;
    $scope.removeFlag = function(task) {
      task.Status = 'Completed';
      Task.updateTask(task);
    };
    $scope.tagSearch = function( tags ) {
     return function( item ) {
       var tagsFound = true;
        angular.forEach(tags,function(tag){
          console.log(tag);
          if(tagsFound){
            tagsFound =_.some(item.Tags, tag);
          }
        });
        return tagsFound;
      };
  };
    var customItem = {
      html: '<a style="cursor: pointer"><i class="fa fa-user"></i>cody</a>',
      enabled: function() {
        return true;
      },
      click: function($itemScope, $event, value) {
        console.log("custom html");
      }
    };
    $scope.tagRemoved = function(tag, recruit) {
      Recruits.deleteTag(recruit, tag.id)
        .then(
          function() {
            return true;
          },
          function() {
            return false;
          });
    };
    $scope.tagAdded = function(tag, recruit) {
      if (angular.isDefined(tag.id)) {
        Recruits.addTag(recruit, tag.id)
          .then(
            function() {
              Recruits.updateRecruits();
              return true;
            },
            function() {
              return false;
            });
      } else {
        Functions.editTags(tag).then(function(newtag) {
          tag = newtag;
          Recruits.addTag(recruit, tag.id)
            .then(
              function() {
                return true;
              },
              function() {
                return false;
              });
        }, function(err) {
          return false;
        });
      }
    };
    $scope.loadTags = function(query) {
      return $scope.tags;
    };
    $scope.itemsPerPage = 10;
    $scope.Recruits = Recruits.data;
    $scope.Recruits.currentPage = 1;
    $scope.addRecruit = function() {
      Recruits.addRecruit();
    };

    if($scope.Archived === 0){
    $scope.ArchiveRecruit = ['Archive', function($itemScope) {
        $itemScope.recruit.Archived = 1;
        Recruits.save($itemScope.recruit);
      }
    ];
  }
  if($scope.Archived === 1){
    $scope.ArchiveRecruit = ['Un-Archive', function($itemScope) {
        $itemScope.recruit.Archived = 0;
        Recruits.save($itemScope.recruit);
      }
    ];
  }

    $scope.recruitListOptions = [
      ['New Task', function($itemScope) {
        //console.log($itemScope.recruit.INDV_ID);
        Task.newTask({
          Recruit_ID: $itemScope.recruit.INDV_ID
        });
        Functions.OpenModal('views/Modals/TaskModal.html', 'md');
      }, false],
      ['Quick Look', function($itemScope) {
          //console.log($itemScope.recruit.INDV_ID);
        },
        [
          ['Notes', function($itemScope) {
            recruit.setRecruit($itemScope.recruit.INDV_ID).then(function(data) {
              Functions.OpenModal('views/Modals/NotesModal.html', 'md');
            });
          }],
          ['Tasks', function($itemScope) {
            recruit.setRecruit($itemScope.recruit.INDV_ID).then(function(data) {
              Functions.OpenModal('views/Recruiting/modals/taskModal.html', 'md');
            });
          }]
        ]
      ],
      ['Email', function($itemScope) {
          console.log($itemScope);
        },
        [
          ['Standard', function($itemScope) {

            },
            [
              ['Contact Info', function($itemScope) {
                var email_info = {
                  FNAME: $itemScope.recruit.FNAME,
                  To: $itemScope.recruit.EMAIL
                };
                var data = {
                  'Email': email_info
                };
                Email.SendContactCard(data);
              }]
            ]
          ],
          ['Favorites'], null, ['All Emails', function($itemScope) {
            console.log($itemScope.user);
          }]
        ]
      ],
      $scope.ArchiveRecruit,

      null, // Dividier
      ['Remove', function($itemScope) {
        $scope.items.splice($itemScope.$index, 1);
      }]
    ];
    $scope.TableDefaults = {
      type: ['Initial Contact', 'Liscencing', 'ACP', 'Contract'],
      Source: ['Referal', 'PO', 'COI', 'ARS', 'Handshake','LinkedIn', 'Other']
    };
    $scope.advancedSearch = {
      'show': true
    };
    $scope.saveRecruitStatus = function(recruit) {
      recruit.NextStepUpdated = moment();
      $scope.saveRecruit(recruit);
    };
    $scope.saveRecruit = function(recruit) {
      Recruits.save(recruit);
    };
    $scope.deleteRecruit = function(ID) {
      Recruits.deleteRecruit(ID);
    };
    $scope.reload = function() {
      $scope.search = null;
      $scope.search2 = null;
      Recruits.updateRecruits();
    };
  });
