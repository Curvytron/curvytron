/**
 * FPS Logger
 */
function FPSLogger()
{
    BaseFPSLogger.call(this);
}

FPSLogger.prototype = Object.create(BaseFPSLogger.prototype);
FPSLogger.prototype.constructor = FPSLogger;
