/**
 * Smaller Self Bonus
 *
 * @param {Array} position
 */
function SmallerSelfBonus(position)
{
    Bonus.call(this, position);
}

SmallerSelfBonus.prototype = Object.create(Bonus.prototype);

SmallerSelfBonus.prototype.type   = 'smaller';
SmallerSelfBonus.prototype.affect = 'self';
SmallerSelfBonus.prototype.step   = BaseAvatar.prototype.defaultRadius;

/**
 * On
 */
SmallerSelfBonus.prototype.on = function()
{
    this.target.setRadius(this.target.radius - this.step);
};

/**
 * Off
 */
SmallerSelfBonus.prototype.off = function()
{
    this.target.setRadius(this.target.radius + this.step);
};
