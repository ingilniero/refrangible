'use strict';

/**
 * @ngdoc overview
 * @name angularApp
 * @description
 * # angularApp
 *
 * Main module of the application.
 */
angular
  .module('angularApp', [
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'firebase'
  ])
  .constant('FBURL', 'https://refrangible.firebaseio.com/')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.whenAuthenticated = function(path, route) {
      route.resolve = route.resolve || {};
      route.resolve.user = ['SecureRoutes', function(SecureRoutes) {
        return SecureRoutes();
      }];
      $routeProvider.when(path, route);
      return $routeProvider;
    }
  }])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'vm'
      })
      .whenAuthenticated('/chat', {
        templateUrl: 'views/chat.html',
        controller: 'ChatCtrl',
        controllerAs: 'vm'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'vm'
      })
      .when('/register', {
        templateUrl: 'views/Register.html',
        controller: 'RegisterCtrl',
        controllerAs: 'vm'
      })
      .whenAuthenticated('/logout', {
        templateUrl: 'views/logout.html',
        controller: 'LogoutCtrl',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(function($rootScope) {
    $rootScope.$on('$routeChangeError', function (e, next, prev, err){
      if (angular.isObject(err) && err.authRequired) {
        window.location.href = '/#/login';
      }
    });
  });
