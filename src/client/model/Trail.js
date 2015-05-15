/**
 * Trail
 */
function Trail(avatar)
{
    BaseTrail.call(this, avatar);

    this.clearAsked = false;
    this.queueX     = null;
    this.queueY     = null;
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
        points = this.points.slice(0);

        if (this.clearAsked) {
            BaseTrail.prototype.clear.call(this);
            if (this.queueX !== null) {
                BaseTrail.prototype.addPoint.call(this, this.queueX, this.queueY);
                this.queueX = null;
                this.queueY = null;
            }
            this.clearAsked = false;
        } else if(length > 1) {
            this.points.splice(0, length - 1);
        }
    }

    return points;
};

/**
 * Add point
 *
 * @param {Number} x
 * @param {Number} y
 */
Trail.prototype.addPoint = function(x, y)
{
    if (this.lastX !== null && (Math.abs(this.lastX - x) > this.tolerance || Math.abs(this.lastY - y) > this.tolerance)) {
        this.clear();
        this.queueX = x;
        this.queueY = y;
    } else {
        BaseTrail.prototype.addPoint.call(this, x, y);
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
