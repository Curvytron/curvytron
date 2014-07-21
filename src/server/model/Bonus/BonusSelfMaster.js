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
 * Get effects
 *
 * @param {Avatar} avatar
 *
 * @return {Array}
 */
BonusSelfMaster.prototype.getEffects = function(avatar)
{
    return [
        ['invincible', true],
        ['printing', -1]
    ];
};