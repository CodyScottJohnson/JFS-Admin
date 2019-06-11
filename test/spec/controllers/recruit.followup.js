'use strict';

describe('Controller: RecruitFollowupCtrl', function () {

  // load the controller's module
  beforeEach(module('JFS_Admin'));

  var RecruitFollowupCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    RecruitFollowupCtrl = $controller('RecruitFollowupCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(RecruitFollowupCtrl.awesomeThings.length).toBe(3);
  });
});
