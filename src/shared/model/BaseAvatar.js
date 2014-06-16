/**
 * Base Avatar
 *
 * @param {Player} player
 */
function BaseAvatar(player, position)
{
    EventEmitter.call(this);

    this.name            = player.name;
    this.color           = player.color;
    this.player          = player;
    this.radius          = 1;
    this.head            = [this.radius, this.radius];
    this.trail           = new Trail(this.color, this.radius, this.head.slice(0));
    this.angle           = Math.random() * Math.PI;
    this.velocities      = [0,0];
    this.angularVelocity = 0;
    this.alive           = true;
    this.printing        = false;
    this.score           = 0;
    this.printimeTimeout = null;
    this.ready           = false;

    this.togglePrinting = this.togglePrinting.bind(this);

    this.togglePrinting();
    this.updateVelocities();
}

BaseAvatar.prototype = Object.create(EventEmitter.prototype);

BaseAvatar.prototype.velocity            = 20/1000;
BaseAvatar.prototype.precision           = 1;
BaseAvatar.prototype.angularVelocityBase = 3/1000;
BaseAvatar.prototype.printingRatio       = 0.8;
BaseAvatar.prototype.printingTime        = 3000;

/**
 * Set Point
 *
 * @param {Array} point
 */
BaseAvatar.prototype.setPosition = function(point)
{
    this.head[0] = point[0];
    this.head[1] = point[1];
};

/**
 * Add Point
 *
 * @param {Array} point
 */
BaseAvatar.prototype.addPoint = function(point)
{
    this.trail.addPoint(point);
};

/**
 * Set angular velocity
 *
 * @param {Number} factor
 */
BaseAvatar.prototype.setAngularVelocity = function(factor)
{
    if (!this.alive) { return; }

    this.angularVelocity = factor * this.angularVelocityBase;
};

/**
 * Set angle
 *
 * @param {Float} angle
 */
BaseAvatar.prototype.setAngle = function(angle)
{
    if (!this.alive) { return; }

    this.angle = angle;

    this.updateVelocities();
};

/**
 * Update
 *
 * @param {Number} step
 */
BaseAvatar.prototype.update = function(step)
{
    return [this.head[0], this.head[1], this.radius];
};

/**
 * Add angle
 *
 * @param {Number} step
 */
BaseAvatar.prototype.updateAngle = function(step)
{
    this.setAngle(this.angle + this.angularVelocity * step);
};

/**
 * Update position
 *
 * @param {Number} step
 *
 * @return {[type]}
 */
BaseAvatar.prototype.updatePosition = function(step)
{
    this.setPosition([
        this.head[0] + this.velocities[0] * step,
        this.head[1] + this.velocities[1] * step
    ]);
};

/**
 * Update velocities
 */
BaseAvatar.prototype.updateVelocities = function()
{
    this.velocities = [
        Math.cos(this.angle) * this.velocity,
        Math.sin(this.angle) * this.velocity
    ];
};

/**
 * Get distance
 *
 * @param {Array} from
 * @param {Array} to
 *
 * @return {Number}
 */
BaseAvatar.prototype.getDistance = function(from, to)
{
    return Math.sqrt(Math.pow(from[0] - to[0], 2) + Math.pow(from[1] - to[1], 2));
};

/**
 * Die
 */
BaseAvatar.prototype.die = function()
{
    this.alive = false;
    this.addPoint(this.head.slice(0));
};

/**
 * Start printing
 */
BaseAvatar.prototype.togglePrinting = function()
{
    this.printing = !this.printing;

    this.printimeTimeout = setTimeout(this.togglePrinting, this.getRandomPrintingTime());

    if (!this.printing) {
        this.trail.clear();
    }
};

/**
 * Get random printing time
 *
 * @return {Number}
 */
BaseAvatar.prototype.getRandomPrintingTime = function()
{
    var ratio = this.printing ? this.printingRatio : 1 - this.printingRatio,
        base = this.printingTime * ratio;

    return base * (0.5 + Math.random());
};

/**
 * This score
 *
 * @param {Number} score
 */
BaseAvatar.prototype.addScore = function(score)
{
    this.setScore(this.score + score);
};

/**
 * This score
 *
 * @param {Number} score
 */
BaseAvatar.prototype.setScore = function(score)
{
    this.score = score;
};

/**
 * Clear
 */
BaseAvatar.prototype.clear = function()
{
    if (this.printimeTimeout) {
        clearTimeout(this.printimeTimeout);
    }

    this.head            = [this.radius, this.radius];
    this.angle           = Math.random() * Math.PI;
    this.velocities      = [0,0];
    this.angularVelocity = 0;
    this.alive           = true;
    this.printing        = false;

    this.trail.clear();

    this.togglePrinting();
    this.updateVelocities();
};

/**
 * Serialize
 *
 * @return {Object}
 */
BaseAvatar.prototype.serialize = function()
{
    return {
        name: this.name,
        color: this.color,
        score: this.score
    };
};