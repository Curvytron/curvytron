/**
 * FPS Logger
 */
function FPSLogger(element)
{
    this.fps     = 0;
    this.element = typeof(element) != 'undefined' ? element : null;

    this.update = this.update.bind(this);
    this.clear  = this.clear.bind(this);

    setInterval(this.clear, 1000);
}

/**
 * Update
 *
 * @param {Number} step
 */
FPSLogger.prototype.update = function(step)
{
    var fps = step > 0 ? 1000/step : 60;

    this.fps = ~~ (0.5 + (this.fps ? (this.fps + fps)/2 : fps));
};

/**
 * Clear
 */
FPSLogger.prototype.clear = function()
{
    this.draw();

    this.fps = 0;
};

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
 * Draw FPS
 */
FPSLogger.prototype.draw = function()
{
    if (this.element) {
        this.element.innerHTML = this.fps;
    } else {
        console.log('FPS: %s', this.fps);
    }
};