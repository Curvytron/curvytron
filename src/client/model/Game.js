/**
 * Game
 *
 * @param {Room} room
 */
function Game(room)
{
    BaseGame.call(this, room);

    this.canvas = document.createElement('canvas');

    this.loop = this.loop.bind(this);

    this.canvas.setAttribute('resize', true);
    document.body.appendChild(this.canvas);
    paper.setup(this.canvas);
    console.log("paper set up");
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
Game.prototype.newFrame = function()
{
    this.frame = window.requestAnimationFrame(this.loop);
};

/**
 * On frame
 *
 * @param {Number} step
 */
Game.prototype.onFrame = function(step)
{
    BaseGame.prototype.onFrame.call(this, step);
    this.draw(step);
};