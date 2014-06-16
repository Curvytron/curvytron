/**
 * FPS Logger
 */
function FPSLogger()
{
    this.fps = 0;

    this.clear = this.clear.bind(this);

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

    this.fps = this.fps ? (this.fps + fps)/2 : fps;
};

/**
 * Clear
 */
FPSLogger.prototype.clear = function()
{
    console.log(this.fps);
    this.fps = 0;
};