/**
 * Fast Bonus
 *
 * @param {Number} x
 * @param {Number} y
 */
function BonusSelfFast(x, y)
{
    BonusSelf.call(this, x, y);
}

BonusSelfFast.prototype = Object.create(BonusSelf.prototype);
BonusSelfFast.prototype.constructor = BonusSelfFast;

/**
 * Duration
 *
 * @type {Number}
 */
BonusSelfFast.prototype.duration = 4000;

/**
 * Get effects
 *
 * @param {Avatar} avatar
 *
 * @return {Array}
 */
BonusSelfFast.prototype.getEffects = function(avatar)
{
    return [['velocity', 0.75 * BaseAvatar.prototype.velocity]];
};
