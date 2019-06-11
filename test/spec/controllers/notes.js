'use strict';

describe('Controller: NotesCtrl', function () {

  // load the controller's module
  beforeEach(module('JFS_Admin'));

  var NotesCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NotesCtrl = $controller('NotesCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(NotesCtrl.awesomeThings.length).toBe(3);
  });
});
