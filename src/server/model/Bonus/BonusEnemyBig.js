/**
 * Big Enemy Bonus
 *
 * @param {Array} position
 */
function BonusEnemyBig(position)
{
    BonusEnemy.call(this, position);
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