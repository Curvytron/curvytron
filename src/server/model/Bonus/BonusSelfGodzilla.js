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
 * Effects
 *
 * @type {Object}
 */
BonusSelfGodzilla.prototype.effects = {
    invincible: true,
    printing: 100,
    radius: 10,
    velocity: 6
};