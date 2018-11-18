const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');


const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

// listen for a new connection, do something after connection
io.on('connection', (socket) => {
  console.log('New user connected!');

  // when a user join chat room, greeting individual user
  // socket.emit('newMessage', generateMessage('Admin', 'Welcome to the Zhiyuan chat room'));

  // brodcaset everyone know new user join
  // socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joind'));

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room) || params.name == 'Admin') {
      callback('Name and Room can not be null or Admin');
    }

    if(users.getUserByName(params.name)) {
      callback('The name has been taken');
    }

    socket.join(params.room);
    // add user into the list
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room))
    socket.emit('newMessage', generateMessage('Admin', `welcome! ${params.name}`));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joind`));

    // socket.leave('The Office Fans ')
    callback();
  });

  socket.on('createMessage', (m, callback) => {
    var user = users.getUser(socket.id);
    if(user && isRealString(m.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, m.text));
    }

    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    var user = users.getUser(socket.id);
    if(user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  });
  // When you colse the tab in the browser which exit the server
  // you will get the message in your termial
  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);
    if(user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
    }
    console.log('User was disconnect');
  });
});


// chain the server to the localhost
server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});

// Connection in socketio
