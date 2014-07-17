/**
 * Slow Bonus
 *
 * @param {Array} position
 */
function BonusSelfSlow(position)
{
    BonusSelf.call(this, position);
}

BonusSelfSlow.prototype = Object.create(BonusSelf.prototype);
BonusSelfSlow.prototype.constructor = BonusSelfSlow;

/**
 * Effects
 *
 * @type {Object}
 */
BonusSelfSlow.prototype.effects = {
    velocity: -BaseAvatar.prototype.velocity/2
};