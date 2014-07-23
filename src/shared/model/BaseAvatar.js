/**
 * Base Avatar
 *
 * @param {Player} player
 */
function BaseAvatar(player)
{
    EventEmitter.call(this);

    this.name            = player.name;
    this.color           = player.color;
    this.player          = player;
    this.head            = [-100, -100];
    this.trail           = new Trail(this);
    this.bonusStack      = new BonusStack(this);
    this.angle           = 0;
    this.velocities      = [0,0];
    this.angularVelocity = 0;
    this.alive           = true;
    this.printing        = false;
    this.score           = 0;
    this.printingTimeout = null;
    this.ready           = false;
    this.ownColor        = this.color;
    this.present         = true;

    this.togglePrinting = this.togglePrinting.bind(this);

    this.updateVelocities();
}

BaseAvatar.prototype = Object.create(EventEmitter.prototype);
BaseAvatar.prototype.constructor = BaseAvatar;

BaseAvatar.prototype.velocity            = 16;
BaseAvatar.prototype.angularVelocityBase = 2.8/1000;
BaseAvatar.prototype.noPrintingTime      = 300;
BaseAvatar.prototype.printingTime        = 3000;
BaseAvatar.prototype.radius              = 0.6;
BaseAvatar.prototype.trailLatency        = 3;
BaseAvatar.prototype.inverse             = false;
BaseAvatar.prototype.invincible          = false;

/**
 * Equal
 *
 * @param {Avatar} avatar
 *
 * @return {Boolean}
 */
BaseAvatar.prototype.equal = function(avatar)
{
    return this.name === avatar.name;
};

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
    this.angularVelocity = factor * this.angularVelocityBase * (this.inverse ? -1 : 1);
};

/**
 * Set angle
 *
 * @param {Float} angle
 */
BaseAvatar.prototype.setAngle = function(angle)
{
    this.angle = angle;
    this.updateVelocities();
};

/**
 * Update
 *
 * @param {Number} step
 */
BaseAvatar.prototype.update = function(step) {};

/**
 * Add angle
 *
 * @param {Number} step
 */
BaseAvatar.prototype.updateAngle = function(step)
{
    if (this.angularVelocity) {
        this.setAngle(this.angle + this.angularVelocity * step);
    }
};

/**
 * Update position
 *
 * @param {Number} step
 */
BaseAvatar.prototype.updatePosition = function(step)
{
    this.setPosition([
        this.head[0] + this.velocities[0] * step,
        this.head[1] + this.velocities[1] * step
    ]);
};

/**
 * Set velocity
 *
 * @param {Number} step
 */
BaseAvatar.prototype.setVelocity = function(velocity)
{
    if (velocity > 0) {
        this.velocity = velocity;
        this.updateVelocities();
    }
};

/**
 * Update velocities
 */
BaseAvatar.prototype.updateVelocities = function()
{
    this.velocities = [
        Math.cos(this.angle) * this.velocity/1000,
        Math.sin(this.angle) * this.velocity/1000
    ];
};

/**
 * Set radius
 *
 * @param {Number} radius
 */
BaseAvatar.prototype.setRadius = function(radius)
{
    if (radius > 0) {
        this.radius = radius;
    }
};

/**
 * Set inverse
 *
 * @param {Number} inverse
 */
BaseAvatar.prototype.setInverse = function(inverse)
{
    this.inverse = inverse ? true : false;

    if (this.angularVelocity !== 0) {
        this.setAngularVelocity(this.angularVelocity > 0 ? 1 : -1);
    }
};

/**
 * Set invincible
 *
 * @param {Number} inverse
 */
BaseAvatar.prototype.setInvincible = function(invincible)
{
    this.invincible = invincible ? true : false;
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
};

/**
 * Start printing
 */
BaseAvatar.prototype.togglePrinting = function()
{
    if (this.printingTimeout) {
        clearTimeout(this.printingTimeout);
        this.printingTimeout = null;
    }

    this.setPrinting(!this.printing);

    this.printingTimeout = setTimeout(this.togglePrinting, this.getRandomPrintingTime());
};

/**
 * Stop printing
 */
BaseAvatar.prototype.stopPrinting = function()
{
    if (this.printingTimeout) {
        clearTimeout(this.printingTimeout);
        this.printingTimeout = null;
    }

    this.setPrinting(false);
};

/**
 * Set printing with timeout start/stop
 *
 * @param {Boolean} printing
 */
BaseAvatar.prototype.setPrintingWithTimeout = function(printing)
{
    if (!printing) {
        this.stopPrinting();
    } else if (!this.printingTimeout) {
        this.togglePrinting();
    }
};

/**
 * Set printing
 *
 * @param {Boolean} printing
 */
BaseAvatar.prototype.setPrinting = function(printing)
{
    if (!printing) {
        this.addPoint(this.head.slice(0), true);
    }

    this.printing = printing;

    if (!this.printing) {
        this.trail.clear();
    }

    if (printing) {
        this.addPoint(this.head.slice(0), true);
    }
};

/**
 * Get random printing time
 *
 * @return {Number}
 */
BaseAvatar.prototype.getRandomPrintingTime = function()
{
    if (this.printing) {
        return this.printingTime * (0.2 + Math.random() * 0.8);
    } else {
        return this.noPrintingTime * (0.8 + Math.random() * 0.5);
    }
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
 * Set color
 *
 * @param {Number} color
 */
BaseAvatar.prototype.setColor = function(color)
{
    this.color = color;
};

/**
 * Clear
 */
BaseAvatar.prototype.clear = function()
{
    this.stopPrinting();
    this.bonusStack.clear();

    this.head            = [this.radius, this.radius];
    this.angle           = Math.random() * Math.PI;
    this.velocities      = [0,0];
    this.angularVelocity = 0;
    this.velocity        = BaseAvatar.prototype.velocity;
    this.alive           = true;
    this.printing        = false;
    this.color           = this.ownColor;
    this.radius          = BaseAvatar.prototype.radius;
    this.inverse         = BaseAvatar.prototype.inverse;
    this.invincible      = BaseAvatar.prototype.invincible;

    this.updateVelocities();
};

/**
 * Destroy
 */
BaseAvatar.prototype.destroy = function()
{
    this.clear();
    this.present = false;
    this.alive   = false;
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