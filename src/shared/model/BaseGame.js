/**
 * BaseGame
 */
function BaseGame()
{
    this.frame   = null;
    this.players = new Collection([], 'name');
}

/**
 * Update
 *
 * @param {Number} step
 */
BaseGame.prototype.update = function(step)
{
    for (var i = this.players.ids.length - 1; i >= 0; i--) {
        this.players.items[i].update(step);
    }
};

/**
 * Add a player to the game
 *
 * @param {Player} player
 */
BaseGame.prototype.addPlayer = function(player)
{
    return this.players.add(player);
};

/**
 * Remove a player from the game
 *
 * @param {Player} player
 */
BaseGame.prototype.removePlayer = function(player)
{
    return this.players.remove(player);
};

/**
 * Start loop
 */
BaseGame.prototype.start = function()
{
    if (!this.frame) {
        this.rendered = new Date().getTime();
        this.loop();
    }
};

/**
 * Stop loop
 */
BaseGame.prototype.stop = function()
{
    if (this.frame) {
        clearTimeout(this.frame);
        this.frame = null;
    }
};

/**
 * Animation loop
 */
BaseGame.prototype.loop = function()
{
    this.newFrame();

    var now = new Date().getTime(),
        step = now - this.rendered;

    this.rendered = now;

    this.onFrame();
};

/**
 * Get new frame
 */
BaseGame.prototype.newFrame = function()
{
    this.frame = setTimeout(this.loop.bind(this), this.framerate * 1000);
};

/**
 * On frame
 *
 * @param {Number} step
 */
BaseGame.prototype.onFrame = function(step)
{
    this.update();
};