/**
 * Trail
 * @constructor
 */
function Trail(avatar)
{
    BaseTrail.call(this, avatar);

    this.path    = [];
    this.changed = true;
}

Trail.prototype = Object.create(BaseTrail.prototype);

/**
 * Set position
 */
Trail.prototype.setPosition = function(point)
{
    var length = this.path.length - 1;

    if (length >= 0) {
        this.path[length] = point;
        this.changed = true;
    }
};

/**
 * Add point
 *
 * @param {Array} point
 */
Trail.prototype.addPoint = function(point)
{
    if (!this.path.length) {
        this.path.push(point);
    }

    this.path.push(point);

    this.changed = true;
};

/**
 * Add point
 *
 * @param {Array} point
 */
Trail.prototype.clear = function()
{
    this.path = [];
};

/**
 * Get last segment
 *
 * @return {Array}
 */
Trail.prototype.getLastSegment = function()
{
    return (this.changed && this.path.length > 1) ? [this.path[this.path.length-2], this.path[this.path.length-1]] : null;
};