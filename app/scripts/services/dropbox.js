'use strict';

/**
 * @ngdoc service
 * @name JFS_Admin.dropbox
 * @description
 * # dropbox
 * Factory in the JFS_Admin.
 */
angular.module('JFS_Admin')
  .factory('dropbox', function () {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      someMethod: function () {
        return meaningOfLife;
      }
    };
  });
