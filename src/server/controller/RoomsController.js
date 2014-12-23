/**
 * Rooms Controller
 *
 * @param {RoomRepository} repository
 */
function RoomsController(repository)
{
    EventEmitter.call(this);

    var controller = this;

    this.socketGroup = new SocketGroup();
    this.repository  = repository;

    this.onRoomOpen   = this.onRoomOpen.bind(this);
    this.onRoomClose  = this.onRoomClose.bind(this);
    this.onRoomPlayer = this.onRoomPlayer.bind(this);
    this.onRoomGame   = this.onRoomGame.bind(this);
    this.detach       = this.detach.bind(this);

    this.callbacks = {
        emitAllRooms: function () { controller.emitAllRooms(this); },
        onCreateRoom: function (data) { controller.onCreateRoom(this, data.data, data.callback); },
        onJoinRoom: function (data) { controller.onJoinRoom(this, data.data, data.callback); }
    };

    this.repository.on('room:open', this.onRoomOpen);
    this.repository.on('room:close', this.onRoomClose);
}

RoomsController.prototype = Object.create(EventEmitter.prototype);
RoomsController.prototype.constructor = RoomsController;

/**
 * Attach events
 *
 * @param {SocketClient} client
 */
RoomsController.prototype.attach = function(client)
{
    if (this.socketGroup.clients.add(client)) {
        this.attachEvents(client);
    }
};

/**
 * Attach events
 *
 * @param {SocketClient} client
 */
RoomsController.prototype.detach = function(client)
{
    if (this.socketGroup.clients.remove(client)) {
        this.detachEvents(client);
    }
};

/**
 * Detach events
 *
 * @param {SocketClient} client
 */
RoomsController.prototype.attachEvents = function(client)
{
    client.on('close', this.detach);
    client.on('room:fetch', this.callbacks.emitAllRooms);
    client.on('room:create', this.callbacks.onCreateRoom);
    client.on('room:join', this.callbacks.onJoinRoom);
};

/**
 * Detach events
 *
 * @param {SocketClient} client
 */
RoomsController.prototype.detachEvents = function(client)
{
    client.removeListener('close', this.detach);
    client.removeListener('room:fetch', this.callbacks.emitAllRooms);
    client.removeListener('room:create', this.callbacks.onCreateRoom);
    client.removeListener('room:join', this.callbacks.onJoinRoom);
};

/**
 * Emit all rooms to the given client
 *
 * @param {SocketClient} client
 */
RoomsController.prototype.emitAllRooms = function(client)
{
    var events = [];

    for (var i = this.repository.rooms.items.length - 1; i >= 0; i--) {
        events.push(['room:open', this.repository.rooms.items[i].serialize(false)]);
    }

    client.addEvents(events);
};

// Events:

/**
 * On new room
 *
 * @param {SocketClient} client
 * @param {Object} data
 * @param {Function} callback
 */
RoomsController.prototype.onCreateRoom = function(client, data, callback)
{
    var room = this.repository.create(data.name);

    callback(room ? {success: true, room: room.serialize(false)} : {success: false});

    if (room) {
        this.emit('room:new', {room: room});
    }
};

/**
 * On join room
 *
 * @param {SocketClient} client
 * @param {Object} data
 * @param {Function} callback
 */
RoomsController.prototype.onJoinRoom = function(client, data, callback)
{
    var room = this.repository.get(data.name);

    if (room) {
        callback({success: true, room: room.serialize()});
        room.controller.attach(client);
    } else {
        callback({success: false});
    }
};

/**
 * On new room open
 *
 * @param {Object} data
 */
RoomsController.prototype.onRoomOpen = function(data)
{
    data.room.on('game:new', this.onRoomGame);
    data.room.on('game:end', this.onRoomGame);
    data.room.on('player:join', this.onRoomPlayer);
    data.room.on('player:leave', this.onRoomPlayer);

    this.socketGroup.addEvent('room:open', data.room.serialize(false));
};

/**
 * On room close
 *
 * @param {Object} data
 */
RoomsController.prototype.onRoomClose = function(data)
{
    data.room.removeListener('game:new', this.onRoomGame);
    data.room.removeListener('game:end', this.onRoomGame);
    data.room.removeListener('player:join', this.onRoomPlayer);
    data.room.removeListener('player:leave', this.onRoomPlayer);

    this.socketGroup.addEvent('room:close', {name: data.room.name});
};

/**
 * On player leave/join a room
 *
 * @param {Object} data
 */
RoomsController.prototype.onRoomPlayer = function(data)
{
    var room = data.room.serialize(false);

    this.socketGroup.addEvent('room:players', { name: room.name,  players: room.players });
};

/**
 * On room start/end a game
 *
 * @param {Object} data
 */
RoomsController.prototype.onRoomGame = function(data)
{
    var room = data.room.serialize(false);

    this.socketGroup.addEvent('room:game', { name: room.name,  game: room.game });
};
