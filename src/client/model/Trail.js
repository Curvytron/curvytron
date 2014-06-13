/**
 * Trail
 * @constructor
 */
function Trail(color, radius)
{
    BaseTrail.call(this, color, radius);

    this.path = null;

    this.createPath();
}

Trail.prototype = Object.create(BaseTrail.prototype);

/**
 * Create path
 */
Trail.prototype.createPath = function()
{
    this.path = new paper.Path({
        strokeColor: this.color,
        strokeWidth: this.radius * 2 * paper.sceneScale,
        strokeCap: 'round',
        strokeJoin: 'round',
        fullySelected: false
    });
};

/**
 * Add point
 *
 * @param {Array} point
 */
Trail.prototype.addPoint = function(point)
{
    this.path.add(new paper.Point(point[0] * paper.sceneScale, point[1] * paper.sceneScale));
};

/**
 * Add point
 *
 * @param {Array} point
 */
Trail.prototype.clear = function()
{
    this.createPath();
};