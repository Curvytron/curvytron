/**
 * World
 */
function World(size, islands)
{
    islands = typeof(islands) === 'number' ? islands : Math.round(size / this.islandGridSize);

    this.size       = size;
    this.islands    = new Collection();
    this.islandSize = this.size / islands;
    this.active     = false;
    this.bodyCount  = 0;

    for (var id, x, y = islands - 1; y >= 0; y--) {
        for (x = islands- 1; x >= 0; x--) {
            id = x.toString() + ':' + y.toString();
            this.islands.add(new Island(id, this.islandSize, x * this.islandSize, y * this.islandSize));
        }
    }
}

/**
 * Island grid size (width of the island)
 *
 * @type {Number}
 */
World.prototype.islandGridSize = 40;

/**
 * Get the island responsible for the given point
 *
 * @param {Number} x
 * @param {Number} y
 *
 * @return {Island}
 */
World.prototype.getIslandByPoint = function(pX, pY)
{
    var x  = Math.floor(pX/this.islandSize),
        y  = Math.floor(pY/this.islandSize),
        id = x.toString() + ':' + y.toString();

    return this.islands.getById(id);
};

/**
 * Add a body to all concerned islands
 *
 * @param {Body} body
 */
World.prototype.addBody = function(body)
{
    if (!this.active) {
        return;
    }

    body.id = this.bodyCount++;

    this.addBodyByPoint(body, body.x - body.radius, body.y - body.radius);
    this.addBodyByPoint(body, body.x + body.radius, body.y - body.radius);
    this.addBodyByPoint(body, body.x - body.radius, body.y + body.radius);
    this.addBodyByPoint(body, body.x + body.radius, body.y + body.radius);
};

/**
 * Add a body to an island if it's concerned by the given point
 *
 * @param {Body} body
 * @param {Number} x
 * @param {Number} y
 */
World.prototype.addBodyByPoint = function(body, x, y)
{
    var island = this.getIslandByPoint(x, y);

    if (island) {
        island.addBody(body);
    }
};

/**
 * Remove a body from islands
 *
 * @param {Body} body
 */
World.prototype.removeBody = function(body)
{
    if (!this.active) {
        return;
    }

    for (var i = body.islands.items.length - 1; i >= 0; i--) {
        body.islands.items[i].removeBody(body);
    }
};

/**
 * Get one or no body coliding with the given body
 *
 * @param {Body} body
 *
 * @return {Body|null}
 */
World.prototype.getBody = function(body)
{
    return this.getBodyByPoint(body, body.x - body.radius, body.y - body.radius) ||
        this.getBodyByPoint(body, body.x + body.radius, body.y - body.radius) ||
        this.getBodyByPoint(body, body.x - body.radius, body.y + body.radius) ||
        this.getBodyByPoint(body, body.x + body.radius, body.y + body.radius);
};

/**
 * Get one or no body coliding with the given body for the given point
 *
 * @param {Body} body
 * @param {Number} x
 * @param {Number} y
 *
 * @return {Body|null}
 */
World.prototype.getBodyByPoint = function(body, x, y)
{
    var island = this.getIslandByPoint(x, y);

    return island ? island.getBody(body) : null;
};

/**
 * Test if the body position is free (there are no bodies for this position)
 *
 * @param {Body} body
 *
 * @return {Boolean}
 */
World.prototype.testBody = function(body)
{
    return this.testBodyByPoint(body, body.x - body.radius, body.y - body.radius) &&
        this.testBodyByPoint(body, body.x + body.radius, body.y - body.radius) &&
        this.testBodyByPoint(body, body.x - body.radius, body.y + body.radius) &&
        this.testBodyByPoint(body, body.x + body.radius, body.y + body.radius);
};

/**
 * Test if the body position is free for the given point
 *
 * @param {Body} Body
 * @param {Number} x
 * @param {Number} y
 */
World.prototype.testBodyByPoint = function(body, x, y)
{
    var island = this.getIslandByPoint(x, y);

    return island ? island.testBody(body) : false;
};

