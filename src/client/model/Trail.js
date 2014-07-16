/**
 * Trail
 */
function Trail(avatar)
{
    BaseTrail.call(this, avatar);
}

Trail.prototype = Object.create(BaseTrail.prototype);

/**
 * Get last segment
 *
 * @return {Array}
 */
Trail.prototype.getLastSegment = function()
{
    var length = this.points.length;

    if (length > 2) {
        var points = this.points;
        this.points = [points[length - 1]];
        return points;
    }

    return null;
};