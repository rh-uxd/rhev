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
        "href":"#/resources"
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
