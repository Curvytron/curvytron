/**
 * FPS Logger
 */
function BaseFPSLogger()
{
    this.interval  = null;
    this.frequency = 0;
    this.period    = 0;
    this.maxPeriod = 0;
    this.frame     = 0;
    this.frames    = [];
    this.max       = 0;

    this.startFrame = this.startFrame.bind(this);
    this.endFrame   = this.endFrame.bind(this);
    this.log        = this.log.bind(this);

    this.start();
}

/**
 * Start frame
 */
BaseFPSLogger.prototype.startFrame = function ()
{
    this.frame = new Date().getTime();
};

/**
 * End frame
 */
BaseFPSLogger.prototype.endFrame = function ()
{
    var period = new Date().getTime() - this.frame;

    this.max = Math.max(period, this.max);

    this.frames.push(period);
};

/**
 * Log
 */
BaseFPSLogger.prototype.log = function()
{
    this.frequency     = this.frames.length;
    this.period        = this.processPeriod();
    this.maxPeriod     = this.max;
    this.frames.length = 0;
    this.max           = 0;
};

/**
 * Start
 */
BaseFPSLogger.prototype.start = function()
{
    if (!this.interval) {
        this.interval = setInterval(this.log, 1000);
    }
};

/**
 * Stop
 */
BaseFPSLogger.prototype.stop = function()
{
    if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
    }
};

/**
 * Process period
 *
 * @return {Number}
 */
BaseFPSLogger.prototype.processPeriod = function()
{
    if (!this.frames.length) {
        return 0;
    }

    return this.frames.reduce(function(previous, current, index, array) {
        return previous + current;
    }) / this.frames.length;
};
