/**
 * Big Enemy Bonus
 *
 * @param {Number} x
 * @param {Number} y
 */
function BonusEnemyBig(x, y)
{
    BonusEnemy.call(this, x, y);
}

BonusEnemyBig.prototype = Object.create(BonusEnemy.prototype);
BonusEnemyBig.prototype.constructor = BonusEnemyBig;

/**
 * Duration
 *
 * @type {Number}
 */
BonusEnemyBig.prototype.duration = 7500;

/**
 * Get effects
 *
 * @param {Avatar} avatar
 *
 * @return {Array}
 */
BonusEnemyBig.prototype.getEffects = function(avatar)
{
    return [['radius', 1]];
};
