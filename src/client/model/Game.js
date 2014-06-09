console.log(BaseGame);

/**
 * Game
 */
function Game()
{
    BaseGame.prototype.call(this);

    this.canvas = document.createElement('canvas');

    this.loop = this.loop.bind(this);

    this.canvas.setAttribute('resize', true);
    document.body.appendChild(this.canvas);
    paper.setup(this.canvas);
}

Game.prototype = Object.create(BaseGame.prototype);

/**
 * Draw
 */
Game.prototype.draw = function()
{
    paper.view.draw();
};

/**
 * Stop loop
 */
Game.prototype.stop = function()
{
    if (this.frame) {
        window.cancelAnimationFrame(this.frame);
        this.frame = null;
    }
};

/**
 * Get new frame
 */
BaseGame.prototype.newFrame = function()
{
    this.frame = window.requestAnimationFrame(this.loop);
};

/**
 * On frame
 *
 * @param {Number} step
 */
BaseGame.prototype.onFrame = function(step)
{
    BaseGame.prototype.onFrame.call(step);
    this.draw(step);
};