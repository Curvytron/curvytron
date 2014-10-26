/**
 * Socket Client
 *
 * @param {Socket} socket
 */
function SocketClient(socket, interval)
{
    BaseSocketClient.call(this, socket, interval);

    this.id      = null;
    this.room    = null;
    this.players = new Collection([], 'id');
}

SocketClient.prototype = Object.create(BaseSocketClient.prototype);
SocketClient.prototype.constructor = SocketClient;
