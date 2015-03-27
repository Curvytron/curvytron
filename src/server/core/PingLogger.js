/**
 * Ping logger
 *
 * @param {Socket} socket
 */
function PingLogger(socket)
{
    EventEmitter.call(this);

    this.socket   = socket;
    this.interval = null;

    this.ping = this.ping.bind(this);
}

PingLogger.prototype = Object.create(EventEmitter.prototype);
PingLogger.prototype.constructor = PingLogger;

/**
 * Ping frequency in milliseconds
 *
 * @type {Number}
 */
PingLogger.prototype.frequency = 1000;

/**
 * Start ping
 */
PingLogger.prototype.start = function()
{
    if (!this.interval) {
        this.interval = setInterval(this.ping, this.frequency);
    }
};

/**
 * Stop ping
 */
PingLogger.prototype.stop = function()
{
    if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
    }
};

/**
 * Ping
 */
PingLogger.prototype.ping = function()
{
    var logger = this,
        ping   = new Date().getTime();

    this.socket.ping(null, function () { logger.pong(ping); });
};

/**
 * Pong
 *
 * @param {Number} ping
 */
PingLogger.prototype.pong = function(ping)
{
    this.emit('latency', new Date().getTime() - ping);
};
