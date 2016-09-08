'use strict';

describe('Controller: StyleCtrl', function () {

  // load the controller's module
  beforeEach(module('JFS_Admin'));

  var StyleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StyleCtrl = $controller('StyleCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(StyleCtrl.awesomeThings.length).toBe(3);
  });
});
