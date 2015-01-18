(function(angular){
  'use strict';

  /**
   * @ngdoc function
   * @name angularApp.controller:LoginCtrl
   * @description
   * # LoginCtrl
   * Controller of the refrangible
   */
  angular.module('angularApp')
  .controller('LoginCtrl', function ($rootScope, $scope, AuthService, $window) {
    var vm = this;

    vm.email = null;
    vm.password = null;
    vm.login = login;
    vm.errors = [];

    function login() {
      vm.errors = [];

      if(!!!vm.email) {
        vm.errors.push('Please enter an email');
      }

      if(!!!vm.password) {
        vm.errors.push('Please enter a password');
      }

      if(vm.errors.length > 0) {
        return;
      }

      AuthService.login(vm.email, vm.password).then(function(authData) {
        $rootScope.currentUser = authData.password.email;
        $window.location.href = '/#/chat';
      }, function(error) {
        vm.errors.push(error.message);
      });
    }

  });
})(window.angular);
