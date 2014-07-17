/**
 * Fast Bonus
 *
 * @param {Array} position
 */
function BonusSelfFast(position)
{
    BonusSelf.call(this, position);
}

BonusSelfFast.prototype = Object.create(BonusSelf.prototype);

BonusSelfFast.prototype.type     = 'fast_me';
BonusSelfFast.prototype.property = 'velocity';
BonusSelfFast.prototype.step     = BaseAvatar.prototype.velocity/2;