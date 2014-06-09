/**
 * Server
 */
function Server(config)
{
    this.config = config;
    this.server = require('http').Server();
    this.io     = require('socket.io')(this.server);

    this.server.listen(config.port, function() {
      console.log('listening on *:' + config.port);
    });

    this.io.on('connection', function(socket){
      console.log('a user connected');
    });
}