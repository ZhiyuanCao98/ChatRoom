var socket = io();


socket.on('connect', function() {
  console.log('Connected to server');
});



socket.on('disconnect', function() {
  console.log('Disconnect from server');
});


socket.on('newMessage', function(m) {
  console.log('newMessage', m );
  var li = jQuery('<li></li>');
  li.text(`${m.from}: ${m.text}`);

  jQuery('#messages').append(li);
});

// socket.emit('createMessage', {
//   from: 'CCC',
//   text: 'HELLO THIS IS CCC'
// }, function (data) {
//   console.log("Got it!", data);
// });

jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();
  socket.emit('createMessage', {
    form: 'Client',
    text: jQuery('[name=message]').val()
  }, function() {

  });

  jQuery('[name=message]').val("");
});
