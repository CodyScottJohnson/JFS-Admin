'use strict';

/**
 * @ngdoc service
 * @name JFS_Admin.Functions
 * @description
 * # Functions
 * Factory in the JFS_Admin.
 */
angular.module('JFS_Admin')
  .factory('Functions', function () {
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
