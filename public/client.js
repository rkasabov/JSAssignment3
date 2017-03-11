// shorthand for $(document).ready(...)
$(function() {

  var $nickname = $('#nicknames');
  var $chatForm = $('#sendForm');

    var socket = io();

    $chatForm.submit(function(){

	     socket.emit('chat', $('#m').val());
	     $('#m').val('');
	     return false;

    });


   socket.on('chat', function(msg){

      $('#messages').append($('<li>').text(msg));

   });

    socket.on('usernames', function(data){

      var currUser = "";

      let i = 0;
      for (i in data) {
        currUser += data[i] + '<br/>';
      }

      $nickname.html(currUser);

    });



});
