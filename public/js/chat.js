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
  var params = jQuery.deparam(window.location.search);
  params.room = params.room.toLowerCase();
  console.log(`Room's name ${params.room}`);
  socket.emit('join', params, function(err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No error');
    }
  });
});



socket.on('disconnect', function() {
  console.log('Disconnect from server');
});

socket.on('updateUserList', function(users) {
  var ol = jQuery('<ol></ol>');

  users.forEach(function (user) {
    ol.append(jQuery('<li></li>').text(user));
  });
  var onlineNum = '(' + users.length + ')';
  jQuery('#onlineNum').html(onlineNum);
  jQuery('#users').html(ol);
});



socket.on('newMessage', function(m) {
  var params = jQuery.deparam(window.location.search);

  var formattedTime = moment(m.createdAt).format('h:mm a');
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    text: m.text,
    from: m.from,
    createdAt: formattedTime
  });
  jQuery('#messages').append(html);


  console.log(`m.from ${m.from}`);
  console.log(`params.name ${params.name}`);
  console.log(`euqal: ${m.from === params.name}`)
  console.log(`The list is ${list}`);
  var list = jQuery('#messages').children('li:last-child');
  if (m.from === params.name) {
      list.css({'float':'right', 'padding':'10px', 'margin' : '5px',
       'background-color': '#66FF33', 'border-radius': '10px',
      });
  }

  if (m.from === 'Admin') {
    list.css({'display':'table', 'margin':'0 auto', 'color' : '#9900FF'});
  }

  if(m.from !== params.name && m.from !== 'Admin') {
    list.css({'float':'left', 'padding':'10px', 'margin' : '5px',
     'background-color': '#6699FF', 'border-radius': '10px',
    });
  }

  scrollToBottom();
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
