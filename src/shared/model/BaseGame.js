/**
 * BaseGame
 *
 * @param {Room} room
 */
function BaseGame(room)
{
    EventEmitter.call(this);

    this.room         = room;
    this.name         = this.room.name;
    this.channel      = 'game:' + this.name;
    this.frame        = null;
    this.avatars      = this.room.players.map(function () { return this.getAvatar(); });
    this.size         = this.getSize(this.avatars.count());
    this.rendered     = null;
    this.maxScore     = this.getMaxScore(this.avatars.count());
    this.fps          = new FPSLogger();
    this.started      = false;
    this.bonusManager = new BonusManager(this);

    this.start    = this.start.bind(this);
    this.stop     = this.stop.bind(this);
    this.loop     = this.loop.bind(this);
    this.newRound = this.newRound.bind(this);
    this.endRound = this.endRound.bind(this);
    this.end      = this.end.bind(this);
    this.onFrame  = this.onFrame.bind(this);
}

BaseGame.prototype = Object.create(EventEmitter.prototype);

BaseGame.prototype.framerate     = 1/60 * 1000;
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
    avatar.destroy();

    var result = this.avatars.remove(avatar);

    if (this.avatars.isEmpty()) {
        this.end();
    }

    return result;
};

/**
 * Start loop
 */
BaseGame.prototype.start = function()
{
    this.started = true;

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

    this.bonusManager.stop();
};

/**
 * Get new frame
 */
BaseGame.prototype.newFrame = function()
{
    this.frame = setTimeout(this.loop.bind(this), this.framerate);
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
BaseGame.prototype.isPlaying = function()
{
    return this.frame !== null;
};

/**
 * New round
 */
BaseGame.prototype.newRound = function()
{
    for (var i = this.bonusManager.bonuses.items.length - 1; i >= 0; i--) {
        this.bonusManager.bonuses.items[i].clear();
    }

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
    if (this.started) {

        this.started = false;

        this.stop();
        this.fps.stop();

        for (var i = this.avatars.items.length - 1; i >= 0; i--) {
            this.removeAvatar(this.avatars.items[i]);
        }

        this.emit('end', {game: this});
    }
};
