'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the refrangible
 */
angular.module('angularApp')
  .controller('MainCtrl', function ($scope, $timeout, MessagesService, TitleService) {
    var vm = this;

    vm.title = null;
    vm.currentUser = null;
    vm.currentText = null;
    vm.sendMessage = sendMessage;
    vm.isFeedTurnOff = false;
    vm.turnOffFeed = turnOffFeed;
    vm.turnOnFeed = turnOnFeed;
    vm.next = next;
    vm.previous = previous;

    setListeners();

    TitleService.valueOnce(function(titleValue){
      $timeout(function(){
        vm.title = titleValue;
      });
    });

    function setListeners() {
      vm.messages = [];

      MessagesService.childAdded(function(childAdded){
        $timeout(function(){
          vm.messages.push(childAdded);
        });
      }, 3);

      MessagesService.childChanged(function(childChanged){
        $timeout(function(){
          var message = findMessageByKey(childChanged.key);
          message.text = childChanged.text;
          message.user = childChanged.user;
        });
      });

      MessagesService.childRemoved(function(childRemovedKey){
        $timeout(function(){
          deleteMessageByKey(childRemovedKey);
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

      MessagesService.addChild(newMessage);
    }

    function turnOffFeed() {
      vm.isFeedTurnOff = true;
      MessagesService.off();
    }

    function turnOnFeed() {
      vm.isFeedTurnOff = false;
      setListeners();
    }

    function next() {
      var lastItem = vm.messages[vm.messages.length - 1];
      MessagesService.nextPage(lastItem.key, 3).then(function(messages){
        vm.messages = messages;
      });
    }

    function previous() {
      var firstItem = vm.messages[0];
      MessagesService.previousPage(firstItem.key, 3).then(function(messages){
        vm.messages = messages;
      });
    }
  });
