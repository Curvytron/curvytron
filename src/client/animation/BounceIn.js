/**
 * Bounce in animation
 *
 * @param {Number} duration
 */
function BounceIn(duration)
{
    this.duration = duration;
    this.created  = new Date().getTime();
    this.done     = false;

    this.end = this.end.bind(this);

    setTimeout(this.end, duration);
}

/**
 * Target value
 *
 * @type {Number}
 */
BounceIn.prototype.target = 1;

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
    return this.done ? this.target : this.easeOutBack(this.getAge(), 0, this.target, this.duration, this.factor);
};

/**
 * Get age in millisecond
 *
 * @return {Number}
 */
BounceIn.prototype.getAge = function()
{
    return new Date().getTime() - this.created;
};

/**
 * End
 */
BounceIn.prototype.end = function()
{
    this.done = true;
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
};
