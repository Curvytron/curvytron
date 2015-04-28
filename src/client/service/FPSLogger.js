/**
 * FPS Logger
 */
function FPSLogger()
{
    BaseFPSLogger.call(this);
}

FPSLogger.prototype = Object.create(BaseFPSLogger.prototype);
FPSLogger.prototype.constructor = FPSLogger;

/**
 * Load FPS
 */
FPSLogger.prototype.log = function()
{
    BaseFPSLogger.prototype.log.call(this);
    this.emit('fps', this.frequency);
};
