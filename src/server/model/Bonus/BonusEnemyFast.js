/**
 * Fast Enemy Bonus
 *
 * @param {Array} position
 */
function BonusEnemyFast(position)
{
    BonusEnemy.call(this, position);
}

BonusEnemyFast.prototype = Object.create(BonusEnemy.prototype);
BonusEnemyFast.prototype.constructor = BonusEnemyFast;

/**
 * Get effects
 *
 * @param {Avatar} avatar
 *
 * @return {Array}
 */
BonusEnemyFast.prototype.getEffects = function(avatar)
{
    return [['velocity', BaseAvatar.prototype.velocity/2]];
};