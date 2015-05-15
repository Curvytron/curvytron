/**
 * Slow Bonus
 *
 * @param {Number} x
 * @param {Number} y
 */
function BonusSelfSlow(x, y)
{
    BonusSelf.call(this, x, y);
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
