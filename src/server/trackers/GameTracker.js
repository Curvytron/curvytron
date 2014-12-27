/**
 * Game tracker
 *
 * @param {Game} game
 */
function GameTracker (game)
{
    Tracker.call(this, game.name);

    this.game   = game;
    this.rounds = 0;

    this.onRound = this.onRound.bind(this);

    this.game.on('round:new', this.onRound);
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
 * Detach tracker
 */
GameTracker.prototype.detach = function()
{
    this.game.removeListener('round:new', this.onRound);
};
