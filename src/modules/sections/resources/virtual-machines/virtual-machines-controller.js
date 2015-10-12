  'use strict';

angular.module('rhev.resources.virtual-machines').controller('resources.virtualMachinesController', ['$scope', '$resource', '$timeout', '$location',
  function( $scope, $resource, $timeout, $location ) {

    $scope.vmsListId = 'vms-vms-list';

    var usageValues = ['< 70%', '70 - 80%', '80 - 90%', '> 90%'];

    var usageMatch = function (selectValue, usage) {
      if (selectValue === usageValues[0]) {
        return usage < 70;
      }
      else if (selectValue === usageValues[1]) {
        return usage >= 70 && usage < 80;
      }
      else if (selectValue === usageValues[2]) {
        return usage >= 80 && usage < 90;
      }
      else if (selectValue === usageValues[3]) {
        return usage >= 90;
      }
    };

    var matchesFilter = function (vm, filter) {
      var match = true;

      if (filter.id === 'name') {
        match = vm.name.match(filter.value) !== null;
      }
      else if (filter.id === 'host') {
        match = vm.host.match(filter.value) !== null;
      }
      else if (filter.id === 'ipAddress') {
        match = vm.ipAddress.match(filter.value) !== null;
      }
      else if (filter.id === 'fqdn') {
        match = vm.fqdn.match(filter.value) !== null;
      }
      else if (filter.id === 'cluster') {
        match = vm.cluster.match(filter.value) !== null;
      }
      else if (filter.id === 'dataCenter') {
        match = vm.dataCenter.match(filter.value) !== null;
      }
      else if (filter.id === 'memoryUsage') {
        return usageMatch(filter.value, vm.memoryInfo.percentUsed);
      }
      else if (filter.id === 'cpuUsage') {
        return usageMatch(filter.value, vm.cpuInfo.percentUsed);
      }
      else if (filter.id === 'networkUsage') {
        return usageMatch(filter.value, vm.networkInfo.percentUsed);
      }
      return match;
    };

    var matchesFilters = function (vm, filters) {
      var matches = true;

      filters.forEach(function(filter) {
        if (!matchesFilter(vm, filter)) {
          matches = false;
          return false;
        }
      });
      return matches;
    };

    $scope.applyFilters = function () {
      if ($scope.toolbarConfig.filterConfig.appliedFilters && $scope.toolbarConfig.filterConfig.appliedFilters.length > 0) {
        $scope.vms = [];
        $scope.allVms.forEach(function (vm) {
          if (matchesFilters(vm, $scope.toolbarConfig.filterConfig.appliedFilters)) {
            $scope.vms.push(vm);
          }
        });
      } else {
        $scope.vms = $scope.allVms;
      }
      $scope.toolbarConfig.filterConfig.resultsCount = $scope.vms.length;
    };

    var filterChange = function (filters) {
      $scope.applyFilters();
    };

    var filterConfig = {
      fields: [
        {
          id: 'name',
          title:  'Name',
          placeholder: 'Filter by Name',
          filterType: 'text'
        },
        {
          id: 'host',
          title:  'Host',
          placeholder: 'Filter by Host',
          filterType: 'text'
        },
        {
          id: 'ipAddress',
          title:  'IP Address',
          placeholder: 'Filter by IP Address',
          filterType: 'text'
        },
        {
          id: 'fqdn',
          title:  'FQDN',
          placeholder: 'Filter by FQDN',
          filterType: 'text'
        },
        {
          id: 'cluster',
          title:  'Cluster',
          placeholder: 'Filter by Cluster',
          filterType: 'text'
        },
        {
          id: 'dataCenter',
          title:  'Data Center',
          placeholder: 'Filter by Data Center',
          filterType: 'text'
        },
        {
          id: 'memoryUsage',
          title:  'Memory Usage',
          placeholder: 'Filter by Memory Usage',
          filterType: 'select',
          filterValues: usageValues
        },
        {
          id: 'cpuUsage',
          title:  'CPU Usage',
          placeholder: 'Filter by CPU Usage',
          filterType: 'select',
          filterValues: usageValues
        },
        {
          id: 'networkUsage',
          title:  'Network Usage',
          placeholder: 'Filter by Network Usage',
          filterType: 'select',
          filterValues: usageValues
        }
      ],
      resultsCount: 0,
      appliedFilters: [],
      onFilterChange: filterChange
    };

    var compareClustersFn = function(item1, item2) {
      var compValue = 0;
      if ($scope.toolbarConfig.sortConfig.currentField.id === 'name') {
        compValue = item1.name.localeCompare(item2.name);
      } else if ($scope.toolbarConfig.sortConfig.currentField.id === 'host') {
        compValue = item1.host.localeCompare(item2.host);
      } else if ($scope.toolbarConfig.sortConfig.currentField.id === 'ipAddress') {
        compValue = item1.ipAddress.localeCompare(item2.ipAddress);
      } else if ($scope.toolbarConfig.sortConfig.currentField.id === 'fqdn') {
        compValue = item1.fqdn.localeCompare(item2.fqdn);
      } else if ($scope.toolbarConfig.sortConfig.currentField.id === 'cluster') {
        compValue = item1.cluster.localeCompare(item2.cluster);
      } else if ($scope.toolbarConfig.sortConfig.currentField.id === 'dataCenter') {
        compValue = item1.dataCenter.localeCompare(item2.dataCenter);
      } else if ($scope.toolbarConfig.sortConfig.currentField.id === 'memoryUsage') {
        compValue = item1.memoryInfo.percentUsed - item2.memoryInfo.percentUsed;
      } else if ($scope.toolbarConfig.sortConfig.currentField.id === 'cpuUsage') {
        compValue = item1.cpuInfo.percentUsed - item2.cpuInfo.percentUsed;
      } else if ($scope.toolbarConfig.sortConfig.currentField.id === 'networkUsage') {
        compValue = item1.networkInfo.percentUsed - item2.networkInfo.percentUsed;
      }

      if (!$scope.toolbarConfig.sortConfig.isAscending) {
        compValue = compValue * -1;
      }
      return compValue;
    };

    var sortVms = function (sortId, isAscending) {
      if ($scope.vms && $scope.vms.length > 0) {
        $scope.vms.sort(compareClustersFn);
      }
    };

    var sortConfig = {
      fields: [
        {
          id: 'name',
          title:  'Name',
          sortType: 'alpha'
        },
        {
          id: 'host',
          title:  'Host',
          sortType: 'alpha'
        },
        {
          id: 'ipAddress',
          title:  'IP Address',
          sortType: 'numeric'
        },
        {
          id: 'fqdn',
          title:  'FQDN',
          sortType: 'numeric'
        },
        {
          id: 'cluster',
          title:  'Cluster',
          sortType: 'alpha'
        },
        {
          id: 'dataCenter',
          title:  'Data Center',
          sortType: 'alpha'
        },
        {
          id: 'memoryUsage',
          title:  'Memory Usage',
          sortType: 'numeric'
        },
        {
          id: 'cpuUsage',
          title:  'CPU Usage',
          sortType: 'numeric'
        },
        {
          id: 'networkUsage',
          title:  'Network Usage',
          sortType: 'numeric'
        }
      ],
      onSortChange: sortVms
    };

    var createVm = function (action) {
    };

    var editVm = function (action) {
    };

    var fakeVmAction = function (action) {
    };

    var actionsConfig = {
      primaryActions: [
        {
          name: 'Create VM',
          title: 'Create a Virtual Machine',
          actionFn: createVm
        },
        {
          name: 'Edit VM',
          title: 'Edit the selected Virtual Machine',
          actionFn: editVm
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
      filterConfig: filterConfig,
      sortConfig: sortConfig,
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

    $scope.vmsLoaded = false;
    var vmsResource = $resource('/resources/virtual-machines/all');
    vmsResource.get(function(response) {
      $scope.allVms = response["virtual-machines"];
      $scope.allVms.forEach(function (vm) {
        vm.memoryInfo = getMemoryInfo(vm);
        vm.cpuInfo = getCpuInfo(vm);
        vm.networkInfo = getNetworkInfo(vm);
      });
      $scope.applyFilters();
      $scope.vmsLoaded = true;
      $scope.lastUpdateTime = new Date();
      $timeout(function() {
        $('[data-toggle="tooltip"]').tooltip();
      }, 100);

    });
  }
]);
