(function(angular, io) {
  'use strict';

  var app = angular.module('chatApp', ['btford.socket-io']);

  app.constant('CHAT_EVENTS', {
    // login events
    LOGIN: 'login',
    LOGIN_SUCCESS: 'login:success',
    LOGIN_USER_TAKEN: 'login:userTaken',

    // User events
    USER_JOINED: 'user:joined',
    USER_LEFT: 'user:left',

    // Send events
    SEND_MESSAGE: 'send:message',

    DISCONNECT: 'disconnect'
  });

  app.factory('chatSocket', function(socketFactory) {
    return socketFactory({
      prefix: null,
      ioSocket: io.connect()
    });
  });

  app.controller('AppCtrl', function(chatSocket, CHAT_EVENTS) {
    var self = this;
    self.needToLogin = true;
    self.username = '';
    self.messages = [];

    self.login = function(username) {
      if (!username) {
        alert('Username should not be empty');
        return;
      }
      chatSocket.emit(CHAT_EVENTS.LOGIN, {username: username});
    };

    self.sendMessage = function(messageText) {
      var message = {message: messageText};
      self.messages.push(message);
      self.messageText = '';

      chatSocket.emit(CHAT_EVENTS.SEND_MESSAGE, message);
    };

    self.addInfoMessage = function(message) {
      self.messages.push({message: message, type: 'info'});
    };

    chatSocket.on(CHAT_EVENTS.LOGIN_SUCCESS, function() {
      self.needToLogin = false;
    });

    chatSocket.on(CHAT_EVENTS.LOGIN_USER_TAKEN, function() {
      alert('The username you specifed is taken');
    });

    chatSocket.on(CHAT_EVENTS.USER_JOINED, function(data) {
      self.addInfoMessage(data.username + 'joined.');
    });

    chatSocket.on(CHAT_EVENTS.USER_LEFT, function(data) {
      self.addInfoMessage(data.username + ' left.');
    });

    chatSocket.on(CHAT_EVENTS.SEND_MESSAGE, function(data) {
      self.messages.push({message: data.message, from: data.from});
    });
  });

  app.directive('scrollToBottom', function() {
    return {
      restrict: 'A',
      scope: {
        watchCollection: '='
      },
      link: function($scope, elem) {
        $scope.$watchCollection('watchCollection', function() {
          elem.scrollTop(elem[0].scrollHeight);
        });
      }
    };
  });
})(window.angular, window.io);
