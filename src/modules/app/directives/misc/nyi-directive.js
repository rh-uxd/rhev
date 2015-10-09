'use strict';
angular.module( 'rhev.misc' ).directive('rhevNyi', function() {
  return {
    restrict: 'A',
    scope: {
      title: '@',
      viewType: '@?'
    },
    templateUrl: 'modules/app/directives/misc/nyi.html',
    controller: ['$scope', '$rootScope',
        function($scope, $rootScope) {
          $scope.viewType = $scope.viewType || 'section';
        }
    ]
  };
});
