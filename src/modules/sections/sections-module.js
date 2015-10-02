
angular.module('rhev.sections', ['rhev.administration', 'rhev.dashboard', 'rhev.resources'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/dashboard', {
        templateUrl: 'modules/sections/dashboard/dashboard.html',
        controller: 'sections.dashboardController'
      })
      .when('/administration', {
        templateUrl: 'modules/sections/administration/administration.html',
        controller: 'sections.administrationController'
      })
  }]);
