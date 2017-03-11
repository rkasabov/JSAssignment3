var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

http.listen( port, function () {
    console.log('listening on port', port);
});

app.use(express.static(__dirname + '/public'));

  //Users currently connected to the chat system
  var chatUsers = [];

// listen to 'chat' messages
io.on('connection', function(socket){

  //Assign a username
  let currUsername = generateUsername();
  let existingUser = chatUsers.indexOf(currUsername);

  //Check if username already exists
  while (existingUser != -1) {

    //If username exists in array, generate a new one
    currUsername = generateUsername();
    existingUser = chatUsers.indexOf(currUsername);
  }

  //Store nickname of each user within socket itself
  socket.nickname = currUsername;
  chatUsers.push(socket.nickname);

  //Emit the chat user's array to all the users so they can update their
  //list when someone new joins

  io.sockets.emit('usernames', chatUsers);

  socket.on('chat', function(msg){

    //We obtain times stamp for message emit below
    let currDate = new Date();
    let hours = currDate.getHours();
    let minutes = currDate.getMinutes();
    let seconds = currDate.getSeconds();

    let time = hours + ":" + minutes + ":" + seconds;

	   io.emit('chat', time + " "  + currUsername + ":" + " " + msg);
  });

   socket.on('disconnect', function(data) {

     //Check if they have a nickname set first
     if (!socket.nickname) return;

     //User leaves chat, active users are updated
     chatUsers.splice(chatUsers.indexOf(socket.nickname), 1);
     io.sockets.emit('usernames', chatUsers);

    })
});

/* Function creates random number's simulating GUIDs */
function createUserID() {

  //Takes the floor of a "randomly" generated number (Partially based on RFC4122)
  let id = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);

  return id;

}

//Generate username
function generateUsername() {

  let nickName = "user" + createUserID();

  return nickName;

}
