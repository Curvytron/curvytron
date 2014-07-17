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
 * Effects
 *
 * @type {Object}
 */
BonusEnemyFast.prototype.effects = {
    velocity: BaseAvatar.prototype.velocity/2
};