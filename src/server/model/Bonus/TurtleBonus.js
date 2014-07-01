/**
 * Turtle Bonus
 *
 * @param {Array} position
 */
function TurtleBonus(position)
{
    Bonus.call(this, position);
}

TurtleBonus.prototype = Object.create(Bonus.prototype);

/**
 * Type
 *
 * @type {String}
 */
TurtleBonus.prototype.name     = 'turtle';

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