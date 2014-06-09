/**
 * Game
 */
function Game()
{
    this.canvas   = document.createElement('canvas');
    this.rendered = new Date().getTime();
    this.frame    = null;
    this.players  = [];

    this.loop = this.loop.bind(this);

    this.canvas.setAttribute('resize', true);
    document.body.appendChild(this.canvas);
    paper.setup(this.canvas);

    this.addPlayer(new Player('red'));

    this.start();

    setTimeout(this.stop.bind(this), 5000);
}

/**
 * Draw
 *
 * @param {Number} step
 */
Game.prototype.draw = function()
{
    paper.view.draw();
};

/**
 * Update
 *
 * @param {Number} step
 */
Game.prototype.update = function(step)
{
    for (var i = this.players.length - 1; i >= 0; i--) {
        this.players[i].update(step);
    }
};

/**
 * Add a player to the game
 *
 * @param {Player} player
 */
Game.prototype.addPlayer = function(player)
{
    this.players.push(player);
};

/**
 * Start loop
 */
Game.prototype.start = function()
{
    if (!this.frame) {
        this.loop();
    }
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
 * Animation loop
 */
Game.prototype.loop = function()
{
    this.frame = window.requestAnimationFrame(this.loop);

    var now = new Date().getTime(),
        step = now - this.rendered;

    this.rendered = now;

    this.draw();
    this.update(step);
};