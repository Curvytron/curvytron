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

BonusEnemyFast.prototype.type     = 'fast_enemy';
BonusEnemyFast.prototype.property = 'velocity';
BonusEnemyFast.prototype.step     = BaseAvatar.prototype.velocity/2;