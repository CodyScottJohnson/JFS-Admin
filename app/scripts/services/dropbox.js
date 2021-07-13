'use strict';

/**
 * @ngdoc service
 * @name JFS_Admin.dropbox
 * @description
 * # dropbox
 * Factory in the JFS_Admin.
 */
angular.module('JFS_Admin')
  .factory('Dropbox', function($rootScope, $http, $sce, $window, $q, FileSaver, Blob,User) {
    // Service logic
    // ...
    //while(!User.data.GlobalSettings.DropBox.access_token){
    //}
    var oauth = {
      //access_token: $rootScope.GlobalSettings.DropBox.access_token
    };
    var Dropbox = {
      data: {}
    };
    /**
     * Dropbox API Servers
     */
    var authServer = 'https://www.dropbox.com',
      apiServer = 'https://api.dropboxapi.com',
      fileServer = 'https://content.dropboxapi.com';


    /**
     * API Method URLs
     */

    var urls = {
      // Authentication.
      authorize: authServer + '/1/oauth2/authorize',
      token: apiServer + '/1/oauth2/token',
      signOut: apiServer + '/1/unlink_access_token',

      // Accounts.
      accountInfo: apiServer + '/1/account/info',

      // Files and metadata.
      getFile: fileServer + '/2/files/download',
      listFolder: apiServer + '/2/files/list_folder',
      postFile: fileServer + '/1/files/auto/',
      putFile: fileServer + '/1/files_put/auto/',
      preview: fileServer + '/2/files/get_preview',
      metadata: apiServer + '/1/metadata/auto/',
      delta: apiServer + '/1/delta',
      revisions: apiServer + '/1/revisions/auto/',
      restore: apiServer + '/1/restore/auto/',
      search: apiServer + '/1/search/auto/',
      shares: apiServer + '/1/shares/auto',
      media: apiServer + '/1/media/auto',
      copyRef: apiServer + '/1/copy_ref/auto',
      thumbnails: fileServer + '/1/thumbnails/auto',
      chunkedUpload: fileServer + '/1/chunked_upload',
      commitChunkedUpload: fileServer + '/1/commit_chunked_upload/auto',
      createShareLink: apiServer + '/2/sharing/create_shared_link_with_settings',
      // File operations.
      fileopsCopy: apiServer + '/1/fileops/copy',
      fileopsCreateFolder: apiServer + '/1/fileops/create_folder',
      fileopsDelete: apiServer + '/1/fileops/delete',
      fileopsMove: apiServer + '/1/fileops/move'
    };
    /**
     * OAuth 2.0 Signatures
     */

    function oauthHeader(options) {
      if (!options.headers) {
        options.headers = {};
      }
      if(!options.headers.Authorization){
        options.headers.Authorization = 'Bearer ' + $rootScope.GlobalSettings.DropBox.access_token;
      }
    }

    function oauthParams(options) {
      if (!options.params) {
        options.params = {};
      }
      options.params.access_token = oauth.access_token;
    }


    /**
     * HTTP Request Helper
     */

    function request(config) {
      var deferred = $q.defer();

      oauthHeader(config);

      function success(response) {
        //console.log(response);
        deferred.resolve(response);
      }

      function failure(fault) {
        console.log(config, fault);
        deferred.reject(fault);
      }

      $http(config).then(success, failure);
      return deferred.promise;
    }


    /**
     * HTTP GET Helper
     */

    function GET(url, params,data,options) {
      var responseType = 'text';
      if (params) {
        if (params.arrayBuffer) {
          responseType = 'arraybuffer';
          delete params.arrayBuffer;
        } else if (params.blob) {
          responseType = 'blob';
          delete params.blob;
        } else if (params.buffer) {
          responseType = 'buffer';
        } else if (params.binary) {
          responseType = 'b'; // See the Dropbox.Util.Xhr.setResponseType docs
        }
      }
      if(params){
      return request({
        responseType: responseType,
        method: 'POST',
        headers: options,
        url: url,
        data:data,
        params: {
          arg: params
        }
      });
    }
    else{
      return request({
        responseType: responseType,
        method: 'POST',
        headers: options,
        url: url,
        data:data,
      });
    }
    }


    /**
     * HTTP POST Helper
     */
    function POST(url, data, params) {
      return request({
        method: 'POST',
        url: url,
        data: data,
        params: params
      });
    }
    var api = {
      preview: function(path, params, filetype) {
        if (filetype == 'page_white_acrobat') {
          return GET(urls.getFile + path, params);
        } else {
          return GET(urls.preview + path, params);
        }
      },
      download: function(path, params, filetype) {
        return GET(urls.getFile + path, params);
      },
      listFolder: function(data,options) {
        return GET(urls.listFolder, null,data,options);
      },
      share: function(data,options) {
        return GET(urls.createShareLink, null,data,options);
      }
    };

    Dropbox.getAuth = function() {
      return oauth.access_token;
    };

    Dropbox.PreviewFile = function(document) {
      var deferred = $q.defer();

      var Preview = {};
      api.preview('', {
        blob: true,
        path: document.filePath
      }, document.fileIcon).then(function(data) {
        var url = $window.URL || $window.webkitURL;
        var type;
        if (document.fileType == 'xlsx') {
          type = "text/html";
        } else {
          type = 'application/pdf';
        }
        var blob = new Blob([data.data], {
          type: type
        });
        var temp = url.createObjectURL(blob);
        Preview.type = data.headers('Content-Type');
        Preview.fileUrl = $sce.trustAsResourceUrl(temp);
        deferred.resolve(Preview);
      }, function(error) {
        deferred.reject(error);
      });
      return deferred.promise;
    };
    Dropbox.getFile = function(document) {
      var deferred = $q.defer();
      api.download('', {
        blob: true,
        path: document.filePath
      }).then(function(data) {
        FileSaver.saveAs(data.data, document.title.replace(/^.*[\\\/]/, '') + '.' + document.fileType);
        deferred.resolve(data);
      });
      return deferred.promise;
    };
    Dropbox.listFolder = function(path,options) {
      var deferred = $q.defer();
      api.listFolder({
        path: path
      },options).then(function(data) {
        deferred.resolve(data.data);
      });
      return deferred.promise;
    };
    Dropbox.shareFile = function(path,options) {
      var deferred = $q.defer();
      api.listFolder({
        path: path
      },options).then(function(data) {
        deferred.resolve(data.data);
      });
      return deferred.promise;
    };



    // Public API here
    return Dropbox;
  });
