angular.module('rhev.dashboard').controller('sections.dashboardController', ['$scope', 'ChartsDataMixin', '$translate', '$resource', '$location', '$timeout',
  function( $scope, chartsDataMixin, $translate, $resource, $location, $timeout ) {
    'use strict';

    $scope.sparklineChartHeight = chartsDataMixin.dashboardSparklineChartHeight;
    $scope.dashboardHeatmapChartHeight = chartsDataMixin.dashboardHeatmapChartHeight;

    $scope.dataCenters = {
      title: "Data Centers",
      iconClass: "fa fa-globe",
      count: 2,
      href: '#/resources/data-centers',
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
      href: '#/resources/clusters',
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
      href: '#/resources/hosts',
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
      href: '#/resources/storage-domains',
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
      href: '#/resources/virtual-machines',
      notifications:[
        {
          iconClass:"pficon pficon-error-circle-o",
          count:3
        }
      ]
    };

    $scope.networks = {
      title:"Networks",
      iconClass:"pficon pficon-service",
      count:2500,
      href: '#/resources/networks',
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
      thresholds: {'warning':'60','error':'90'},
      onClickFn: function (d, i) {
        utilizationDrilldown($scope.cpuUsageConfig.title,
                             $scope.cpuUsageDonutConfig.chartId,
                             d, i);
      }
    };

    $scope.memoryUsageConfig = chartConfig.memoryUsageConfig;
    $scope.memoryUsageSparklineConfig = {
      chartId: 'memorySparklineChart'
    };
    $scope.memoryUsageDonutConfig = {
      chartId: 'memoryDonutChart',
      thresholds: {'warning':'60','error':'90'},
      onClickFn: function (d, i) {
        utilizationDrilldown($scope.memoryUsageConfig.title,
                             $scope.memoryUsageDonutConfig.chartId,
                             d, i);
      }
    };

    $scope.networkUsageConfig = chartConfig.networkUsageConfig;
    $scope.networkUsageSparklineConfig = {
      chartId: 'networkSparklineChart'
    };
    $scope.networkUsageDonutConfig = {
      chartId: 'networkDonutChart',
      thresholds: {'warning':'60','error':'90'},
      onClickFn: function (d, i) {
        utilizationDrilldown($scope.networkUsageConfig.title,
                             $scope.networkUsageDonutConfig.chartId,
                             d, i);
      }

    };

    $scope.storageUsageConfig = chartConfig.storageUsageConfig;
    $scope.storageUsageSparklineConfig = {
      chartId: 'storageSparklineChart'
    };
    $scope.storageUsageDonutConfig = {
      chartId: 'storageDonutChart',
      thresholds: {'warning':'60','error':'90'},
      onClickFn: function (d, i) {
        utilizationDrilldown($scope.storageUsageConfig.title,
                             $scope.storageUsageDonutConfig.chartId,
                             d, i);
      }
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

    // Utilization Drilldown Dialog

    var utilizationDrilldown = function (title, chartId, d, i) {
      $scope.utilizationDrillDown = {title: title, chartId: chartId};
      $scope.layoutInline = {
        'type': 'inline'
      };
      loadOverUtilizedVMs();
      loadOverUtilizedHosts();
      $scope.$apply();
      $("#utilDrilldown").modal();

      // When dialog closed, reset loaded flags
      $("#utilDrilldown").on('hidden.bs.modal', function () {
        $scope.overUtilizedVMsLoaded = false;
        $scope.overUtilizedHostsLoaded = false;
      });
    };

    $scope.OverUtilizedVMsLoaded = false;
    var loadOverUtilizedVMs = function () {
      var targetResource = String($scope.utilizationDrillDown.title).toLowerCase() + "_vms";
      var vmsResource = $resource('/resources/virtual-machines/' + targetResource);
      vmsResource.get(function (response) {
        $scope.overUtilizedVMs = response["virtual-machines"];

        // Calculate percentageUsed for sort
        $scope.overUtilizedVMs.forEach(function (vm) {
          vm.percentageUsed = Math.round(100 * (parseInt(vm.utilBarChart.data.used, 10) / parseInt(vm.utilBarChart.data.total, 10)));
        });

        $scope.overUtilizedVMsLoaded = true;
      });
    };

    $scope.overUtilizedHostsLoaded = false;
    var loadOverUtilizedHosts = function () {
      var targetResource = String($scope.utilizationDrillDown.title).toLowerCase() + "_hosts";
      var hostsResource = $resource('/resources/hosts/' + targetResource);
      hostsResource.get(function (response) {
        $scope.overUtilizedHosts = response["hosts"];

        // Calculate percentageUsed for sort
        $scope.overUtilizedHosts.forEach(function (host) {
          host.percentageUsed = Math.round(100 * (parseInt(host.utilBarChart.data.used, 10) / parseInt(host.utilBarChart.data.total, 10)));
        });

        $scope.overUtilizedHostsLoaded = true;
      });
    };

    $scope.loadVMDetails = function(vmId) {
      $timeout(function() {
        $location.path('/resources/virtual-machines/' + vmId );
      }, 400);
    };

    $scope.loadHostDetails = function(hostId) {
      $timeout(function() {
        $location.path('/resources/hosts/');
      }, 400);
    };

    $timeout(function() {
      var usedContextMenu = [
        {
          title: 'View Resources',
          action: function (elm, d, i) {
            utilizationDrilldown($scope.cpuUsageConfig.title, $scope.cpuUsageDonutConfig.chartId);
          }
        },
        {
          title: 'View VMs',
          action: function (elm, d, i) {
            $location.path('/resources/virtual-machines/');
            $scope.$apply();
          }
        }
      ];

      var availContextMenu = [
        {
          title: 'View VMs',
          action: function (elm, d, i) {
            $location.path('/resources/virtual-machines/');
            $scope.$apply();
          }
        }
      ];

      // hook up appropriate context menus for Used and Available arcs
      var g = d3.select('.c3-arcs-Used');
      g.on('contextmenu', d3.contextMenu(usedContextMenu));
      g = d3.select('.c3-arcs-Available');
      g.on('contextmenu', d3.contextMenu(availContextMenu));
    }, 1100);
  }
]);
