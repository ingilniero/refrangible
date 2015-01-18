(function(angular){
  'use strict';

  /**
   * @ngdoc function
   * @name angularApp.controller:ChatCtrl
   * @description
   * # ChatCtrl
   * Controller of the refrangible
   */
  angular.module('angularApp')
  .controller('ChatCtrl', function ($scope, $timeout, MessagesService, TitleService) {
    var vm = this;

    vm.currentUser = $scope.currentUser;
    vm.title = null;
    vm.currentText = null;
    vm.sendMessage = sendMessage;
    vm.isFeedTurnOff = false;
    vm.turnOffFeed = turnOffFeed;
    vm.turnOnFeed = turnOnFeed;
    vm.next = next;
    vm.previous = previous;

    setListeners();

    TitleService.loaded(function(titleValue){
      vm.title = titleValue;
    });

    function setListeners() {
      vm.messages = [];

      MessagesService.watch({
        child_added: function(message){
          vm.messages.push(message);
        },
        child_removed: function(message) {
          deleteMessageByKey(message.key);
        },
        child_changed: function(changedMessage) {
          var message = findMessageByKey(changedMessage.key);
          message.text = changedMessage.text;
          message.user = changedMessage.user;
        }
      }, 3);
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
        vm.messages = [];
        messages.forEach(function(message){
          message.key = message.$id;
          vm.messages.push(message);
        });
      });
    }

    function previous() {
      var firstItem = vm.messages[0];
      MessagesService.previousPage(firstItem.key, 3).then(function(messages){
        vm.messages = [];
        messages.forEach(function(message){
          message.key = message.$id;
          vm.messages.push(message);
        });
      });
    }

  });

})(window.angular);
