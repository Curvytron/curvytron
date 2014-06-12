/**
 * Game
 *
 * @param {Room} room
 */
function Game(room)
{
    this.canvas = document.getElementById('game');

    //this.canvas.setAttribute('resize', true);
    paper.setup(this.canvas);

    console.log("paper set up", this.canvas);

    BaseGame.call(this, room);

    this.loop = this.loop.bind(this);
    this.stop = this.stop.bind(this);

    window.addEventListener('error', this.stop);
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
 * Start loop
 */
Game.prototype.start = function()
{
    for (var i = this.avatars.ids.length - 1; i >= 0; i--) {
        this.avatars.items[i].trail.initPath();
    }

    BaseGame.prototype.start.call(this);
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
