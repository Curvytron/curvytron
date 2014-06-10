/**
 * Base Lobby
 */
function BaseLobby(name)
{
    this.name    = name;
    this.players = new Collection([], 'name');
    this.game    = null;
}

/**
 * Add player
 *
 * @param {Player} player
 */
BaseLobby.prototype.addPlayer = function(player)
{
    return this.players.add(player);
};

/**
 * Remove player
 *
 * @param {Player} player
 */
BaseLobby.prototype.removePlayer = function(player)
{
    return this.players.remove(player);
};