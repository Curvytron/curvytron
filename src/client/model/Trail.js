/**
 * Trail
 */
function Trail(avatar)
{
    BaseTrail.call(this, avatar);

    this.clearAsked = false;
}

Trail.prototype = Object.create(BaseTrail.prototype);
Trail.prototype.constructor = Trail;

/**
 * Get last segment
 *
 * @return {Array}
 */
Trail.prototype.getLastSegment = function()
{
    var length = this.points.length,
        points = null;

    if (length) {
        points = this.points;

        this.points     = this.clearAsked ? [] : [points[length - 1]];
        this.clearAsked = false;
    }

    return points;
};

/**
 * Clear
 *
 * @param {Array} point
 */
Trail.prototype.clear = function()
{
    this.clearAsked = true;
};