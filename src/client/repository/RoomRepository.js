/**
 * RoomRepository
 *
 * @param {SocketCLient} client
 */
function RoomRepository(client)
{
    EventEmitter.call(this);

    this.synced = false;
    this.client = client;
    this.rooms  = new Collection([], 'name');

    this.start           = this.start.bind(this);
    this.onNewRoom       = this.onNewRoom.bind(this);
    this.onCloseRoom     = this.onCloseRoom.bind(this);
    this.onJoinRoom      = this.onJoinRoom.bind(this);
    this.onLeaveRoom     = this.onLeaveRoom.bind(this);
    this.onRoomGameStart = this.onRoomGameStart.bind(this);
    this.onRoomGameEnd   = this.onRoomGameEnd.bind(this);
    this.onPlayerReady   = this.onPlayerReady.bind(this);
    this.onPlayerColor   = this.onPlayerColor.bind(this);

    if (this.client.connected) {
        this.start();
    } else {
        this.client.on('connected', this.start);
    }
}

RoomRepository.prototype = Object.create(EventEmitter.prototype);

/**
 * Attach events
 */
RoomRepository.prototype.attachEvents = function()
{
    this.client.on('room:new', this.onNewRoom);
    this.client.on('room:close', this.onCloseRoom);
    this.client.on('room:join', this.onJoinRoom);
    this.client.on('room:leave', this.onLeaveRoom);
    this.client.on('room:game:start', this.onRoomGameStart);
    this.client.on('room:game:end', this.onRoomGameEnd);
    this.client.on('room:player:ready', this.onPlayerReady);
    this.client.on('room:player:color', this.onPlayerColor);
};

/**
 * Attach events
 */
RoomRepository.prototype.detachEvents = function()
{
    this.client.off('room:new', this.onNewRoom);
    this.client.off('room:close', this.onCloseRoom);
    this.client.off('room:join', this.onJoinRoom);
    this.client.off('room:leave', this.onLeaveRoom);
    this.client.off('room:game:start', this.onRoomGameStart);
    this.client.off('room:game:end', this.onRoomGameEnd);
    this.client.off('room:player:ready', this.onPlayerReady);
    this.client.off('room:player:color', this.onPlayerColor);
};

/**
 * Get all
 *
 * @return {Array}
 */
RoomRepository.prototype.all = function()
{
    return this.rooms;
};

/**
 * Get all
 *
 * @return {Array}
 */
RoomRepository.prototype.get = function(name)
{
    return this.rooms.getById(name);
};

/**
 * Create
 *
 * @param name
 * @param {Function} callback
 * @returns {*|Emitter|Namespace|Socket}
 */
RoomRepository.prototype.create = function(name, callback)
{
    return this.client.addEvent('room:create', {name: name.substr(0, Room.prototype.maxLength)}, callback);
};

/**
 * Join
 *
 * @param {String} room
 * @param {Function} callback
 */
RoomRepository.prototype.join = function(room, callback)
{
    return this.client.addEvent('room:join', {room: room}, callback);
};

/**
 * Add player
 *
 * @param {String} name
 * @param {Function} callback
 */
RoomRepository.prototype.addPlayer = function(name, callback)
{
    return this.client.addEvent('room:player:add', {name: name.substr(0, Player.prototype.maxLength)}, callback);
};

/**
 * Leave
 *
 * @return {Array}
 * @param {Function} callback
 */
RoomRepository.prototype.leave = function(callback)
{
    return this.client.addEvent('room:leave', callback);
};

/**
 * Set color
 *
 * @return {Array}
 * @param {Function} callback
 */
RoomRepository.prototype.setColor = function(room, player, color, callback)
{
    return this.client.addEvent('room:color', {room: room, player: player, color: color.substr(0, Player.prototype.colorMaxLength)}, callback);
};

/**
 * Set ready
 *
 * @param {Room} room
 * @param {Boolean} ready
 * @param {Function} callback
 *
 * @return {Array}
 */
