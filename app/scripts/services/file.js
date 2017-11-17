'use strict';

/**
 * @ngdoc service
 * @name JFS_Admin.file
 * @description
 * # file
 * Factory in the JFS_Admin.
 */
angular.module('JFS_Admin')
  .factory('File', function(FileUploader,UUID) {
    // Service logic
    var uploader ={};
    var File = {
      data: {}
    };

    File.data.recruitUploader = new FileUploader({
        //url: 'https://api-content.dropbox.com/1/files_put/auto/Temp/',
        url: 'https://content.dropboxapi.com/2/files/upload',
        headers: {
          Authorization: 'Bearer Q97s2PcThkMAAAAAAAB12r6Z6FAIKdLFxUy8uTSFqAv2VnRRG6QxtK80OukeGzBh',
          "Dropbox-API-Arg": {"path": "/Homework/math/Matrices.txt","mode": "add","autorename": false},
          "Content-Type": "application/octet-stream"


        },
        method: 'POST',
        disableMultipart: true
      });

      File.data.recruitUploader.onAfterAddingFile = function(fileItem) {
        console.info('onAfterAddingFile', fileItem);
    };
    File.data.recruitUploader.onBeforeUploadItem = function(item) {
      var re = /(?:\.([^.]+))?$/;
       var ext = re.exec(item.file.name)[1]; // "txt"
       item.newName = UUID.newuuid() + '.' + ext;
       item.ext = ext;
       console.log(item);
       item.headers['Dropbox-API-Arg'].path = '/Temp/'+ item.newName;
       item.headers['Dropbox-API-Arg'] = angular.toJson( item.headers['Dropbox-API-Arg']);
       //item.url = item.url + item.newName;
   };

    // Public API here
    return File;
  });
