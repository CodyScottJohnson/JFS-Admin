'use strict';

describe('Filter: sqldate', function () {

  // load the filter's module
  beforeEach(module('JFS_Admin'));

  // initialize a new instance of the filter before each test
  var sqldate;
  beforeEach(inject(function ($filter) {
    sqldate = $filter('sqldate');
  }));

  it('should return the input prefixed with "sqldate filter:"', function () {
    var text = 'angularjs';
    expect(sqldate(text)).toBe('sqldate filter: ' + text);
  });

});
