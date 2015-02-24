/**
 * Socket Client
 *
 * @param {Socket} socket
 */
function SocketClient(socket, interval)
{
    BaseSocketClient.call(this, socket, interval);

    this.id      = null;
    this.active  = true;
    this.players = new Collection([], 'id');

    this.onActivity = this.onActivity.bind(this);
    this.sendId     = this.sendId.bind(this);

    this.on('whoami', this.sendId);
    this.on('activity', this.onActivity);
}

SocketClient.prototype = Object.create(BaseSocketClient.prototype);
SocketClient.prototype.constructor = SocketClient;

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
SocketClient.prototype.sendId = function()
{
    this.addEvent('client:id', this.id);
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
