/**
 * Room
 */
function Room(name, client)
{
    BaseRoom.call(this, name);
}

Room.prototype = Object.create(BaseRoom.prototype);

/**
 * Add player
 *
 * @param {Player} player
 */
BaseRoom.prototype.addPlayer = function(player)
{
    return this.players.add(player);
};

/**
 * Remove player
 *
 * @param {Player} player
 */
BaseRoom.prototype.removePlayer = function(player)
{
    return this.players.remove(player);
};