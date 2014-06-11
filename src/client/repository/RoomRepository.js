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

    this.onNewRoom = this.onNewRoom.bind(this);

    this.client.io.on('room:new', this.onNewRoom);
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
 */
RoomRepository.prototype.create = function(name)
{
    return this.client.io.emit('room:create', {name: name});
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

    if(this.rooms.add(room)) {
        this.emit('room:new', room);
    }
};

/**
 * On new room
 *
 * @param {Object} data
 *
 * @return {Boolean}
 */
RoomRepository.prototype.onCloseRoom = function(data)
{
    var room = this.rooms.getById(data.name);

    for (var i = data.players.length - 1; i >= 0; i--) {
        room.addPlayer(new Player(data.players[i].name, data.players[i].color));
    }

    if(this.rooms.remove(room)) {
        this.emit('room:close', room);
    }
};