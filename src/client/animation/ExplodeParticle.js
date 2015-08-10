/**
 * Explode particle
 */
function ExplodeParticle (x, y, velocity, angle, radius)
{
    this.x         = this.round(x);
    this.y         = this.round(y);
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
    this.x = this.round(this.originX + this.velocityX * time);
    this.y = this.round(this.originY + this.velocityY * time);
};

/**
 * Round
 *
 * @param {Number} value
 *
 * @return {Number}
 */
ExplodeParticle.prototype.round = function (value)
{
    return (0.5 + value) | 0;
};
