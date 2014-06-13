/**
 * BaseTrail
 */
function BaseTrail(color, radius)
{
    this.color  = color;
    this.radius = radius;
    this.points = [];
}

BaseTrail.prototype = Object.create(EventEmitter.prototype);

/**
 * Add point
 *
 * @param {Array} point
 */
BaseTrail.prototype.addPoint = function(point)
{
    this.points.push(point);
};