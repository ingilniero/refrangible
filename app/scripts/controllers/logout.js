(function(angular){
  'use strict';

  /**
   * @ngdoc function
   * @name angularApp.controller:LogoutCtrl
   * @description
   * # LogoutCtrl
   * Controller of the refrangible
   */
  angular.module('angularApp')
  .controller('LogoutCtrl', function ($scope, $timeout, AuthService, $window) {
    $timeout(function(){
      AuthService.logout();
      $window.location.href = '/#/login';
    }, 2000);

  });
})(window.angular);
