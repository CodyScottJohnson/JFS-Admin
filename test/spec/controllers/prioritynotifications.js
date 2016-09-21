'use strict';

describe('Controller: PrioritynotificationsCtrl', function () {

  // load the controller's module
  beforeEach(module('JFS_Admin'));

  var PrioritynotificationsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PrioritynotificationsCtrl = $controller('PrioritynotificationsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PrioritynotificationsCtrl.awesomeThings.length).toBe(3);
  });
});
