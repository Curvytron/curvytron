/**
 * Master Bonus
 *
 * @param {Array} position
 */
function BonusEnemyMaster(position)
{
    BonusEnemy.call(this, position);
}

BonusEnemyMaster.prototype = Object.create(BonusEnemy.prototype);
BonusEnemyMaster.prototype.constructor = BonusEnemyMaster;

/**
 * Get effects
 *
 * @param {Avatar} avatar
 *
 * @return {Array}
 */
BonusEnemyMaster.prototype.getEffects = function(avatar)
{
    return [
        ['invincible', true],
        ['printing', -1]
    ];
};