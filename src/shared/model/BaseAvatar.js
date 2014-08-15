/**
 * Base Avatar
 *
 * @param {Player} player
 */
function BaseAvatar(player)
{
    EventEmitter.call(this);

    this.id              = player.id;
    this.name            = player.name;
    this.color           = player.color;
    this.player          = player;
    this.head            = new Array(2);
    this.trail           = new Trail(this);
    this.bonusStack      = new BonusStack(this);
    this.angle           = 0;
    this.velocities      = [0,0];
    this.angularVelocity = 0;
    this.alive           = true;
    this.printing        = false;
    this.score           = 0;
    this.roundScore      = 0;
    this.printingTimeout = null;
    this.ready           = false;
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
BaseAvatar.prototype.borderless          = false;

/**
 * Equal
 *
 * @param {Avatar} avatar
 *
 * @return {Boolean}
 */
BaseAvatar.prototype.equal = function(avatar)
{
    return this.id === avatar.id;
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
    factor = typeof(factor) !== 'undefined' ? factor : (this.angularVelocity === 0 ? 0 : (this.angularVelocity > 0 ? 1 : -1));

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
    this.velocity = Math.max(velocity, BaseAvatar.prototype.velocity/2);
    this.updateVelocities();
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

    var ratio = this.velocity / BaseAvatar.prototype.velocity;

    this.angularVelocityBase = ratio * BaseAvatar.prototype.angularVelocityBase + Math.log(1/ratio)/1000;
    this.setAngularVelocity();
};

/**
 * Set radius
 *
 * @param {Number} radius
 */
BaseAvatar.prototype.setRadius = function(radius)
{
    this.radius = Math.max(radius, BaseAvatar.prototype.radius/8);
};

/**
 * Set inverse
 *
 * @param {Number} inverse
 */
BaseAvatar.prototype.setInverse = function(inverse)
{
    this.inverse = inverse ? true : false;
    this.setAngularVelocity();
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
 * Set borderless
 *
 * @param {Number} inverse
 */
BaseAvatar.prototype.setBorderless = function(borderless)
{
    this.borderless = borderless ? true : false;
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

    this.bonusStack.clear();
    this.stopPrinting();
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
    printing = printing ? true : false;

    if (this.printing !== printing) {
        this.printing = printing;

        this.addPoint(this.head.slice(0), true);

        if (!this.printing) {
            this.trail.clear();
        }
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
    this.setRoundScore(this.roundScore + score);
};

/**
 * Resolve score
 *
 * @param {Number} score
 */
BaseAvatar.prototype.resolveScore = function()
{
    this.setScore(this.score + this.roundScore);
    this.roundScore = 0;
};

/**
 * This round score
 *
 * @param {Number} score
 */
BaseAvatar.prototype.setRoundScore = function(score)
{
    this.roundScore = score;
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
    this.roundScore      = 0;
    this.velocity        = BaseAvatar.prototype.velocity;
    this.alive           = true;
    this.printing        = false;
    this.color           = this.player.color;
    this.radius          = BaseAvatar.prototype.radius;
    this.inverse         = BaseAvatar.prototype.inverse;
    this.invincible      = BaseAvatar.prototype.invincible;
    this.borderless      = BaseAvatar.prototype.borderless;

    if (this.body) {
        this.body.radius = BaseAvatar.prototype.radius;
    }

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
        id: this.id,
        name: this.name,
        color: this.color,
        score: this.score
    };
};