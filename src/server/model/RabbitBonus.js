/**
 * RabbitBonus
 *
 * @param color
 * @param radius
 */
function RabbitBonus(name, color, radius)
{
    BaseBonus.call(this, name, '#7CFC00', radius);

    this.path = null;
}

RabbitBonus.prototype = Object.create(BaseBonus.prototype);

/**
 * Aplly bonus callback
 */
RabbitBonus.prototype.callback = function(avatar)
{
    avatar.upVelocity();
    return setTimeout(function() { avatar.downVelocity(); }, 3333);
};