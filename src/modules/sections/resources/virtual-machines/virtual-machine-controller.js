  'use strict';

angular.module('rhev.resources.virtual-machines')
.controller('resources.virtualMachineController',
           ['$scope', '$resource', '$timeout', '$routeParams', 'pfViewUtils', 'ChartsDataMixin',
  function( $scope, $resource, $timeout, $routeParams, pfViewUtils, chartsDataMixin ) {

    var currentId = $routeParams.id;

    $scope.viewSelected = function(viewId) {
      $scope.currentView = viewId
    };

    $scope.viewsList = [pfViewUtils.getDashboardView(), pfViewUtils.getTableView()];
    $scope.currentView = $scope.viewsList[0].id;

    $scope.setCurrentSection = function(section) {
      $scope.currentSection = section;
    };

    $scope.cpuUsageConfig = {
      chartId: 'cpuUsageChart',
      title: 'CPU',
      units: 'Cores',
      usageDataName: 'Used',
      legendLeftText: 'Last 30 Days',
      legendRightText: '',
      tooltipType: 'valuePerDay',
      numDays: 30
    }

      $scope.cpuUsageSparklineConfig = {
      tooltipType: 'valuePerDay',
      chartId: 'cpuSparklineChart'
    };
    $scope.cpuUsageDonutConfig = {
      chartId: 'cpuDonutChart',
      thresholds: {'warning':'60','error':'90'}
    };
    $scope.memoryUsageConfig = chartConfig.memoryUsageConfig;
    $scope.memoryUsageSparklineConfig = {
      tooltipType: 'valuePerDay',
      chartId: 'memorySparklineChart'
    };
    $scope.memoryUsageDonutConfig = {
      chartId: 'memoryDonutChart',
      thresholds: {'warning':'60','error':'90'}
    };

    $scope.iopsTrendsConfig = {
      chartId  : 'iopsTrendsChart',
      units    : 'IOPS',
      dataName: 'IOPS',
      tooltipType: 'valuePerDay'
    };

    $scope.ioBandWidthTrendsConfig = {
      chartId  : 'ioBandwidthTrendsChart',
      units    : 'KBps',
      dataName: 'KBps',
      tooltipType: 'valuePerDay'
    };

    $scope.ioLatencyTrendsConfig = {
      chartId  : 'ioLatencyTrendsChart',
      units    : 'ms',
      dataName: 'ms',
      tooltipType: 'valuePerDay'
    };

    $scope.bandwidthInConfig = {
      chartId  : 'bandwidthInChart',
      units    : 'MBps',
      dataName: 'MBpx',
      tooltipType: 'valuePerDay'
    };

    $scope.bandwidthOutConfig = {
      chartId  : 'bandwidthOutChart',
      units    : 'MBps',
      dataName: 'MBpx',
      tooltipType: 'valuePerDay'
    };

    var fakeVmAction = function (action) {
    };

    var actionsConfig = {
      primaryActions: [
        {
          name: 'VM Action',
          title: 'Create a Virtual Machine',
          actionFn: fakeVmAction
        },
        {
          name: 'Edit VM',
          title: 'Edit the Virtual Machine',
          actionFn: fakeVmAction
        }
      ],
      moreActions: [
        {
          name: 'Fake VM Action',
          title: 'Perform another action',
          actionFn: fakeVmAction
        },
        {
          name: 'Another Action',
          title: 'Do something else',
          actionFn: fakeVmAction
        },
        {
          name: 'Disabled Action',
          title: 'Unavailable action',
          actionFn: fakeVmAction,
          isDisabled: true
        },
        {
          name: 'Something Else',
          title: '',
          actionFn: fakeVmAction
        },
        {
          isSeparator: true
        },
        {
          name: 'Grouped Action 1',
          title: 'Do something',
          actionFn: fakeVmAction
        },
        {
          name: 'Grouped Action 2',
          title: 'Do something similar',
          actionFn: fakeVmAction
        }
      ]
    };

    $scope.toolbarConfig = {
      actionsConfig: actionsConfig
    };

    var compareFn = function (item1, item2) {
      return item2.value - item1.value;
    };

    var getMemoryInfo = function(vm) {
      var info = {
        percentUsed: Math.round((vm.memoryUsed / vm.memoryTotal) * 100.0)
      };

      info.tooltip = info.percentUsed + "% Used   (" + vm.memoryUsed + " of " + vm.memoryTotal + " GB)";

      if (info.percentUsed < 70) {
        info.statusClass = 'ok-status';
      }
      else if (info.percentUsed < 80) {
        info.statusClass = 'warn-status';
      }
      else if (info.percentUsed < 90) {
        info.statusClass = 'error-status';
      }
      else {
        info.statusClass = 'critical-status';
      }

      return info;
    };

    var getCpuInfo = function(vm) {
      var info = {
        percentUsed: vm.cpuUsedPercent,
        usedTooltip: '',
        availableTooltip: ''
      };

      info.tooltip = info.percentUsed + "% Used";

      if (info.percentUsed < 70) {
        info.statusClass = 'ok-status';
      }
      else if (info.percentUsed < 80) {
        info.statusClass = 'warn-status';
      }
      else if (info.percentUsed < 90) {
        info.statusClass = 'error-status';
      }
      else {
        info.statusClass = 'critical-status';
      }
      return info;
    };

    var getNetworkInfo = function(vm) {
      var info = {
        percentUsed: Math.round((vm.networkUsed / vm.networkTotal) * 100.0)
      };

      info.tooltip = info.percentUsed + "% Used   (" + vm.networkUsed + " of " + vm.networkTotal + " GB)";

      if (info.percentUsed < 70) {
        info.statusClass = 'ok-status';
      }
      else if (info.percentUsed < 80) {
        info.statusClass = 'warn-status';
      }
      else if (info.percentUsed < 90) {
        info.statusClass = 'error-status';
      }
      else {
        info.statusClass = 'critical-status';
      }

      return info;
    };

    var handleVmClick = function(item) {
      $location.path('/resources/virtual-machines/' + item.uuid);
    };

    $scope.vmsListConfig = {
      selectionMatchProp: 'uuid',
      selectedItems: [],
      checkDisabled: false,
      onClick: handleVmClick
    };

    var getEvents = function (responseEvents) {
      var events = {
        criticalEvents: [],
        warningEvents: [],
        taskEvents: []
      };

      responseEvents.forEach(function (event) {
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

    var vmsResource = $resource('/resources/virtual-machines/' + currentId);
    vmsResource.get(function(response) {
      $scope.vm = response.data;
      $scope.events = getEvents($scope.vm.events);
      $scope.cpuUsageData = chartsDataMixin.getCpuUsageDataFromResponse(response, $scope.cpuUsageConfig.usageDataName);
      $scope.memoryUsageData = chartsDataMixin.getMemoryUsageDataFromResponse(response, $scope.memoryUsageConfig.usageDataName);
      $scope.iopsTrendData = chartsDataMixin.getSparklineData($scope.vm.iopsTrendData, $scope.iopsTrendsConfig.dataName);
      $scope.ioBandWidthData = chartsDataMixin.getSparklineData($scope.vm.ioBandWidthData, $scope.ioBandWidthTrendsConfig.dataName);
      $scope.ioLatencyData = chartsDataMixin.getSparklineData($scope.vm.ioLatencyData, $scope.ioLatencyTrendsConfig.dataName);
      $scope.bandwidthInData = chartsDataMixin.getSparklineData($scope.vm.bandwidthInData, $scope.bandwidthInConfig.dataName);
      $scope.bandwidthOutData = chartsDataMixin.getSparklineData($scope.vm.bandwidthOutData, $scope.bandwidthOutConfig.dataName);
      $scope.lastUpdateTime = new Date();
      $scope.loadingDone = true;
      $timeout(function() {
        $('[data-toggle="tooltip"]').tooltip();
      }, 100);
    });
  }
]);
