/**
 * Base Avatar
 *
 * @param {Player} player
 */
function BaseAvatar(player)
{
    EventEmitter.call(this);

    this.name   = player.name;
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
