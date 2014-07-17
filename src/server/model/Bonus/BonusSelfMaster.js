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
BonusSelfMaster.prototype.constructor = BonusSelfMaster;

/**
 * Effects
 *
 * @type {Object}
 */
BonusSelfMaster.prototype.effects = {
    invincible: true,
    printing: -1
};