/**
 * Socket Client
 *
 * @param {Socket} socket
 */
function SocketClient(socket)
{
    this.id     = socket.id
    this.socket = socket;
    this.player = new Player(this, this.id);

    this.onJoinRoom   = this.onJoinRoom.bind(this);
    this.onCreateRoom = this.onCreateRoom.bind(this);

    this.attachEvents();

    this.socket.emit('open');

    this.repositories.room.listRooms(this.socket);
}

/**
 * Attach events
 */
SocketClient.prototype.attachEvents = function()
{
    this.socket.on('room:create', this.onCreateRoom);
    this.socket.on('room:join', this.onJoinRoom);
};

/**
 * Attach events
 */
SocketClient.prototype.detachEvents = function()
{
    this.socket.off('room:create', this.onCreateRoom);
    this.socket.off('room:join', this.onJoinRoom);
};

/**
 * On new room
 *
 * @param {String} name
 * @param {Function} callback
 */
SocketClient.prototype.onCreateRoom = function(data, callback)
{
    callback(this.repositories.room.create(data.name));
};

/**
 * On join room
 *
 * @param {Object} data
 * @param {Function} callback
 */
SocketClient.prototype.onJoinRoom = function(data, callback)
{
    var room = this.roomRepositories.get(data.room)
        player = new Player(this, data.player);

    callback(room.addPlayer(player));
};