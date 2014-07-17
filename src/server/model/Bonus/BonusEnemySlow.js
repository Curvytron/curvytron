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
 * Effects
 *
 * @type {Object}
 */
BonusEnemySlow.prototype.effects = {
    velocity: -BaseAvatar.prototype.velocity/2
};