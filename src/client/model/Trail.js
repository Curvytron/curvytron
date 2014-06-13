/**
 * Trail
 * @constructor
 */
function Trail(color, radius)
{
    BaseTrail.call(this, color, radius);

    this.path = new paper.Path({
        strokeColor: this.color,
        strokeWidth: this.radius,
        strokeCap: 'round',
        strokeJoin: 'round',
        fullySelected: true
    });
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
    this.path.moveTo(point);
    this.path.lineTo(point);
    /*this.add(this.head.add(this.velocities));
     this.smooth();*/
};