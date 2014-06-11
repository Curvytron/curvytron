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

    this.onJoinRoom = this.onJoinRoom.bind(this);
    this.onCreateRoom  = this.onCreateRoom.bind(this);

    this.attachEvents();

    this.socket.emit('open');
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
 */
SocketClient.prototype.onCreateRoom = function(name)
{
    console.log("onCreateRoom", name);
    this.repositories.room.create(name);
};

/**
 * On join room
 *
 * @param {Object} data
 */
SocketClient.prototype.onJoinRoom = function(data)
{
    /*var room = this.roomController.get(data.room)
        player = new Player(this, data.player);

    room.addPlayer(player);*/
};