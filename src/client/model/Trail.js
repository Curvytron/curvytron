/**
 * Trail
 * @constructor
 */
function Trail(avatar)
{
    BaseTrail.call(this, avatar);

    this.path = [];
}

Trail.prototype = Object.create(BaseTrail.prototype);

/**
 * Add point
 *
 * @param {Array} point
 */
Trail.prototype.addPoint = function(point)
{
    if (!this.path.length || point !== this.path[this.path.length - 1]) {
        this.path.push(point);
    }
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
    var length = this.path.length;

    if (length > 2) {
        var path = this.path;
        this.path = [path[length - 1]];
        return path;
    }

    return null;
};