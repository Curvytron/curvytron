/**
 * Avatar
 *
 * @param {Player} player
 */
function Avatar(player)
{
    BaseAvatar.call(this, player);

    this.local      = player.local;
    this.canvas     = new Canvas(100, 100);
    this.arrow      = new Canvas(this.arrowSize, this.arrowSize);
    this.width      = this.radius * 2;
    this.clearWidth = this.canvas.element.width;
    this.startX     = 0;
    this.startY     = 0;

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
    if (!this.changed) {
        this.updateAngle(step);
        this.updatePosition(step);
    }

    var width = this.canvas.element.width/2;

    this.startX  = this.canvas.round(this.head[0] * this.canvas.scale - width);
    this.startY  = this.canvas.round(this.head[1] * this.canvas.scale - width);
    this.changed = false;
};

/**
 * Set position (from server)
 *
 * @param {Array} point
 */
Avatar.prototype.setPositionFromServer = function(point)
{
    BaseAvatar.prototype.setPosition.call(this, point);

    this.changed = true;

    if (this.printing) {
        this.addPoint(point);
    }
};

/**
 * Set scale
 *
 * @param {Number} scale
 */
Avatar.prototype.setScale = function(scale)
{
    var width = this.width * scale;

    if (width !== this.canvas.element.width) {
        this.canvas.setDimension(width, width, scale);
        this.clearWidth = this.canvas.element.width;
        this.changed    = true;
        this.drawHead();
    }
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
    this.addPoint(this.head);
    this.emit('die', this);
};

/**
 * Draw head
 */
Avatar.prototype.drawHead = function()
{
    var middle = this.canvas.element.width/2;

    this.canvas.clear();
    this.canvas.drawCircle(middle, middle, this.radius * this.canvas.scale, this.color);
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
