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
 * Effects
 *
 * @type {Object}
 */
BonusEnemyInverse.prototype.effects = {
    inverse: 1
};