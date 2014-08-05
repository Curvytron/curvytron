/**
 * Room
 */
function Room(name)
{
    BaseRoom.call(this, name);

    this.inGame  = false;
    this.url     = '/room/' + encodeURIComponent(this.name);
    this.gameUrl = '/game/' + encodeURIComponent(this.name);

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
 * Close game
 */
Room.prototype.newGame = function()
{
    this.inGame = true;

    return BaseRoom.prototype.newGame.call(this);
};

/**
 * Close game
 */
Room.prototype.closeGame = function()
{
    this.inGame = false;

    for (var i = this.players.items.length - 1; i >= 0; i--) {
        if (!this.players.items[i].avatar.present) {
            this.removePlayer(this.players.items[i]);
        }
    }

    return BaseRoom.prototype.closeGame.call(this);
};
