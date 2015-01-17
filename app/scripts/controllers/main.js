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
    vm.currentUser = null;
    vm.currentText = null;
    vm.messages = [];

    vm.messagesRef.on('child_added', function(snapshot){
      $timeout(function(){
        var snapshowVal = snapshot.val();
        console.log(snapshowVal);
        vm.messages.push(snapshowVal);
      });
    });

    vm.sendMessage = function() {
      var newMessage = {
        user: vm.currentUser,
        text: vm.currentText
      };

      vm.messagesRef.push(newMessage);
    };

  });
