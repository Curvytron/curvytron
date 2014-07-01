
/**
 * Island
 */
function Island(id,  size, from)
{
    this.id     = id;
    this.size   = size;
    this.from   = [from[0], from[1]];
    this.to     = [this.from[0] + size, this.from[1] + size];
    this.bodies = new Collection([], 'id', true);
}

/**
 * Add body
 *
 * @param {Array} body
 */
Island.prototype.addBody = function(body)
{
    this.bodies.add(body);
    body.islands.add(this);
};

/**
 * Remove body
 *
 * @param {Array} body
 */
Island.prototype.removeBody = function(body)
{
    this.bodies.remove(body);
    body.islands.remove(this);
};

/**
 * Add body
 *
 * @param {Array} body
 */
Island.prototype.testBody = function(body)
{
    return this.getBody(body) === null;
};

/**
 * Add body
 *
 * @param {Body} body
 */
Island.prototype.getBody = function(body)
{
    if (this.bodyInBound(body, this.from, this.to)) {
        for (var i = this.bodies.items.length - 1; i >= 0; i--) {
            if (this.bodiesTouch(this.bodies.items[i], body)) {
                return this.bodies.items[i];
            }
        }
    }

    return null;
};

/**
 * Bodies touch
 *
 * @param {Body} bodyA
 * @param {Body} bodyB
 *
 * @return {Boolean}
 */
Island.prototype.bodiesTouch = function(bodyA, bodyB)
{
    return this.getDistance(bodyA.position, bodyB.position) < (bodyA.radius + bodyB.radius) && bodyA.matchMask(bodyB);
};

/**
 * Is point in bound?
 *
 * @param {Body} body
 * @param {Array} from
 * @param {Array} to
 *
 * @return {Boolean}
 */
Island.prototype.bodyInBound = function(body, from, to)
{
    return body.position[0] + body.radius > from[0] &&
           body.position[0] - body.radius < to[0]   &&
           body.position[1] + body.radius > from[1] &&
           body.position[1] - body.radius < to[1];
};

/**
 * get Distance
 *
 * @param {Array} from
 * @param {Array} to
 *
 * @return {Number}
 */
Island.prototype.getDistance = function(from, to)
{
    return Math.sqrt(Math.pow(from[0] - to[0], 2) + Math.pow(from[1] - to[1], 2));
};

/**
 * Random Position
 *
 * @param {Number} radius
 * @param {Number} border
 *
 * @return {Array}
 */
Island.prototype.getRandomPosition = function(radius, border)
{
    var margin = radius + border * this.size,
        point = this.getRandomPoint(margin);

    while (!this.testBody(point, margin)) {
        point = this.getRandomPoint(margin);
    }

    return point;
};

/**
 * Get random point
 *
 * @param {Number} margin
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
    this.bodies.clear();
};