/**
 * Trail
 * @constructor
 */
function Trail(color)
{
    BaseTrail.call(this, color);

    this.path = null;
    /*this.path = new paper.Path({
        strokeColor: this.color,
        strokeWidth: this.radius,
        strokeCap: 'round',
        strokeJoin: 'round',
        fullySelected: true
    });*/
}

Trail.prototype = Object.create(BaseTrail.prototype);

/**
 * Init Path
 */
Trail.prototype.initPath = function()
{
    this.path = new paper.Path({
        strokeColor: this.color,
        strokeWidth: this.radius,
        strokeCap: 'round',
        strokeJoin: 'round',
        fullySelected: true
    });
};

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
    this.path.smooth();
    /*this.add(this.head.add(this.velocities));
     this.smooth();*/
};