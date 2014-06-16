/**
 * Avatar
 *
 * @param {Player} player
 */
function Avatar(player)
{
    BaseAvatar.call(this, player);

    this.path = new paper.Shape.Circle({
        center: [this.head[0] * paper.sceneScale, this.head[1] * paper.sceneScale],
        radius: this.radius * paper.sceneScale,
        fillColor: player.color,
        fullySelected: false
    });
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
    this.path.position = [this.head[0] * paper.sceneScale, this.head[1] * paper.sceneScale];
};

/**
 * Clear
 */
Avatar.prototype.clear = function()
{
    BaseAvatar.prototype.clear.call(this);

    this.trail.clearPaths();
};