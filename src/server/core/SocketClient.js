/**
 * Socket Client
 *
 * @param {Socket} socket
 */
function SocketClient(socket, interval)
{
    BaseSocketClient.call(this, socket, interval);

    this.id      = null;
    this.players = new Collection([], 'id');
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
