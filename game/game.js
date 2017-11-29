
var players = {};   // dict of id + player obj

function init(io) {

  io.on('connect', function(socket){

    console.log('someone connected', socket.id);
    io.sockets.emit('allPlayerLocations', players);  // send to everyone.
    socket.emit('setId', socket.id);   // send only  to the thing that connected
    players[socket.id] = null; // placeholder


    socket.on('clientStart', function(player){
        // needed?
    });


    socket.on('clientPosition', function(player){
      // find player in players obj and update
      players[player.id] = player;
      io.sockets.emit('allPlayerLocations', players);

      console.log('player pos ', players)
    })

    socket.on('playerEaten', function(player){
      // remove player from players object
      console.log('player was eaten', player);
      delete players[player.id];
      io.sockets.emit('allPlayerLocations', players);
    })

    socket.on('disconnect', function() {
  //      socket.emit('destroyPlayer', "todo")

          delete players[socket.id];
    });





  })

}

module.exports = init;