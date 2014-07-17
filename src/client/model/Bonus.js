/**
 * Bonus
 *
 * @param {Number} id
 * @param {Array} position
 * @param {String} type
 * @param {String} affect
 * @param {Number} radius
 */
function Bonus(id, position, type, affect, radius)
{
    BaseBonus.call(this, position);

    this.id     = id;
    this.type   = type;
    this.affect = affect;
    this.radius = radius;
    this.canvas = new Canvas();

    this.position[0] = this.position[0] - this.radius;
    this.position[1] = this.position[1] - this.radius;
}

Bonus.prototype = Object.create(BaseBonus.prototype);
Bonus.prototype.constructor = Bonus;

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
    var middle = this.canvas.element.width/2,
        iconWidth = this.canvas.element.width,
        iconMiddle = middle - iconWidth/2;

    this.canvas.drawImage(this.assets[this.type], [iconMiddle, iconMiddle], iconWidth, iconWidth);
};

/**
 * Clear
 */
Bonus.prototype.clear = function()
{
    this.canvas.clear();

    BaseBonus.prototype.clear.call(this);
};