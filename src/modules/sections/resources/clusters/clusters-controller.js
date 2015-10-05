'use strict';

angular.module('rhev.resources.clusters').controller('resources.clustersController', ['$scope', 'ChartsDataMixin', '$translate', '$resource',
  function( $scope, chartsDataMixin, $translate, $resource ) {

    $scope.clustersListId = 'resources-clusters-list';

    var matchesFilter = function (cluster, filter) {
      var match = true;

      if (filter.id === 'name') {
        match = cluster.name.match(filter.value) !== null;
      }
      return match;
    };

    var matchesFilters = function (cluster, filters) {
      var matches = true;

      filters.forEach(function(filter) {
        if (!matchesFilter(cluster, filter)) {
          matches = false;
          return false;
        }
      });
      return matches;
    };

    $scope.applyFilters = function () {
      if ($scope.toolbarConfig.filterConfig.appliedFilters && $scope.toolbarConfig.filterConfig.appliedFilters.length > 0) {
        $scope.clusters = [];
        $scope.allClusters.forEach(function (cluster) {
          if (matchesFilters(cluster, $scope.toolbarConfig.filterConfig.appliedFilters)) {
            $scope.clusters.push(cluster);
          }
        });
      } else {
        $scope.clusters = $scope.allClusters;
      }
      $scope.toolbarConfig.filterConfig.resultsCount = $scope.clusters.length;
    };

    var filterChange = function (filters) {
      $rootScope.resourcesClustersFilters = filters;
      $scope.applyFilters();
    };

    var filterConfig = {
      fields: [
        {
          id: 'name',
          title:  'Name',
          placeholder: 'Filter by Name',
          filterType: 'text'
        }
      ],
      resultsCount: 0,
      appliedFilters: [],
      onFilterChange: filterChange
    };

    var createCluster = function (action) {
    };

    var editCluster = function (action) {
    };

    var fakeClusterAction = function (action) {
    };

    var actionsConfig = {
      primaryActions: [
        {
          name: 'Create Cluster',
          title: 'Create a cluster',
          actionFn: createCluster
        },
        {
          name: 'Edit Cluster',
          title: 'Edit the selected cluster',
          actionFn: editCluster
        }
      ],
      moreActions: [
        {
          name: 'Fake Cluster Action',
          title: 'Perform another action',
          actionFn: fakeClusterAction
        },
        {
          name: 'Another Action',
          title: 'Do something else',
          actionFn: fakeClusterAction
        },
        {
          name: 'Disabled Action',
          title: 'Unavailable action',
          actionFn: fakeClusterAction,
          isDisabled: true
        },
        {
          name: 'Something Else',
          title: '',
          actionFn: fakeClusterAction
        },
        {
          isSeparator: true
        },
        {
          name: 'Grouped Action 1',
          title: 'Do something',
          actionFn: fakeClusterAction
        },
        {
          name: 'Grouped Action 2',
          title: 'Do something similar',
          actionFn: fakeClusterAction
        }
      ]
    };

    $scope.toolbarConfig = {
      filterConfig: filterConfig,
      actionsConfig: actionsConfig
    };

    var handleClusterClick = function(item) {
      // Update details view
    };

    $scope.listConfig = {
      selectionMatchProp: 'uuid',
      selectedItems: [],
      checkDisabled: false,
      onClick: handleClusterClick
    };

    $scope.clustersLoaded = false;
    var clustersResource = $resource('/resources/clusters/all');
    clustersResource.get(function(response) {
      $scope.allClusters = response.clusters;
      $scope.applyFilters();
      $scope.clustersLoaded = true;
      $scope.lastUpdateTime = new Date();
      console.dir($scope.allClusters);
    });

  }
]);
