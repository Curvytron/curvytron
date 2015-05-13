/**
 * Explosion animation
 *
 * @param {Avatar} avatar
 * @param {Canvas} effect
 */
function Explode(avatar, effect)
{
    this.effect    = effect;
    this.particles = new Array(this.particleTotal);
    this.canvas    = new Canvas(this.width, this.width);
    this.created   = new Date().getTime();
    this.done      = false;
    this.cleared   = false;

    var width = this.width/2;

    this.canvas.drawCircle(width, width, width, avatar.color);

    for (var i = this.particles.length - 1; i >= 0; i--) {
        this.particles[i] = new ExplodeParticle(
            avatar.x * this.effect.scale,
            avatar.y * this.effect.scale,
            this.randomize(avatar.velocity / 750 * this.effect.scale, 0.1),
            avatar.angle + this.angleVariation * (Math.random() * 2 - 1),
            this.effect.round(this.randomize(avatar.radius, 0.5) * this.effect.scale)
        );
    }
}

/**
 * Canvas width
 *
 * @type {Number}
 */
Explode.prototype.width = 10;

/**
 * Angle variation
 *
 * @type {Float}
 */
Explode.prototype.angleVariation = Math.PI / 8;

/**
 * Number of particles to generate
 *
 * @type {Number}
 */
Explode.prototype.particleTotal = 20;

/**
 * Animation duration
 *
 * @type {Number}
 */
Explode.prototype.duration = 500;

/**
 * Randomize value
 *
 * @param {Float} value
 * @param {Float} factor
 *
 * @return {Float}
 */
Explode.prototype.randomize = function(value, factor)
{
    return value + value * factor * (Math.random() * 2 - 1);
};

/**
 * Draw particles
 */
Explode.prototype.draw = function ()
{
    if (this.done) { return; }

    this.clear();

    this.lastRender = new Date().getTime();
    this.cleared    = false;

    var age = this.lastRender - this.created;

    if (age <= this.duration) {
        var step = age / this.duration;

        this.effect.setOpacity(ExplodeParticle.prototype.opacity * (1.2-step));

        for (var particle, i = this.particles.length - 1; i >= 0; i--) {
            particle = this.particles[i];
            particle.update(age);
            this.effect.drawImage(this.canvas.element, particle.x, particle.y, particle.radius, particle.radius);
        }

        this.effect.setOpacity(1);
    } else {
        this.clear();
        this.done = true;
    }
};

/**
 * Clear particles from cache
 */
Explode.prototype.clear = function ()
{
    if (this.cleared) { return; }

    for (var particle, width, i = this.particles.length - 1; i >= 0; i--) {
        particle = this.particles[i];
        this.effect.clearZone(particle.x, particle.y, particle.radius, particle.radius);
    }

    this.cleared = true;
};
