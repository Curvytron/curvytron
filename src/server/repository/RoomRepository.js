/**
 * Room Repository
 */
function RoomRepository()
{
    this.rooms = new Collection([], 'name');
}

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

    return this.rooms.add(room) ? room : null;
};

/**
 * Delete a room
 *
 * @param {Room} room
 */
RoomRepository.prototype.remove = function(room)
{
    return room.clients.isEmpty() && this.rooms.remove(room);
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