/**
 * Explode particle
 */
function ExplodeParticle (position, velocity, angle, radius)
{
    this.origin   = position.slice(0);
    this.position = position.slice(0);
    this.velocity = velocity;
    this.angle    = angle;
    this.radius   = radius;
}

/**
 * Opacity
 *
 * @type {Number}
 */
ExplodeParticle.prototype.opacity = 1;

/**
 * Update
 *
 * @param {Number} step
 */
ExplodeParticle.prototype.update = function (time, step)
{
    this.position[0] = this.origin[0] + (Math.cos(this.angle) * this.velocity) * time;
    this.position[1] = this.origin[1] + (Math.sin(this.angle) * this.velocity) * time;

    this.opacity = ExplodeParticle.prototype.opacity * (1-step);

    return this.position;
};