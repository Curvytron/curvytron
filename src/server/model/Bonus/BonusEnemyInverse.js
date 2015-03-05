/**
 * Inverse Enemy Bonus
 *
 * @param {Array} position
 */
function BonusEnemyInverse(position)
{
    BonusEnemy.call(this, position);
}

BonusEnemyInverse.prototype = Object.create(BonusEnemy.prototype);
BonusEnemyInverse.prototype.constructor = BonusEnemyInverse;

/**
 * Probability
 *
 * @type {Number}
 */
BonusEnemyInverse.prototype.probability = 0.8;

/**
 * Get effects
 *
 * @param {Avatar} avatar
 *
 * @return {Array}
 */
BonusEnemyInverse.prototype.getEffects = function(avatar)
{
    return [['inverse', 1]];
};
