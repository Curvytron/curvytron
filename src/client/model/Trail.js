/**
 * Trail
 * @constructor
 */
function Trail(color)
{
    BaseTrail.call(this, color);

    this.path = paper.Path();

    this.path.strokeColor   = this.color;
    this.path.strokeWidth   = this.radius;
    this.path.strokeCap     = 'round';
    this.path.strokeJoin    = 'round';
    this.path.fullySelected = true;
}

Trail.prototype = Object.create(BaseTrail.prototype);

/**
 * Add point
 *
 * @param {Array} point
 */
Trail.prototype.addPoint = function(point)
{
    this.path.moveTo(point);
    this.path.lineTo(point);
    /*this.add(this.head.add(this.velocities));
     this.smooth();*/
};