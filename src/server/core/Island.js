
/**
 * Island
 */
function Island(id,  size, from)
{
    this.id      = id;
    this.size    = size;
    this.from    = [from[0], from[1]];
    this.to      = [this.from[0] + size, this.from[1] + size];
    this.circles = [];
}

/**
 * Add circle
 *
 * @param {Array} circle
 */
Island.prototype.addCircle = function(circle)
{
    this.circles.push(circle);
};

/**
 * Add circle
 *
 * @param {Array} circle
 */
Island.prototype.testCircle = function(circle)
{
    if (!this.circleInBound(circle, this.from, this.to)) {
        return false;
    }

    for (var i = this.circles.length - 1; i >= 0; i--)
    {
        if (this.circlesTouch(this.circles[i], circle)) {
            return false;
        }
    }

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
Island.prototype.circlesTouch = function(circleA, circleB)
{
    return this.getDistance(circleA, circleB) < (circleA[2] + circleB[2])
        && (circleA[3] && circleB[3] ? circleA[3] !== circleB[3] : true);
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
Island.prototype.circleInBound = function(circle, from, to)
{
    return circle[0] + circle[2] >= from[0]
        && circle[0] - circle[2] <= to[0]
        && circle[1] + circle[2] >= from[1]
        && circle[1] - circle[2] <= to[1];
};

/**
 * get Distance
 *
 * @param {Array} from
 * @param {Array} to
 *
 * @return {Boolean}
 */
Island.prototype.getDistance = function(from, to)
{
    return Math.sqrt(Math.pow(from[0] - to[0], 2) + Math.pow(from[1] - to[1], 2));
};

/**
 * Random Position
 *
 * @param {Number} radius
 *
 * @return {Array}
 */
Island.prototype.getRandomPosition = function(radius, border)
{
    var margin = radius + border * this.size,
        point = this.getRandomPoint(margin);

    while (!this.testCircle([point[0], point[1], margin, 0])) {
        point = this.getRandomPoint(margin);
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
Island.prototype.getRandomPoint = function(margin)
{
    return [
        margin + Math.random() * (this.size - margin * 2),
        margin + Math.random() * (this.size - margin * 2)
    ];
};

/**
 * Clear the world
 */
Island.prototype.clear = function()
{
    this.circles = [];
};