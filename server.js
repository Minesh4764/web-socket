var httpd = require('http').createServer(handler);
var io = require('socket.io').listen(httpd);
var fs = require('fs');

httpd.listen(3300);

function handler(req, res) {
  fs.readFile(__dirname + '/index.html',
    function(err, data) {
      if (err) {
       res.writeHead(500);
       return res.end('Error loading index.html');
      }

      res.writeHead(200);
      res.end(data);
    }
  );
}

 io.sockets.on('connection',function(socket){
    socket.on('clientMessage',function(content){
    socket.emit('serverMessage','you said:  '+ content );
    console.log(content);

   // socket.get('username',function(err,username){
     username = socket.username;
     console.log(username + 'said this' + content);
    if(!username) {

         username = socket.id;
      }
     /*room = socket.room;
      var broadcast= socket.broadcast;
      var message = content;
   if (room) {

      broadcast.to(room);
   }
*/
    //broadcast.emit('serverMessage', username + ' said: ' + message);
        socket.broadcast.emit('serverMessage',username + 'said : ' + content);
   

      

        
   // });



   });






socket.on('disconnect', function() {

username = socket.username;
if (!username ){
  username = socket.id;

}
console.log(username + 'is disconnected');
  socket.broadcast.emit('serverMessage','user' + username + ' logged out');

});


  socket.on('typing', function () {
     console.log("typing emiited");
     socket.broadcast.emit('whotyping', 'user' +  socket.username + 'is typing');
  //  socket.broadcast.emit('typing',  socket.username + 'is typing');
   // socket.emit('typing',socket.username +'is typing');
    
  });


socket.on('login',function(username){
//console.log(username);
  socket.username = username;
  //socket.set('username',username,function(err){
   //  if (err) { throw  err; }
      socket.emit('serverMessage','Cuttently logged in as ' + username);
      socket.broadcast.emit('serverMessage', 'User ' +  username + 'logged in');

//  });

});
/*
socket.on('join',function(room) {
   room = socket.room;
   if (!room) {
       socket.room =room; 
    }
   socket.join(room);
   username = socket.username;
 if(!username){
    username = socket.id;
   }
    socket.broadcast.to(room).emit('serverMessage','user ' + username + 'joinged the room');

});
*/
socket.emit('login');


});

