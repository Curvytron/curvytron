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
    this.game   = null;
    this.avatar = null;

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

    if (room.isNameAvailable(name)) {
        this.room = room;

        this.player.setName(name);
        this.player.toggleReady(false);

        this.room.addPlayer(this.player);

        return true;
    }

    return false;
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
    }
};

/**
 * Join game
 *
 * @param {Game} game
 */
SocketClient.prototype.joinGame = function(game)
{
    if (this.game) {
        this.leaveGame();
    }

    this.game   = game;
    this.avatar = game.avatars.getById(this.player.name);
};

/**
 * Leave room
 */
SocketClient.prototype.leaveGame = function()
{
    if (this.game && this.game.removeAvatar(this.avatar)) {
        this.game   = null;
        this.avatar = null;
    }
};