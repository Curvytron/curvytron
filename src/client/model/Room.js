/**
 * Room
 */
function Room(name)
{
    BaseRoom.call(this, name);

    this.players.index = false;
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

/**
 * Get player by client Id
 *
 * @param {Number} client
 *
 * @return {Player}
 */
Room.prototype.getPlayerByClient = function(client)
{
    return this.players.match(function () { return this.client.id === client; });
};

/**
 * Get url
 *
 * @return {String}
 */
Room.prototype.getUrl = function()
{
    return '/room/' + encodeURIComponent(this.name);
};

/**
 * Get game url
 *
 * @return {String}
 */
Room.prototype.getGameUrl = function()
{
    return '/game/' + encodeURIComponent(this.name);
};

/**
 * Close game
 */
Room.prototype.closeGame = function()
{
    for (var i = this.players.items.length - 1; i >= 0; i--) {
        if (!this.players.items[i].avatar.present) {
            this.removePlayer(this.players.items[i]);
        }
    }

    return BaseRoom.prototype.closeGame.call(this);
};
