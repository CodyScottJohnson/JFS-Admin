'use strict';

describe('Service: Notifications', function () {

  // load the service's module
  beforeEach(module('JFS_Admin'));

  // instantiate service
  var Notifications;
  beforeEach(inject(function (_Notifications_) {
    Notifications = _Notifications_;
  }));

  it('should do something', function () {
    expect(!!Notifications).toBe(true);
  });

});
