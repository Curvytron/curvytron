/**
 * Avatar
 *
 * @param {Player} player
 */
function Avatar(player)
{
    BaseAvatar.call(this, player);
}

Avatar.prototype = Object.create(BaseAvatar.prototype);

/**
 * Update
 */
Avatar.prototype.update = function(step)
{
    this.updateAngle(step);

    this.head[0] = this.head[0] + this.velocities[0];
    this.head[1] = this.head[1] + this.velocities[1];

    if (this.getDistance(this.lastPosition, this.head) > this.precision) {
        this.lastPosition = this.head.slice(0);
        this.trail.addPoint(this.lastPosition);
    }

    BaseAvatar.prototype.update.call(this);
};