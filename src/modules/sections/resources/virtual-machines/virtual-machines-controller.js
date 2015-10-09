  'use strict';

angular.module('rhev.resources.virtual-machines').controller('resources.virtualMachinesController', ['$scope', '$resource', '$timeout', '$location',
  function( $scope, $resource, $timeout, $location ) {

    $scope.vmsListId = 'vms-vms-list';

    var matchesFilter = function (vm, filter) {
      var match = true;

      if (filter.id === 'name') {
        match = vm.name.match(filter.value) !== null;
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
        }
      ],
      resultsCount: 0,
      appliedFilters: [],
      onFilterChange: filterChange
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
