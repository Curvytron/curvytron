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