/**
 * Bonus
 *
 * @param color
 * @param radius
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
TurtleBonus.prototype.callback = function(avatar)
{
    avatar.downVelocity();
    return setTimeout(function() { avatar.upVelocity(); }, 3333);
};