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

BonusEnemyInverse.prototype.type     = 'inverse';
BonusEnemyInverse.prototype.property = 'inverse';
BonusEnemyInverse.prototype.step     = 1;