var path = require('path');

var app = require('express')();
app.set('rootDirectory', __dirname);

// express configuration
require('./configure.js')(app);
app.use('/', require('./routes')(app));

var server = require('http').Server(app);

// socket.io
var io = require('socket.io')(server);

var ChatServer = require('./chat/server.js');
var chatServer = new ChatServer(io);

server.listen(app.get('port'), function(){
  console.log('listening on *:' + app.get('port'));
});

module.exports = app;
