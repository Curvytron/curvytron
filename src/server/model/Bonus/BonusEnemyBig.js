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

BonusEnemyBig.prototype.type     = 'big';
BonusEnemyBig.prototype.property = 'radius';
BonusEnemyBig.prototype.step     = BaseAvatar.prototype.radius;