angular.module( 'rhev.appModule', [
  'ngResource',
  'ngRoute',
  'ui.bootstrap',
  'pascalprecht.translate',
  'patternfly',
  'patternfly.charts',
  'rhev.navigation',
  'rhev.sections',
  'rhev.card',
  'rhev.charts',
  'rhev.misc'
] )
  .config( ['$routeProvider', '$translateProvider',
    function( $routeProvider, $translateProvider ) {
      'use strict';

      $routeProvider
        .when('/', {
          redirectTo: '/dashboard'
        })

        // Default
        .otherwise({
          redirectTo: '/'
        });

      $translateProvider.translations( 'default', 'en');
      $translateProvider.preferredLanguage( 'default' );
    }
  ]
);
