/**
 * Trail
 */
function Trail(color, radius)
{
    BaseTrail.call(this, color, radius);
}

Trail.prototype = Object.create(BaseTrail.prototype);

/**
 * Add point
 *
 * @param {Array} point
 */
Trail.prototype.addPoint = function(point)
{
    BaseTrail.prototype.addPoint.call(this, point);

    this.emit('point', point);
};