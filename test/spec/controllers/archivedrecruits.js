'use strict';

describe('Controller: ArchivedrecruitsCtrl', function () {

  // load the controller's module
  beforeEach(module('JFS_Admin'));

  var ArchivedrecruitsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ArchivedrecruitsCtrl = $controller('ArchivedrecruitsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ArchivedrecruitsCtrl.awesomeThings.length).toBe(3);
  });
});
