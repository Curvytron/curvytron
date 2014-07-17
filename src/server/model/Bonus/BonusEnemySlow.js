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

BonusEnemySlow.prototype.type     = 'slow_enemy';
BonusEnemySlow.prototype.property = 'velocity';
BonusEnemySlow.prototype.step     = -BaseAvatar.prototype.velocity/2;