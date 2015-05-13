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
    this.x               = 0;
    this.y               = 0;
    this.trail           = new Trail(this);
    this.bonusStack      = new BonusStack(this);
    this.angle           = 0;
    this.velocityX       = 0;
    this.velocityY       = 0;
    this.angularVelocity = 0;
    this.alive           = true;
    this.printing        = false;
    this.score           = 0;
    this.roundScore      = 0;
    this.ready           = false;
    this.present         = true;

    // useless too? this.updateVelocities();
}

BaseAvatar.prototype = Object.create(EventEmitter.prototype);
BaseAvatar.prototype.constructor = BaseAvatar;

/**
 * Movement velocity
 *
 * @type {Number}
 */
BaseAvatar.prototype.velocity = 16;

/**
 * Turn velocity
 *
 * @type {Float}
 */
BaseAvatar.prototype.angularVelocityBase = 2.8/1000;

/**
 * Radius
 *
 * @type {Number}
 */
BaseAvatar.prototype.radius = 0.6;

/**
 * Number of trail points that don't kill the player
 *
 * @type {Number}
 */
BaseAvatar.prototype.trailLatency = 3;

/**
 * Inverted controls
 *
 * @type {Boolean}
 */
BaseAvatar.prototype.inverse = false;

/**
 * Invincible
 *
 * @type {Boolean}
 */
BaseAvatar.prototype.invincible = false;

/**
 * Type of tunrn: round or straight
 *
 * @type {Boolean}
 */
BaseAvatar.prototype.directionInLoop = true;

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
 * @param {Float} x
 * @param {Float} y
 */
BaseAvatar.prototype.setPosition = function(x, y)
{
    this.x = x;
    this.y = y;
};

/**
 * Add point
 *
 * @param {Float} x
 * @param {Float} y
 */
BaseAvatar.prototype.addPoint = function(x, y)
{
    this.trail.addPoint(x, y);
};

/**
 * Update angular velocity
 *
 * @param {Number} factor
 */
BaseAvatar.prototype.updateAngularVelocity = function(factor)
{
    if (typeof(factor) === 'undefined') {
        if (this.angularVelocity === 0) { return; }
        factor = (this.angularVelocity > 0 ? 1 : -1) * (this.inverse ? -1 : 1);
    }

    this.setAngularVelocity(factor * this.angularVelocityBase * (this.inverse ? -1 : 1));
};

/**
 * Set angular velocity
 *
 * @param {Float} angularVelocity
 */
BaseAvatar.prototype.setAngularVelocity = function(angularVelocity)
{
    this.angularVelocity = angularVelocity;
};

/**
 * Set angle
 *
 * @param {Float} angle
 */
BaseAvatar.prototype.setAngle = function(angle)
{
    if (this.angle !== angle) {
        this.angle = angle;
        this.updateVelocities();
    }
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
        if (this.directionInLoop) {
            this.setAngle(this.angle + this.angularVelocity * step);
        } else {
            this.setAngle(this.angle + this.angularVelocity);
            this.updateAngularVelocity(0);
        }
    }
};

/**
 * Update position
 *
 * @param {Number} step
 */
BaseAvatar.prototype.updatePosition = function(step)
{
    this.setPosition(
        this.x + this.velocityX * step,
        this.y + this.velocityY * step
    );
};

/**
 * Set velocity
 *
 * @param {Number} step
 */
BaseAvatar.prototype.setVelocity = function(velocity)
{
    velocity = Math.max(velocity, BaseAvatar.prototype.velocity/2);

    if (this.velocity !== velocity) {
        this.velocity = velocity;
        this.updateVelocities();
    }
};

/**
 * Update velocities
 */
BaseAvatar.prototype.updateVelocities = function()
{
    var velocity = this.velocity/1000;

    this.velocityX = Math.cos(this.angle) * velocity;
    this.velocityY = Math.sin(this.angle) * velocity;

    this.updateBaseAngularVelocity();
};

/**
 * Update base angular velocity
 */
BaseAvatar.prototype.updateBaseAngularVelocity = function()
{
    if (this.directionInLoop) {
        var ratio = this.velocity / BaseAvatar.prototype.velocity;
        this.angularVelocityBase = ratio * BaseAvatar.prototype.angularVelocityBase + Math.log(1/ratio)/1000;
        this.updateAngularVelocity();
    }
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
    if (this.inverse !== inverse) {
        this.inverse = inverse ? true : false;
        this.updateAngularVelocity();
    }
};

/**
 * Set invincible
 *
 * @param {Number} invincible
 */
BaseAvatar.prototype.setInvincible = function(invincible)
{
    this.invincible = invincible ? true : false;
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
BaseAvatar.prototype.getDistance = function(fromX, fromY, toX, toY)
{
    return Math.sqrt(Math.pow(fromX - toX, 2) + Math.pow(fromY - toY, 2));
};

/**
 * Die
 */
BaseAvatar.prototype.die = function()
{
    this.bonusStack.clear();
    this.alive = false;
    this.addPoint(this.x, this.y);
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

        this.addPoint(this.x, this.y, true);

        if (!this.printing) {
            this.trail.clear();
        }
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
    this.bonusStack.clear();

    this.x                   = this.radius;
    this.y                   = this.radius;
    this.angle               = 0;
    this.velocityX           = 0;
    this.velocityY           = 0;
    this.angularVelocity     = 0;
    this.roundScore          = 0;
    this.velocity            = BaseAvatar.prototype.velocity;
    this.alive               = true;
    this.printing            = false;
    this.color               = this.player.color;
    this.radius              = BaseAvatar.prototype.radius;
    this.inverse             = BaseAvatar.prototype.inverse;
    this.invincible          = BaseAvatar.prototype.invincible;
    this.directionInLoop     = BaseAvatar.prototype.directionInLoop;
    this.angularVelocityBase = BaseAvatar.prototype.angularVelocityBase;

    if (this.body) {
        this.body.radius = BaseAvatar.prototype.radius;
    }

    // useless? this.updateVelocities();
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
