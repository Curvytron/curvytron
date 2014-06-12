/**
 * BaseTrail
 */
function BaseTrail(color)
{
    this.color         = color;
    this.head          = [0, 0];
    this.lastPosition  = this.head.slice(0);
    this.angle         = 0.5;
    this.velocities    = [0,0];
    this.points        = [];

    this.updateVelocities();
}

BaseTrail.prototype.velocity  = 5;
BaseTrail.prototype.radius    = 10;
BaseTrail.prototype.precision = 10;

/**
 * Update
 */
BaseTrail.prototype.update = function()
{
    this.head[0] = this.head[0] + this.velocities[0];
    this.head[1] = this.head[1] + this.velocities[1];

    if (this.getDistance(this.lastPosition, this.head) > this.precision) {
        this.addPoint(this.head);
    }
};

/**
 * Set angle
 *
 * @param {Float} angle
 */
BaseTrail.prototype.setAngle = function(angle)
{
    this.angle = angle;

    this.updateVelocities();
};

/**
 * Add angle
 *
 * @param {Float} angle
 */
BaseTrail.prototype.addAngle = function(angle)
{
    this.setAngle(this.angle + angle);
};

/**
 * Add point
 *
 * @param {Array} point
 */
BaseTrail.prototype.addPoint = function(point)
{
    this.lastPosition = point.slice(0);

    this.points.push(point);
};

/**
 * Update velocities
 */
BaseTrail.prototype.updateVelocities = function()
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
BaseTrail.prototype.getDistance = function(from, to)
{
    return Math.sqrt(Math.pow(from[0] - to[0], 2) + Math.pow(from[1] - to[1], 2));
};