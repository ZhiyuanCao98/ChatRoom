var socket = io();

function scrollToBottom () {
  // Selectors
  var message = jQuery('#messages');
  var newMessage = message.children('li:last-child')
  // Heights
  var clientHeight = message.prop('clientHeight');
  var scrollTop = message.prop('scrollTop');
  var scrollHeight = message.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
     message.scrollTop(scrollHeight);
  };
}

socket.on('connect', function() {
  console.log('Connected to server');
});



socket.on('disconnect', function() {
  console.log('Disconnect from server');
});


socket.on('newMessage', function(m) {
  var formattedTime = moment(m.createdAt).format('h:mm a');
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    text: m.text,
    from: m.from,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
  scrollToBottom();

  // var formattedTime = moment(m.createdAt).format('h:mm a');
  // console.log('newMessage', m );
  // var li = jQuery('<li></li>');
  // li.text(`${m.from} ${formattedTime}: ${m.text}`);
  //
  // jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function(message){
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template, {
    from: message.from,
    createdAt: formattedTime,
    url: message.url
  });
  jQuery('#messages').append(html);
  scrollToBottom();
  // var formattedTime = moment(message.createdAt).format('h:mm a');
  // console.log('newMessage', m );
  //
  // var li = jQuery('<li></li>');
  // var a = jQuery('<a target="_blank">My current location</a>');
  //
  // li.text(`${message.from}: ${formattedTime}`);
  // a.attr('href', message.url);
  // li.append(a);
  // jQuery('#messages').append(li);
});
// socket.emit('createMessage', {
//   from: 'CCC',
//   text: 'HELLO THIS IS CCC'
// }, function (data) {
//   console.log("Got it!", data);
// });

// Show on personalScreen
socket.on('personalMessage', function(message){
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#personal-message-template').html();
  var html = Mustache.render(template, {
    text: message.text,
    createdAt: formattedTime
  });
  jQuery('#messages').append(html);
});



jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();

  var messageTextbox = jQuery('[name=message]');

  socket.emit('createMessage', {
    from: 'Client',
    text: messageTextbox.val()
  }, function() {
    messageTextbox.val("");
  });


});


var locationButton = jQuery('#send-location');
locationButton.on('click', function() {
  if (!navigator.geolocation) {
    return alert('GEOLOCATION NOT SUPPORT BY YOUR SUPPORT');
  }

  locationButton.attr('disabled', 'disabled').text('Sending.......');

  navigator.geolocation.getCurrentPosition( function(position) {
    locationButton.removeAttr('disabled').text('Send Location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });

  }, function() {
    locationButton.removeAttr('disabled').text('Send Location');
    alert('Unable to fetch location.');
  });
});
