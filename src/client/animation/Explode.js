/**
 * Explosion animation
 *
 * @param {Array} position
 * @param {Float} velocity
 * @param {Float} angle
 */
function Explode(avatar)
{
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
            avatar.head,
            this.randomize(avatar.velocity/750, 0.2),
            this.randomize(avatar.angle, 0.2),
            this.randomize(avatar.radius * 1.3, 0.2)
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
Explode.prototype.draw = function (canvas)
{
    this.clear(canvas);

    if (this.done) { return; }

    this.lastRender = new Date().getTime();
    this.cleared    = false;

    var age = this.lastRender - this.created;

    if (age <= this.duration) {
        var step = age / this.duration;

        for (var particle, i = this.particles.length - 1; i >= 0; i--) {
            particle = this.particles[i];
            particle.update(age, step);
            canvas.drawImageScaled(this.canvas.element, particle.position[0], particle.position[1], particle.radius, particle.radius, 0, particle.opacity);
            this.cache.push(particle.position.concat([particle.radius]));
        }
    } else {
        this.done = true;
    }
};

/**
 * Clear particles from cache
 */
Explode.prototype.clear = function (canvas)
{
    if (this.cleared) { return; }

    for (var particle, width, i = this.cache.length - 1; i >= 0; i--) {
        particle = this.cache[i];
        if (particle) {
            width    = particle[2] * 2;
            canvas.clearZoneScaled(particle[0], particle[1], width, width);
        }
    }

    this.cache.length = 0;
    this.cleared      = true;
};
