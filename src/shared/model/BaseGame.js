/**
 * BaseGame
 *
 * @param {Room} room
 */
function BaseGame(room)
{
    EventEmitter.call(this);

    this.room     = room;
    this.name     = this.room.name;
    this.channel  = 'game:' + this.name;
    this.frame    = null;
    this.avatars  = this.room.players.map(function () { return this.getAvatar(); });
    this.size     = this.getSize(this.avatars.count());
    this.rendered = null;
    this.maxScore = this.getMaxScore(this.avatars.count());
    this.fps      = new FPSLogger();

    this.start    = this.start.bind(this);
    this.stop     = this.stop.bind(this);
    this.loop     = this.loop.bind(this);
    this.newRound = this.newRound.bind(this);
    this.endRound = this.endRound.bind(this);
    this.end      = this.end.bind(this);
}

BaseGame.prototype = Object.create(EventEmitter.prototype);

BaseGame.prototype.framerate     = 1/60;
BaseGame.prototype.perPlayerSize = 100;
BaseGame.prototype.warmupTime    = 5000;
BaseGame.prototype.warmdownTime  = 3000;

/**
 * Update
 *
 * @param {Number} step
 */
BaseGame.prototype.update = function(step) {};

/**
 * Remove a avatar from the game
 *
 * @param {Avatar} avatar
 */
BaseGame.prototype.removeAvatar = function(avatar)
{
    avatar.clear();

    return this.avatars.remove(avatar);
};

/**
 * Start loop
 */
BaseGame.prototype.start = function()
{
    if (!this.frame) {
        this.onStart();
        this.rendered = new Date().getTime();
        this.loop();
    }
};

/**
 * Stop loop
 */
BaseGame.prototype.stop = function()
{
    if (this.frame) {
        clearTimeout(this.frame);
        this.onStop();
    }
};

/**
 * Animation loop
 */
BaseGame.prototype.loop = function()
{
    this.newFrame();

    var now = new Date().getTime(),
        step = now - this.rendered;

    this.rendered = now;

    this.onFrame(step);
};

/**
 * On start
 */
BaseGame.prototype.onStart = function() {};

/**
 * Onn stop
 */
BaseGame.prototype.onStop = function()
{
    this.frame    = null;
    this.rendered = null;
};

/**
 * Get new frame
 */
BaseGame.prototype.newFrame = function()
{
    this.frame = setTimeout(this.loop.bind(this), this.framerate * 1000);
};

/**
 * On frame
 *
 * @param {Number} step
 */
BaseGame.prototype.onFrame = function(step)
{
    this.update(step);
    this.fps.update(step);
};

/**
 * Get size by players
 *
 * @param {Number} players
 *
 * @return {Number}
 */
BaseGame.prototype.getSize = function(players)
{
    /**
     * Should be:
     * 2  -> 105 -> 11000
     * 3  -> 110 -> 12000
     * 4  -> 114 -> 13000
     * 5  -> 118 -> 14000
     */
    var baseSquareSize = this.perPlayerSize * this.perPlayerSize;

    return Math.sqrt(baseSquareSize + ((players - 1) * baseSquareSize / 5.0));
};

/**
 * Get max score
 *
 * @param {Number} players
 *
 * @return {Number}
 */
BaseGame.prototype.getMaxScore = function(players)
{
    return players * 10 - 10;
};

/**
 * Serialize
 *
 * @return {Object}
 */
BaseGame.prototype.serialize = function()
{
    return {
        name: this.name,
        players: this.avatars.map(function () { return this.serialize(); }).items
    };
};

/**
 * Is started
 *
 * @return {Boolean}
 */
BaseGame.prototype.isStarted = function()
{
    return this.rendered !== null;
};

/**
 * New round
 */
BaseGame.prototype.newRound = function()
{
    setTimeout(this.start, this.warmupTime);
};


/**
 * Check end of round
 */
BaseGame.prototype.endRound = function()
{
    this.stop();
};
/**
 * FIN DU GAME
 */
BaseGame.prototype.end = function()
{
    this.stop();
};
