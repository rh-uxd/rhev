
angular.module('rhev.resources', ['pascalprecht.translate', 'ui.bootstrap']);

angular.module( 'rhev.resources',
  ['rhev.resources.capacity-planning',
   'rhev.resources.clusters',
   'rhev.resources.data-centers',
    'rhev.resources.hosts',
    'rhev.resources.networks',
    'rhev.resources.overview',
    'rhev.resources.storage-domains',
   'rhev.resources.virtual-machines'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/resources', {
        redirectTo: '/resources/overview'
      })
      .when('/resources/overview', {
        templateUrl: 'modules/sections/resources/overview/overview.html',
        controller: 'resources.overviewController'
      })
      .when('/resources/data-centers', {
        templateUrl: 'modules/sections/resources/data-centers/data-centers.html',
        controller: 'resources.dataCentersController'
      })
      .when('/resources/clusters', {
        templateUrl: 'modules/sections/resources/clusters/clusters.html',
        controller: 'resources.clustersController'
      })
      .when('/resources/hosts', {
        templateUrl: 'modules/sections/resources/hosts/hosts.html',
        controller: 'resources.hostsController'
      })
      .when('/resources/storage-domains', {
        templateUrl: 'modules/sections/resources/storage-domains/storage-domains.html',
        controller: 'resources.storageDomainsController'
      })
      .when('/resources/networks', {
        templateUrl: 'modules/sections/resources/networks/networks.html',
        controller: 'resources.networksController'
      })
      .when('/resources/virtual-machines', {
        templateUrl: 'modules/sections/resources/virtual-machines/virtual-machines.html',
        controller: 'resources.virtualMachinesController'
      })
      .when('/resources/capacity-planning', {
        templateUrl: 'modules/sections/resources/capacity-planning/capacity-planning.html',
        controller: 'resources.capacityPlanningController'
      })
  }]);
