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
    this.path   = new paper.Shape.Circle({
        center: new paper.Point(this.position[0] * paper.sceneScale, this.position[1] * paper.sceneScale),
        radius: this.radius * paper.sceneScale,
        fillColor: this.color,
        fullySelected: false
    });
}

Bonus.prototype = Object.create(BaseBonus.prototype);

/**
 * Clear
 */
Bonus.prototype.clear = function()
{
    this.path.remove();

    BaseBonus.prototype.clear.call(this);
};