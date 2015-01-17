/*global Firebase*/

(function(angular){
  'use strict';

  angular.module('angularApp').service('MessagesService', function(FBURL) {
    var rootRef =  new Firebase(FBURL);
    var messagesRef = rootRef.child('messages');

    return {
      childAdded: function childAdded(callback, limit) {
        var limitMessages = limit | 5;

        messagesRef.limit(limitMessages).on('child_added', function(snapshot){
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
        messagesRef.off()
      }
    }
  });

})(window.angular);
