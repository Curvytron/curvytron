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
    this.radius = this.radius * this.radiusMargin;
    this.width  = this.radius * 2;

    if (this.local) {
        this.input = new PlayerInput(this, player.getBinding());
    }

    this.drawHead();
    this.drawArrow();
}

Avatar.prototype = Object.create(BaseAvatar.prototype);

/**
 * Radius margin
 *
 * @type {Number}
 */
Avatar.prototype.radiusMargin = 1.1;

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
    this.head[0] = point[0] - this.radius;
    this.head[1] = point[1] - this.radius;

    if (this.printing) {
        this.trail.addPoint(point);
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

    this.canvas.setDimension(width, width);
    this.drawHead();
};

/**
 * Draw head
 */
Avatar.prototype.drawHead = function()
{
    var middle = this.canvas.element.width/2;

    this.canvas.drawCircle([middle, middle], middle, this.color);
};

/**
 * Draw arrow
 */
Avatar.prototype.drawArrow = function()
{
    this.arrow.drawLine([[65, 50], [95, 50]], this.arrowWidth, this.color);
    this.arrow.drawLine([[85, 40], [95, 50], [85, 60]], this.arrowWidth, this.color);
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