/**
 * Room
 */
function Room(name)
{
    BaseRoom.call(this, name);

    this.inGame = false;
}

Room.prototype = Object.create(BaseRoom.prototype);