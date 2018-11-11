var socket = io();


socket.on('connect', function() {
  console.log('Connected to server');

  socket.emit('createMessage', {
      from: 'Zy',
      text: 'Hello'
  });
});



socket.on('disconnect', function() {
  console.log('Disconnect from server');
});


socket.on('newMessage', function(m) {
  console.log('newMessage', m );
})
