'use strict';

describe('Filter: cmdate', function () {

  // load the filter's module
  beforeEach(module('JFS_Admin'));

  // initialize a new instance of the filter before each test
  var cmdate;
  beforeEach(inject(function ($filter) {
    cmdate = $filter('cmdate');
  }));

  it('should return the input prefixed with "cmdate filter:"', function () {
    var text = 'angularjs';
    expect(cmdate(text)).toBe('cmdate filter: ' + text);
  });

});
