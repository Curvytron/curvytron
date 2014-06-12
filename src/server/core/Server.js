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
        room: new RoomRepository(this.io)
    };

    this.controllers = {
        room: new RoomController(this.io, this.repositories.room)
    };

    this.onSocketConnection    = this.onSocketConnection.bind(this);
    this.onSocketDisconnection = this.onSocketDisconnection.bind(this);

    this.io.on('connection', this.onSocketConnection);
    this.app.use(express.static('web'));

    this.server.listen(config.port, function() {
      console.log('listening on *:' + config.port);
    });
}

/**
 * On socket connection
 *
 * @param {Socket} socket
 */
Server.prototype.onSocketConnection = function(socket)
{
    console.log('Client connected', socket.id);

    var server = this;

    socket.on('disconnect', function () { server.onSocketDisconnection(client); });

    var client = new SocketClient(socket);

    this.controllers.room.attach(client);
    this.clients.add(client);
};

/**
 * On socket connection
 *
 * @param {Socket} socket
 */
Server.prototype.onSocketDisconnection = function(client)
{
    console.log('Client disconnect');
    this.controllers.room.detach(client);
    this.clients.remove(client);
};