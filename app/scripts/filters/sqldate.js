'use strict';

/**
 * @ngdoc filter
 * @name JFS_Admin.filter:sqldate
 * @function
 * @description
 * # sqldate
 * Filter in the JFS_Admin.
 */
angular.module('JFS_Admin')
  .filter('sqldate', [
    '$filter',
    function($filter) {
        return function(input, format) {
            if (input === null){ return '';}
            else{ return $filter('date')(new Date(input+'z'), format);}
        };
    }
])
.filter('momentdate', [
  '$filter',
  function($filter) {
      return function(input, format) {
          if (input === null){ return '';}
          else{ return moment(input).format(format);}
      };
  }
]);
