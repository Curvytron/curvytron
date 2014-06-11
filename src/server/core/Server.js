/**
 * Server
 */
function Server(config)
{
    this.config       = config;
    this.app          = express();
    this.server       = http.Server(this.app);
    this.io           = io(this.server);
    this.clients      = new Collection();
    this.repositories = {
        lobby: new LobbyRepository(this.io)
    };

    this.onSocketConnection    = this.onSocketConnection.bind(this);
    this.onSocketDisconnection = this.onSocketDisconnection.bind(this);

    this.io.on('connection', this.onSocketConnection);
    this.app.use(express.static('web'));

    this.server.listen(config.port, function() {
      console.log('listening on *:' + config.port);
    });

    SocketClient.prototype.repositories = this.repositories;
}

/**
 * On socket connection
 *
 * @param {Socket} socket
 */
Server.prototype.onSocketConnection = function(socket)
{
    console.log('Client connected', socket.id);

    socket.on('disconnect', this.onSocketDisconnection);

    this.clients.add(new SocketClient(socket));

    socket.emit('lobby:new', {name: "elao"});
};

/**
 * On socket connection
 *
 * @param {Socket} socket
 */
Server.prototype.onSocketDisconnection = function(socket)
{
    console.log('Client disconnect');

    var client = this.clients.getById(socket.id);

    if (client) {
        client.detachEvents();
        this.clients.remove(client);
    }
};