/**
 * Random a random, free of bodies, position
 *
 * @param {Number} radius
 * @param {Number} border
 *
 * @return {Array}
 */
World.prototype.getRandomPosition = function(radius, border)
{
    var margin = radius + border * this.size,
        body   = new Body(this.getRandomPoint(margin), this.getRandomPoint(margin), margin);

    while (!this.testBody(body)) {
        body.x = this.getRandomPoint(margin);
        body.y = this.getRandomPoint(margin);
    }

    return [body.x, body.y];
};

/**
 * Random random direction
 *
 * @param {Number} x
 * @param {Number} y
 * @param {Number} tolerance
 *
 * @return {Float}
 */
World.prototype.getRandomDirection = function(x, y, tolerance)
{
    var direction = this.getRandomAngle(),
        margin    = tolerance * this.size;

    while (!this.isDirectionValid(direction, x, y, margin)) {
        direction = this.getRandomAngle();
    }

    return direction;
};

/**
 * Is direction valid
 *
 * @param {Float} angle
 * @param {Number} x
 * @param {Number} y
 * @param {Float} margin
 *
 * @return {Boolean}
 */
World.prototype.isDirectionValid = function(angle, x, y, margin)
{
    var quarter = Math.PI/2,
        from,
        to;

    for (var i = 0; i < 4; i++) {
        from = quarter * i;
        to   = quarter * (i+1);

        if (angle >= from && angle < to) {
            if (this.getHypotenuse(angle - from, this.getDistanceToBorder(i, x, y)) < margin) {
                return false;
            }

            if (this.getHypotenuse(to - angle, this.getDistanceToBorder(i < 3 ? i+1 : 0, x, y)) < margin) {
                return false;
            }

            return true;
        }
    }
};

/**
 * Get hypotenuse from adjacent side
 *
 * @param {Float} angle
 * @param {Number} adjacent
 *
 * @return {Float}
 */
World.prototype.getHypotenuse = function(angle, adjacent)
{
    return adjacent / Math.cos(angle);
};

/**
 * Get random angle
 *
 * @return {Float}
 */
World.prototype.getRandomAngle = function()
{
    return Math.random() * Math.PI * 2;
};

/**
 * Get random point
 *
 * @param {Number} margin
 *
 * @return {Array}
 */
World.prototype.getRandomPoint = function(margin)
{
    return margin + Math.random() * (this.size - margin * 2);
};

/**
 * Get intersection between given body and the map borders
 *
 * @param {Body} body
 * @param {Number} margin
 *
 * @return {Boolean}
 */
World.prototype.getBoundIntersect = function(body, margin)
{
    if (body.x - margin < 0) {
        return [0, body.y];
    }

    if (body.x + margin > this.size) {
        return [this.size, body.y];
    }

    if (body.y - margin < 0) {
        return [body.x, 0];
    }

    if (body.y + margin > this.size) {
        return [body.x, this.size];
    }

    return null;
};

/**
 * Get oposite point
 *
 * @param {Number} x
 * @param {Number} y
 *
 * @return {Array}
 */
World.prototype.getOposite = function(x, y)
{
    if (x === 0) {
        return [this.size, y];
    }

    if (x === this.size) {
        return [0, y];
    }

    if (y === 0) {
        return [x, this.size];
    }

    if (y === this.size) {
        return [x, 0];
    }

    return [x, y];
};

/**
 * Get the distance of a point to the border
 *
 * @param {Number} border
 * @param {Number} x
 * @param {Number} y
 *
 * @return {Float}
 */
World.prototype.getDistanceToBorder = function(border, x, y)
{
    if (border === 0) {
        return this.size - x;
    }

    if (border === 1) {
        return this.size - y;
    }

    if (border === 2) {
        return x;
    }

    if (border === 3) {
        return y;
    }
};

/**
 * Clear the world
 */
World.prototype.clear = function()
{
    this.active    = false;
    this.bodyCount = 0;

    for (var i = this.islands.items.length - 1; i >= 0; i--) {
        this.islands.items[i].clear();
    }
};

/**
 * Activate
 */
World.prototype.activate = function()
{
    this.active = true;
};
