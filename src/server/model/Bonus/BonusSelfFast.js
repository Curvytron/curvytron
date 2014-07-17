/**
 * Fast Bonus
 *
 * @param {Array} position
 */
function BonusSelfFast(position)
{
    BonusSelf.call(this, position);
}

BonusSelfFast.prototype = Object.create(BonusSelf.prototype);
BonusSelfFast.prototype.constructor = BonusSelfFast;

/**
 * Effects
 *
 * @type {Object}
 */
BonusSelfFast.prototype.effects = {
    velocity: BaseAvatar.prototype.velocity/2
};