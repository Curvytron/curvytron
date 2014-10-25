/**
 * SocketClient
 */
function SocketClient()
{
    var Socket = window.MozWebSocket || window.WebSocket;

    BaseSocketClient.call(this, new Socket('ws://' + document.location.host + document.location.pathname, ['websocket']));

    this.sendPing = this.sendPing.bind(this);
    this.onError  = this.onError.bind(this);
    this.onOpen   = this.onOpen.bind(this);
    this.onSocket = this.onSocket.bind(this);

    this.id         = null;
    this.connected  = false;
    //this.pingLogger = new PingLogger(this.sendPing, 1000);

    this.socket.onopen  = this.onSocket;
    this.socket.onerror = this.onError;

    //this.on('pong', this.pingLogger.pong);
    this.on('open', this.onOpen);
}

SocketClient.prototype = Object.create(BaseSocketClient.prototype);
SocketClient.prototype.constructor = SocketClient;

/**
 * On socket connection
 *
 * @param {Socket} socket
 */
SocketClient.prototype.onSocket = function(e)
{
    console.info('Connected');

    this.connected = true;

    this.start();
    //this.pingLogger.start();

    this.emit('connected');
};

/**
 * On open
 *
 * @param {Event} e
 */
SocketClient.prototype.onOpen = function(e)
{
    this.id = e.detail;
};

/**
 * On open
 *
 * @param {Event} e
 */
SocketClient.prototype.onClose = function(e)
{
    console.info('Disconnect');

    this.connected = false;
    this.id        = null;

    //this.pingLogger.stop();

    this.emit('disconnected');

    throw 'Connexion lost';
};

/**
 * On Ping
 *
 * @param {Number} ping
 */
SocketClient.prototype.sendPing = function(ping)
{
    this.addEvent('ping', ping);
};

/**
 * On error
 *
 * @param {Event} e
 */
SocketClient.prototype.onError = function (e)
{
    throw e;
};
