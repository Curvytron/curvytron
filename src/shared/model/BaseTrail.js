/**
 * BaseTrail
 */
function BaseTrail(avatar)
{
    EventEmitter.call(this);

    this.avatar = avatar;
    this.color  = this.avatar.color;
    this.radius = this.avatar.radius;
    this.points = new Collection();
}

BaseTrail.prototype = Object.create(EventEmitter.prototype);

/**
 * Add point
 *
 * @param {Array} point
 */
BaseTrail.prototype.addPoint = function(point)
{
    this.points.add(point);
};

/**
 * Get last point
 *
 * @return {Array}
 */
BaseTrail.prototype.getLast = function()
{
    return this.points.getLast();
};

/**
 * Clear
 *
 * @param {Array} point
 */
BaseTrail.prototype.clear = function()
{
    this.points.clear();
};