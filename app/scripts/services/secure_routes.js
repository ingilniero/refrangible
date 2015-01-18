/*global Firebase*/

(function(angular){
  'use strict';

  angular.module('angularApp')

  .factory('SecureRoutes', function(AuthService, $q) {
    return function() {
      return AuthService.getUser().then(function(user){
        return user ? user : $q.reject({ authRequired: true});
      });
    }
  });

})(window.angular);


