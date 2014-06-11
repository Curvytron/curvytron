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

    this.repositories.room.listRooms(this.socket);
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

    this.socket/*.in(this.room.name)*/.emit(event, data);
    this.socket/*.in(this.room.name)*/.broadcast.emit(event, data);
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

    callback(result ? this.player.name : false);

    if (result) {
        var eventName = 'room:join',
            eventData = {room: this.room.name, player: this.player.serialize()};

        this.socket.emit(eventName, eventData);
        this.socket.broadcast.emit(eventName, eventData);
    }
};

/**
 * On new room
 *
 * @param {Object} data
 */
SocketClient.prototype.onReadyRoom = function(data, callback)
{
    this.player.ready = data.ready;
    this.room.checkStart();

    callback(true);

    this.broadcastRoom('room:ready', {ready: this.player.ready});
};

/**
 * On new room
 *
 * @param {Object} data
 */
SocketClient.prototype.onColorRoom = function(data, callback)
{
    this.player.color = data.color;

    callback(true);

    this.broadcastRoom('room:color', {ready: this.player.color});
};