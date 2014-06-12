/**
 * Socket Client
 *
 * @param {Socket} socket
 */
function SocketClient(socket)
{
    this.id     = socket.id;
    this.socket = socket;
    this.player = new Player(this, this.id);
    this.room   = null;

    this.onChannel = this.onChannel.bind(this);

    this.socket.on('channel', this.onChannel);
    this.socket.emit('open');
}

SocketClient.prototype = Object.create(EventEmitter.prototype);

/**
 * On channel change
 *
 * @param {String} channel
 */
SocketClient.prototype.onChannel = function(channel)
{
    console.log("%s switching to channel: %s", this.socket.id, channel);
    this.socket.join(channel);
};

/**
 * Join room
 *
 * @param {Room} room
 * @param {String} name
 *
 * @return {Boolean}
 */
SocketClient.prototype.joinRoom = function(room, name)
{
    if (this.room) {
        this.leaveRoom();
    }

    this.room = room;

    this.player.setName(name);
    this.player.toggleReady(false);

    return this.room.addPlayer(this.player);
};

/**
 * Leave room
 *
 * @return {[type]}
 */
SocketClient.prototype.leaveRoom = function()
{
    if (this.room && this.room.removePlayer(this.player)) {
        this.player.toggleReady(false);
        this.room = null;

        return true;
    }

    return false;
};
