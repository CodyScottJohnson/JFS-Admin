'use strict';

describe('Service: dropbox', function () {

  // load the service's module
  beforeEach(module('JFS_Admin'));

  // instantiate service
  var dropbox;
  beforeEach(inject(function (_dropbox_) {
    dropbox = _dropbox_;
  }));

  it('should do something', function () {
    expect(!!dropbox).toBe(true);
  });

});
