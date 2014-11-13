var _ = require('lodash');
var bunyan = require('bunyan');
var log = bunyan.createLogger({name: 'chat-server'});

var EVENTS = require('./events.js');
var user = require('./user.js');
var User = user.User;
var UserManager = user.UserManager;

var Server = function(io) {
  this.userManager = new UserManager();

  var self = this;
  io.on(EVENTS.CONNECTION, function(socket) {
    self.handleConnection(socket);
  });
};

Server.prototype.handleConnection = function(socket) {
  log.info('Handling new connection');
  var self = this;
  var userManager = this.userManager;
  var user;

  socket.on(EVENTS.LOGIN, function(data) {
    log.info({eventData: data}, 'EVENT %s', EVENTS.LOGIN);
    var username = data.username;
    if (userManager.isAvailable(username)) {
      log.info('username %s available', username);

      user = new User(username, socket);
      userManager.add(user);
      self.setResponseListeners(user);

      socket.emit(EVENTS.LOGIN_SUCCESS, {
        usernames: userManager.getUsernames()
      });

      log.info('emitting %s', EVENTS.USER_JOINED);
      socket.broadcast.emit(EVENTS.USER_JOINED, {
        username: user.username
      });

    } else {
      log.info('username %s not available', username);
      socket.emit(EVENTS.LOGIN_USER_TAKEN, {});
    }
  });
};

Server.prototype.setResponseListeners = function(user) {
  log.info('Setting response listeners for %s', user.username);
  var self = this;

  var socket = user.socket;
  socket.on(EVENTS.SEND_MESSAGE, function(data) {
    log.info({eventData: data}, 'EVENT %s', EVENTS.SEND_MESSAGE);

    var message = data.message;
    if (!_.isEmpty(message)) {
      socket.broadcast.emit(EVENTS.SEND_MESSAGE, {message: message})
    }
  });


  socket.on(EVENTS.DISCONNECT, function() {
    log.info('EVENT %s', EVENTS.DISCONNECT);
    self.userManager.remove(user);
    socket.broadcast.emit(EVENTS.USER_LEFT, {
      username: user.username
    });
  });
};

module.exports = Server;
