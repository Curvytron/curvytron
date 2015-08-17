/**
 * Game tracker
 *
 * @param {Inspector} inspector
 * @param {Game} game
 */
function GameTracker (inspector, game)
{
    Tracker.call(this, inspector, game.name);

    this.game        = game;
    this.size        = this.game.avatars.count();
    this.rounds      = 0;
    this.finished    = false;
    this.fpsInterval = null;

    this.onRound = this.onRound.bind(this);
    this.onStart = this.onStart.bind(this);
    this.onStop  = this.onStop.bind(this);
    this.onEnd   = this.onEnd.bind(this);
    this.sendFPS = this.sendFPS.bind(this);

    this.game.on('round:new', this.onRound);
    this.game.on('game:start', this.onStart);
    this.game.on('game:stop', this.onStop);
    this.game.on('end', this.onEnd);
}

GameTracker.prototype = Object.create(Tracker.prototype);
GameTracker.prototype.constructor = GameTracker;

/**
 * FPS log frequency
 *
 * @type {Number}
 */
GameTracker.prototype.fpsFrequency = 1000;

/**
 * On round
 */
GameTracker.prototype.onRound = function()
{
    this.rounds++;
};

/**
 * On round
 */
GameTracker.prototype.onEnd = function()
{
    this.finished = this.game.gameWinner !== null;
};

/**
 * On start
 */
GameTracker.prototype.onStart = function()
{
    if (!this.fpsInterval) {
        this.fpsInterval = setInterval(this.sendFPS, this.fpsFrequency);
    }
};

/**
 * On start
 */
GameTracker.prototype.onStop = function()
{
    if (this.fpsInterval) {
        clearInterval(this.fpsInterval);
        this.fpsInterval = null;
    }
};

/**
 * On round
 */
GameTracker.prototype.sendFPS = function()
{
    if (this.game.fps.frequency) {
        this.emit('fps', { tracker: this, fps: this.game.fps.frequency });
    }
};

/**
 * @inheritDoc
 */
GameTracker.prototype.destroy = function()
{
    this.onStop();

    this.game.removeListener('end', this.onEnd);
    this.game.removeListener('round:new', this.onRound);

    return Tracker.prototype.destroy.call(this);
};

/**
 * @inheritDoc
 */
GameTracker.prototype.getValues = function()
{
    var data = Tracker.prototype.getValues.call(this);

    data.size     = this.size;
    data.rounds   = this.rounds;
    data.finished = this.finished;

    return data;
};
