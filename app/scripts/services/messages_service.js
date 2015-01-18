/*global Firebase*/

(function(angular){
  'use strict';

  angular.module('angularApp').service('MessagesService', function(FBURL, $q) {
    var rootRef =  new Firebase(FBURL);
    var messagesRef = rootRef.child('messages');
    var defaultPageSize = 5;

    function deferredItems(deferred, messages, snapshot) {
      snapshot.forEach(function(snapItem){
        var itemVal = snapItem.val();
        itemVal.key = snapItem.key();
        messages.push(itemVal);
      });

      deferred.resolve(messages);
    }

    return {
      childAdded: function childAdded(callback, limit) {
        var limitMessages = limit || defaultPageSize;

        messagesRef.startAt().limitToFirst(limitMessages).on('child_added', function(snapshot){
          var val = snapshot.val();

          callback.call(this,{
            user: val.user,
            text: val.text,
            key: snapshot.key(),
          });
       });
      },
      childChanged: function childChanged(callback) {
        messagesRef.on('child_changed', function(snapshot){
          var val = snapshot.val();

          callback.call(this, {
            key: snapshot.key(),
            text: val.text,
            user: val.user
          });
        });
      },
      childRemoved: function childRemoved(callback) {
        messagesRef.on('child_removed', function(snapshot){
          callback.call(this, snapshot.key());
        });
      },
      addChild: function addChild(child) {
        messagesRef.push(child);
      },
      off: function turnOffFeed() {
        messagesRef.off();
      },
      nextPage: function nextPage(startingKey, pageSize) {
        var deferred = $q.defer();
        var messages = [];
        var limitMessages = pageSize || defaultPageSize;

        messagesRef.startAt(null, startingKey).limitToFirst(limitMessages).once('value', function(snapshot){
          deferredItems(deferred, messages, snapshot);
        });

        return deferred.promise;
      },
      previousPage: function previousPage(startingKey, pageSize){
        var deferred = $q.defer();
        var messages = [];
        var limitMessages = pageSize || defaultPageSize;

        messagesRef.endAt(null, startingKey).limitToLast(limitMessages).once('value', function(snapshot) {
          deferredItems(deferred, messages, snapshot);
        });

        return deferred.promise;
      }
    };
  });

})(window.angular);
