/**
 * Game tracker
 *
 * @param {Inspector} inspector
 * @param {Game} game
 */
function GameTracker (inspector, game)
{
    Tracker.call(this, inspector, game.name);

    this.game     = game;
    this.size     = this.game.avatars.count();
    this.rounds   = 0;
    this.finished = false;

    this.onRound = this.onRound.bind(this);
    this.onEnd   = this.onEnd.bind(this);

    this.game.on('round:new', this.onRound);
    this.game.on('end', this.onEnd);
}

GameTracker.prototype = Object.create(Tracker.prototype);
GameTracker.prototype.constructor = GameTracker;

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
    this.finished = true;
};

/**
 * @inheritDoc
 */
GameTracker.prototype.destroy = function()
{
    this.game.removeListener('end', this.onEnd);
    this.game.removeListener('round:new', this.onRound);

    return Tracker.prototype.destroy.call(this);
};

/**
 * @inheritDoc
 */
GameTracker.prototype.serialize = function()
{
    var data = Tracker.prototype.serialize.call(this);

    data.id       = this.uniqId;
    data.name     = this.game.name;
    data.size     = this.size;
    data.rounds   = this.rounds;
    data.finished = this.finished;

    return data;
};
