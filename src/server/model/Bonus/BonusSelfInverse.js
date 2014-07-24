/**
 * Inverse Enemy Bonus
 *
 * @param {Array} position
 */
function BonusSelfInverse(position)
{
    BonusSelf.call(this, position);
}

BonusSelfInverse.prototype = Object.create(BonusSelf.prototype);
BonusSelfInverse.prototype.constructor = BonusSelfInverse;

/**
 * Get effects
 *
 * @param {Avatar} avatar
 *
 * @return {Array}
 */
BonusSelfInverse.prototype.getEffects = function(avatar)
{
    return [['inverse', 1]];
};