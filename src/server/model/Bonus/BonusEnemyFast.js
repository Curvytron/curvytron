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
 * Duration
 *
 * @type {Number}
 */
BonusEnemyFast.prototype.duration = 6000;

/**
 * Get effects
 *
 * @param {Avatar} avatar
 *
 * @return {Array}
 */
BonusEnemyFast.prototype.getEffects = function(avatar)
{
    return [['velocity', 0.75 * BaseAvatar.prototype.velocity]];
};