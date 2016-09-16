'use strict';

describe('Controller: AgentsCtrl', function () {

  // load the controller's module
  beforeEach(module('JFS_Admin'));

  var AgentsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AgentsCtrl = $controller('AgentsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AgentsCtrl.awesomeThings.length).toBe(3);
  });
});
