'use strict';

/**
 * @ngdoc filter
 * @name JFS_Admin.filter:cmdate
 * @function
 * @description
 * # cmdate
 * Filter in the JFS_Admin.
 */
angular.module('JFS_Admin')
  .filter('cmdate', [
    '$filter',
    function($filter) {
        return function(input, format) {
            if(input === null){return '';}
            else {return $filter('date')(new Date(input), format, 'UTC');}
        };
    }
]);
angular.module('JFS_Admin')
.filter('momentdate', [
  '$filter',
  function($filter) {
      return function(input, format) {
          if (input === null) { return '';}
          else { return moment(input).format(format);}
      };
  }
]);
angular.module('JFS_Admin')
.filter('momentdateRelative', [
  '$filter',
  function($filter) {
      return function(input, format) {
          if (input === null) { return '';}
          else { return moment(input).fromNow();}
      };
  }
]);
