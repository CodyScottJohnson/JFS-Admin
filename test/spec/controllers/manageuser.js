'use strict';

describe('Controller: ManageuserCtrl', function () {

  // load the controller's module
  beforeEach(module('JFS_Admin'));

  var ManageuserCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ManageuserCtrl = $controller('ManageuserCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ManageuserCtrl.awesomeThings.length).toBe(3);
  });
});
