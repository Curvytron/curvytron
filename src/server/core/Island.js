
/**
 * Island
 */
function Island(id, size, x, y)
{
    this.id     = id;
    this.size   = size;
    this.fromX  = x;
    this.fromY  = y;
    this.toX    = x + size;
    this.toY    = y + size;
    this.bodies = new Collection([], 'id', true);
}

/**
 * Add body
 *
 * @param {Body} body
 */
Island.prototype.addBody = function(body)
{
    this.bodies.add(body);
    body.islands.add(this);
};

/**
 * Remove body
 *
 * @param {Body} body
 */
Island.prototype.removeBody = function(body)
{
    this.bodies.remove(body);
    body.islands.remove(this);
};

/**
 * Test body
 *
 * @param {Body} body
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
    if (this.bodyInBound(body, this.fromX, this.fromY, this.toX, this.toX)) {
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
    return (this.getDistance(bodyA.x, bodyA.y, bodyB.x, bodyB.y) < (bodyA.radius + bodyB.radius)) && bodyA.match(bodyB);
};

/**
 * Is point in bound?
 *
 * @param {Body} body
 * @param {Number} fromX
 * @param {Number} fromY
 * @param {Number} toX
 * @param {Number} toY
 *
 * @return {Boolean}
 */
Island.prototype.bodyInBound = function(body, fromX, fromY, toX, toY)
{
    return body.x + body.radius > fromX &&
           body.x - body.radius < toX   &&
           body.y + body.radius > fromY &&
           body.y - body.radius < toY;
};

/**
 * Get distance
 *
 * @param {Number} fromX
 * @param {Number} fromY
 * @param {Number} toX
 * @param {Number} toY
 *
 * @return {Number}
 */
Island.prototype.getDistance = function(fromX, fromY, toX, toY)
{
    return Math.sqrt(Math.pow(fromX - toX, 2) + Math.pow(fromY - toY, 2));
};

/**
 * Random Position
 *
 * @param {Number} radius
 * @param {Number} border
 *
 * @return {Array}
 */
/*Island.prototype.getRandomPosition = function(radius, border)
{
    var margin = radius + border * this.size,
        point  = this.getRandomPoint(margin);

    while (!this.testBody(point)) {
        point = this.getRandomPoint(margin);
    }

    return point;
};*/

/**
 * Get random point
 *
 * @param {Number} margin
 *
 * @return {Array}
 */
/*Island.prototype.getRandomPoint = function(margin)
{
    return [
        margin + Math.random() * (this.size - margin * 2),
        margin + Math.random() * (this.size - margin * 2)
    ];
};*/

/**
 * Clear the world
 */
Island.prototype.clear = function()
{
    this.bodies.clear();
};
