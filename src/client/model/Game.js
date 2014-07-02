/**
 * Game
 *
 * @param {Room} room
 */
function Game(room)
{
    BaseGame.call(this, room);

    this.canvas     = new Canvas(0, 0, document.getElementById('game'));
    this.background = new Canvas(0, 0, document.getElementById('game'));

    this.onResize = this.onResize.bind(this);

    this.onResize();

    window.addEventListener('error', this.stop);
    window.addEventListener('resize', this.onResize);

    this.draw();
}

Game.prototype = Object.create(BaseGame.prototype);

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
    console.log('clearFrame');
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

    for (var i = this.avatars.ids.length - 1; i >= 0; i--) {
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
    var i, trail, avatar, width, position, points;

    this.canvas.clear();

    for (i = this.avatars.items.length - 1; i >= 0; i--) {
        avatar = this.avatars.items[i];
        points = avatar.trail.getLastSegment();
        if (points) {
            this.background.drawLine(points, avatar.radius/2, avatar.color);
        }
    }

    this.canvas.drawImage(this.background.element, [0, 0]);

    for (i = this.avatars.items.length - 1; i >= 0; i--) {
        avatar = this.avatars.items[i];
        width  = avatar.radius * 2;

        this.canvas.drawImageScaled(avatar.draw(), avatar.head, width, width, avatar.angle);

        //if (!this.running) {
            width = 10;
            position = [avatar.head[0] + avatar.radius - width/2, avatar.head[1] + avatar.radius - width/2];
            this.canvas.drawImageScaled(avatar.arrow.element, position, width, width, avatar.angle);
        //}
    }
};

/**
 * On resize
 */
Game.prototype.onResize = function()
{
    var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;

    var width = Math.min(x - 300 - 8, y - 8),
        scale = width / this.size;

    console.log(width,scale);
    this.canvas.setDimension(width, width, scale);
    this.background.setDimension(width, width, scale);
};
