'use strict';

describe('Service: UUID', function () {

  // load the service's module
  beforeEach(module('JFS_Admin'));

  // instantiate service
  var UUID;
  beforeEach(inject(function (_UUID_) {
    UUID = _UUID_;
  }));

  it('should do something', function () {
    expect(!!UUID).toBe(true);
  });

});
