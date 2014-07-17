/**
 * Slow Bonus
 *
 * @param {Array} position
 */
function SlowSelfBonus(position)
{
    Bonus.call(this, position);
}

SlowSelfBonus.prototype = Object.create(Bonus.prototype);

SlowSelfBonus.prototype.type   = 'slow_me';
SlowSelfBonus.prototype.affect = 'self';
SlowSelfBonus.prototype.step   = BaseAvatar.prototype.velocity/2;

/**
 * Apply on
 */
SlowSelfBonus.prototype.on = function()
{
    this.target.setVelocity(this.target.velocity - this.step);
};

/**
 * Apply off
 */
SlowSelfBonus.prototype.off = function()
{
    this.target.setVelocity(this.target.velocity + this.step);
};