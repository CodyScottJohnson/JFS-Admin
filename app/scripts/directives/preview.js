'use strict';

/**
 * @ngdoc directive
 * @name JFS_Admin.directive:preview
 * @description
 * # preview
 */
angular.module('JFS_Admin')
  .directive('preview', function () {
    return {
         restrict: 'E',
         replace: true,
         link: function(scope, element, attrs) {
             attrs.$observe(
                 "src",
                 function() {
                     //console.log(attrs.src);
                     //console.log(element.attr('src'));
                     var url = element.attr('src');
                     var type = attrs.type;
                     element.html("");
                     element.append('<object class="scrollbar"  style="height:100%;width:100%;overflow:hidden" data="' + url + '"></object>');



                 });
         }
     };
  });
