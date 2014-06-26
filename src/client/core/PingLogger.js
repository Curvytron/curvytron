/**
 * Ping Logger
 *
 * @param {Function} callback
 * @param {Number} interval
 */
function PingLogger(callback, interval)
{
    this.callback     = callback;
    this.interval     = typeof(interval) !== 'undefined' ? interval : 10000;
    this.element      = null;
    this.pingInterval = null;
    this.queue        = [];
    this.value        = 0;

    this.start = this.start.bind(this);
    this.stop  = this.stop.bind(this);
    this.ping  = this.ping.bind(this);
    this.pong  = this.pong.bind(this);
}

/**
 * Start pingging
 */
PingLogger.prototype.start = function()
{
    if (!this.pingInterval) {
        this.pingInterval = setInterval(this.ping, this.interval);
    }
};

/**
 * Stop pingging
 */
PingLogger.prototype.stop = function()
{
    if (this.pingInterval) {
        clearInterval(this.pingInterval);
        this.pingInterval = null;
    }
};

/**
 * Ping request
 */
PingLogger.prototype.ping = function()
{
    var ping = new Date().getTime();

    this.queue.push(ping);
    this.callback(ping);
};

/**
 * Pong response
 *
 * @param {Event} e
 */
PingLogger.prototype.pong = function(e)
{
    var pong = new Date().getTime(),
        index = this.queue.indexOf(e.detail);

    if (index >= 0) {
        this.setPing(pong - this.queue[index]);
        this.queue.splice(index, 1);
    }
};

/**
 * Display ping
 *
 * @param {Number} ping
 */
PingLogger.prototype.setPing = function(ping)
{
    this.value = ping;
    this.draw();
};

/**
 * Set element
 *
 * @param {Element} element
 */
PingLogger.prototype.setElement = function(element)
{
    this.element = element;
};

/**
 * Draw ping
 */
PingLogger.prototype.draw = function()
{
    if (this.element) {
        this.element.innerHTML   = this.value + 'ms';
        this.element.style.color = this.getColor(this.value);
    }
};

/**
 * Get color state for the given Ping value
 *
 * @param {Number} ping
 *
 * @return {String}
 */
PingLogger.prototype.getColor = function(ping)
{
    return ping <= 100 ? 'green' : (ping <= 300 ? 'orange' : 'red');
};