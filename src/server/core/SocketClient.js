/**
 * Socket Client
 *
 * @param {Socket} socket
 */
function SocketClient(socket)
{
    this.id      = socket.id;
    this.socket  = socket;
    this.players = new Collection([], 'name');
    this.room    = null;

    this.joinChannel = this.joinChannel.bind(this);

    this.socket.emit('open', this.id);
}

SocketClient.prototype = Object.create(EventEmitter.prototype);

/**
 * On channel change
 *
 * @param {String} channel
 */
SocketClient.prototype.joinChannel = function(channel)
{
    this.socket.join(channel);
};