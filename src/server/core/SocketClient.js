/**
 * Socket Client
 *
 * @param {Socket} socket
 * @param {Number} interval
 * @param {String} ip
 */
function SocketClient(socket, interval, ip)
{
    BaseSocketClient.call(this, socket, interval);

    this.ip      = ip;
    this.id      = null;
    this.active  = true;
    this.players = new Collection([], 'id');

    this.onActivity = this.onActivity.bind(this);
    this.identify   = this.identify.bind(this);
    this.ping       = this.ping.bind(this);

    this.on('whoami', this.identify);
    this.on('activity', this.onActivity);

    setInterval(this.ping, this.pingInterval);
}

SocketClient.prototype = Object.create(BaseSocketClient.prototype);
SocketClient.prototype.constructor = SocketClient;

/**
 * Ping interval
 *
 * @type {Number}
 */
SocketClient.prototype.pingInterval = 1000;

/**
 * Ping
 */
SocketClient.prototype.ping = function()
{
    var client = this,
        ping = new Date().getTime();

    this.socket.ping(null, function () {
        client.pong(ping);
    });
};

/**
 * Pong
 *
 * @param {Number} ping
 */
SocketClient.prototype.pong = function(ping)
{
    var pong = new Date().getTime(),
        latency = pong - ping;

    console.log('%sms', latency);
    this.emit('latency', latency);
    this.addEvent('latency', latency, null, true);
};

/**
 * Is this client playing?
 *
 * @return {Boolean}
 */
SocketClient.prototype.isPlaying = function()
{
    return !this.players.isEmpty();
};

/**
 * Who am I?
 */
SocketClient.prototype.identify = function(event)
{
    event[1](this.id);
};

/**
 * On activity change
 *
 * @param {Event} event
 */
SocketClient.prototype.onActivity = function(active)
{
    this.active = active;
};
