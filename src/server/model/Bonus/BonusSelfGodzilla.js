/**
 * Godzilla Bonus
 *
 * @param {Array} position
 */
function BonusSelfGodzilla(position)
{
    BonusSelf.call(this, position);
}

BonusSelfGodzilla.prototype = Object.create(BonusSelf.prototype);

BonusSelfGodzilla.prototype.type     = 'godzilla';
BonusSelfGodzilla.prototype.property = 'godzilla';
BonusSelfGodzilla.prototype.step     = true;