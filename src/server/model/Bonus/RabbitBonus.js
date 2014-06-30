/**
 * Rabbit Bonus
 *
 * @param {Array} position
 */
function RabbitBonus(position)
{
    Bonus.call(this, position);
}

RabbitBonus.prototype = Object.create(Bonus.prototype);

/**
 * Type
 *
 * @type {String}
 */
RabbitBonus.prototype.type = 'rabbit';

/**
 * Aplly bonus callback
 *
 * @param {Avatar} avatar
 */
RabbitBonus.prototype.applyTo = function(avatar)
{
    console.log('apply', this.name, 'to', avatar.name);
    avatar.upVelocity();

    return setTimeout(function() { avatar.downVelocity(); }, this.duration);
};