/**
 * Slow Bonus
 *
 * @param {Array} position
 */
function BonusSelfSlow(position)
{
    BonusSelf.call(this, position);
}

BonusSelfSlow.prototype = Object.create(BonusSelf.prototype);

BonusSelfSlow.prototype.type     = 'slow_me';
BonusSelfSlow.prototype.property = 'velocity';
BonusSelfSlow.prototype.step     = -BaseAvatar.prototype.velocity/2;
