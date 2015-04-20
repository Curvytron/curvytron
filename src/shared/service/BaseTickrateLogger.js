/**
 * Tickrate Logger
 */
function BaseTickrateLogger()
{
    this.interval  = null;
    this.frequency = 0;
    this.ticks     = [];

    this.log  = this.log.bind(this);
    this.tick = this.tick.bind(this);

    this.start();
}

/**
 * Tick
 */
BaseTickrateLogger.prototype.tick = function (data)
{
    this.ticks.push(data);
};

/**
 * Log
 */
BaseTickrateLogger.prototype.log = function()
{
    this.frequency    = this.ticks.length;
    this.ticks.length = 0;
};

/**
 * Start
 */
BaseTickrateLogger.prototype.start = function()
{
    if (!this.interval) {
        this.interval = setInterval(this.log, 1000);
    }
};

/**
 * Stop
 */
BaseTickrateLogger.prototype.stop = function()
{
    if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
    }
};
