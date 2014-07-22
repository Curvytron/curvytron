/**
 * Base Room
 */
function BaseRoom(name)
{
    EventEmitter.call(this);

    this.name    = name;
    this.players = new Collection([], 'name');
    this.warmup  = null;
}

BaseRoom.prototype = Object.create(EventEmitter.prototype);
BaseRoom.prototype.constructor = BaseRoom;

/**
 * Number of player needed to start a room
 *
 * @type {Number}
 */
BaseRoom.prototype.minPlayer = 1;

/**
 * Warmup time
 *
 * @type {Number}
 */
BaseRoom.prototype.warmupTime = 5000;

/**
 * Max length for name
 *
 * @type {Number}
 */
BaseRoom.prototype.maxLength = 25;

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
 * Is name available?
 *
 * @param {String} name
 */
BaseRoom.prototype.isNameAvailable = function(name)
{
    return !this.players.indexExists(name);
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
 * Is ready
 *
 * @return {Boolean}
 */
BaseRoom.prototype.isReady = function()
{
    return this.players.count() >= this.minPlayer && this.players.filter(function () { return !this.ready; }).isEmpty();
};

/**
 * Start warmpup
 */
BaseRoom.prototype.newGame = function()
{
    if (!this.game) {
        this.game = new Game(this);
        this.emit('game:new', {room: this, game: this.game});
    }

    return this.game;
};

/**
 * Close game
 */
BaseRoom.prototype.closeGame = function()
{
    this.game = null;

    for (var i = this.players.items.length - 1; i >= 0; i--) {
        this.players.items[i].reset();
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
