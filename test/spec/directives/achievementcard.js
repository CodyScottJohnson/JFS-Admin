'use strict';

describe('Directive: AchievementCard', function () {

  // load the directive's module
  beforeEach(module('JFS_Admin'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<-achievement-card></-achievement-card>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the AchievementCard directive');
  }));
});
