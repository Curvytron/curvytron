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

    this.angles = {
        topLeft: [0, 0],
        topRight: [this.size, 0],
        bottomRight: [this.size, this.size],
        bottomLeft: [0, this.size]
    };

    this.borders = [
        [this.angles.topLeft, this.angles.topRight],
        [this.angles.topRight, this.angles.bottomRight],
        [this.angles.bottomRight, this.angles.bottomLeft],
        [this.angles.bottomLeft, this.angles.topLeft]
    ];

    var x, y, id;

    for (y = this.islandGridSize - 1; y >= 0; y--) {
        for (x = this.islandGridSize - 1; x >= 0; x--) {
            id = x.toString() + ':' + y.toString();
            this.islands.add(new Island(id, this.islandSize, [x * this.islandSize, y * this.islandSize]));
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
 * @param {Array} point
 *
 * @return {Island}
 */
World.prototype.getIslandByPoint = function(point)
{
    var x = Math.floor(point[0]/this.islandSize),
        y = Math.floor(point[1]/this.islandSize),
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
World.prototype.getIslandsByBody = function(body)
{
    var islands = new Collection(),
        sources = [
            this.getIslandByPoint([body.position[0] - body.radius, body.position[1] - body.radius]),
            this.getIslandByPoint([body.position[0] + body.radius, body.position[1] - body.radius]),
            this.getIslandByPoint([body.position[0] - body.radius, body.position[1] + body.radius]),
            this.getIslandByPoint([body.position[0] + body.radius, body.position[1] + body.radius])
        ];

    for (var i = sources.length - 1; i >= 0; i--) {
        if (sources[i]) {
            islands.add(sources[i]);
        }
    }

    return islands.items;
};

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

    var islands = this.getIslandsByBody(body);

    for (var i = islands.length - 1; i >= 0; i--) {
        islands[i].addBody(body);
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
    var islands = this.getIslandsByBody(body),
        match;

    for (var i = islands.length - 1; i >= 0; i--) {
        match = islands[i].getBody(body);
        if (match) {
            return match;
        }
    }

    return null;
};

/**
 * Add body
 *
 * @param {Body} body
 *
 * @return {Boolean}
 */
World.prototype.testBody = function(body)
{
    var islands = this.getIslandsByBody(body);

    for (var i = islands.length - 1; i >= 0; i--) {
        if (!islands[i].testBody(body)) {
            return false;
        }
    }

    return true;
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
        point = this.getRandomPoint(margin);

    while (!this.testBody(new Body(point, margin))) {
        point = this.getRandomPoint(margin);
    }

    return point;
};

/**
 * Random random direction
 *
 * @param {Array} point
 *
 * @return {Float}
 */
World.prototype.getRandomDirection = function(point, tolerance)
{
    var direction = this.getRandomAngle(),
        margin = tolerance * this.size;

    while (!this.isDirectionValid(direction, point, margin)) {
        direction = this.getRandomAngle();
    }

    return direction;
};

/**
 * Is direction valid
 *
 * @param {Float} angle
 * @param {Array} point
 * @param {Float} margin
 *
 * @return {Boolean}
 */
World.prototype.isDirectionValid = function(angle, point, margin)
{
    var quarter = Math.PI/2,
        from,
        to;

    for (var i = 0; i < 4; i++) {
        from = quarter * i;
        to   = quarter * (i+1);

        if (angle >= from && angle < to) {
            if (this.getHypotenuse(angle - from, this.getDistanceToBorder(i, point)) < margin) {
                return false;
            }

            if (this.getHypotenuse(to - angle, this.getDistanceToBorder(i < 3 ? i+1 : 0, point)) < margin) {
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
    return [
        margin + Math.random() * (this.size - margin * 2),
        margin + Math.random() * (this.size - margin * 2)
    ];
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

    if (body.position[0] - margin < this.angles.topLeft[0]) {
        return [this.angles.topLeft[0], body.position[1]];
    }

    if (body.position[0] + margin > this.angles.bottomRight[0]) {
        return [this.angles.bottomRight[0], body.position[1]];
    }

    if (body.position[1] - margin < this.angles.topLeft[1]) {
        return [body.position[0], this.angles.topLeft[1]];
    }

    if (body.position[1] + margin > this.angles.bottomRight[1]) {
        return [body.position[0], this.angles.bottomRight[1]];
    }

    return null;
};

/**
 * Get oposite
 *
 * @param {Array} point
 *
 * @return {Array}
 */
World.prototype.getOposite = function(point)
{
    if (point[0] === this.angles.topLeft[0]) {
        return [this.angles.bottomRight[0], point[1], 0];
    }

    if (point[0] === this.angles.bottomRight[0]) {
        return [this.angles.topLeft[0], point[1], 0];
    }

    if (point[1] === this.angles.topLeft[1]) {
        return [point[0], this.angles.bottomRight[1], 1];
    }

    if (point[1] === this.angles.bottomRight[1]) {
        return [point[0], this.angles.topLeft[1], 1];
    }

    return point;
};

/**
 * Get the distance of a point to the border
 *
 * @param {Number} border
 * @param {Array} point
 *
 * @return {Float}
 */
World.prototype.getDistanceToBorder = function(border, point)
{
    if (border === 0) {
        return this.size - point[0];
    }

    if (border === 1) {
        return this.size - point[1];
    }

    if (border === 2) {
        return point[0];
    }

    if (border === 3) {
        return point[1];
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
