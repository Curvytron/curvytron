/**
 * Base Room
 */
function BaseRoom(name)
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

/**
 * Check ready
 */
BaseRoom.prototype.checkReady = function()
{
    if (this.players.filter(function () { return !this.ready; }).isEmpty()) {
        this.startGame();
    }
};

/**
 * Start Game
 */
BaseRoom.prototype.startGame = function()
{
    if (!this.game) {
        this.game = new Game(this);
    }
};

/**
 * Serialize
 *
 * @return {Object}
 */
BaseRoom.prototype.serialize = function()
{
    return {
        name: this.name,
        players: this.players.map(function () { return this.serialize(); }).items,
        game: this.game ? true : false
    };
};