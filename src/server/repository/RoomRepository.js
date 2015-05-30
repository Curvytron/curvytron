/**
 * Room Repository
 */
function RoomRepository()
{
    EventEmitter.call(this);

    this.generator = new RoomNameGenerator();
    this.rooms     = new Collection([], 'name');

    this.onRoomClose = this.onRoomClose.bind(this);

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
    if (typeof(name) === 'undefined' || !name) {
        name = this.getRandomRoomName();
    }

    var room = new Room(name);

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
    if (this.rooms.remove(room)) {
        this.emit('room:close', {room: room});

        return true;
    }

    return false;
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

/**
 * Get random room name
 *
 * @return {String}
 */
RoomRepository.prototype.getRandomRoomName = function()
{
    var name = this.generator.getName();

    while (this.rooms.ids.indexOf(name) >= 0) {
        name = this.generator.getName();
    }

    return name;
};
