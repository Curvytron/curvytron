/**
 * FPS Logger
 */
function FPSLogger(element)
{
    this.element = element;

    BaseFPSLogger.call(this);
}

FPSLogger.prototype = Object.create(BaseFPSLogger.prototype);
FPSLogger.prototype.constructor = FPSLogger;

/**
 * Set element
 *
 * @param {DOMElement} element
 */
FPSLogger.prototype.setElement = function(element)
{
    this.element = element;
};

/**
 * Log
 */
FPSLogger.prototype.log = function()
{
    this.draw();

    BaseFPSLogger.prototype.log.call(this);
};

/**
 * Draw FPS
 */
FPSLogger.prototype.draw = function()
{
    this.element.innerHTML = this.value + 'fps';
};
