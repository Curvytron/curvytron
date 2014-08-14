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
    this.inRound      = false;
    this.rounds       = 0;

    this.start    = this.start.bind(this);
    this.stop     = this.stop.bind(this);
    this.loop     = this.loop.bind(this);
    this.newRound = this.newRound.bind(this);
    this.endRound = this.endRound.bind(this);
    this.end      = this.end.bind(this);
    this.onFrame  = this.onFrame.bind(this);
}

BaseGame.prototype = Object.create(EventEmitter.prototype);
BaseGame.prototype.constructor = BaseGame;

BaseGame.prototype.framerate     = 1/60 * 1000;
BaseGame.prototype.perPlayerSize = 100;
BaseGame.prototype.warmupTime    = 3000;
BaseGame.prototype.warmdownTime  = 5000;

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
    if (this.avatars.exists(avatar)) {
        avatar.die();
        avatar.destroy();

        if (this.getPresentAvatars().isEmpty()) {
            this.end();
        }
    }
};

/**
 * Start loop
 */
BaseGame.prototype.start = function()
{
    if (!this.frame) {
        this.onStart();
        this.loop();
    }
};

/**
 * Stop loop
 */
BaseGame.prototype.stop = function()
{
    if (this.frame) {
        this.clearFrame();
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
BaseGame.prototype.onStart = function()
{
    this.rendered = new Date().getTime();
    this.bonusManager.start();
};

/**
 * Onn stop
 */
BaseGame.prototype.onStop = function()
{
    this.rendered = null;
    this.bonusManager.stop();
};

/**
 * On round new
 */
BaseGame.prototype.onRoundNew = function()
{
    for (var i = this.avatars.items.length - 1; i >= 0; i--) {
        if (this.avatars.items[i].present) {
            this.avatars.items[i].clear();
        }
    }
};

/**
 * On round end
 */
BaseGame.prototype.onRoundEnd = function()
{
    this.rounds++;
};

/**
 * Get new frame
 */
BaseGame.prototype.newFrame = function()
{
    this.frame = setTimeout(this.loop, this.framerate);
};

/**
 * Clear frame
 */
BaseGame.prototype.clearFrame = function()
{
    clearTimeout(this.frame);
    this.frame = null;
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
    var baseSquareSize = this.perPlayerSize * this.perPlayerSize;

    return Math.sqrt(baseSquareSize + ((players - 1) * baseSquareSize / 5));
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
    return (players-1) * 10;
};

/**
 * Get alive avatars
 *
 * @return {Collection}
 */
BaseGame.prototype.getAliveAvatars = function()
{
    return this.avatars.filter(function () { return this.alive; });
};

/**
 * Get present avatars
 *
 * @return {Collection}
 */
BaseGame.prototype.getPresentAvatars = function()
{
    return this.avatars.filter(function () { return this.present; });
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
 * New round
 */
BaseGame.prototype.newRound = function(time)
{
    this.started = true;

    if (!this.inRound) {
        this.inRound = true;
        setTimeout(this.start, typeof(time) !== 'undefined' ? time : this.warmupTime);
        this.onRoundNew();
    }
};

/**
 * Check end of round
 */
BaseGame.prototype.endRound = function()
{
    if (this.inRound) {
        this.inRound = false;
        setTimeout(this.stop, this.warmdownTime);
        this.onRoundEnd();
    }
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
        this.avatars.clear();

        this.emit('end', {game: this});
    }
};
