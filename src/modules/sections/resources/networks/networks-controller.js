angular.module('rhev.dashboard').controller('resources.networksController', ['$scope', 'ChartsDataMixin', '$translate', '$resource',
  function( $scope, chartsDataMixin, $translate, $resource ) {
    'use strict';

    $scope.sparklineChartHeight = chartsDataMixin.dashboardSparklineChartHeight;
    $scope.dashboardHeatmapChartHeight = chartsDataMixin.dashboardHeatmapChartHeight;

    $scope.dataCenters = {
      title: "Data Centers",
      iconClass: "fa fa-globe",
      count: 2,
      notifications:[
        {
          iconClass: "pficon pficon-error-circle-o",
          count: 1
        }
      ]
    };

    $scope.clusters = {
      title:"Clusters",
      iconClass:"fa fa-cubes",
      count:10,
      notifications:[
        {
          iconClass:"pficon pficon-error-circle-o",
          count:"1"
        }
      ]
    };

    $scope.hosts = {
      title:"Hosts",
      iconClass:"fa fa-desktop",
      count:75,
      notifications:[
        {
          iconClass:"pficon pficon-error-circle-o",
          count:"1"
        },
        {
          iconClass:"pficon pficon-warning-triangle-o",
          count:"15"
        }
      ]
    };

    $scope.storageDomains = {
      title:"Storage Domains",
      "type":"projects",
      iconClass:"fa fa-database",
      count:510,
      notifications:[
        {
          iconClass:"pficon pficon-error-circle-o",
          count:"1"
        }
      ]
    };

    $scope.vms =  {
      title:"VMs",
      iconClass:"fa fa-laptop",
      count:1200,
      notifications:[
        {
          iconClass:"pficon pficon-error-circle-o",
          count:3
        }
      ]
    };

    $scope.networks = {
      title:"Networks",
      iconClass:"pficon-service",
      count:2500,
      notifications:[
        {
          iconClass:"pficon pficon-error-circle-o",
          count:"1"
        }
      ]
    };



    // Utilization
    $scope.cpuUsageConfig = chartConfig.cpuUsageConfig;
    $scope.cpuUsageSparklineConfig = {
      chartId: 'cpuSparklineChart'
    };
    $scope.cpuUsageDonutConfig = {
      chartId: 'cpuDonutChart',
      thresholds: {'warning':'60','error':'90'}
    };

    $scope.memoryUsageConfig = chartConfig.memoryUsageConfig;
    $scope.memoryUsageSparklineConfig = {
      chartId: 'memorySparklineChart'
    };
    $scope.memoryUsageDonutConfig = {
      chartId: 'memoryDonutChart',
      thresholds: {'warning':'60','error':'90'}
    };

    $scope.networkUsageConfig = chartConfig.networkUsageConfig;
    $scope.networkUsageSparklineConfig = {
      chartId: 'networkSparklineChart'
    };
    $scope.networkUsageDonutConfig = {
      chartId: 'networkDonutChart',
      thresholds: {'warning':'60','error':'90'}
    };

    $scope.storageUsageConfig = chartConfig.storageUsageConfig;
    $scope.storageUsageSparklineConfig = {
      chartId: 'storageSparklineChart'
    };
    $scope.storageUsageDonutConfig = {
      chartId: 'storageDonutChart',
      thresholds: {'warning':'60','error':'90'}
    };

    $scope.utilizationLoadingDone = false;
    var ContainersUtilization = $resource('/dashboard/utilization');
    ContainersUtilization.get(function(response) {
      $scope.cpuUsageData = chartsDataMixin.getCpuUsageDataFromResponse(response, $scope.cpuUsageConfig.usageDataName);
      $scope.memoryUsageData = chartsDataMixin.getMemoryUsageDataFromResponse(response, $scope.memoryUsageConfig.usageDataName);
      $scope.networkUsageData = chartsDataMixin.getNetworkUsageDataFromResponse(response, $scope.networkUsageConfig.usageDataName);
      $scope.storageUsageData = chartsDataMixin.getStorageUsageDataFromResponse(response, $scope.storageUsageConfig.usageDataName);
      $scope.utilizationLoadingDone = true;
    });

    // HeatMaps

    $scope.nodeCpuUsage = {
      title: 'CPU',
      id: 'nodeCpuUsageMap',
      loadingDone: false
    };
    $scope.nodeMemoryUsage = {
      title: 'Memory',
      id: 'nodeMemoryUsageMap',
      loadingDone: false
    };

    $scope.nodeNetworkUsage = {
      title: 'Network',
      id: 'nodeNetworkUsageMap',
      loadingDone: false
    };
    $scope.nodeStorageUsage = {
      title: 'Storage',
      id: 'nodeStorageUsageMap',
      loadingDone: false
    };

    $scope.heatmaps = [$scope.nodeCpuUsage, $scope.nodeMemoryUsage, $scope.nodeNetworkUsage, $scope.nodeStorageUsage];

    var NodeCpuUsage = $resource('/dashboard/node-cpu-usage');
    NodeCpuUsage.get(function(response) {
      var data = response.data;
      $scope.nodeCpuUsage.data = data.nodeCpuUsage;
      $scope.nodeCpuUsage.loadingDone = true;
    });

    var NodeMemoryUsage = $resource('/dashboard/node-memory-usage');
    NodeMemoryUsage.get(function(response) {
      var data = response.data;
      $scope.nodeMemoryUsage.data = data.nodeMemoryUsage;
      $scope.nodeMemoryUsage.loadingDone = true;
    });

    var NodeNetworkUsage = $resource('/dashboard/node-network-usage');
    NodeNetworkUsage.get(function(response) {
      var data = response.data;
      $scope.nodeNetworkUsage.data = data.nodeNetworkUsage;
      $scope.nodeNetworkUsage.loadingDone = true;
    });

    var NodeStorageUsage = $resource('/dashboard/node-storage-usage');
    NodeStorageUsage.get(function(response) {
      var data = response.data;
      $scope.nodeStorageUsage.data = data.nodeStorageUsage;
      $scope.nodeStorageUsage.loadingDone = true;
    });

    $scope.nodeHeatMapUsageLegendLabels = chartsDataMixin.nodeHeatMapUsageLegendLabels;
  }
]);
