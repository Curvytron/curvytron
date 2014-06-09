/**
 * Player
 *
 * @param {String} color
 */
function Player(color)
{
    EventEmitter.call(this);

    this.color = color || 'red';
    this.trail = new Trail();
}

Player.prototype = Object.create(EventEmitter.prototype);
Player.prototype.constructor = Player;

/**
 * Update
 *
 * @param {Number} step
 */
Player.prototype.update = function(step)
{
    this.trail.update(step);
};