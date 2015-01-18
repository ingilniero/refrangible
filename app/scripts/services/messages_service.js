/*global Firebase*/

(function(angular){
  'use strict';

  angular.module('angularApp').service('MessagesService', function(FBURL, $q, $firebase) {
    var rootRef =  new Firebase(FBURL);
    var messagesRef = rootRef.child('messages');
    var defaultPageSize = 5;

    return {
      watch: function watch(callbacks, limit) {
        var limitMessages = limit || defaultPageSize;
        var fireMessages = $firebase(messagesRef.startAt().limitToFirst(limitMessages)).$asArray();

        fireMessages.$watch(function(data){
          var message = fireMessages.$getRecord(data.key);

          if(Object.keys(callbacks).indexOf(data.event) !== -1) {
            callbacks[data.event].call(this, {
              user: message && message.user,
              text: message && message.text,
              key: data.key
            });
          }
       });
      },
      addChild: function addChild(child) {
        return $firebase(messagesRef).$asArray().$add(child);
      },
      off: function turnOffFeed() {
        $firebase(messagesRef).$asArray().$destroy();
      },
      nextPage: function nextPage(startingKey, pageSize) {
        var limitMessages = pageSize || defaultPageSize;

        return $firebase(messagesRef.startAt(null, startingKey).limitToFirst(limitMessages)).$asArray().$loaded();
      },
      previousPage: function previousPage(startingKey, pageSize){
        var limitMessages = pageSize || defaultPageSize;

        return $firebase(messagesRef.endAt(null, startingKey).limitToLast(limitMessages)).$asArray().$loaded();
      }
    };
  });

})(window.angular);
