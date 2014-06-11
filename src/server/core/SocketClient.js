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

    this.onJoinRoom   = this.onJoinRoom.bind(this);
    this.onCreateRoom = this.onCreateRoom.bind(this);
    this.onReadyRoom  = this.onReadyRoom.bind(this);
    this.onColorRoom  = this.onColorRoom.bind(this);

    this.attachEvents();

    this.socket.emit('open');

    this.controllers.room.listRooms(this.socket);
}

/**
 * Attach events
 */
SocketClient.prototype.attachEvents = function()
{
    this.socket.on('room:create', this.onCreateRoom);
    this.socket.on('room:join', this.onJoinRoom);
    this.socket.on('room:ready', this.onReadyRoom);
    this.socket.on('room:color', this.onColorRoom);
};

/**
 * Attach events
 */
SocketClient.prototype.detachEvents = function()
{
    this.socket.off('room:create', this.onCreateRoom);
    this.socket.off('room:join', this.onJoinRoom);
    this.socket.off('room:ready', this.onReadyRoom);
    this.socket.off('room:color', this.onColorRoom);
};

/**
 * Broacast to room
 *
 * @param {String} event
 * @param {Object} data
 */
SocketClient.prototype.broadcastRoom = function(event, data)
{
    if (typeof(data.player) === 'undefined') {
        data.player = this.player.name;
    }

    if (typeof(data.room) === 'undefined') {
        data.room = this.room.name;
    }

    this.socket.emit(event, data);
    this.socket.broadcast.emit(event, data);
};

/**
 * On new room
 *
 * @param {String} name
 * @param {Function} callback
 */
SocketClient.prototype.onCreateRoom = function(data, callback)
{
    callback(this.controllers.room.create(data.name));
};

/**
 * On join room
 *
 * @param {Object} data
 * @param {Function} callback
 */
SocketClient.prototype.onJoinRoom = function(data, callback)
{
    var room = this.repositories.room.get(data.room),
        result = false;

    if (room) {
        if (this.room) {
            this.socket.leave(this.room.name);
            this.room.removePlayer(this.player);
        }

        this.room = room;
        this.socket.join(this.room.name);

        this.player.name  = data.player;
        this.player.ready = false;

        result = room.addPlayer(this.player);
    }

    callback({result: result, name: this.player.name});

    if (result) {
        this.broadcastRoom('room:join', {player: this.player.serialize()});
    }
};

/**
 * On new room
 *
 * @param {Object} data
 */
SocketClient.prototype.onReadyRoom = function(data, callback)
{
    this.player.ready = !this.player.ready;

    callback({success: true, ready: this.player.ready});

    this.broadcastRoom('room:player:update', {ready: this.player.ready});

    //this.room.checkReady();
};

/**
 * On new room
 *
 * @param {Object} data
 */
SocketClient.prototype.onColorRoom = function(data, callback)
{
    this.player.color = data.color;

    callback({success: true, color: this.player.color});

    this.broadcastRoom('room:player:update', {color: this.player.color});
};