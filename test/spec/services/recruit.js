'use strict';

describe('Service: recruit', function () {

  // load the service's module
  beforeEach(module('JFS_Admin'));

  // instantiate service
  var recruit;
  beforeEach(inject(function (_recruit_) {
    recruit = _recruit_;
  }));

  it('should do something', function () {
    expect(!!recruit).toBe(true);
  });

});
