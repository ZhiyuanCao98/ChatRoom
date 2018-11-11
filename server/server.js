const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

// listen for a new connection, do something after connection
io.on('connection', (socket) => {
  console.log('New user connected!');

    socket.on('createMessage', (m) => {
      console.log('Created message', m);
      io.emit('newMessage', {
        from: m.from,
        text: m.text,
        createdAt: new Date().getTime()
      });
  });

  // When you colse the tab in the browser which exit the server
  // you will get the message in your termial
  socket.on('disconnect', () => {
    console.log('User was disconnect');
  });
});


// chain the server to the localhost
server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});

// Connection in socketio
