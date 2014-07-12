/**
 * Rabbit Bonus
 *
 * @param {Array} position
 */
function RabbitSelfBonus(position)
{
    Bonus.call(this, position);
}

RabbitSelfBonus.prototype = Object.create(Bonus.prototype);

RabbitSelfBonus.prototype.type   = 'rabbit';
RabbitSelfBonus.prototype.affect = 'self';
RabbitSelfBonus.prototype.step   = BaseAvatar.prototype.velocity/2;

/**
 * Apply on
 */
RabbitSelfBonus.prototype.on = function()
{
    this.target.setVelocity(this.target.velocity + this.step);
};

/**
 * Apply off
 */
RabbitSelfBonus.prototype.off = function()
{
    this.target.setVelocity(this.target.velocity - this.step);
};