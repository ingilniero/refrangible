(function(angular){
  'use strict';

  /**
   * @ngdoc function
   * @name angularApp.controller:RegisterCtrl
   * @description
   * # RegisterCtrl
   * Controller of the refrangible
   */
  angular.module('angularApp')
  .controller('RegisterCtrl', function ($rootScope, $scope, AuthService, $window) {
    var vm = this;

    vm.register = register;
    vm.email = null;
    vm.password = null;
    vm.passwordConfirmation = null;
    vm.errors = [];

    function register() {
      vm.errors = [];

      if(!!!vm.email) {
        vm.errors.push('Please enter an email');
      }

      if (!!!vm.password) {
        vm.errors.push('Please enter a password');
      } else if(vm.password !== vm.passwordConfirmation) {
        vm.errors.push('Password must match');
      }

      if(vm.errors.length > 0) {
        return;
      }

      AuthService.register(vm.email, vm.password).then(function(){
        AuthService.login(vm.email, vm.password).then(function(authData){
          $rootScope.currentUser = authData.password.email;
          vm.email = null;
          vm.password = null;
          vm.passwordConfirmation = null;
          vm.errors = [];
          $window.location.href = '/#/chat';
        }, function(error) {
          console.log(error);
        });
      });
    }
  });

})(window.angular);
