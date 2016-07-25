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
        url: 'https://api-content.dropbox.com/1/files_put/auto/Temp/',
        headers: {
          Authorization: 'Bearer Q97s2PcThkMAAAAAAAB12r6Z6FAIKdLFxUy8uTSFqAv2VnRRG6QxtK80OukeGzBh',

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
       item.url = item.url + item.newName;
   };

    // Public API here
    return File
  });
