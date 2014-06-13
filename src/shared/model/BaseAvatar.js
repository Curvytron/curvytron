/**
 * Base Avatar
 *
 * @param {Player} player
 */
function BaseAvatar(player)
{
    EventEmitter.call(this);

    this.name            = player.name;
    this.player          = player;
    this.trail           = new Trail(player.color, this.radius);
    this.head            = [0, 0];
    this.lastPosition    = this.head.slice(0);
    this.angle           = Math.random() * Math.PI;
    this.velocities      = [0,0];
    this.angularVelocity = 0;

    this.updateVelocities();
}

BaseAvatar.prototype = Object.create(EventEmitter.prototype);

BaseAvatar.prototype.velocity            = 3;
BaseAvatar.prototype.radius              = 10;
BaseAvatar.prototype.precision           = 10;
BaseAvatar.prototype.angularVelocityBase = 0.01;

/**
 * Set angular velocity
 *
 * @param {Number} factor
 */
BaseAvatar.prototype.setAngularVelocity = function(factor)
{
    this.angularVelocity = factor * this.angularVelocityBase;
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
 */
BaseAvatar.prototype.update = function(step) { };

/**
 * Add angle
 *
 * @param {Float} angle
 */
BaseAvatar.prototype.updateAngle = function(step)
{
    this.setAngle(this.angle + this.angularVelocity * step);
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
