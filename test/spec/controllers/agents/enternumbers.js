'use strict';

describe('Controller: AgentsEnternumbersCtrl', function () {

  // load the controller's module
  beforeEach(module('JFS_Admin'));

  var AgentsEnternumbersCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AgentsEnternumbersCtrl = $controller('AgentsEnternumbersCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AgentsEnternumbersCtrl.awesomeThings.length).toBe(3);
  });
});
