/**
 * Server
 */
function Server(config)
{
    this.config      = config;
    this.app         = express();
    this.server      = new http.Server(this.app);
    this.clients     = new Collection([], 'id', true);

    this.roomRepository = new RoomRepository();
    this.gameController = new GameController();
    this.roomController = new RoomController(this.roomRepository, this.gameController);

    this.authorizationHandler  = this.authorizationHandler.bind(this);
    this.onSocketConnection    = this.onSocketConnection.bind(this);
    this.onSocketDisconnection = this.onSocketDisconnection.bind(this);
    this.onError               = this.onError.bind(this);

    this.app.use(express.static('web'));

    this.server.on('error', this.onError);
    this.server.on('upgrade', this.authorizationHandler);
    this.server.listen(config.port);

    console.info('Listening on: %s', config.port);
}

/**
 * Authorization Handler
 *
 * @param {Object} request
 * @param {Object} socket
 * @param {Buffer} body
 */
Server.prototype.authorizationHandler = function(request, socket, head)
{
    return WebSocket.isWebSocket(request) ? this.onSocketConnection(new WebSocket(request, socket, head, ['websocket'], {ping: 5})) : socket.end();
};

/**
 * On socket connection
 *
 * @param {Socket} socket
 */
Server.prototype.onSocketConnection = function(socket)
{
    var server = this,
        client = new SocketClient(socket, 3);

    this.clients.add(client);
    socket.on('close', function (e) { server.onSocketDisconnection(client); });

    client.addEvent('open', client.id);

    this.roomController.attach(client);

    console.info('Client connected', client.id);
};

/**
 * On socket connection
 *
 * @param {SocketClient} client
 */
Server.prototype.onSocketDisconnection = function(client)
{
    console.info('Client disconnected', client.id);

    this.roomController.onLeaveRoom(client);
    this.roomController.detach(client);

    this.clients.remove(client);
    client = null;
};

/**
 * On error
 *
 * @param {Error} error
 */
Server.prototype.onError = function(error)
{
    console.error('Server Error:', error.stack);
};