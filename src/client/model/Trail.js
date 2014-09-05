/**
 * Trail
 */
function Trail(avatar)
{
    BaseTrail.call(this, avatar);

    this.clearAsked = false;
    this.queue      = [];
}

Trail.prototype = Object.create(BaseTrail.prototype);
Trail.prototype.constructor = Trail;

/**
 * Distance tolerance
 *
 * @type {Number}
 */
Trail.prototype.tolerance = 1;

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

        if (this.clearAsked) {
            this.points = this.queue;
            this.queue  = [];
        } else {
            this.points = [points[length - 1]];
        }

        this.clearAsked = false;
    }

    return points;
};

/**
 * Add point
 *
 * @param {Array} point
 */
Trail.prototype.addPoint = function(point)
{
    var last = this.getLast();

    if (last && (Math.abs(last[0] - point[0]) > this.tolerance || Math.abs(last[1] - point[1]) > this.tolerance)) {
        this.clear();
        this.queue.push(point);
    } else {
        this.points.push(point);
    }
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