/*global Firebase*/

(function(angular){
  'use strict';

  angular.module('angularApp').service('TitleService', function(FBURL, $firebase) {
    var rootRef =  new Firebase(FBURL);
    var titleRef = rootRef.child('title');
    var fireTitle = $firebase(titleRef).$asObject();

    return {
      loaded: function loaded(callback){
        fireTitle.$loaded().then(function(data){
          callback.call(this, data.$value);
        });
      }
    };
  });

})(window.angular);

