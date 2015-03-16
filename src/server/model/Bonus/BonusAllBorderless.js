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
 * Probability
 *
 * @type {Number}
 */
BonusAllBorderless.prototype.probability = 0.8;

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
