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
    chatSocket.on(CHAT_EVENTS.LOGIN_SUCCESS, function(data) {
      console.log('login:success', data);
    });

    chatSocket.on(CHAT_EVENTS.LOGIN_USER_TAKEN, function(data) {
      console.log('login:usernameTaken', data);
    });
    chatSocket.emit(CHAT_EVENTS.LOGIN, {username: 'victor'});
  });
})(window.angular, window.io);
