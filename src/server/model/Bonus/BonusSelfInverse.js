/**
 * Inverse Enemy Bonus
 *
 * @param {Array} position
 */
function BonusSelfInverse(position)
{
    BonusEnemy.call(this, position);
}

BonusSelfInverse.prototype = Object.create(BonusEnemy.prototype);
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