/**
 * Turtle Bonus
 *
 * @param {Array} position
 */
function TurtleBonus(position)
{
    BaseBonus.call(this, position);
}

TurtleBonus.prototype = Object.create(BaseBonus.prototype);

TurtleBonus.prototype.name     = 'Turtle';
TurtleBonus.prototype.color    = '#FF0000';
TurtleBonus.prototype.positive = false;

/**
 * Aplly bonus callback
 */
TurtleBonus.prototype.applyTo = function(avatar)
{
    avatar.downVelocity();

    return setTimeout(function() { avatar.upVelocity(); }, this.duration);
};