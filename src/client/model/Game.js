/**
 * Game
 *
 * @param {Room} room
 */
function Game(room)
{
    BaseGame.call(this, room);

    this.canvas     = new Canvas(0, 0, document.getElementById('game'));
    this.background = new Canvas(0, 0);

    this.onResize = this.onResize.bind(this);

    window.addEventListener('error', this.stop);
    window.addEventListener('resize', this.onResize);

    this.onResize();
}

Game.prototype = Object.create(BaseGame.prototype);
Game.prototype.constructor = Game;

/**
 * Background color
 *
 * @type {String}
 */
Game.prototype.backgroundColor = '#222222';

/**
 * Get new frame
 */
Game.prototype.newFrame = function()
{
    this.frame = window.requestAnimationFrame(this.loop);
};

/**
 * Clear frame
 */
Game.prototype.clearFrame = function()
{
    window.cancelAnimationFrame(this.frame);
    this.frame = null;
};

/**
 * On frame
 *
 * @param {Number} step
 */
Game.prototype.onFrame = function(step)
{
    this.draw();
    BaseGame.prototype.onFrame.call(this, step);
};

/**
 * New round
 */
Game.prototype.newRound = function()
{
    BaseGame.prototype.newRound.call(this);

    this.clearBackground();
    this.draw();

    for (var i = this.avatars.items.length - 1; i >= 0; i--) {
        this.avatars.items[i].clear();
    }
};

/**
 * End round
 */
Game.prototype.endRound = function()
{
    BaseGame.prototype.endRound.call(this);
    this.clearBackground();
    this.draw();

    for (var i = this.avatars.items.length - 1; i >= 0; i--) {
        this.avatars.items[i].clear();
    }
};

/**
 * FIN DU GAME
 */
Game.prototype.end = function()
{
    BaseGame.prototype.end.call(this);

    for (var i = this.avatars.ids.length - 1; i >= 0; i--) {
        this.avatars.items[i].clear();
    }
};

/**
 * Remove a avatar from the game
 *
 * @param {Avatar} avatar
 */
Game.prototype.removeAvatar = function(avatar)
{
    avatar.destroy();
    this.draw();

    return BaseGame.prototype.removeAvatar.call(this, avatar);
};

/**
 * Draw
 *
 * @param {Number} step
 */
Game.prototype.draw = function()
{
    var i, avatar, width, position, points;

    for (i = this.avatars.items.length - 1; i >= 0; i--) {
        avatar = this.avatars.items[i];
        points = avatar.trail.getLastSegment();
        if (points) {
            this.background.drawLineScaled(points, avatar.width, avatar.color);
        }
    }

    this.canvas.drawImage(this.background.element, [0, 0]);

    for (i = this.avatars.items.length - 1; i >= 0; i--) {
        avatar = this.avatars.items[i];

        this.canvas.drawImage(avatar.canvas.element, avatar.start, avatar.angle);

        if (avatar.local && !this.running) {
            width = 10;
            position = [avatar.head[0] - width/2, avatar.head[1] - width/2];
            this.canvas.drawImageScaled(avatar.arrow.element, position, width, width, avatar.angle);
        }
    }

    this.bonusManager.draw(this.canvas);
};

/**
 * Clear background with color
 */
Game.prototype.clearBackground = function()
{
    this.background.color(this.backgroundColor);
};

/**
 * On resize
 */
Game.prototype.onResize = function()
{
    var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;

    var width = Math.min(x - 300 - 8, y - 8),
        scale = width / this.size;

    for (i = this.avatars.items.length - 1; i >= 0; i--) {
        this.avatars.items[i].setScale(scale);
    }

    this.bonusManager.setScale(scale);
    this.canvas.setDimension(width, width, scale);
    this.background.setDimension(width, width, scale, true);
    this.draw();
};
