/**
 * Explode particle
 */
function ExplodeParticle (x, y, velocity, angle, radius)
{
    this.x         = x;
    this.y         = y;
    this.originX   = x;
    this.originY   = y;
    this.velocityX = Math.cos(angle) * velocity;
    this.velocityY = Math.sin(angle) * velocity;
    this.radius    = radius;
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
ExplodeParticle.prototype.update = function (time)
{
    this.x = this.originX + this.velocityX * time;
    this.y = this.originY + this.velocityY * time;
};
