/**
 * BaseTrail
 */
function BaseTrail(avatar)
{
    EventEmitter.call(this);

    this.avatar = avatar;
    this.color  = this.avatar.color;
    this.radius = this.avatar.radius;
    this.points = [];
}

BaseTrail.prototype = Object.create(EventEmitter.prototype);
BaseTrail.prototype.constructor = BaseTrail;

/**
 * Add point
 *
 * @param {Array} point
 */
BaseTrail.prototype.addPoint = function(point)
{
    this.points.push(point);
};

/**
 * Get last point
 *
 * @return {Array}
 */
BaseTrail.prototype.getLast = function()
{
    return this.points.length ? this.points[this.points.length - 1] : null;
};

/**
 * Clear
 *
 * @param {Array} point
 */
BaseTrail.prototype.clear = function()
{
    this.points.length = 0;
};
