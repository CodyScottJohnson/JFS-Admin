'use strict';

/**
 * @ngdoc function
 * @name JFS_Admin.controller:RecruitCtrl
 * @description
 * # RecruitCtrl
 * Controller of the JFS_Admin
 */
angular.module('JFS_Admin')
  .controller('RecruitCtrl', function ($scope,$rootScope,Task,Recruits,recruit,Dropbox,Functions,FileUploader,File) {
    $scope.Task =Task.data;
    $scope.Recruit = recruit.data;
    $scope.options2 = {
        segmentStrokeWidth: 1
    };
    $scope.colors2 = ['#97BBCD', '#DCDCDC', '#F7464A', '#FDB45C'];
    $scope.labels2 = ['', '', '', ''];
    $scope.previewFile = function(file){
        Dropbox.PreviewFile(file).then(function(data){Functions.OpenModal('views/Modals/FilePreview.html', 'lg',data);});
    };
    $scope.uploadFile = function(){
      Functions.OpenModal('views/Modals/FileUpload.html', 'lg');
    };
    $scope.File = File.data;
    $scope.File.recruitUploader.onSuccessItem = function(fileItem, response, status, headers) {
      console.info('onSuccessItem', fileItem, response, status, headers);
      var newDoc = {
           filePath: response.path,
           fileName: fileItem.newName,
           fileType: fileItem.ext,
           fileSize: response.bytes,
           fileIcon: response.icon,
           fileUploaded: new Date(),
           fileUploadedBy: $rootScope.currentUser.user_id,
           title: fileItem.file.name

       }
       $scope.Recruit.currentRecruit.Info.Documents.push(newDoc);
    }
 console.log($scope.File);
    recruit.setRecruit(10336);
  });
