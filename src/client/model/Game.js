/**
 * Game
 *
 * @param {Room} room
 */
function Game(room)
{
    this.canvas = document.getElementById('game');

    paper.setup(this.canvas);
    paper.sceneScale = Math.min(paper.view.viewSize.width, paper.view.viewSize.height) / (room.players.count() * this.perPlayerSize);

    console.log(paper.view.size, paper.view.viewSize, paper.sceneScale);

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
