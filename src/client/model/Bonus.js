/**
 * Bonus
 *
 * @param color
 * @param radius
 */
function Bonus(name, color, radius)
{
    BaseBonus.call(this, name, color, radius);

    this.path = null;
}

Bonus.prototype = Object.create(BaseBonus.prototype);

/**
 * Create path
 */
Bonus.prototype.createPath = function()
{
    this.path = new paper.Shape.Circle({
        center: new paper.Point(this.position[0] * paper.sceneScale, this.position[1] * paper.sceneScale),
        radius: this.radius * paper.sceneScale,
        fillColor: this.color,
        fullySelected: false
    });
};

/**
 * Pop
 */
Bonus.prototype.pop = function()
{
    BaseBonus.prototype.pop.call(this)

    this.createPath();
};

/**
 * Clear
 */
Bonus.prototype.clear = function()
{
    BaseBonus.prototype.clear.call(this)

    this.path.remove();
};