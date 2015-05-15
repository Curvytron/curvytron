/**
 * Borderless Game Bonus
 *
 * @param {Number} x
 * @param {Number} y
 */
function BonusGameBorderless(x, y)
{
    BonusGame.call(this, x, y);
}

BonusGameBorderless.prototype = Object.create(BonusGame.prototype);
BonusGameBorderless.prototype.constructor = BonusGameBorderless;

/**
 * Duration
 *
 * @type {Number}
 */
BonusGameBorderless.prototype.duration = 10000;

/**
 * Probability
 *
 * @type {Number}
 */
BonusGameBorderless.prototype.probability = 0.8;

/**
 * Get effects
 *
 * @param {Game} game
 *
 * @return {Array}
 */
BonusGameBorderless.prototype.getEffects = function(game)
{
    return [
        ['borderless', true]
    ];
};
