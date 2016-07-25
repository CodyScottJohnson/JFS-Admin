'use strict';

describe('Service: file', function () {

  // load the service's module
  beforeEach(module('JFS_Admin'));

  // instantiate service
  var file;
  beforeEach(inject(function (_file_) {
    file = _file_;
  }));

  it('should do something', function () {
    expect(!!file).toBe(true);
  });

});
