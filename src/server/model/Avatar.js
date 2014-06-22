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
    if (this.alive) {
        this.updateAngle(step);
        this.updatePosition(step);

        if (this.printing && (!this.trail.getLast() || this.getDistance(this.trail.getLast(), this.head) > this.precision)) {
            this.addPoint(this.head.slice(0));
        }
    }

    return BaseAvatar.prototype.update.call(this);
};

/**
 * Set position
 *
 * @param {Array} point
 */
Avatar.prototype.setPosition = function(point)
{
    BaseAvatar.prototype.setPosition.call(this, point);
    this.emit('position', {avatar: this, point: point});
};

/**
 * Set position
 *
 * @param {Array} point
 */
Avatar.prototype.setAngle = function(angle)
{
    BaseAvatar.prototype.setAngle.call(this, angle);
    this.emit('angle', {avatar: this, angle: angle});
};

/**
 * Add point
 *
 * @param {Array} point
 */
Avatar.prototype.addPoint = function(point)
{
    BaseAvatar.prototype.addPoint.call(this, point);
    this.emit('point', {avatar: this, point: point});
};

/**
 * Die
 */
Avatar.prototype.die = function()
{
    BaseAvatar.prototype.die.call(this);
    this.emit('die', {avatar: this});
};

/**
 * Set score
 *
 * @param {Number} score
 */
Avatar.prototype.setScore = function(score)
{
    BaseAvatar.prototype.setScore.call(this, score);

    this.emit('score', {avatar: this, score: this.score});
};

/**
 * Upgrade velocity
 */
Avatar.prototype.upVelocity = function()
{
    BaseAvatar.prototype.upVelocity.call(this);
    this.emit('velocity:up', {avatar: this});
};

/**
 * Downgrade velocity
 */
Avatar.prototype.downVelocity = function()
{
    BaseAvatar.prototype.downVelocity.call(this);
    this.emit('velocity:down', {avatar: this});
};