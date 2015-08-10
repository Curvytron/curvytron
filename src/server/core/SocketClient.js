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

    this.ip         = ip;
    this.id         = null;
    this.active     = true;
    this.players    = new Collection([], 'id');
    this.pingLogger = new PingLogger(this.socket);
    this.tickrate   = new BaseTickrateLogger();

    this.identify   = this.identify.bind(this);
    this.onActivity = this.onActivity.bind(this);
    this.onLatency  = this.onLatency.bind(this);

    this.on('whoami', this.identify);
    this.on('activity', this.onActivity);
    this.pingLogger.on('latency', this.onLatency);
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
 * On ping logger latency value
 *
 * @param {Number} latency
 */
SocketClient.prototype.onLatency = function(latency)
{
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
 * Clear players
 */
SocketClient.prototype.clearPlayers = function()
{
    this.emit('players:clear', this);
    this.players.clear();
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

/**
 * Send an event
 *
 * @param {String} name
 * @param {String} data
 */
SocketClient.prototype.sendEvents = function (events)
{
    this.tickrate.tick(events);
    BaseSocketClient.prototype.sendEvents.call(this, events);
};

/**
 * Stop
 */
SocketClient.prototype.stop = function()
{
    BaseSocketClient.prototype.stop.call(this);
    this.pingLogger.stop();
    this.tickrate.stop();
};

/**
 * Object version of the client
 *
 * @return {Object}
 */
SocketClient.prototype.serialize = function()
{
    var data = BaseSocketClient.prototype.serialize.call(this);

    data.active = this.active;

    return data;
};
