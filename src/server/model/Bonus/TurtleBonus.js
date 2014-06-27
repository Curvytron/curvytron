/**
 * Bonus
 *
 * @param name
 * @param color
 * @param radius
 *
 * @constructor
 */
function TurtleBonus(name, color, radius)
{
    BaseBonus.call(this, name, '#FF0000', radius);

    this.path = null;
}

TurtleBonus.prototype = Object.create(BaseBonus.prototype);

/**
 * Aplly bonus callback
 */
TurtleBonus.prototype.applyTo = function(avatar)
{
    avatar.downVelocity();
    return setTimeout(function() { avatar.upVelocity(); }, 3333);
};