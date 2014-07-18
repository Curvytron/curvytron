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
 * Get effects
 *
 * @param {Avatar} avatar
 *
 * @return {Array}
 */
BonusEnemyBig.prototype.getEffects = function(avatar)
{
    return [['radius', BaseAvatar.prototype.radius]];
};