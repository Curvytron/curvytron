/**
 * BaseGame
 *
 * @param {Room} room
 */
function BaseGame(room)
{
    this.room    = room;
    this.frame   = null;
    this.avatars = this.room.players.map(function () { return new Avatar(this); });
    console.log(this.room.players, this.avatars);
}

/**
 * Update
 *
 * @param {Number} step
 */
BaseGame.prototype.update = function(step)
{
    for (var i = this.avatars.ids.length - 1; i >= 0; i--) {
        this.avatars.items[i].update(step);
    }
};

/**
 * Remove a avatar from the game
 *
 * @param {Avatar} avatar
 */
BaseGame.prototype.removeAvatar = function(avatar)
{
    return this.avatars.remove(avatar);
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

/**
 * Serialize
 *
 * @return {Object}
 */
BaseGame.prototype.serialize = function()
{
    return {
        name: this.name,
        players: this.avatars.map(function () { return this.player.serialize(); }).items
    };
};