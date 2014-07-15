/**
 * World
 */
function World(size, islands)
{
    islands = typeof(islands) === 'number' ? islands : this.islandGridSize;

    this.size       = size;
    this.from       = [0, 0];
    this.to         = [size, size];
    this.islands    = new Collection();
    this.islandSize = this.size / islands;
    this.active     = false;

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
    if (!this.bodyInBound(body, this.from, this.to)) {
        return null;
    }

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
 */
World.prototype.testBody = function(body)
{
    if (!this.bodyInBound(body, this.from, this.to)) {
        return false;
    }

    var islands = this.getIslandsByBody(body);

    for (var i = islands.length - 1; i >= 0; i--) {
        if (!islands[i].testBody(body)) {
            return false;
        }
    }

    return true;
};

/**
 * Random Position
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
 * @param {Array} from
 * @param {Array} to
 *
 * @return {Boolean}
 */
World.prototype.bodyInBound = function(body, from, to)
{
    return body.position[0] - body.radius > from[0] &&
           body.position[0] + body.radius < to[0]   &&
           body.position[1] - body.radius > from[1] &&
           body.position[1] + body.radius < to[1];
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