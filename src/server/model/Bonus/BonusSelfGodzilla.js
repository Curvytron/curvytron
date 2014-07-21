/**
 * Godzilla Bonus
 *
 * @param {Array} position
 */
function BonusSelfGodzilla(position)
{
    BonusSelf.call(this, position);
}

BonusSelfGodzilla.prototype = Object.create(BonusSelf.prototype);
BonusSelfGodzilla.prototype.constructor = BonusSelfGodzilla;

/**
 * Get effects
 *
 * @param {Avatar} avatar
 *
 * @return {Array}
 */
BonusSelfGodzilla.prototype.getEffects = function(avatar)
{
    return [
        ['invincible', true],
        ['printing', 100],
        ['radius', 10],
        ['velocity', 6]
    ];
};