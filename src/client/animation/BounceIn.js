/**
 * Bounce in animation
 *
 * @param {Number} duration
 */
function BounceIn(duration)
{
    this.duration = duration;
    this.target   = 1;
    this.created  = new Date().getTime();
    this.done     = false;
}

/**
 * Easing constant
 *
 * @type {Number}
 */
BounceIn.prototype.factor = 1.77635683940025e-15;

/**
 * Get size
 *
 * @return {Float}
 */
BounceIn.prototype.getValue = function()
{
    if (this.done) { return this.target; }

    var age = new Date().getTime() - this.created;

    if (age > this.duration) {
        this.done = true;

        return this.target;
    }

    return this.easeOutBack(age, 0, this.target, this.duration, this.factor);
};

/**
 * Ease out back
 *
 * @param {Number} time
 * @param {Number} begin
 * @param {Number} target
 * @param {Number} duration
 * @param {Float} factor
 *
 * @return {Float}
 */
BounceIn.prototype.easeOutBack = function(time, begin, target, duration, factor)
{
    var ts = (time/=duration)*time,
        tc = ts*time;
    return begin+target*(factor*tc*ts + 4*tc + -9*ts + 6*time);
}