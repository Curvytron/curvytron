/**
 * SocketClient
 */
function SocketClient()
{
    var Socket = window.MozWebSocket || window.WebSocket;

    this.sendPing     = this.sendPing.bind(this);
    this.onError      = this.onError.bind(this);
    this.onOpen       = this.onOpen.bind(this);
    this.onConnection = this.onConnection.bind(this);

    this.id         = null;
    this.connected  = false;
    this.pingLogger = new PingLogger(this.sendPing, this.pingFrequency);

    BaseSocketClient.call(this, new Socket('ws://' + document.location.host + document.location.pathname, ['websocket']));

    this.socket.addEventListener('open', this.onOpen);
    this.socket.addEventListener('error', this.onError);
    this.socket.addEventListener('close', this.onClose);

    this.on('pong', this.pingLogger.pong);
}

SocketClient.prototype = Object.create(BaseSocketClient.prototype);
SocketClient.prototype.constructor = SocketClient;

/**
 * Ping frequency
 *
 * @type {Number}
 */
SocketClient.prototype.pingFrequency = 5000;

/**
 * On socket connection
 *
 * @param {Socket} socket
 */
SocketClient.prototype.onOpen = function(e)
{
    console.info('Socket open.');
    this.addEvent('whoami', null, this.onConnection);
};

/**
 * On open
 *
 * @param {Event} e
 */
SocketClient.prototype.onConnection = function(id)
{
    console.info('Connected with id "%s".', id);

    this.id        = id;
    this.connected = true;

    this.start();
    this.pingLogger.start();
    this.emit('connected');
};

/**
 * On open
 *
 * @param {Event} e
 */
SocketClient.prototype.onClose = function(e)
{
    console.info('Disconnected.');

    this.connected = false;
    this.id        = null;

    this.stop();
    this.pingLogger.stop();

    this.emit('disconnected');
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
    console.error(e);

    if (!this.connected) {
        this.onClose();
    }
};
