'use strict';

describe('Controller: EmailPeopleCtrl', function () {

  // load the controller's module
  beforeEach(module('JFS_Admin'));

  var EmailPeopleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EmailPeopleCtrl = $controller('EmailPeopleCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EmailPeopleCtrl.awesomeThings.length).toBe(3);
  });
});
