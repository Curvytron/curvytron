/**
 * Avatar
 *
 * @param {Player} player
 */
function Avatar(player)
{
    BaseAvatar.call(this, player);

    this.local  = player.local;
    this.canvas = new Canvas(100, 100);
    this.arrow  = new Canvas(100, 100);
    this.start  = new Array(2);
    this.radius = this.radius * this.radiusMargin;
    this.width  = this.radius * 2;

    if (this.local) {
        this.input = new PlayerInput(this, player.getBinding());
    }

    this.drawArrow();
}

Avatar.prototype = Object.create(BaseAvatar.prototype);
Avatar.prototype.constructor = Avatar;

/**
 * Radius margin
 *
 * @type {Number}
 */
Avatar.prototype.radiusMargin = 1.15;

/**
 * Arrao width
 *
 * @type {Number}
 */
Avatar.prototype.arrowWidth = 3;

/**
 * Set position
 *
 * @param {Array} point
 */
Avatar.prototype.setPosition = function(point)
{
    BaseAvatar.prototype.setPosition.call(this, point);

    this.updateStart();

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
    this.updateStart();
    this.drawHead();
};

/**
 * Set radius
 *
 * @param {Number} radius
 */
Avatar.prototype.setRadius = function(radius)
{
    this.radius = radius * this.radiusMargin;
    this.width  = this.radius * 2;

    this.setScale(this.canvas.scale);
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
 * Draw head
 */
Avatar.prototype.drawHead = function()
{
    var middle = this.canvas.element.width/2;

    this.canvas.clear();
    this.canvas.drawCircle([middle, middle], this.radius * this.canvas.scale, this.color);
};

/**
 * Draw arrow
 */
Avatar.prototype.drawArrow = function()
{
    this.arrow.clear();
    this.arrow.drawLine([[65, 50], [95, 50]], this.arrowWidth, this.color);
    this.arrow.drawLine([[85, 40], [95, 50], [85, 60]], this.arrowWidth, this.color);
};

/**
 * Update drawing start point
 */
Avatar.prototype.updateStart = function()
{
    this.start = [
        this.head[0] * this.canvas.scale - this.canvas.element.width/2,
        this.head[1] * this.canvas.scale - this.canvas.element.width/2
    ];
};

/**
 * Clear
 */
Avatar.prototype.clear = function()
{
    BaseAvatar.prototype.clear.call(this);
    this.setRadius(Avatar.prototype.radius);
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
        throw "Unknown setter " + method;
    }
};