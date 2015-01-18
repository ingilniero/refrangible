/*global Firebase*/

(function(angular){
  'use strict';

  angular.module('angularApp').service('AuthService', function(FBURL, $firebaseAuth) {
    var ref =  new Firebase(FBURL);
    var auth = $firebaseAuth(ref) ;

    return {
      register: function registerUser(email, password) {
        return auth.$createUser({
          email: email,
          password: password
        });
      },
      login: function loginUser(email, password) {
        return auth.$authWithPassword({
          email: email,
          password: password
        });
      },
      logout: function logoutUser() {
        return auth.$unauth();
      },
      getUser: function() {
        return auth.$waitForAuth();
      }
    };
  });

})(window.angular);

