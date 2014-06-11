/**
 * RoomRepository
 *
 * @param {Object} config
 */
function RoomRepository(SocketClient, PlayerRepository)
{
    EventEmitter.call(this);

    this.client = SocketClient;
    this.rooms  = new Collection([], 'name');

    this.onNewRoom      = this.onNewRoom.bind(this);
    this.onJoinRoom     = this.onJoinRoom.bind(this);
    this.onPlayerUpdate = this.onPlayerUpdate.bind(this);

    this.client.io.on('room:new', this.onNewRoom);
    this.client.io.on('room:join', this.onJoinRoom);
    this.client.io.on('room:player:update', this.onPlayerUpdate);
}

RoomRepository.prototype = Object.create(EventEmitter.prototype);

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
 * Get all
 *
 * @return {Array}
 * @param {Function} callback
 */
RoomRepository.prototype.create = function(name, callback)
{
    return this.client.io.emit('room:create', {name: name}, callback);
};

/**
 * Get all
 *
 * @return {Array}
 * @param {Function} callback
 */
RoomRepository.prototype.join = function(room, player, callback)
{
    return this.client.io.emit('room:join', {room: room, player: player}, callback);
};

// EVENTS:

/**
 * On new room
 *
 * @param {Object} data
 *
 * @return {Boolean}
 */
RoomRepository.prototype.onNewRoom = function(data)
{
    var room = new Room(data.name);

    for (var i = data.players.length - 1; i >= 0; i--) {
        room.addPlayer(new Player(data.players[i].name, data.players[i].color));
    }

    if(this.rooms.add(room)) {
        this.emit('room:new', room);
    }
};

/**
 * On join room
 *
 * @param {Object} data
 *
 * @return {Boolean}
 */
RoomRepository.prototype.onJoinRoom = function(data)
{
    var room = this.rooms.getById(data.room),
        player = new Player(data.player.name, data.player.color);

    if (room && room.addPlayer(player)) {
        this.emit('room:join', room);
        this.emit('room:join:' + room.name, room);
    }
};

/**
 * On join room
 *
 * @param {Object} data
 *
 * @return {Boolean}
 */
RoomRepository.prototype.onPlayerUpdate = function(data)
{
    var room = this.rooms.getById(data.room),
        player = room ? room.players.findById(data.player) : null;

    if (player && this.updatePlayer(player, data)) {
        this.emit('room:player:update', room);
        this.emit('room:player:update:' + room.name, room);
    }
};

/**
 * Update player
 *
 * @param {Player} player
 * @param {Object} data
 */
RoomRepository.prototype.updatePlayer = function(player, data)
{
    var changed = false;

    for (var property in data) {
        if (data.hasOwnProperty(property)) {
            player[property] = data[property];
            changed = true;
        }
    }

    return changed;
};