/*global Firebase*/
'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the refrangible
 */
angular.module('angularApp')
  .controller('MainCtrl', function ($scope, $timeout) {
    var vm = this;

    vm.rootRef = new Firebase('https://refrangible.firebaseio.com/');
    vm.messagesRef = vm.rootRef.child('messages');
    vm.titleRef = vm.rootRef.child('title');

    vm.title = null;
    vm.currentUser = null;
    vm.currentText = null;
    vm.sendMessage = sendMessage;
    vm.isFeedTurnOff = false;
    vm.turnOffFeed = turnOffFeed;
    vm.turnOnFeed = turnOnFeed;

    setListeners();

    vm.titleRef.once('value', function(snapshot) {
      $timeout(function(){
        vm.title = snapshot.val();
      });
    });

    function setListeners() {
      vm.messages = [];

      vm.messagesRef.on('child_added', function(snapshot){
        $timeout(function(){
          var snapshotVal = snapshot.val();
          vm.messages.push({
           user: snapshotVal.user,
           text: snapshotVal.text,
           key: snapshot.key()
          });
        });
      });

      vm.messagesRef.on('child_changed', function(snapshot){
        $timeout(function(){
          var snapshotVal = snapshot.val();
          var message = findMessageByKey(snapshot.key());

          message.text = snapshotVal.text;
          message.user = snapshotVal.user;
        });
      });

      vm.messagesRef.on('child_removed', function(snapshot){
        $timeout(function(){
          deleteMessageByKey(snapshot.key());
        });
      });
    }


    function deleteMessageByKey(key) {
      for(var i = 0; i < vm.messages.length; i++) {
        var currentMessage = vm.messages[i];
        if(currentMessage.key === key) {
          vm.messages.splice(i, 1);
          break;
        }
      }
    }

    function findMessageByKey(key) {
      var messageFound = null;

      for(var i = 0; i < vm.messages.length; i++) {
        var currentMessage = vm.messages[i];
        if(currentMessage.key === key) {
          messageFound = currentMessage;
          break;
        }
      }

      return messageFound;
    }

    function sendMessage() {
      var newMessage = {
        user: vm.currentUser,
        text: vm.currentText
      };

      vm.messagesRef.push(newMessage);
    };

    function turnOffFeed() {
      vm.isFeedTurnOff = true;
      vm.messagesRef.off();
    }

    function turnOnFeed() {
      vm.isFeedTurnOff = false;
      setListeners();
    }
  });
