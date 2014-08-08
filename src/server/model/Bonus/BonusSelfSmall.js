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
 * Duration
 *
 * @type {Number}
 */
BonusSelfSmall.prototype.duration = 7500;

/**
 * Get effects
 *
 * @param {Avatar} avatar
 *
 * @return {Array}
 */
BonusSelfSmall.prototype.getEffects = function(avatar)
{
    return [['radius', -1]];
};