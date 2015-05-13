/**
 * Island
 *
 * @param {Number} id
 * @param {Number} size
 * @param {Number} x
 * @param {Number} y
 */
function Island(id, size, x, y)
{
    this.id     = id;
    this.size   = size;
    this.fromX  = x;
    this.fromY  = y;
    this.toX    = x + size;
    this.toY    = y + size;
    this.bodies = new Collection([], 'id');
}

/**
 * Add a body
 *
 * @param {Body} body
 */
Island.prototype.addBody = function(body)
{
    if (this.bodies.add(body)) {
        body.islands.add(this);
    }
};

/**
 * Remove a body
 *
 * @param {Body} body
 */
Island.prototype.removeBody = function(body)
{
    this.bodies.remove(body);
    body.islands.remove(this);
};

/**
 * Test if the given body position is free (doesn't collide with any other)
 *
 * @param {Body} body
 *
 * @return {Boolean}
 */
Island.prototype.testBody = function(body)
{
    return this.getBody(body) === null;
};

/**
 * Get collinding body for the given body
 *
 * @param {Body} body
 *
 * @return {Body|null}
 */
Island.prototype.getBody = function(body)
{
    if (this.bodyInBound(body, this.fromX, this.fromY, this.toX, this.toY)) {
        for (var i = this.bodies.items.length - 1; i >= 0; i--) {
            if (this.bodiesTouch(this.bodies.items[i], body)) {
                return this.bodies.items[i];
            }
        }
    }

    return null;
};

/**
 * Does the given bodies touch each other?
 *
 * @param {Body} bodyA
 * @param {Body} bodyB
 *
 * @return {Boolean}
 */
Island.prototype.bodiesTouch = function(bodyA, bodyB)
{
    var distance = this.getDistance(bodyA.x, bodyA.y, bodyB.x, bodyB.y),
        radius   = bodyA.radius + bodyB.radius,
        match    = bodyA.match(bodyB);

    return distance < radius && match;
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
 * Get distance between two points
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
 * Clear the island
 */
Island.prototype.clear = function()
{
    this.bodies.clear();
};
