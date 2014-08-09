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
    this.onPlayerName    = this.onPlayerName.bind(this);
    this.setSynced       = this.setSynced.bind(this);

    this.start();
}

RoomRepository.prototype = Object.create(EventEmitter.prototype);
RoomRepository.prototype.constructor = RoomRepository;

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
    this.client.on('room:player:name', this.onPlayerName);
    this.client.on('fetched', this.setSynced);
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
    this.client.off('room:player:name', this.onPlayerName);
    this.client.off('fetched', this.setSynced);
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
 * @param {String} name
 * @param {Function} callback
 */
RoomRepository.prototype.create = function(name, callback)
{
    this.client.addEvent('room:create', {name: name.substr(0, Room.prototype.maxLength)}, callback);
};

/**
 * Join
 *
 * @param {String} room
 * @param {Function} callback
 */
RoomRepository.prototype.join = function(room, callback)
{
    this.client.addEvent('room:join', {room: room}, callback);
};

/**
 * Add player
 *
 * @param {String} name
 * @param {Function} callback
 */
RoomRepository.prototype.addPlayer = function(name, callback)
{
    this.client.addEvent('room:player:add', {name: name.substr(0, Player.prototype.maxLength)}, callback);
};

/**
 * Remove player
 *
 * @param {Number} player
 * @param {Function} callback
 */
RoomRepository.prototype.removePlayer = function(player, callback)
{
    this.client.addEvent('room:player:remove', {player: player}, callback);
};

/**
 * Leave
 *
 * @param {Function} callback
 */
RoomRepository.prototype.leave = function(callback)
{
    this.client.addEvent('room:leave', callback);
};

/**
 * Set color
 *
 * @param {Room} room
 * @param {Number} player
 * @param {String} color
 * @param {Function} callback
 */
RoomRepository.prototype.setColor = function(player, color, callback)
{
    this.client.addEvent('room:color', {player: player, color: color.substr(0, Player.prototype.colorMaxLength)}, callback);
};

/**
 * Set name
 *
 * @param {Room} room
 * @param {Number} player
 * @param {String} name
 * @param {Function} callback
 */
RoomRepository.prototype.setName = function(player, name, callback)
{
    name = name.substr(0, Player.prototype.nameMaxLength);

    if (name !== player.name) {
        this.client.addEvent('room:name', {player: player, name: name}, callback);
    }
};

/**
 * Set ready
 *
 * @param {Room} room
 * @param {Number} player
 * @param {Function} callback
 */
RoomRepository.prototype.setReady = function(player, callback)
{
    this.client.addEvent('room:ready', {player: player}, callback);
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
        room.addPlayer(new Player(data.players[i].id, data.players[i].client, data.players[i].name, data.players[i].color));
    }

    if(this.rooms.add(room)) {
        this.emit('room:new', {room: room});
    }
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
        player = new Player(data.player.id, data.player.client, data.player.name, data.player.color);

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
 * On player change name
 *
 * @param {Event} e
 */
RoomRepository.prototype.onPlayerName = function(e)
{
    var data = e.detail,
        room = this.rooms.getById(data.room),
        player = room ? room.players.getById(data.player) : null;

    if (player) {
        player.setName(data.name);
        this.emit('room:player:name:' + room.name, {room: room, player: player});
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
        if (this.client.connected) {
            this.attachEvents();
            this.client.addEvent('room:fetch');
        } else {
            this.client.on('connected', this.start);
        }
    }
};

/**
 * Refresh room
 */
RoomRepository.prototype.refresh = function()
{
    if (this.client.connected) {
        this.stop();
        this.rooms.clear();
        this.start();
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
