
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
    this.bodies = new Collection([], 'id');
}

/**
 * Add body
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
 * Bodies touch
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
 * Clear the world
 */
Island.prototype.clear = function()
{
    this.bodies.clear();
};
