/**
 * Stop watch
 *
 * @param {String} name
 * @param {Number} tolerance
 */
function StopWatch(name, tolerance) {
    this.name     = name;
    this.from     = null;
    this.to       = null;
    this.duration = 0;

    if (typeof(tolerance) === 'number') {
        this.tolerance = tolerance;
    }

    this.start();
}

/**
 * Duration
 *
 * @type {Number}
 */
StopWatch.prototype.tolerance = 2;
/**
 * Start
 */
StopWatch.prototype.start = function() {
    this.from = new Date();
};

/**
 * Stop
 */
StopWatch.prototype.stop = function() {
    this.to = new Date();
    this.log(this.to.getTime() - this.from.getTime());
};

/**
 * Log duration
 *
 * @param {Number} duration
 */
StopWatch.prototype.log = function(duration) {
    if (duration >= this.tolerance) {
        this.duration = duration;
        console.info(this.name + ': ' + this.duration);
    }
};
