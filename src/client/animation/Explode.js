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
    this.done      = false;

    this.canvas.drawCircle([this.width/2,this.width/2], this.width/2, avatar.color);

    for (var i = this.particles.length - 1; i >= 0; i--) {
        this.particles[i] = new ExplodeParticle(
            avatar.head,
            this.randomize(avatar.velocity/750, 0.2),
            this.randomize(avatar.angle, 0.2),
            this.randomize(avatar.radius, 0.2)
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
Explode.prototype.particleTotal = 10;

/**
 * Animation duration
 *
 * @type {Number}
 */
Explode.prototype.duration = 300;

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
 * Update
 */
Explode.prototype.draw = function (canvas)
{
    if (this.done) { return; }

    var age = new Date().getTime() - this.created;

    if (age <= this.duration) {
        var step = age / this.duration;

        for (var i = this.particles.length - 1; i >= 0; i--) {
            particle = this.particles[i];
            particle.update(age, step);
            canvas.drawImageScaled(this.canvas.element, particle.position, particle.radius, particle.radius, 0, particle.opacity);
        }
    }
};