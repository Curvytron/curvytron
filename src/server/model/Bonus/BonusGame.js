/**
 * Game Bonus
 *
 * @param {Number} x
 * @param {Number} y
 */
function BonusGame(x, y)
{
    Bonus.call(this, x, y);

    this.off = this.off.bind(this);
}

BonusGame.prototype = Object.create(Bonus.prototype);
BonusGame.prototype.constructor = BonusGame;

/**
 * Affect game
 *
 * @type {String}
 */
BonusGame.prototype.affect = 'game';

/**
 * Get target
 *
 * @param {Avatar} avatar
 * @param {Game} game
 *
 * @return {Object}
 */
BonusGame.prototype.getTarget = function(avatar, game)
{
    return game;
};

/**
 * Apply on
 */
BonusGame.prototype.on = function()
{
    if (this.target) {
        this.target.bonusStack.add(this);
    }
};

/**
 * Apply on
 */
BonusGame.prototype.off = function()
{
    if (this.target) {
        this.target.bonusStack.remove(this);
    }
};
