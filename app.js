
/**
 * Module dependencies.
 */

 var express = require('express')
 , app = express()
 , http = require('http')
 , port = process.env.PORT || 3000
 , server = http.createServer(app).listen(port)
 , io = require('socket.io').listen(server);

// Configuration

app.configure(function(){
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
  app.set('env', 'production')
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

io.sockets.on('connection', function (socket) {

  socket.emit("init", socket.id);

  socket.on('disconnect', function() {
  });

  socket.on('movePlayer', function (player) {
    io.to(player.socketId).emit('updatePlayerPosition', player);
  });

  socket.on('controlerConnected', function (socketId) {
    io.to(socketId).emit("clientConnexion");
  });
});

app.get('qrcode/', function(req, res) {
 res.sendfile('public/qrcode/index.html');
});

app.get('qrcode/control.html/:id', function(req, res) {
  res.sendfile('public/qrcode/control.html');
});
