'use strict';

/**
 * @ngdoc function
 * @name JFS_Admin.controller:ResourceCtrl
 * @description
 * # ResourceCtrl
 * Controller of the JFS_Admin
 */
angular.module('JFS_Admin')
  .controller('ResourceCtrl', function ($rootScope,$scope,User,Dropbox,$timeout) {
      $scope.Folder = {PreviousPath:''};
      $scope.goToFolder = function(item){
      Dropbox.listFolder(item.id,{Authorization:'Bearer '+ $rootScope.GlobalSettings.DropBox.Access_Token_Global})
      .then(function(data){
        $scope.Folder.PreviousPath = $scope.Folder.CurrentPath;
        $scope.Folder.content = data.entries;
        $scope.Folder.CurrentPath = item;
      });
    };
    $scope.folderSort = function(item){
      switch (item['.tag']) {
            case 'folder':
                return [1,item.name];

            case 'file':
                return [2,item.name];
        }
    };
    $scope.goToFolder({id:''});
    $scope.fileIcon = function(item){
      if(item['.tag'] == 'folder'){
        return 'folder';
      }
      else{
      var type = item.name.substring(item.name.lastIndexOf('.')+1, item.name.length) || "";
      if(['png','bmp','jpg','jpeg','tiff','gif'].indexOf(type)!== -1){
        return 'page_white_picture';
      }
      if(['application/x-rar-compressed', 'application/octet-stream','application/zip'].indexOf(type)!== -1){
        return 'page_white_zip';
      }
      if(['application/vnd.oasis.opendocument.text','application/x-iwork-pages-sffpages','application/msword','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.openxmlformats-officedocument.wordprocessingml.template','application/vnd.ms-word.document.macroEnabled.12','application/vnd.ms-word.template.macroEnabled.12','doc','docx'].indexOf(type)!== -1){
        return 'page_white_word';
      }
      if(['application/vnd.ms-powerpoint','application/vnd.openxmlformats-officedocument.presentationml.presentation','application/vnd.openxmlformats-officedocument.presentationml.template','application/vnd.openxmlformats-officedocument.presentationml.slideshow','application/vnd.ms-powerpoint.addin.macroEnabled.12','application/vnd.ms-powerpoint.presentation.macroEnabled.12','application/vnd.ms-powerpoint.template.macroEnabled.12','application/vnd.ms-powerpoint.slideshow.macroEnabled.12','ppt','pptx'].indexOf(type)!== -1){
        return 'page_white_powerpoint';
      }
      if(['application/pdf','pdf'].indexOf(type)!== -1){
        return 'page_white_acrobat';
      }
      if(['application/vnd.oasis.opendocument.spreadsheet','application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/vnd.openxmlformats-officedocument.spreadsheetml.template','application/vnd.ms-excel.sheet.macroEnabled.12','application/vnd.ms-excel.template.macroEnabled.12','application/vnd.ms-excel.addin.macroEnabled.12','application/vnd.ms-excel.sheet.binary.macroEnabled.12','csv','xlsx','xls'].indexOf(type)!== -1){
        return 'page_white_excel';
      }
      else{
        return 'page_white_text';
      }
    }

    };

    });
