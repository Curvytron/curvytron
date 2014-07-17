/**
 * Master Bonus
 *
 * @param {Array} position
 */
function BonusSelfMaster(position)
{
    BonusSelf.call(this, position);
}

BonusSelfMaster.prototype = Object.create(BonusSelf.prototype);

BonusSelfMaster.prototype.type     = 'master';
BonusSelfMaster.prototype.property = 'invincible';
BonusSelfMaster.prototype.step     = true;