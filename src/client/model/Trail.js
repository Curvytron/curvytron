/**
 * Trail
 * @constructor
 */
function Trail(color, radius)
{
    BaseTrail.call(this, color, radius);

    this.path = new paper.Path({
        strokeColor: this.color,
        strokeWidth: this.radius * 1.1 * paper.sceneScale,
        strokeCap: 'round',
        strokeJoin: 'round',
        fullySelected: false
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
    this.path.add(new paper.Point(
        point[0] * paper.sceneScale,
        point[1] * paper.sceneScale)
    );
};