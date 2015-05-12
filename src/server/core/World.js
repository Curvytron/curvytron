/**
 * World
 */
function World(size, islands)
{
    islands = typeof(islands) === 'number' ? islands : this.islandGridSize;

    this.size       = size;
    this.islands    = new Collection();
    this.islandSize = this.size / islands;
    this.active     = false;

    this.angleTopLeftX     = 0;
    this.angleTopLeftY     = 0;
    this.angleTopRightX    = this.size;
    this.angleTopRightY    = 0;
    this.angleBottomRightX = this.size;
    this.angleBottomRightY = this.size;
    this.angleBottomLeftX  = 0;
    this.angleBottomLeftY  = this.size;

    for (var id, x, y = islands - 1; y >= 0; y--) {
        for (x = islands- 1; x >= 0; x--) {
            id = x.toString() + ':' + y.toString();
            this.islands.add(new Island(id, this.islandSize, x * this.islandSize, y * this.islandSize));
        }
    }
}

/**
 * Island grid size
 *
 * @type {Number}
 */
World.prototype.islandGridSize = 5;

/**
 * Get island by point
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
 * Get island by body
 *
 * @param {Body} body
 *
 * @return {Island}
 */
/*World.prototype.getIslandsByBody = function(body)
{
    var islands = new Collection(),
        source;

    source = this.getIslandByPoint(body.x - body.radius, body.y - body.radius);
    if (source) { islands.add(source); }
    source = this.getIslandByPoint(body.x + body.radius, body.y - body.radius);
    if (source) { islands.add(source); }
    source = this.getIslandByPoint(body.x - body.radius, body.y + body.radius);
    if (source) { islands.add(source); }
    source = this.getIslandByPoint(body.x + body.radius, body.y + body.radius);
    if (source) { islands.add(source); }

    return islands.items;
};*/

/**
 * Add body
 *
 * @param {Body} body
 */
World.prototype.addBody = function(body)
{
    if (!this.active) {
        return;
    }

    this.addBodyByPoint(body, body.x - body.radius, body.y - body.radius);
    this.addBodyByPoint(body, body.x + body.radius, body.y - body.radius);
    this.addBodyByPoint(body, body.x - body.radius, body.y + body.radius);
    this.addBodyByPoint(body, body.x + body.radius, body.y + body.radius);
};

/**
 * Add body to island by point
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
 * Remove body
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
 * Get body
 *
 * @param {Body} body
 */
World.prototype.getBody = function(body)
{
    return this.getBodyByPoint(body, body.x - body.radius, body.y - body.radius) ||
        this.getBodyByPoint(body, body.x + body.radius, body.y - body.radius) ||
        this.getBodyByPoint(body, body.x - body.radius, body.y + body.radius) ||
        this.getBodyByPoint(body, body.x + body.radius, body.y + body.radius);
};

/**
 * Get body by point
 *
 * @param {Body} body
 * @param {Number} x
 * @param {Number} y
 */
World.prototype.getBodyByPoint = function(body, x, y)
{
    var island = this.getIslandByPoint(x, y);

    return island ? island.getBody(body) : null;
};

/**
 * Test body
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
 * Test body by point
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
 * Random random position
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
 * Is point in bound?
 *
 * @param {Body} body
 *
 * @return {Boolean}
 */
World.prototype.getBoundIntersect = function(body, margin)
{
    margin = typeof(margin) !== 'undefined' ? margin : 0;

    if (body.x - margin < this.angleTopLeftX) {
        return [this.angleTopLeftX, body.y];
    }

    if (body.x + margin > this.angleBottomRightX) {
        return [this.angleBottomRightX, body.y];
    }

    if (body.y - margin < this.angleTopLeftY) {
        return [body.x, this.angleTopLeftY];
    }

    if (body.y + margin > this.angleBottomRightY) {
        return [body.x, this.angleBottomRightY];
    }

    return null;
};

/**
 * Get oposite
 *
 * @param {Number} x
 * @param {Number} y
 *
 * @return {Array}
 */
World.prototype.getOposite = function(x, y)
{
    if (x === this.angleTopLeftX) {
        return [this.angleBottomRightX, y, 0];
    }

    if (x === this.angleBottomRightX) {
        return [this.angleTopLeftX, y, 0];
    }

    if (y === this.angleTopLeftY) {
        return [x, this.angleBottomRightY, 1];
    }

    if (y === this.angleBottomRightY) {
        return [x, this.angleTopLeftY, 1];
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
    this.active = false;

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
