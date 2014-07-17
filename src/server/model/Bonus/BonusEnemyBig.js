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
 * Effects
 *
 * @type {Object}
 */
BonusEnemyBig.prototype.effects = {
    radius: BaseAvatar.prototype.radius
};