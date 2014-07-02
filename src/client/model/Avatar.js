/**
 * Avatar
 *
 * @param {Player} player
 */
function Avatar(player)
{
    BaseAvatar.call(this, player);

    this.local   = player.local;
    this.canvas  = new Canvas(50, 50);
    this.arrow   = new Canvas(100, 100);

    if (this.local) {
        this.input = new PlayerInput(this, player.getBinding());
    }

    this.drawHead();
    this.drawArrow();

    console.log(this.canvas.toString());
    console.log(this.arrow.toString());
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
        this.trail.setPosition(point);
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
    this.arrow.drawLine([[50, 50], [80, 50]], 2, this.color);
    this.arrow.drawLine([[70, 40], [80, 50], [70, 60]], 2, this.color);
};

/**
 * Draw
 */
Avatar.prototype.draw = function()
{
    return this.canvas.element;
};

/**
 * Set arrow
 *
 * @param {Boolean} toggle
 */
/*Avatar.prototype.setArrow = function(toggle)
{
    if (this.arrow) {
        this.arrow.remove();
    }

    if (this.local && toggle) {
        this.arrow = new paper.Group({
            children: [
                new paper.Path([[20, -10], [30, 0], [20, 10]]),
                new paper.Path([[0, 0], [30, 0]])
            ],
            position: [
                this.path.position.x + 40,
                this.path.position.y
            ],
            strokeColor: this.color,
            strokeWidth: 2
        });

        this.arrow.rotate(this.angle * 180 / Math.PI, [this.path.position.x, this.path.position.y]);
    } else {
        this.arrow = null;
    }
};*/

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