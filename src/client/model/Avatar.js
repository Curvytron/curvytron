/**
 * Avatar
 *
 * @param {Player} player
 */
function Avatar(player)
{
    BaseAvatar.call(this, player);

    this.local        = player.local;
    this.canvas       = new Canvas(100, 100);
    this.arrow        = new Canvas(this.arrowSize, this.arrowSize);
    this.width        = this.radius * 2;
    this.canvasWidth  = this.canvas.element.width;
    this.canvasRadius = this.canvasWidth/2;
    this.clearWidth   = this.canvasWidth;
    this.startX       = 0;
    this.startY       = 0;
    this.clearX       = 0;
    this.clearY       = 0;
    this.elements     = {
        root: null,
        roundScore: null,
        score: null
    };

    if (this.local) {
        this.input = new PlayerInput(this, player.getBinding());
    }

    this.drawArrow();
}

Avatar.prototype = Object.create(BaseAvatar.prototype);
Avatar.prototype.constructor = Avatar;

/**
 * Array width
 *
 * @type {Number}
 */
Avatar.prototype.arrowWidth = 3;

/**
 * Arrow canvas size
 *
 * @type {Number}
 */
Avatar.prototype.arrowSize = 200;

/**
 * Update
 *
 * @param {Number} step
 */
Avatar.prototype.update = function(step)
{
    if (!this.changed && this.alive) {
        this.updateAngle(step);
        this.updatePosition(step);
    }

    this.startX  = this.canvas.round(this.x * this.canvas.scale - this.canvasRadius);
    this.startY  = this.canvas.round(this.y * this.canvas.scale - this.canvasRadius);
    this.changed = false;
};

/**
 * Set position (from server)
 *
 * @param {Number} x
 * @param {Number} y
 */
Avatar.prototype.setPositionFromServer = function(x, y)
{
    BaseAvatar.prototype.setPosition.call(this, x, y);

    this.changed = true;

    if (this.printing) {
        this.addPoint(x, y);
    }
};

/**
 * Set scale
 *
 * @param {Number} scale
 */
Avatar.prototype.setScale = function(scale)
{
    var width = Math.ceil(this.width * scale);
    this.canvas.setDimension(width, width, scale);
    this.changed      = true;
    this.canvasWidth  = this.canvas.element.width;
    this.canvasRadius = this.canvas.element.width/2;
    this.drawHead();
};

/**
 * Set radius
 *
 * @param {Number} radius
 */
Avatar.prototype.setRadius = function(radius)
{
    BaseAvatar.prototype.setRadius.call(this, radius);
    this.updateWidth();
    this.drawHead();
};

/**
 * Set color
 *
 * @param {String} color
 */
Avatar.prototype.setColor = function(color)
{
    BaseAvatar.prototype.setColor.call(this, color);
    this.drawHead();
};

/**
 * Set score
 *
 * @param {Number} score
 */
Avatar.prototype.setScore = function(score)
{
    var diff = score - this.score;

    BaseAvatar.prototype.setScore.call(this, score);

    this.roundScore = diff;
};

/**
 * Die
 */
Avatar.prototype.die = function()
{
    BaseAvatar.prototype.die.call(this);
    this.emit('die', this);
};

/**
 * Draw head
 */
Avatar.prototype.drawHead = function()
{
    this.canvas.clear();
    this.canvas.drawCircle(
        this.canvasRadius,
        this.canvasRadius,
        this.radius * this.canvas.scale,
        this.color
    );
};

/**
 * Draw arrow
 */
Avatar.prototype.drawArrow = function()
{
    var arrowLines = [
        [[this.arrowSize * 0.65, this.arrowSize * 0.5], [this.arrowSize * 0.95, this.arrowSize * 0.5]],
        [[this.arrowSize * 0.85, this.arrowSize * 0.4], [this.arrowSize * 0.95, this.arrowSize * 0.5], [this.arrowSize * 0.85, this.arrowSize * 0.6]]
    ];

    this.arrow.clear();

    for (var i = arrowLines.length - 1; i >= 0; i--) {
        this.arrow.drawLine(arrowLines[i], this.arrowSize * this.arrowWidth/100, this.color, 'round');
    }
};

/**
 * Update width
 */
Avatar.prototype.updateWidth = function()
{
    this.width = this.radius * 2;
    this.setScale(this.canvas.scale);
};

/**
 * Destroy
 */
Avatar.prototype.destroy = function()
{
    this.trail.clear();
    this.canvas.clear();
    this.arrow.clear();

    if (this.input) {
        this.input.detachEvents();
        this.input = null;
    }

    BaseAvatar.prototype.destroy.call(this);
};

/**
 * Clear
 */
Avatar.prototype.clear = function()
{
    BaseAvatar.prototype.clear.call(this);
    this.updateWidth();
    this.drawHead();
};

/**
 * Set
 *
 * @param {String} property
 * @param {Object} value
 */
Avatar.prototype.set = function(property, value)
{
    var method = 'set' + property[0].toUpperCase() + property.slice(1);

    if (typeof(this[method]) !== 'undefined') {
        this[method](value);
    } else {
        throw 'Unknown setter ' + method;
    }
};

/**
 * Has bonus
 *
 * @return {Boolean}
 */
Avatar.prototype.hasBonus = function()
{
    return !this.bonusStack.bonuses.isEmpty();
};
