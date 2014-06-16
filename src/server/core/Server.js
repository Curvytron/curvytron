/**
 * Server
 */
function Server(config)
{
    this.config       = config;
    this.app          = express();
    this.server       = http.Server(this.app);
    this.io           = io(this.server);

    this.roomRepository = new RoomRepository(this.io);
    this.gameController = new GameController(this.io);
    this.roomController = new RoomController(this.io, this.roomRepository, this.gameController);

    this.onSocketConnection    = this.onSocketConnection.bind(this);
    this.onSocketDisconnection = this.onSocketDisconnection.bind(this);

    this.io.on('connection', this.onSocketConnection);
    this.app.use(express.static('web'));

    this.server.listen(config.port, function() { console.log('Listening on: %d' + config.port); });
}

/**
 * On socket connection
 *
 * @param {Socket} socket
 */
Server.prototype.onSocketConnection = function(socket)
{
    console.log('Client connected', socket.id);

    var server = this,
        client = new SocketClient(socket);

    socket.on('disconnect', function () { server.onSocketDisconnection(client); });

    this.roomController.attach(client);
};

/**
 * On socket connection
 *
 * @param {SocketClient} client
 */
Server.prototype.onSocketDisconnection = function(client)
{
    console.log('Client disconnected', client.socket.id);

    this.roomController.detach(client);
    this.gameController.detach(client);
};