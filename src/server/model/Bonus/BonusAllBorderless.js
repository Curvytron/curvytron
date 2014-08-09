/**
 * Master Bonus
 *
 * @param {Array} position
 */
function BonusAllBorderless(position)
{
    BonusAll.call(this, position);
}

BonusAllBorderless.prototype = Object.create(BonusAll.prototype);
BonusAllBorderless.prototype.constructor = BonusAllBorderless;

/**
 * Duration
 *
 * @type {Number}
 */
BonusAllBorderless.prototype.duration = 10000;

/**
 * Get effects
 *
 * @param {Avatar} avatar
 *
 * @return {Array}
 */
BonusAllBorderless.prototype.getEffects = function(avatar)
{
    return [
        ['borderless', true]
    ];
};