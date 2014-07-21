/**
 * Small Bonus
 *
 * @param {Array} position
 */
function BonusSelfSmall(position)
{
    BonusSelf.call(this, position);
}

BonusSelfSmall.prototype = Object.create(BonusSelf.prototype);
BonusSelfSmall.prototype.constructor = BonusSelfSmall;

/**
 * Get effects
 *
 * @param {Avatar} avatar
 *
 * @return {Array}
 */
BonusSelfSmall.prototype.getEffects = function(avatar)
{
    return [['radius', BaseAvatar.prototype.radius/2]];
};