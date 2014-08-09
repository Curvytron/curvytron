/**
 * Game Bonus
 *
 * @param {Array} position
 */
function BonusGame(position)
{
    Bonus.call(this, position);

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
BonusGame.prototype.on = function() {};

/**
 * Apply on
 */
BonusGame.prototype.off = function() {};