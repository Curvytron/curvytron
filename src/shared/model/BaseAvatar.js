/**
 * Base Avatar
 *
 * @param {Player} name
 * @param {String} color
 */
function BaseAvatar(player)
{
    EventEmitter.call(this);

    this.player = player;
    this.trail  = new Trail(this.player.color);
}

BaseAvatar.prototype = Object.create(EventEmitter.prototype);

/**
 * Update
 */
BaseAvatar.prototype.update = function()
{
    this.trail.update();
};