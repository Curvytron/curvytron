/**
 * Explosion animation
 *
 * @param {Array} position
 * @param {Canvas} effect
 */
function Explode(avatar, effect)
{
    this.effect    = effect;
    this.particles = new Array(this.particleTotal);
    this.canvas    = new Canvas(this.width, this.width);
    this.created   = new Date().getTime();
    this.cache     = [];
    this.done      = false;
    this.cleared   = false;

    var width = this.width/2;

    this.canvas.drawCircle(width, width, width, avatar.color);

    for (var i = this.particles.length - 1; i >= 0; i--) {
        this.particles[i] = new ExplodeParticle(
            avatar.head[0] * this.effect.scale,
            avatar.head[1] * this.effect.scale,
            this.randomize(avatar.velocity / 750 * this.effect.scale, 0.2),
            this.randomize(avatar.angle, 0.2),
            this.effect.round(this.randomize(avatar.radius * 1.3 * this.effect.scale, 0.2))
        );
    }
}

/**
 * Number of particles to generate
 *
 * @type {Number}
 */
Explode.prototype.width = 20;

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
    this.clear();

    if (this.done) { return; }

    this.lastRender = new Date().getTime();
    this.cleared    = false;

    var age = this.lastRender - this.created;

    if (age <= this.duration) {
        var step = age / this.duration;

        for (var particle, i = this.particles.length - 1; i >= 0; i--) {
            particle = this.particles[i];
            particle.update(age, step);
            this.effect.setOpacity(particle.opacity);
            this.effect.drawImage(this.canvas.element, this.effect.round(particle.x), this.effect.round(particle.y), particle.radius, particle.radius);
            this.cache.push([particle.x, particle.y, particle.radius * 2]);
        }

        this.effect.setOpacity(1);
    } else {
        this.done = true;
    }
};

/**
 * Clear particles from cache
 */
Explode.prototype.clear = function ()
{
    if (this.cleared) { return; }

    for (var particle, width, i = this.cache.length - 1; i >= 0; i--) {
        particle = this.cache[i];
        //if (particle) {
            this.effect.clearZone(particle[0], particle[1], particle[2], particle[2]);
        //}
    }

    this.cache.length = 0;
    this.cleared      = true;
};
