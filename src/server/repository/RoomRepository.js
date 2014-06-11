/**
 * Room Repository
 */
function RoomRepository(socket)
{
    this.socket  = socket;
    this.rooms = new Collection([], 'name');
}

/**
 * Create a room
 *
 * @param {String} first_argument
 *
 * @return {Room}
 */
RoomRepository.prototype.create = function(name)
{
    var room = new Room(name);

    if (this.rooms.add(room)) {
        this.socket.emit('room:new', room.name);

        return room;
    }
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