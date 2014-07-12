/**
 * Turtle Bonus
 *
 * @param {Array} position
 */
function TurtleSelfBonus(position)
{
    Bonus.call(this, position);
}

TurtleSelfBonus.prototype = Object.create(Bonus.prototype);

TurtleSelfBonus.prototype.type   = 'turtle';
TurtleSelfBonus.prototype.affect = 'self';
TurtleSelfBonus.prototype.step   = BaseAvatar.prototype.velocity/2;

/**
 * Apply on
 */
TurtleSelfBonus.prototype.on = function()
{
    this.target.setVelocity(this.target.velocity - this.step);
};

/**
 * Apply off
 */
TurtleSelfBonus.prototype.off = function()
{
    this.target.setVelocity(this.target.velocity + this.step);
};