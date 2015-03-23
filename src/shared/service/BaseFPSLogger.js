/**
 * FPS Logger
 */
function BaseFPSLogger()
{
    this.value    = 0;
    this.interval = null;

    this.update = this.update.bind(this);
    this.log    = this.log.bind(this);

    this.start();
}

/**
 * Update
 *
 * @param {Number} step
 */
BaseFPSLogger.prototype.update = function(step)
{
    var fps = step > 0 ? 1000/step : 60;

    this.value = ~~ (0.5 + (this.value ? (this.value + fps)/2 : fps));
};

/**
 * Log
 */
BaseFPSLogger.prototype.log = function()
{
    this.value = 0;
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
