/**
 * Slow Enemy Bonus
 *
 * @param {Array} position
 */
function BonusEnemySlow(position)
{
    BonusEnemy.call(this, position);
}

BonusEnemySlow.prototype = Object.create(BonusEnemy.prototype);
BonusEnemySlow.prototype.constructor = BonusEnemySlow;

/**
 * Get effects
 *
 * @param {Avatar} avatar
 *
 * @return {Array}
 */
BonusEnemySlow.prototype.getEffects = function(avatar)
{
    return [['velocity', -BaseAvatar.prototype.velocity/2]];
};