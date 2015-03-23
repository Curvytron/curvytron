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
    this.ping       = this.onPing.bind(this);

    this.on('whoami', this.identify);
    this.on('activity', this.onActivity);
}

SocketClient.prototype = Object.create(BaseSocketClient.prototype);
SocketClient.prototype.constructor = SocketClient;

/**
 * Attach events
 */
SocketClient.prototype.attachEvents = function()
{
    BaseSocketClient.prototype.attachEvents.call(this);
    this.on('ping', this.onPing);
};

/**
 * Detach Events
 */
SocketClient.prototype.detachEvents = function()
{
    BaseSocketClient.prototype.detachEvents.call(this);
    this.removeListener('ping', this.onPing);
};

/**
 * On ping
 *
 * @param {Number} ping
 */
SocketClient.prototype.onPing = function (event)
{
    var ping = event[0],
        callback = event[1];

    callback(ping);
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
