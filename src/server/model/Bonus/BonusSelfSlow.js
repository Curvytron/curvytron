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
BonusSelfSlow.prototype.constructor = BonusSelfSlow;

/**
 * Get effects
 *
 * @param {Avatar} avatar
 *
 * @return {Array}
 */
BonusSelfSlow.prototype.getEffects = function(avatar)
{
    return [['velocity', -BaseAvatar.prototype.velocity/2]];
};