angular.module( 'rhev.appModule').controller( 'rhev.appController', ['$scope', '$rootScope', '$resource',
  function() {
    'use strict';
    var vm = this;

    vm.username = 'Administrator';

    //Navigation should be loaded from a service
    vm.navigationItems = [
      {
        "title":"Dashboard",
        "href":"#/dashboard"
      },
      {
        "title":"Resources",
        "href":"#/resources",
        "children":[
          {
            "title":"Overview",
            "href":"#/resources/overview"
          },
          {
            "title":"Data Centers",
            "href":"#/resources/data-centers"
          },
          {
            "title":"Clusters",
            "href":"#/resources/clusters"
          },
          {
            "title":"Hosts",
            "href":"#/resources/hosts"
          },
          {
            "title":"Storage Domains",
            "href":"#/resources/storage-domains"
          },
          {
            "title":"Networks",
            "href":"#/resources/networks"
          },
          {
            "title":"Virtual Machines",
            "href":"#/resources/virtual-machines"
          },
          {
            "title":"Capacity Planning",
            "href":"#/resources/capacity-planning"
          }
        ]
      },
      {
        "title":"Administration",
        "href":"#/administration"
      }
    ];

    vm.notifications = [
      {
        'text': 'Modified Datasources ExampleDS'
      },
      {
        'text': 'Error: System Failure'
      }
    ];

    vm.clearNotifications = function() {
      vm.notifications = [];
    };
  }
]);
