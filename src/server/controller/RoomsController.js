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

    this.onRoomOpen       = this.onRoomOpen.bind(this);
    this.onRoomClose      = this.onRoomClose.bind(this);
    this.onRoomPlayer     = this.onRoomPlayer.bind(this);
    this.onRoomGame       = this.onRoomGame.bind(this);
    this.onRoomConfigOpen = this.onRoomConfigOpen.bind(this);
    this.detach           = this.detach.bind(this);

    this.callbacks = {
        emitAllRooms: function () { controller.emitAllRooms(this); },
        onCreateRoom: function (data) { controller.onCreateRoom(this, data[0], data[1]); },
        onJoinRoom: function (data) { controller.onJoinRoom(this, data[0], data[1]); }
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
    var name = data.name.substr(0, Room.prototype.maxLength).trim(),
        room = this.repository.create(name);

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

    if (!room) {
        return callback({success: false, error: 'Unknown room "' + data.name + '".'});
    }

    var password = typeof(data.password) !== 'undefined' ? data.password : null;

    if (!room.config.allow(password)) {
        return callback({success: false, error: 'Wrong password.'});
    }

    room.controller.attach(client, callback);
};

/**
 * On new room open
 *
 * @param {Object} data
 */
RoomsController.prototype.onRoomOpen = function(data)
{
    var room = data.room;

    room.on('game:new', this.onRoomGame);
    room.on('game:end', this.onRoomGame);
    room.on('player:join', this.onRoomPlayer);
    room.on('player:leave', this.onRoomPlayer);
    room.config.on('room:config:open', this.onRoomConfigOpen);

    this.socketGroup.addEvent('room:open', room.serialize(false));
};

/**
 * On room close
 *
 * @param {Object} data
 */
RoomsController.prototype.onRoomClose = function(data)
{
    var room = data.room;

    room.removeListener('game:new', this.onRoomGame);
    room.removeListener('game:end', this.onRoomGame);
    room.removeListener('player:join', this.onRoomPlayer);
    room.removeListener('player:leave', this.onRoomPlayer);
    room.config.on('room:config:open', this.onRoomConfigOpen);

    this.socketGroup.addEvent('room:close', {name: room.name});
};

/**
 * On room config open
 *
 * @param {Object} data
 */
RoomsController.prototype.onRoomConfigOpen = function(data)
{
    this.socketGroup.addEvent('room:config:open', {name: data.room.name, open: data.open});
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
