/**
 * Room Controller
 */
function RoomController(socket, repository)
{
    this.socket     = socket;
    this.repository = repository;
}

/**
 * Create a room
 *
 * @param {String} name
 *
 * @return {Room}
 */
RoomController.prototype.create = function(name)
{
    var room = this.repository.create(name);

    if (room) {
        this.emitNewRoom(room);
    }
}

/**
 * List rooms
 */
RoomController.prototype.listRooms = function(client)
{
    for (var i = this.repository.rooms.ids.length - 1; i >= 0; i--) {
        this.emitNewRoom(this.repository.rooms.items[i], client);
    }
};

/**
 * emitNewRoom
 *
 * @param {Room} room
 * @param {Socket} client
 */
RoomController.prototype.emitNewRoom = function(room, client)
{
    var socket = (typeof(client) !== 'undefined' ? client : this.socket)

    socket.emit('room:new', room.serialize());
};