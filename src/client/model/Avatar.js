/**
 * Avatar
 *
 * @param {Player} player
 */
function Avatar(player)
{
    BaseAvatar.call(this, player);

    this.local = player.local;

    this.path  = new paper.Shape.Circle({
        center: [this.head[0] * paper.sceneScale, this.head[1] * paper.sceneScale],
        radius: this.radius * paper.sceneScale,
        fillColor: this.color,
        fullySelected: false
    });

    if (this.local) {
        this.input = new PlayerInput(this, player.getBinding());
    }
}

Avatar.prototype = Object.create(BaseAvatar.prototype);

/**
 * Set position
 *
 * @param {Array} point
 */
Avatar.prototype.setPosition = function(point)
{
    BaseAvatar.prototype.setPosition.call(this, point);

    this.path.position.x = this.head[0] * paper.sceneScale;
    this.path.position.y = this.head[1] * paper.sceneScale;

    this.updateArrowPosition();
};

/**
 * Set angle
 *
 * @param {Float} angle
 */
Avatar.prototype.setAngle = function(angle)
{
    BaseAvatar.prototype.setAngle.call(this, angle);

    this.updateArrowPosition();
};

/**
 * Update arrow position
 */
Avatar.prototype.updateArrowPosition = function()
{
    if (this.arrow !== null) {
        this.setArrow(true);
    }
}

/**
 * Set started
 *
 * @param {Boolean} started
 */
Avatar.prototype.setStarted = function(started)
{
    this.setArrow(!started);
};

/**
 * Set arrow
 *
 * @param {Boolean} toggle
 */
Avatar.prototype.setArrow = function(toggle)
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
            strokeWidth: 2,
        });

        this.arrow.rotate(this.angle * 180 / Math.PI, [this.path.position.x, this.path.position.y]);

        paper.view.update();
        paper.view.draw();
    } else {
        this.arrow = null;
    }
};

/**
 * Clear
 */
Avatar.prototype.clear = function()
{
    BaseAvatar.prototype.clear.call(this);

    this.trail.clearPaths();
};