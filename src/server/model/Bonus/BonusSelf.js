/**
 * Self Bonus
 *
 * @param {Array} position
 */
function BonusSelf(position)
{
    Bonus.call(this, position);

    this.off = this.off.bind(this);
}

BonusSelf.prototype = Object.create(Bonus.prototype);

/**
 * Affect self
 *
 * @type {String}
 */
BonusSelf.prototype.affect = 'self';

/**
 * Get target
 *
 * @param {Avatar} avatar
 * @param {Game} game
 *
 * @return {Object}
 */
BonusSelf.prototype.getTarget = function(avatar, game)
{
    return avatar;
};

/**
 * Apply on
 */
BonusSelf.prototype.on = function()
{
    this.target.bonusStack.add(this);
};

/**
 * Apply on
 */
BonusSelf.prototype.off = function()
{
    this.target.bonusStack.remove(this);
};