/**
 * Room Controller
 */
function RoomController(io, repository, gameController)
{
    this.io             = io;
    this.repository     = repository;
    this.gameController = gameController;
}

/**
 * Attach events
 *
 * @param {SocketClient} client
 */
RoomController.prototype.attach = function(client)
{
    var rooms = this.repository.all();

    this.attachEvents(client);

    for (var i = rooms.length - 1; i >= 0; i--) {
        client.socket.emit('room:new', rooms[i].serialize());
    }
};

/**
 * Attach events
 *
 * @param {SocketClient} client
 */
RoomController.prototype.detach = function(client)
{
    if (client.room) {
        this.io.sockets.in('rooms').emit('room:leave', {room: client.room.name, player: client.player.name});
        client.leaveRoom();
    }

    this.detachEvents(client);
};

/**
 * Detach events
 *
 * @param {SocketClient} client
 */
RoomController.prototype.attachEvents = function(client)
{
    var controller = this;

    client.socket.on('room:create', function (data, callback) { controller.onCreateRoom(client, data, callback); });
    client.socket.on('room:join', function (data, callback) { controller.onJoinRoom(client, data, callback); });
    client.socket.on('room:leave', function (data, callback) { controller.onLeaveRoom(client, data, callback); });
    client.socket.on('room:ready', function (data, callback) { controller.onReadyRoom(client, data, callback); });
    client.socket.on('room:color', function (data, callback) { controller.onColorRoom(client, data, callback); });
};

/**
 * Detach events
 *
 * @param {SocketClient} client
 */
RoomController.prototype.detachEvents = function(client)
{
    client.socket.removeAllListeners('room:create');
    client.socket.removeAllListeners('room:join');
    client.socket.removeAllListeners('room:leave');
    client.socket.removeAllListeners('room:ready');
    client.socket.removeAllListeners('room:color');
};

// Events:

/**
 * On new room
 *
 * @param {String} name
 * @param {Function} callback
 */
RoomController.prototype.onCreateRoom = function(client, data, callback)
{
    var room = this.repository.create(data.name);

    callback({success: room ? true : false, room: room? room.name : null});

    if (room) {
        this.io.sockets.in('rooms').emit('room:new', room.serialize());
    }
};

/**
 * On join room
 *
 * @param {Object} data
 * @param {Function} callback
 */
RoomController.prototype.onJoinRoom = function(client, data, callback)
{
    var room = this.repository.get(data.room),
        result = false;

    if (room) {
        result = client.joinRoom(room, data.player);
    }

    callback({success: result});

    if (result) {
        this.io.sockets.in('rooms').emit('room:join', {room: room.name, player: client.player.serialize()});
    }
};

/**
 * On leave room
 *
 * @param {Object} data
 * @param {Function} callback
 */
RoomController.prototype.onLeaveRoom = function(client, data, callback)
{
    var result = client.leaveRoom();

    callback({success: result});

    if (result) {
        this.io.sockets.in('rooms').emit('room:leave', {room: room.name, player: player.name});
    }
};

/**
 * On new room
 *
 * @param {Object} data
 */
RoomController.prototype.onColorRoom = function(client, data, callback)
{
    client.player.setColor(data.color);

    callback({success: true, color: client.player.color});

    this.io.sockets.in('rooms').emit('room:player:color', {
        room: client.room.name,
        player: client.player.name,
        color: client.player.color
    });
};

/**
 * On new room
 *
 * @param {Object} data
 */
RoomController.prototype.onReadyRoom = function(client, data, callback)
{
    client.player.toggleReady();

    callback({success: true, ready: client.player.ready});

    this.io.sockets.in('rooms').emit('room:player:ready', {
        room: client.room.name,
        player: client.player.name,
        ready: client.player.ready
    });

    if (client.room.isReady()) {
        this.warmupRoom(client.room);
    }
};

/**
 * Warmup room
 *
 * @param {Room} room
 */
RoomController.prototype.warmupRoom = function(room)
{
    this.io.sockets.in('rooms').emit('room:start', {room: room.name});

    this.gameController.addGame(room.newGame());

    for (var i = room.players.ids.length - 1; i >= 0; i--) {
        this.detachEvents(room.players.items[i].client);
        this.gameController.attach(room.players.items[i].client, room.game);
    }
};
