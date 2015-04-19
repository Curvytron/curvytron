/**
 * Game
 *
 * @param {Room} room
 */
function Game(room)
{
    BaseGame.call(this, room);

    this.render     = document.getElementById('render');
    this.canvas     = new Canvas(0, 0, document.getElementById('game'));
    this.background = new Canvas(0, 0, document.getElementById('background'));
    this.effect     = new Canvas(0, 0, document.getElementById('effect'));
    this.animations = [];

    this.onResize = this.onResize.bind(this);
    this.onDie    = this.onDie.bind(this);

    window.addEventListener('error', this.stop);
    window.addEventListener('resize', this.onResize);

    for (var avatar, i = this.avatars.items.length - 1; i >= 0; i--) {
        this.avatars.items[i].on('die', this.onDie);
    }

    this.onResize();
}

Game.prototype = Object.create(BaseGame.prototype);
Game.prototype.constructor = Game;

/**
 * Margin between player an bonus stack
 *
 * @type {Number}
 */
Game.prototype.stackMargin = 15;

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
 * On start
 */
Game.prototype.onStart = function()
{
    this.effect.clear();
    BaseGame.prototype.onStart.call(this);
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
    var maxScore = this.maxScore;

    return this.avatars.match(function () { return this.score >= maxScore; }) !== null;
};

/**
 * Are all avatars ready?
 *
 * @return {Boolean}
 */
Game.prototype.isReady = function()
{
    return this.started ? true : BaseGame.prototype.isReady.call(this);
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
        this.effect.clear();
    }
};

/**
 * Update size
 */
Game.prototype.setSize = function()
{
    BaseGame.prototype.setSize.call(this);

    this.onResize();
};

/**
 * Draw
 *
 * @param {Number} step
 */
Game.prototype.draw = function()
{
    if (!this.frame) {
        this.effect.clear();
    }

    for (var animation, a = this.animations.length - 1; a >= 0; a--) {
        animation = this.animations[a];
        animation.draw(this.effect);
        if (animation.done && animation.cleared) {
            this.animations.splice(a, 1);
        }
    }

    for (var avatar, i = this.avatars.items.length - 1; i >= 0; i--) {
        avatar = this.avatars.items[i];
        if (avatar.present) {
            this.drawTail(avatar);
            this.clearAvatar(avatar);
            this.clearBonusStack(avatar);
            this.drawAvatar(avatar);
            this.drawBonusStack(avatar);

            if (!this.frame && avatar.local) {
                this.drawArrow(avatar);
            }
        }
    }

    this.bonusManager.draw();
};

/**
 * Draw tail
 *
 * @param {Avatar} avatar
 */
Game.prototype.drawTail = function(avatar)
{
    var points = avatar.trail.getLastSegment();

    if (points) {
        this.background.drawLineScaled(points, avatar.width, avatar.color);
    }
};

/**
 * Draw avatar
 *
 * @param {Avatar} avatar
 */
Game.prototype.drawAvatar = function(avatar)
{
    avatar.updateStart();
    this.canvas.drawImage(avatar.canvas.element, avatar.startX, avatar.startY, avatar.angle);
};

/**
 * Clear bonus from the canvas
 *
 * @param {Bonus} bonus
 */
Game.prototype.clearAvatar = function(avatar)
{
    this.canvas.clearZone(avatar.startX, avatar.startY, avatar.canvas.element.width, avatar.canvas.element.height);
};

/**
 * Clear bonus stack
 *
 * @param {Avatar} avatar
 */
Game.prototype.clearBonusStack = function(avatar)
{
    if (avatar.bonusStack.lastWidth) {
        this.canvas.clearZone(
            avatar.startX + this.stackMargin,
            avatar.startY + this.stackMargin,
            avatar.bonusStack.lastWidth,
            avatar.bonusStack.lastHeight
        );
    }
};


/**
 * Draw bonus stack
 *
 * @param {Avatar} avatar
 */
Game.prototype.drawBonusStack = function(avatar)
{
    if (avatar.alive && avatar.hasBonus()) {
        avatar.bonusStack.lastWidth  = avatar.bonusStack.canvas.element.width;
        avatar.bonusStack.lastHeight = avatar.bonusStack.canvas.element.height;

        this.canvas.drawImage(
            avatar.bonusStack.canvas.element,
            avatar.startX + this.stackMargin,
            avatar.startY + this.stackMargin
        );
    }
};

/**
 * Draw arrow
 *
 * @param {Avatar} avatar
 */
Game.prototype.drawArrow = function(avatar)
{
    this.effect.drawImageScaled(avatar.arrow.element, avatar.head[0] - 5, avatar.head[1] - 5, 10, 10, avatar.angle);
};

/**
 * Clear background with color
 */
Game.prototype.clearBackground = function()
{
    this.background.color(this.backgroundColor);
};

/**
 * On die
 *
 * @param {Event} event
 */
Game.prototype.onDie = function(event)
{
    this.animations.push(new Explode(event.detail));
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

    for (var i = this.avatars.items.length - 1; i >= 0; i--) {
        avatar = this.avatars.items[i];

        avatar.setScale(scale);

        if (typeof(avatar.input) !== 'undefined') {
            avatar.input.setWidth(x);
        }
    }

    this.render.style.width  = (width + 8) + 'px';
    this.render.style.height = (width + 8) + 'px';
    this.canvas.setDimension(width, width, scale);
    this.effect.setDimension(width, width, scale);
    this.background.setDimension(width, width, scale, true);
    this.bonusManager.setDimension(width, scale);
    this.draw();
};
