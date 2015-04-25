/**
 * Explode particle
 */
function ExplodeParticle (x, y, velocity, angle, radius)
{
    this.x        = x;
    this.y        = y;
    this.originX  = x;
    this.originY  = y;
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
    this.x       = this.originX + (Math.cos(this.angle) * this.velocity) * time;
    this.y       = this.originY + (Math.sin(this.angle) * this.velocity) * time;
    this.opacity = ExplodeParticle.prototype.opacity * (1.2-step);
};
