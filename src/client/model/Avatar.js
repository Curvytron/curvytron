/**
 * Avatar
 *
 * @param {Player} player
 */
function Avatar(player)
{
    BaseAvatar.call(this, player);

    this.local     = player.local;
    this.canvas    = new Canvas(100, 100);
    this.arrow     = new Canvas(this.arrowSize, this.arrowSize);
    this.startX    = 0;
    this.startY    = 0;
    this.width     = this.radius * 2;
    this.animation = null;

    if (this.local) {
        this.input = new PlayerInput(this, player.getBinding());
    }

    this.clearAnimation = this.clearAnimation.bind(this);

    this.drawArrow();
}

Avatar.prototype = Object.create(BaseAvatar.prototype);
Avatar.prototype.constructor = Avatar;

/**
 * Arrao width
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
 * Set position
 *
 * @param {Array} point
 */
Avatar.prototype.setPosition = function(point)
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

    this.canvas.setDimension(width, width, scale);
    this.changed = true;
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

    setTimeout(this.clearAnimation, Explode.prototype.duration);
    this.animation = new Explode(this);
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
        this.arrow.drawLine(arrowLines[i], this.arrowSize * this.arrowWidth/100, this.color);
    }
};

/**
 * Update drawing start point
 */
Avatar.prototype.updateStart = function()
{
    if (this.changed) {
        this.changed = false;
        this.startX  = this.head[0] * this.canvas.scale - this.canvas.element.width/2;
        this.startY  = this.head[1] * this.canvas.scale - this.canvas.element.width/2;
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
    this.clearAnimation();
};

/**
 * Clear animation
 */
Avatar.prototype.clearAnimation = function ()
{
    this.animation = null;
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
