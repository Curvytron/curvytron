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
    this.game    = null;

    this.onChannel = this.onChannel.bind(this);

    this.socket.on('channel', this.onChannel);
    this.socket.emit('open', this.id);
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
    if (this.room && this.room !== room) {
        this.leaveRoom();
    }

    if (room.isNameAvailable(name)) {

        if (!this.room) {
            this.room = room;
            this.room.clients.add(this);
        }

        var player = new Player(this, name);

        this.room.addPlayer(player);
        this.players.add(player);

        return player;
    }

    return false;
};

/**
 * Leave room
 */
SocketClient.prototype.leaveRoom = function()
{
    if (this.room) {

        this.leaveGame();

        var player;

        for (var i = this.players.items.length - 1; i >= 0; i--) {
            player = this.players.items[i];
            this.room.removePlayer(player);
        }

        this.players.clear();
        this.room.clients.remove(this);
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
    if (this.game && this.game !== game) {
        this.leaveGame();
    }

    if (!this.game) {
        this.game = game;
        this.game.clients.add(this);
    }
};

/**
 * Leave room
 */
SocketClient.prototype.leaveGame = function()
{
    if (this.game) {
        var player;

        console.log('leaveGame');

        this.game.clients.remove(this);
        this.game = null;
    }
};