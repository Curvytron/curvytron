/**
 * Fast Bonus
 *
 * @param {Array} position
 */
function FastSelfBonus(position)
{
    Bonus.call(this, position);
}

FastSelfBonus.prototype = Object.create(Bonus.prototype);

FastSelfBonus.prototype.type   = 'fast_me';
FastSelfBonus.prototype.affect = 'self';
FastSelfBonus.prototype.step   = BaseAvatar.prototype.velocity/2;

/**
 * Apply on
 */
FastSelfBonus.prototype.on = function()
{
    this.target.setVelocity(this.target.velocity + this.step);
};

/**
 * Apply off
 */
FastSelfBonus.prototype.off = function()
{
    this.target.setVelocity(this.target.velocity - this.step);
};