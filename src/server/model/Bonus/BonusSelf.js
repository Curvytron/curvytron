/**
 * Self Bonus
 *
 * @param {Number} x
 * @param {Number} y
 */
function BonusSelf(x, y)
{
    Bonus.call(this, x, y);

    this.off = this.off.bind(this);
}

BonusSelf.prototype = Object.create(Bonus.prototype);
BonusSelf.prototype.constructor = BonusSelf;

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
    return avatar.alive ? avatar : null;
};

/**
 * Apply on
 */
BonusSelf.prototype.on = function()
{
    if (this.target) {
        this.target.bonusStack.add(this);
    }
};

/**
 * Apply on
 */
BonusSelf.prototype.off = function()
{
    if (this.target) {
        this.target.bonusStack.remove(this);
    }
};
