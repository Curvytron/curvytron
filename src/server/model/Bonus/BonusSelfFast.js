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
BonusSelfFast.prototype.constructor = BonusSelfFast;

/**
 * Get effects
 *
 * @param {Avatar} avatar
 *
 * @return {Array}
 */
BonusSelfFast.prototype.getEffects = function(avatar)
{
    return [['velocity', BaseAvatar.prototype.velocity/2]];
};