/**
 * Trail
 */
function Trail(color, radius)
{
    BaseTrail.call(this, color, radius);
}

Trail.prototype = Object.create(BaseTrail.prototype);

/**
 * Clear
 */
Trail.prototype.clear = function()
{
    BaseTrail.prototype.clear.call(this);
    this.emit('clear');
};