var path = require('path');

var app = require('express')();
app.set('rootDirectory', __dirname);

// express configuration
require('./configure.js')(app);
app.use('/',require('./routes')(app));

var server = require('http').createServer(app);

// socket.io
var io = require('socket.io')(server);

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

server.listen(app.get('port'), function(){
  console.log('listening on *:' + app.get('port'));
});

module.exports = app;
