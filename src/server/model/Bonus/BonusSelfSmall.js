/**
 * Small Bonus
 *
 * @param {Number} x
 * @param {Number} y
 */
function BonusSelfSmall(x, y)
{
    BonusSelf.call(this, x, y);
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
