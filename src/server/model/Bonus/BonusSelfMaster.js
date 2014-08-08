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
 * Duration
 *
 * @type {Number}
 */
BonusSelfMaster.prototype.duration = 7500;

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