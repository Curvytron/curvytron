/**
 * Rabbit Bonus
 *
 * @param {Array} position
 */
function RabbitBonus(position)
{
    BaseBonus.call(this, position);
}

RabbitBonus.prototype = Object.create(BaseBonus.prototype);

RabbitBonus.prototype.name = 'Rabbit';

/**
 * Aplly bonus callback
 *
 * @param {Avatar} avatar
 */
RabbitBonus.prototype.applyTo = function(avatar)
{
    avatar.upVelocity();

    return setTimeout(function() { avatar.downVelocity(); }, this.duration);
};