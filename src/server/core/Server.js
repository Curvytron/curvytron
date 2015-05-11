/**
 * Server
 */
function Server(config)
{
    EventEmitter.call(this);

    this.config  = config;
    this.app     = express();
    this.server  = new http.Server(this.app);
    this.clients = new Collection([], 'id', true);

    this.roomRepository  = new RoomRepository();
    this.roomsController = new RoomsController(this.roomRepository);

    this.authorizationHandler  = this.authorizationHandler.bind(this);
    this.onSocketConnection    = this.onSocketConnection.bind(this);
    this.onSocketDisconnection = this.onSocketDisconnection.bind(this);
    this.onError               = this.onError.bind(this);

    this.app.use(express['static']('web'));

    this.server.on('error', this.onError);
    this.server.on('upgrade', this.authorizationHandler);
    this.server.listen(config.port);

    console.info('Listening on port %s', config.port);
}

Server.prototype = Object.create(EventEmitter.prototype);
Server.prototype.constructor = Server;

/**
 * Authorization Handler
 *
 * @param {Object} request
 * @param {Object} socket
 * @param {Buffer} body
 */
Server.prototype.authorizationHandler = function(request, socket, head)
{
    if (!WebSocket.isWebSocket(request)) {
        return socket.end();
    }

    var websocket = new WebSocket(request, socket, head, ['websocket'], {ping: 30}),
        ip = request.headers['x-real-ip'] || request.connection.remoteAddress;

    return this.onSocketConnection(websocket, ip);
};

/**
 * On socket connection
 *
 * @param {Socket} socket
 * @param {String} ip
 */
Server.prototype.onSocketConnection = function(socket, ip)
{
    var client = new SocketClient(socket, 1, ip);
    this.clients.add(client);

    client.on('close', this.onSocketDisconnection);
    this.roomsController.attach(client);
    this.emit('client', client);

    console.info('Client %s connected.', client.id);
};

/**
 * On socket connection
 *
 * @param {SocketClient} client
 */
Server.prototype.onSocketDisconnection = function(client)
{
    console.info('Client %s disconnected.', client.id);

    this.clients.remove(client);
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
