/**
 * FPS Logger
 */
function BaseFPSLogger()
{
    EventEmitter.call(this);

    this.interval  = null;
    this.frames    = 0;
    this.frequency = 0;

    this.onFrame = this.onFrame.bind(this);
    this.log     = this.log.bind(this);

    this.start();
}

BaseFPSLogger.prototype = Object.create(EventEmitter.prototype);
BaseFPSLogger.prototype.constructor = BaseFPSLogger;

/**
 * End frame
 */
BaseFPSLogger.prototype.onFrame = function ()
{
    this.frames++;
};

/**
 * Log
 */
BaseFPSLogger.prototype.log = function()
{
    this.frequency = this.frames;
    this.frames    = 0;
};

/**
 * Start
 */
BaseFPSLogger.prototype.start = function()
{
    if (!this.interval) {
        this.frames   = 0;
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
        this.interval  = null;
        this.frequency = 0;
    }
};
