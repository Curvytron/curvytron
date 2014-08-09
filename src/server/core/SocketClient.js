/**
 * Socket Client
 *
 * @param {Socket} socket
 */
function SocketClient(socket, interval)
{
    BaseSocketClient.call(this, socket, interval);

    this.players = new Collection([], 'id');
    this.id      = null;
    this.room    = null;
}

SocketClient.prototype = Object.create(BaseSocketClient.prototype);
SocketClient.prototype.constructor = SocketClient;