'use strict';

/**
 * @ngdoc filter
 * @name JFS_Admin.filter:phone
 * @function
 * @description
 * # phone
 * Filter in the JFS_Admin.
 */

function convertToDecimal(num, decimal){
    return Math.round(num * Math.pow(10,decimal)) / (Math.pow(10, decimal));
  }
angular.module('JFS_Admin')
  .filter('phone', function () {
    return function (tel) {
       if (!tel) { return ''; }

       var value = tel.toString().trim().replace(/^\+/, '');

       if (value.match(/[^0-9]/)) {
           return tel;
       }

       var country, city, number;

       switch (value.length) {
           case 10: // +1PPP####### -> C (PPP) ###-####
               country = 1;
               city = value.slice(0, 3);
               number = value.slice(3);
               break;

           case 11: // +CPPP####### -> CCC (PP) ###-####
               country = value[0];
               city = value.slice(1, 4);
               number = value.slice(4);
               break;

           case 12: // +CCCPP####### -> CCC (PP) ###-####
               country = value.slice(0, 3);
               city = value.slice(3, 5);
               number = value.slice(5);
               break;

           default:
               return tel;
       }

       if (country == 1) {
           country = "";
       }

       number = number.slice(0, 3) + '-' + number.slice(3);

       return (country + " (" + city + ") " + number).trim();
   };
  })
  .filter('moneyFmt', function () {
    return function (number, decimal) {
      number = Number(number);
      if(angular.isNumber(decimal)  && decimal%1===0 && decimal >= 0 &&
      angular.isNumber(number)){
        if(number < 1e3) {
          return '$ ' + number;  // Coerce to string
        } else if(number < 1e6) {
          return '$ '+convertToDecimal((number / 1e3), decimal) + ' K';
        } else if(number < 1e9){
          return '$ '+convertToDecimal((number / 1e6), decimal) + ' M';
        } else {
          return '$ '+ convertToDecimal((number / 1e9), decimal) + ' B';
        }

      }
      return '$ 0';
    };
  });
 