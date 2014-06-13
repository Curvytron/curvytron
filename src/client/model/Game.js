/**
 * Game
 *
 * @param {Room} room
 */
function Game(room)
{
    this.canvas = document.getElementById('game');

    paper.setup(this.canvas);

    BaseGame.call(this, room);

    window.addEventListener('error', this.stop);
}

Game.prototype = Object.create(BaseGame.prototype);

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

    paper.view.draw();
};
