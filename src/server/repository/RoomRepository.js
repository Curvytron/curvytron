/**
 * Room Repository
 */
function RoomRepository()
{
    EventEmitter.call(this);

    this.onRoomClose = this.onRoomClose.bind(this);

    this.rooms = new Collection([], 'name');
}

RoomRepository.prototype = Object.create(EventEmitter.prototype);
RoomRepository.prototype.constructor = RoomRepository;

/**
 * Create a room
 *
 * @param {String} name
 *
 * @return {Room}
 */
RoomRepository.prototype.create = function(name)
{
    var room = new Room(name.substr(0, Room.prototype.maxLength));

    if (!this.rooms.add(room)) { return false; }

    room.on('close', this.onRoomClose);
    this.emit('room:open', {room: room});

    return room;
};

/**
 * Delete a room
 *
 * @param {Room} room
 */
RoomRepository.prototype.remove = function(room)
{
    if (!room.players.isEmpty() || !this.rooms.remove(room)) { return false; }

    this.emit('room:close', {room: room});

    return true;
};

/**
 * Get by name
 *
 * @param {String} name
 *
 * @return {Room}
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
RoomRepository.prototype.all = function()
{
    return this.rooms.items;
};

/**
 * On room close
 *
 * @param {Object} data
 */
RoomRepository.prototype.onRoomClose = function(data)
{
    this.remove(data.room);
};
