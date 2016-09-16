'use strict';

describe('Service: Recruits', function () {

  // load the service's module
  beforeEach(module('JFS_Admin'));

  // instantiate service
  var Recruits;
  beforeEach(inject(function (_Recruits_) {
    Recruits = _Recruits_;
  }));

  it('should do something', function () {
    expect(!!Recruits).toBe(true);
  });

});
