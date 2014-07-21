/**
 * Small Enemy Bonus
 *
 * @param {Array} position
 */
function BonusEnemySmall(position)
{
    BonusEnemy.call(this, position);
}

BonusEnemySmall.prototype = Object.create(BonusEnemy.prototype);
BonusEnemySmall.prototype.constructor = BonusEnemySmall;

/**
 * Get effects
 *
 * @param {Avatar} avatar
 *
 * @return {Array}
 */
BonusEnemySmall.prototype.getEffects = function(avatar)
{
    return [['radius', BaseAvatar.prototype.radius / 2]];
};