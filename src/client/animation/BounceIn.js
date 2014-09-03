/**
 * Bounce in animation
 *
 * @param {Number} duration
 */
function BounceIn(duration)
{
    this.duration = duration;
    this.target   = 1;
    this.top      = this.target * 3/2;
    this.step     = this.duration * 2/3;
    this.created  = new Date().getTime();
    this.done     = false;
}

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

    var time = age < this.step ? age : (this.step - (age - this.step));

    return time / this.step * this.top;
};