RoomRepository.prototype.setReady = function(room, player, callback)
{
    return this.client.addEvent('room:ready', {room: room, player: player}, callback);
};

// EVENTS:

/**
 * On new room
 *
 * @param {Event} e
 *
 * @return {Boolean}
 */
RoomRepository.prototype.onNewRoom = function(e)
{
    var data = e.detail,
        room = new Room(data.name);

    room.inGame = data.game;

    for (var i = data.players.length - 1; i >= 0; i--) {
        room.addPlayer(new Player(data.players[i].client, data.players[i].name, data.players[i].color));
    }

    if(this.rooms.add(room)) {
        this.emit('room:new', {room: room});
    }

    this.setSynced();
};

/**
 * On close room
 *
 * @param {Event} e
 *
 * @return {Boolean}
 */
RoomRepository.prototype.onCloseRoom = function(e)
{
    var data = e.detail,
        room = this.get(data.room);

    if(room && this.rooms.remove(room)) {
        data = {room: room};
        this.emit('room:close', data);
        this.emit('room:close:' + room.name, data);
    }
};

/**
 * On join room
 *
 * @param {Event} e
 *
 * @return {Boolean}
 */
RoomRepository.prototype.onJoinRoom = function(e)
{
    var data = e.detail,
        room = this.rooms.getById(data.room),
        player = new Player(data.player.client, data.player.name, data.player.color);

    if (room && room.addPlayer(player)) {
        data = {room: room, player: player};
        this.emit('room:join', data);
        this.emit('room:join:' + room.name, data);
    }
};

/**
 * On leave room
 *
 * @param {Event} e
 *
 * @return {Boolean}
 */
RoomRepository.prototype.onLeaveRoom = function(e)
{
    var data = e.detail,
        room = this.rooms.getById(data.room),
        player = room ? room.players.getById(data.player) : null;

    if (room && player && room.removePlayer(player)) {
        data = {room: room, player: player};
        this.emit('room:leave', data);
        this.emit('room:leave:' + room.name, data);
    }
};

/**
 * On player change color
 *
 * @param {Event} e
 */
RoomRepository.prototype.onPlayerColor = function(e)
{
    var data = e.detail,
        room = this.rooms.getById(data.room),
        player = room ? room.players.getById(data.player) : null;

    if (player) {
        player.setColor(data.color);
        this.emit('room:player:color:' + room.name, {room: room, player: player});
    }
};

/**
 * On player toggle ready
 *
 * @param {Event} e
 */
RoomRepository.prototype.onPlayerReady = function(e)
{
    var data = e.detail,
        room = this.rooms.getById(data.room),
        player = room ? room.players.getById(data.player) : null;

    if (player) {
        player.toggleReady(data.ready);
        this.emit('room:player:ready:' + room.name, {room: room, player: player});
    }
};

/**
 * On room game start
 *
 * @param {Event} e
 */
RoomRepository.prototype.onRoomGameStart = function(e)
{
    var data = e.detail,
        room = this.rooms.getById(data.room);

    if (room) {
        room.inGame = true;

        data = {room: room};
        this.emit('room:game:start', data);
        this.emit('room:game:start:' + room.name, data);
    }
};

/**
 * On room game end
 *
 * @param {Event} e
 */
RoomRepository.prototype.onRoomGameEnd = function(e)
{
    var data = e.detail,
        room = this.rooms.getById(data.room);

    if (room) {
        room.inGame = false;

        data = {room: room};
        this.emit('room:game:end', data);
        this.emit('room:game:end:' + room.name, data);
    }
};

/**
 * Set synced
 */
RoomRepository.prototype.setSynced = function()
{
    if (!this.synced) {
        this.synced = true;
        this.emit('synced');
    }
};

/**
 * Start
 */
RoomRepository.prototype.start = function()
{
    if (!this.synced) {
        this.attachEvents();
        this.client.addEvent('room:fetch');
    }
};

/**
 * Pause
 */
RoomRepository.prototype.stop = function()
{
    this.synced = false;
    this.detachEvents();
};
