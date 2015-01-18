/*global Firebase*/

(function(angular){
  'use strict';

  angular.module('angularApp').service('TitleService', function(FBURL) {
    var rootRef =  new Firebase(FBURL);
    var titleRef = rootRef.child('title');

    return {
      valueOnce: function valueOnce(callback){
        titleRef.once('value', function(snapshot){
          callback.call(this, snapshot.val());
        });
      }
    };
  });

})(window.angular);

