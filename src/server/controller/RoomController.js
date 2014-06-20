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
    this.detachEvents(client);

    if (client.room) {

        if (client.room.game) {
            this.gameController.detach(client, client.room.game);
        }

        for (var i = client.players.items.length - 1; i >= 0; i--) {
            this.io.sockets.in('rooms').emit('room:leave', {room: client.room.name, player: client.players.items[i].name});
        }

        client.leaveRoom();
    }
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
        player = room ? client.joinRoom(room, data.player) : null;

    callback({success: player ? true : false});

    if (player) {
        this.io.sockets.in('rooms').emit('room:join', {room: room.name, player: player.serialize()});
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

    var client;

    for (var i = room.clients.items.length - 1; i >= 0; i--) {
        client = room.clients.items[i];
        this.detachEvents(client);
        this.gameController.attach(client, room.game);
    }
};

/**
 * End game
 *
 * @param {Object} data
 */
RoomController.prototype.endGame = function(data)
{
    console.log("endGame", data);

    var game = data.game,
        room = game.room,
        client;

    this.io.sockets.in(game.channel).emit('end');

    this.gameController.removeGame(game);

    console.log('clients:', room.clients.items.length);

    for (var i = room.clients.items.length - 1; i >= 0; i--) {
        client = room.clients.items[i];
        this.gameController.detach(client);
        this.attachEvents(client);
    }

    room.closeGame();
};
