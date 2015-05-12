/**
 * Master Bonus
 *
 * @param {Number} x
 * @param {Number} y
 */
function BonusGameClear(x, y)
{
    BonusGame.call(this, x, y);
}

BonusGameClear.prototype = Object.create(BonusGame.prototype);
BonusGameClear.prototype.constructor = BonusGameClear;

/**
 * Duration
 *
 * @type {Number}
 */
BonusGameClear.prototype.duration = 0;

/**
 * Get probability
 *
 * @param {Game} game
 *
 * @return {Number}
 */
BonusGameClear.prototype.getProbability = function (game)
{
    var ratio = 1 - game.getAliveAvatars().count() / game.getPresentAvatars().count();

    if (ratio < 0.5) {
        return this.probability;
    }

    return Math.round((BaseBonus.prototype.probability - ratio) * 10) / 10;
};

/**
 * Apply on
 */
BonusGameClear.prototype.on = function()
{
    this.target.clearTrails();
};
