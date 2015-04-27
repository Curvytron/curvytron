/**
 * FPS Logger
 */
function FPSLogger()
{
    BaseFPSLogger.call(this);

    this.color = 'red';
}

FPSLogger.prototype = Object.create(BaseFPSLogger.prototype);
FPSLogger.prototype.constructor = FPSLogger;

/**
 * Log
 */
FPSLogger.prototype.log = function()
{
    BaseFPSLogger.prototype.log.call(this);

    this.color = this.getColor();

    this.emit('fps');
};

/**
 * Get color
 *
 * @return {String}
 */
FPSLogger.prototype.getColor = function()
{
    return this.frequency >= 55 ? 'green' : (this.frequency > 40 ? 'orange' : 'red');
};
