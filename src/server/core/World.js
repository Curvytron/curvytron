/**
 * World
 */
function World(size)
{
    this.size    = size;
    this.from    = [0, 0];
    this.to      = [size, size];
    this.circles = [];
    this.islands = [];
}

World.prototype.islandGrid = 10;

/**
 * Add circle
 *
 * @param {Array} circle
 */
World.prototype.addCircle = function(circle)
{
    if (!this.circleInBound(circle, this.from, this.to)) {
        return false;
    }

    this.circles.push(circle);

    return true;
};

/**
 * Add circle
 *
 * @param {Array} circle
 */
World.prototype.test = function(circle)
{
    console.log("test", circle);

    if (!this.circleInBound(circle, this.from, this.to)) {
        console.log('not in bound');
        return false;
    }
    console.log('in bound');

    for (var i = this.circles.length - 1; i >= 0; i--)
    {
        if (this.circlesTouch(this.circles[i], circle)) {
            console.log('collids', this.circles[i]);
            return false
        }
    }

    console.log("pass");

    return true;
};

/**
 * Circles touch
 *
 * @param {Array} circleA
 * @param {Array} circleB
 *
 * @return {Boolean}
 */
World.prototype.circlesTouch = function(circleA, circleB)
{
    var distance = circleA[2] + circleB[2];

    return Math.abs(circleA[0] - circleB[0]) < distance || Math.abs(circleA[1] - circleB[1]) < distance;
};

/**
 * Is point in bound?
 *
 * @param {Array} circle
 * @param {Array} from
 * @param {Array} to
 *
 * @return {Boolean}
 */
World.prototype.circleInBound = function(circle, from, to)
{
    console.log("circleInBound", circle, from, to);

    return circle[0] - circle[2] >= from[0]
        && circle[0] + circle[2] <= to[0]
        && circle[1] - circle[2] >= from[1]
        && circle[1] + circle[2] <= to[1]
};

/**
 * Random Position
 *
 * @param {Number} radius
 *
 * @return {Array}
 */
World.prototype.getRandomPosition = function(radius)
{
    var point = this.getRandomPoint(radius);

    while (!this.test([point[0], point[1], radius])) {
        point = this.getRandomPoint(radius);
    }

    return point;
};

/**
 * Get random point
 *
 * @param {Number} radius
 *
 * @return {Array}
 */
World.prototype.getRandomPoint = function(radius)
{
    return [
        radius + Math.random() * (this.size - radius * 2),
        radius + Math.random() * (this.size - radius * 2)
    ]
};