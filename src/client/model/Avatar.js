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

    if (this.local) {
        this.input = new PlayerInput(this, player.getBinding());
    }

    this.drawHead();
    this.drawArrow();
}

Avatar.prototype = Object.create(BaseAvatar.prototype);

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
 * Draw head
 */
Avatar.prototype.drawHead = function()
{
    var middle = this.canvas.element.width/2;

    this.canvas.drawCircle([middle, middle], middle - 1, this.color);
};

/**
 * Draw arrow
 */
Avatar.prototype.drawArrow = function()
{
    this.arrow.drawLine([[65, 50], [95, 50]], 2, this.color);
    this.arrow.drawLine([[85, 40], [95, 50], [85, 60]], 2, this.color);
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