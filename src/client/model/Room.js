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

/**
 * Get local players
 *
 * @return {Collection}
 */
Room.prototype.getLocalPlayers = function()
{
    return this.players.filter(function () { return this.local; });
};