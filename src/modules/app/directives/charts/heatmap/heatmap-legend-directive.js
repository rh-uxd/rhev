angular.module('rhev.charts').directive('rhevHeatMapLegend',
  function() {
    'use strict';
    return {
      restrict: 'A',
      scope: {
        legend: '=',
        legendColors: '=?'
      },
      replace: true,
      templateUrl: 'modules/app/directives/charts/heatmap/heatmap-legend.html',
      controller: ['$scope', '$rootScope',
        function($scope, $rootScope) {
          var items = [];

          var legendColors = $scope.legendColors || ['#d4f0fa', '#F9D67A', '#EC7A08', '#CE0000'];

          if ($scope.legend) {
            for (var i = $scope.legend.length - 1; i >= 0; i--) {
              items.push({
                text: $scope.legend[i],
                color: legendColors[i]
              });
            }
          }
          $scope.legendItems = items;
        }]
    };
  }
);
