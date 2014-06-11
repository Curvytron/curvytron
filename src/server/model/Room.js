/**
 * Room
 */
function Room(name)
{
    BaseRoom.call(this, name);
}

Room.prototype = Object.create(BaseRoom.prototype);

/**
 * Serialize
 *
 * @return {Object}
 */
Room.prototype.serialize = function()
{
    return {
        name: this.name,
        players: this.players.map(function () { this.serialize(); }).items
    };
};