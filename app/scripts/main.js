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

  app.service('ChatService', function(socketFactory, CHAT_EVENTS) {
    var chatSocket = socketFactory({
      prefix: null,
      ioSocket: io.connect()
    });

    this.login = function(username) {
      chatSocket.emit(CHAT_EVENTS.LOGIN, {username: username});
    };

    this.sendMessage = function(message) {
      chatSocket.emit(CHAT_EVENTS.SEND_MESSAGE, {message: message});
    };

    this.handleLoginSuccess = function(handler) {
      chatSocket.addListener(CHAT_EVENTS.LOGIN_SUCCESS, handler);
    };

    this.handleLoginUserTaken = function(handler) {
      chatSocket.on(CHAT_EVENTS.LOGIN_USER_TAKEN, handler);
    };


    this.handleUserJoined = function(handler) {
      chatSocket.on(CHAT_EVENTS.USER_JOINED, handler);
    };

    this.handleUserLeft = function(handler) {
      chatSocket.on(CHAT_EVENTS.USER_LEFT, handler);
    };

    this.handleIncomingMessage = function(handler) {
      chatSocket.on(CHAT_EVENTS.SEND_MESSAGE, handler);
    };
  });

  app.controller('AppCtrl', function(ChatService) {
    var self = this;
    self.needToLogin = true;
    self.username = '';
    self.messages = [];

    self.login = function(username) {
      if (!username) {
        alert('Username should not be empty');
        return;
      }

      ChatService.login(username);
    };

    self.sendMessage = function(messageText) {
      ChatService.sendMessage(messageText);
      var message = {message: messageText};
      self.messages.push(message);
      self.messageText = '';
    };

    self.addInfoMessage = function(message) {
      self.messages.push({message: message, type: 'info'});
    };

    // Event Handlers
    ChatService.handleLoginSuccess(function() {
      self.needToLogin = false;
    });

    ChatService.handleLoginUserTaken(function() {
      alert('The username you specifed is taken');
    });

    ChatService.handleUserJoined(function(data) {
      self.addInfoMessage(data.username + ' joined.');
    });

    ChatService.handleUserLeft(function(data) {
      self.addInfoMessage(data.username + ' left.');
    });

    ChatService.handleIncomingMessage(function(data) {
      self.messages.push({message: data.message, from: data.from});
    });
  });

  // Keeps the scrolling window scrolled to the bottom, watching for changes in the given watchCollection.
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
