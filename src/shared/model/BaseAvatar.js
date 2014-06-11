/**
 * Base Avatar
 *
 * @param {Player} name
 * @param {String} color
 */
function BaseAvatar(player, color)
{
    EventEmitter.call(this);

    this.player = player;
    this.color  = typeof(color) !== 'undefined' ? color : 'red';
    this.trail  = new Trail(this.color);
}

BaseAvatar.prototype = Object.create(EventEmitter.prototype);

/**
 * Update
 */
BaseAvatar.prototype.update = function()
{
    this.trail.update();
};