/**
 * Room
 */
function Room(name)
{
    BaseRoom.call(this, name);
}

Room.prototype = Object.create(BaseRoom.prototype);