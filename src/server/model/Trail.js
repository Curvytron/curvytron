/**
 * Trail
 */
function Trail(avatar)
{
    BaseTrail.call(this, avatar);
}

Trail.prototype = Object.create(BaseTrail.prototype);
Trail.prototype.constructor = Trail;

/**
 * Clear
 */
Trail.prototype.clear = function()
{
    BaseTrail.prototype.clear.call(this);
    this.emit('clear', {avatar: this.avatar});
};