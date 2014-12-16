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
    this.spectate   = false;

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
 * On round new
 */
Game.prototype.onRoundNew = function()
{
    BaseGame.prototype.onRoundNew.call(this);

    this.clearBackground();
    this.draw();
};

/**
 * On stop
 */
Game.prototype.onStop = function()
{
    BaseGame.prototype.onStop.call(this);
    this.clearBackground();
    this.draw();
};

/**
 * Is tie break
 *
 * @return {Boolean}
 */
Game.prototype.isTieBreak = function()
{
    for (var i = this.avatars.length - 1; i >= 0; i--) {
        if (this.avatars[i].score >= maxScore) {
            return true;
        }
    }

    return false;
};

/**
 * Clear trails
 */
Game.prototype.clearTrails = function()
{
    this.clearBackground();
};

/**
 * End
 */
Game.prototype.end = function()
{
    if (this.started) {
        this.started = false;

        window.removeEventListener('error', this.stop);
        window.removeEventListener('resize', this.onResize);

        this.stop();
        this.fps.stop();
        this.canvas.clear();
    }
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

        if (avatar.present) {
            points = avatar.trail.getLastSegment();
            if (points) {
                this.background.drawLineScaled(points, avatar.width, avatar.color);
            }
        }
    }

    this.canvas.drawImage(this.background.element, [0, 0]);

    for (i = this.avatars.items.length - 1; i >= 0; i--) {
        avatar = this.avatars.items[i];

        if (avatar.present) {
            this.canvas.drawImage(avatar.canvas.element, avatar.start, avatar.angle);

            if (avatar.alive && avatar.hasBonus()) {
                this.canvas.drawImage(avatar.bonusStack.canvas.element, [avatar.start[0] + 15, avatar.start[1] + 15]);
            }

            if (!this.frame && (this.spectate || avatar.local)) {
                width = 10;
                position = [avatar.head[0] - width/2, avatar.head[1] - width/2];
                this.canvas.drawImageScaled(avatar.arrow.element, position, width, width, avatar.angle);
            }

            if (avatar.animation) {
                avatar.animation.draw(this.canvas);
            }
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
 * Set spectate
 *
 * @param {Boolean} spectate
 */
Game.prototype.setSpectate = function(spectate)
{
    this.spectate = spectate;
};

/**
 * On resize
 */
Game.prototype.onResize = function()
{
    var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;

    var width = Math.min(x - document.getElementById('game-infos').clientWidth - 8, y - 8),
        scale = width / this.size,
        avatar;

    for (i = this.avatars.items.length - 1; i >= 0; i--) {
        avatar = this.avatars.items[i];

        avatar.setScale(scale);

        if (avatar.local) {
            avatar.input.setWidth(x);
        }
    }

    this.canvas.setDimension(width, width, scale);
    this.background.setDimension(width, width, scale, true);
    this.draw();
};
