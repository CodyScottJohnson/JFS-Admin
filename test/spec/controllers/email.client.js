'use strict';

describe('Controller: EmailClientCtrl', function () {

  // load the controller's module
  beforeEach(module('JFS_Admin'));

  var EmailClientCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EmailClientCtrl = $controller('EmailClientCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EmailClientCtrl.awesomeThings.length).toBe(3);
  });
});
