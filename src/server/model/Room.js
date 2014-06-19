/**
 * Room
 */
function Room(name)
{
    BaseRoom.call(this, name);

    this.clients = new Collection();
}

Room.prototype = Object.create(BaseRoom.prototype);