/**
 * Base Room
 */
function BaseRoom(name)
{
    EventEmitter.call(this);

    this.name    = name;
    this.players = new Collection([], 'id', true);
    this.config  = new RoomConfig(this);

    this.closeGame = this.closeGame.bind(this);
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
 * Max length for name
 *
 * @type {Number}
 */
BaseRoom.prototype.maxLength = 25;

/**
 * Launch time
 *
 * @type {Number}
 */
BaseRoom.prototype.launchTime = 5000;

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
 * Equal
 *
 * @param {Room} room
 *
 * @return {Boolean}
 */
BaseRoom.prototype.equal = function(room)
{
    return room ? this.name === room.name : false;
};

/**
 * Is name available?
 *
 * @param {String} name
 */
BaseRoom.prototype.isNameAvailable = function(name)
{
    return !this.players.match(function () { return this.name === name; });
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
    return !this.game && this.players.count() >= this.minPlayer  && this.players.filter(function () { return !this.ready; }).isEmpty();
};

/**
 * Start warmpup
 */
BaseRoom.prototype.newGame = function()
{
    if (!this.game) {
        this.game = new Game(this);

        this.game.on('end', this.closeGame);
        this.emit('game:new', {room: this, game: this.game});

        return this.game;
    }

    return null;
};

/**
 * Close game
 */
BaseRoom.prototype.closeGame = function()
{
    if (this.game) {

        delete this.game;

        this.emit('game:end', {room: this});

        this.players = this.players.filter(function () { return this.client; });

        for (var i = this.players.items.length - 1; i >= 0; i--) {
            this.players.items[i].reset();
        }
    }
};

/**
 * Serialize
 *
 * @return {Object}
 */
BaseRoom.prototype.serialize = function(full)
{
    full = typeof(full) === 'undefined' || full;

    var data = {
        name: this.name,
        players: full ? this.players.map(function () { return this.serialize(); }).items : this.players.count(),
        game: this.game ? true : false,
        open: this.config.open
    };

    if (full) {
        data.config = this.config.serialize();
    }

    return data;
};
