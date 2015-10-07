'use strict';

angular.module('rhev.resources.clusters').controller('resources.clustersController', ['$scope', 'ChartsDataMixin', '$translate', '$resource', '$timeout',
  function( $scope, chartsDataMixin, $translate, $resource, $timeout ) {

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

    $scope.hostStatusThresholdRange = [1, 2];
    $scope.hostStatusColorPattern = ['#bee1f4', '#F9D67A', '#bbbbbb'];
    $scope.hostStatusLegend = ['Running', 'Maintenance', 'Error'];
    $scope.utilizationLegend = ['< 70%', '70-80%' ,'80-90%', '> 90%'];
    $scope.hostsHeatmapChartHeight =  '70px';

    $scope.vmStatusThresholdRange = [1, 2, 3];
    $scope.vmStatusColorPattern = ['#bee1f4', '#F9D67A', '#bbbbbb', '#d1d1d1'];
    $scope.vmStatusLegend = ['Running', 'Paused', 'Down', 'Unknown'];
    $scope.vmsHeatmapChartHeight =  '88px';

    var compareFn = function (item1, item2) {
      return item2.value - item1.value;
    };

    var getHostStatusData = function(cluster) {
      var statusData = [];

      cluster.hostData.forEach(function (data) {
        var nextData = {};
        if (data.status === 'maintenance')
        {
          nextData.value = 1;
        }
        else if (data.status === 'error')
        {
          nextData.value = 2;
        }
        else
        {
          nextData.value = 0;
        }
        nextData.tooltip = data.id + ": " + data.statusMessage;

        statusData.push(nextData);
      });

      statusData.sort(compareFn);

      return statusData;
    };

    var getHostStatusInfo = function(cluster) {
      var statusInfo = {
        maintenanceCount: 0,
        errorCount: 0,
        runningCount: 0,
        totalCount: cluster.hostData.length
      };

      cluster.hostData.forEach(function (data) {
        var nextData = {};
        if (data.status === 'maintenance')
        {
          statusInfo.maintenanceCount++;
        }
        else if (data.status === 'error')
        {
          statusInfo.errorCount++;
        }
        else
        {
          statusInfo.runningCount++;
        }
      });

      statusInfo.percentError = Math.round((statusInfo.errorCount / statusInfo.totalCount) * 100.0);
      statusInfo.percentMaintenance = Math.round((statusInfo.maintenanceCount / statusInfo.totalCount) * 100.0);
      statusInfo.percentRunning = Math.round((statusInfo.runningCount / statusInfo.totalCount) * 100.0);

      statusInfo.errorTooltip = "Error: " + statusInfo.percentError + "%  (" + statusInfo.errorCount + " of " + statusInfo.totalCount + ")";
      statusInfo.maintenanceTooltip = "Maintenance: " + statusInfo.percentMaintenance + "%  (" + statusInfo.maintenanceCount + " of " + statusInfo.totalCount + ")";
      statusInfo.runningTooltip = "Running: " + statusInfo.percentRunning + "%  (" + statusInfo.runningCount + " of " + statusInfo.totalCount + ")";

      return statusInfo;
    };

    var getHostMemoryData = function(cluster) {
      var memoryData = [];

      cluster.hostData.forEach(function (data) {
        var nextData = {
          memoryUsed: data.memoryUsed,
          memoryTotal: data.memoryTotal,
          value: data.memoryUsed / data.memoryTotal
        };
        var usedPercent = Math.round(nextData.value * 100);
        nextData.tooltip = data.id + ":    " + usedPercent + "% Used   (" + data.memoryUsed + " of " + data.memoryTotal + " GB)";
        memoryData.push(nextData);
      });

      memoryData.sort(compareFn);
      return memoryData;
    };

    var getHostCPUData = function(cluster) {
      var memoryData = [];

      cluster.hostData.forEach(function (data) {
        var nextData = {
          value: data.cpuUsedPercent * 0.01,
          tooltip: data.id + ":    " + data.cpuUsedPercent + "% Used "
        };
        memoryData.push(nextData);
      });

      memoryData.sort(compareFn);
      return memoryData;
    };

    var getVMStatusData = function(cluster) {
      var statusData = [];

      cluster.vmData.forEach(function (data) {
        var nextData = {};
        if (data.status === 'paused')
        {
          nextData.value = 1;
          nextData.statusString = "Paused";
        }
        else if (data.status === 'down')
        {
          nextData.value = 2;
          nextData.statusString = "Down";
        }
        else if (data.status === 'unknown')
        {
          nextData.value = 3;
          nextData.statusString = "Unknown";
        }
        else
        {
          nextData.value = 0;
          nextData.statusString = "Running";
        }
        nextData.tooltip = data.id + ": " + nextData.statusString;

        statusData.push(nextData);
      });

      statusData.sort(compareFn);

      return statusData;
    };

    var getClusterEvents = function (cluster) {
      var events = {
        criticalEvents: [],
        warningEvents: [],
        taskEvents: []
      };

      cluster.events.forEach(function (event) {
        if (event.severity === 'critical') {
          events.criticalEvents.push(event);
        }
        else if (event.severity === 'warning') {
          events.warningEvents.push(event);
        }
        else if (event.severity === 'task') {
          events.taskEvents.push(event);
        }
      });

      return events;
    };

    var getSelectedCluster = function(hostId) {
      var clusterResource = $resource('/resources/clusters/' + hostId);
      clusterResource.get(function(response) {
        $scope.selectedCluster = response.data;
        $scope.selectedCluster.hostsInfo.iconClass = "fa fa-desktop";
        $scope.selectedCluster.hostStatusData = getHostStatusData($scope.selectedCluster);
        $scope.selectedCluster.hostStatusInfo = getHostStatusInfo($scope.selectedCluster);
        $scope.selectedCluster.hostMemoryData = getHostMemoryData($scope.selectedCluster);
        $scope.selectedCluster.hostCPUData = getHostCPUData($scope.selectedCluster);
        $scope.selectedCluster.vmInfo.iconClass = "fa fa-laptop";
        $scope.selectedCluster.vmStatusData = getVMStatusData($scope.selectedCluster);

        $scope.selectedCluster.eventsInfo = getClusterEvents($scope.selectedCluster);

        $timeout(function() {
          $('[data-toggle="tooltip"]').tooltip();
        }, 100);

      });
    };

    var handleSelectionChange = function(items) {
      // Update details view
      if (items && items[0] && items[0].uuid !== undefined) {
        $scope.selectedCluster = getSelectedCluster(items[0].uuid);
      } else {
        $scope.selectedCluster = undefined;
      }
    };

    $scope.clustersListConfig = {
      selectionMatchProp: 'uuid',
      selectItems: true,
      showSelectBox: false,
      selectedItems: [],
      checkDisabled: false,
      onSelectionChange: handleSelectionChange
    };

    $scope.clustersLoaded = false;
    var clustersResource = $resource('/resources/clusters/all');
    clustersResource.get(function(response) {
      $scope.allClusters = response.clusters;
      $scope.applyFilters();
      $scope.clustersLoaded = true;
      $scope.lastUpdateTime = new Date();
    });

    $scope.setCurrentSection = function(section) {
      $scope.currentSection = section;
    };

  }
]);
