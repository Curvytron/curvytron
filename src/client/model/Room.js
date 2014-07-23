/**
 * Room
 */
function Room(name)
{
    BaseRoom.call(this, name);

    this.inGame = false;

    this.messages = [];
}

Room.prototype = Object.create(BaseRoom.prototype);
Room.prototype.constructor = Room;