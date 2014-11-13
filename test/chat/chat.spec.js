var expect = require('chai').expect;

var ioClient = require('socket.io-client');
var io = require('socket.io')();

var ChatServer = require('../../chat/server.js');
var EVENTS = require('../../chat/events.js');

var socketURL = 'http://localhost:3000';
var options ={
  transports: ['websocket'],
  multiplex: false
};

var chatServer;

var connect = function(cb) {
  var socket = ioClient.connect(socketURL, options);
  socket.on('connect', cb);
  return socket;
};

var onConnect = function(socket, handleer) {
  socket.on('connect', handler);
};

describe('Chat Server', function() {
  before(function() {
    io.listen(3000);
  });

  after(function() {
    io.close();
  });

  beforeEach(function() {
    chatServer = new ChatServer(io);
  });
  describe('login', function() {
    it('should allow the user to login with a non-existent user and emit the usernames', function(done) {
      var client = connect(function() {
        client.emit(EVENTS.LOGIN, {username: 'victor'});

        client.on(EVENTS.LOGIN_SUCCESS, function(data) {
          expect(data.usernames).to.deep.equal(['victor']);
          client.disconnect();
          done();
        });
      });
    });

    it('should broadcast a USER_JOINED', function(done) {
      var client = connect(function() {
        var client2 = connect(function() {
          client.emit(EVENTS.LOGIN, {username: 'victor'});
          client2.on(EVENTS.USER_JOINED, function(data) {
            expect(data.username).to.equal('victor');
            client.disconnect();
            client2.disconnect();
            done();
          });
        });
      });
    });

    describe('successful:', function() {

      describe('send message', function() {
        it('should be able to broadcast the sent message', function(done) {
          var client = connect(function() {
            var client2 = connect(function() {
              client.emit(EVENTS.LOGIN, {username: 'victor'});
              client2.emit(EVENTS.LOGIN, {username: 'victor2'});

              var message = 'testing my server';
              client2.emit(EVENTS.SEND_MESSAGE, {message: message});
              client.on(EVENTS.SEND_MESSAGE, function(data) {
                expect(data).to.deep.equal({message: message, from: 'victor2'});
                client.disconnect();
                client2.disconnect();
                done();
              });
            });
          });
        });
      });

      describe('disconnect', function() {
        it('should broadcast user left', function(done) {
          var client = connect(function() {
            var client2 = connect(function() {
              client.emit(EVENTS.LOGIN, {username: 'victor'});
              client2.emit(EVENTS.LOGIN, {username: 'victor2'});

              client.disconnect();
              client2.on(EVENTS.USER_LEFT, function(data) {
                expect(data.username).to.equal('victor');
                client2.disconnect();
                done();
              });
            });
          });
        });
      });
    });

    describe('unsuccessful: ', function() {
      describe('username taken', function() {
        it('should emit a username taken event and not a login success', function() {
          var client = connect(function() {
            var client2 = connect(function() {
              client.emit(EVENTS.LOGIN, {username: 'victor'});
              client2.emit(EVENTS.LOGIN, {username: 'victor'});

              client2.on(EVENTS.LOGIN_SUCCESS, function() {
                throw new Error('Login success should not be called');
              });

              client2.on(EVENTS.LOGIN_USER_TAKEN, function() {
                client.disconnect();
                client2.disconnect();
                done();
              });
            });
          });
        });
      });
    });
  });
});
