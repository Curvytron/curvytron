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

BaseRoom.prototype.warmupTime = 5000;

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
 * Is ready
 *
 * @return {Boolean}
 */
BaseRoom.prototype.isReady = function()
{
    return this.players.filter(function () { return !this.ready; }).isEmpty();
};

/**
 * Start warmpup
 */
BaseRoom.prototype.startWarmup = function()
{
    if (!this.game) {
        console.log("Start warmup");
        this.game = new Game(this);
        this.emit('game:new', {room: this, game: this.game});
        setTimeout(this.game.start, this.warmupTime);
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
