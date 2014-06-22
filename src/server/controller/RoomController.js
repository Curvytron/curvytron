/**
 * Room Controller
 */
function RoomController(io, repository, gameController)
{
    this.io             = io;
    this.repository     = repository;
    this.gameController = gameController;

    this.endGame = this.endGame.bind(this);
}

/**
 * Attach events
 *
 * @param {SocketClient} client
 */
RoomController.prototype.attach = function(client)
{
    var rooms = this.repository.all();

    client.joinChannel('rooms');
    this.attachEvents(client);
    this.emitAllRooms(client);
};

/**
 * Attach events
 *
 * @param {SocketClient} client
 */
RoomController.prototype.detach = function(client)
{
    this.detachEvents(client);
    this.onLeaveRoom(client);
};

/**
 * Detach events
 *
 * @param {SocketClient} client
 */
RoomController.prototype.attachEvents = function(client)
{
    var controller = this;

    client.socket.on('room:fetch', function () { controller.emitAllRooms(client); });
    client.socket.on('room:create', function (data, callback) { controller.onCreateRoom(client, data, callback); });
    client.socket.on('room:join', function (data, callback) { controller.onJoinRoom(client, data, callback); });
    client.socket.on('room:leave', function () { controller.onLeaveRoom(client); });
    client.socket.on('room:player:add', function (data, callback) { controller.onAddPlayer(client, data, callback); });
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
    client.socket.removeAllListeners('room:fetch');
    client.socket.removeAllListeners('room:create');
    client.socket.removeAllListeners('room:join');
    client.socket.removeAllListeners('room:player:add');
    client.socket.removeAllListeners('room:leave');
    client.socket.removeAllListeners('room:ready');
    client.socket.removeAllListeners('room:color');
};

/**
 * Emit all rooms to the given client
 *
 * @param {SocketClient} client
 */
RoomController.prototype.emitAllRooms = function(client)
{
    for (var i = this.repository.rooms.items.length - 1; i >= 0; i--) {
        client.socket.emit('room:new', this.repository.rooms.items[i].serialize());
    }
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
    var room = this.repository.get(data.room);

    if (room) {
        room.addClient(client);
        callback({success: true});
    } else {
        callback({success: false});
    }
};

/**
 * On leave room
 *
 * @param {SocketClient} client
 */
RoomController.prototype.onLeaveRoom = function(client)
{
    var room = client.room;

    if (room) {

        if (client.room.game) {
            this.gameController.detach(client);
        }

        for (var i = client.players.items.length - 1; i >= 0; i--) {
            player = client.players.items[i];
            this.io.sockets.in('rooms').emit('room:leave', {room: room.name, player: player.name});
            room.removePlayer(player);
        }

        client.players.clear();
        room.removeClient(client);
        this.checkRoomClose(room);
    }
};

/**
 * Check room closing
 *
 * @param {Room} room
 */
RoomController.prototype.checkRoomClose = function(room)
{
    var name = room.name;

    if (room.clients.isEmpty() && this.repository.remove(room)) {
        this.io.sockets.in('rooms').emit('room:close', {room: room.name});
    }
};

/**
 * On add player to room
 *
 * @param {Object} data
 * @param {Function} callback
 */
RoomController.prototype.onAddPlayer = function(client, data, callback)
{
    var name = data.name;

    if (client.room && client.room.isNameAvailable(name)) {

        var player = new Player(client, name);

        client.room.addPlayer(player);
        client.players.add(player);

        callback({success: true});

        this.io.sockets.in('rooms').emit('room:join', {room: client.room.name, player: player.serialize()});
    } else {
        callback({success: false});
    }
};

/**
 * On new room
 *
 * @param {Object} data
 */
RoomController.prototype.onColorRoom = function(client, data, callback)
{
    var room = client.room,
        player = client.players.getById(data.player);

    if (room && player) {
        player.setColor(data.color);

        callback({success: true, color: player.color});

        this.io.sockets.in('rooms').emit('room:player:color', {
            room: room.name,
            player: player.name,
            color: player.color
        });
    }
};

/**
 * On new room
 *
 * @param {Object} data
 */
RoomController.prototype.onReadyRoom = function(client, data, callback)
{
    var room = client.room,
        player = client.players.getById(data.player);

    if (room && player) {
        player.toggleReady();

        callback({success: true, ready: player.ready});

        this.io.sockets.in('rooms').emit('room:player:ready', {
            room: room.name,
            player: player.name,
            ready: player.ready
        });

        if (room.isReady()) {
            this.startGame(room);
        }
    }
};

/**
 * Warmup room
 *
 * @param {Room} room
 */
RoomController.prototype.startGame = function(room)
{
    var game = room.newGame(),
        client;

    this.io.sockets.in('rooms').emit('room:start', {room: room.name});

    game.on('end', this.endGame);

    this.gameController.addGame(game);

    for (var i = room.clients.items.length - 1; i >= 0; i--) {
        this.detachEvents(room.clients.items[i]);
    }
};

/**
 * End game
 *
 * @param {Object} data
 */
RoomController.prototype.endGame = function(data)
{
    var game = data.game,
        room = game.room,
        client;

    this.io.sockets.in(game.channel).emit('end');

    this.gameController.removeGame(game);

    for (var i = room.clients.items.length - 1; i >= 0; i--) {
        client = room.clients.items[i];
        client.joinChannel('rooms');
        this.attachEvents(client);
        this.emitAllRooms(client);
    }

    room.closeGame();
};
