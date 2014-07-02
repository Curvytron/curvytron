/**
 * Bonus
 *
 * @param {Number} id
 * @param {Array} position
 * @param {String} type
 * @param {String} color
 * @param {Number} radius
 */
function Bonus(id, position, type, color, radius)
{
    BaseBonus.call(this, position);

    this.id     = id;
    this.type   = type;
    this.color  = color;
    this.radius = radius;
    this.canvas = new Canvas(100, 100);

    this.position[0] = this.position[0] - this.radius;
    this.position[1] = this.position[1] - this.radius;
}

Bonus.prototype = Object.create(BaseBonus.prototype);

/**
 * Set scale
 *
 * @param {Number} scale
 */
Bonus.prototype.setScale = function(scale)
{
    var width = Math.ceil(this.radius * 2 * scale);

    this.canvas.setDimension(width, width);
    this.draw();
};

/**
 * Draw
 */
Bonus.prototype.draw = function()
{
    var middle = this.canvas.element.width/2;

    this.canvas.drawCircle([middle, middle], middle, this.color);
};

/**
 * Clear
 */
Bonus.prototype.clear = function()
{
    this.canvas.clear();

    BaseBonus.prototype.clear.call(this);
};