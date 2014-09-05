/**
 * Decrease animation
 *
 * @param {Number} duration
 */
function EaseOut(duration, position, velocity, angle)
{
    this.duration = duration;
    this.origin   = position.slice(0);
    this.position = position.slice(0);
    this.velocity = velocity;
    this.angle    = angle;
    this.created  = new Date().getTime();
    this.done     = false;
}

/**
 * Update
 *
 * @param {Number} step
 */
EaseOut.prototype.update = function ()
{
    if (this.done) { return this.position; }

    var age = new Date().getTime() - this.created;

    if (age > this.duration) {
        this.done = true;
    } else {
        var step = /*Math.exp(*/age / this.duration/*)*/;

        this.position[0] = this.origin[0] + (Math.cos(this.angle) * this.velocity) * age;
        this.position[1] = this.origin[1] + (Math.sin(this.angle) * this.velocity) * age;
    }

    console.log(this.position);

    return this.position;
};