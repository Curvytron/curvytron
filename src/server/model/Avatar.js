/**
 * Avatar
 *
 * @param {Player} player
 */
function Avatar(player)
{
    BaseAvatar.call(this, player);

    this.game      = null;
    this.bodyCount = 0;
    this.body      = new AvatarBody(this.head, this);
}

Avatar.prototype = Object.create(BaseAvatar.prototype);
Avatar.prototype.constructor = Avatar;

/**
 * Update
 *
 * @param {Number} step
 */
Avatar.prototype.update = function(step)
{
    if (this.alive) {
        this.updateAngle(step);
        this.updatePosition(step);

        var last = this.trail.getLast();

        if (this.printing && (!last || this.getDistance(last, this.head) > this.radius)) {
            this.addPoint(this.head.slice(0));
        }
    }

    BaseAvatar.prototype.update.call(this);
};

/**
 * Set position
 *
 * @param {Array} point
 */
Avatar.prototype.setPosition = function(point)
{
    BaseAvatar.prototype.setPosition.call(this, point);

    this.body.position = this.head;
    this.body.num      = this.bodyCount;

    this.emit('property', {avatar: this, property: 'position', value: this.head});
};

/**
 * Set angle
 *
 * @param {Array} point
 */
Avatar.prototype.setAngle = function(angle)
{
    BaseAvatar.prototype.setAngle.call(this, angle);
    this.emit('property', {avatar: this, property: 'angle', value: this.angle});
};

/**
 * Set color
 *
 * @param {Color} color
 */
Avatar.prototype.setColor = function(color)
{
    BaseAvatar.prototype.setColor.call(this, color);
    this.emit('color', {avatar: this, color: this.color});
};

/**
 * Set radius
 *
 * @param {Number} radius
 */
Avatar.prototype.setRadius = function(radius)
{
    BaseAvatar.prototype.setRadius.call(this, radius);
    this.body.radius = this.radius;
    this.emit('property', {avatar: this, property: 'radius', value: this.radius});
};

/**
 * Set invincible
 *
 * @param {Number} invincible
 */
Avatar.prototype.setInvincible = function(invincible)
{
    BaseAvatar.prototype.setInvincible.call(this, invincible);
    this.emit('property', {avatar: this, property: 'invincible', value: this.invincible});
};

/**
 * Set inverse
 *
 * @param {Number} inverse
 */
Avatar.prototype.setInverse = function(inverse)
{
    BaseAvatar.prototype.setInverse.call(this, inverse);
    this.emit('property', {avatar: this, property: 'inverse', value: this.inverse});
};

/**
 * Set color
 *
 * @param {Number} color
 */
Avatar.prototype.setColor = function(color)
{
    this.color = color;
    this.emit('property', {avatar: this, property: 'color', value: this.color});
};

/**
 * Add point
 *
 * @param {Array} point
 */
Avatar.prototype.addPoint = function(point, important)
{
    if (this.game.isPlaying()) {
        BaseAvatar.prototype.addPoint.call(this, point);
        this.emit('point', { avatar: this, point: point, important: important || this.angularVelocity });
    }
};

/**
 * Set printing
 *
 * @param {Boolean} printing
 */
Avatar.prototype.setPrinting = function(printing)
{
    BaseAvatar.prototype.setPrinting.call(this, printing);
    this.emit('property', {avatar: this, property: 'printing', value: this.printing});
};

/**
 * Die
 */
Avatar.prototype.die = function()
{
    BaseAvatar.prototype.die.call(this);
    
    if (!this.invincible) {
        this.addPoint(this.head.slice(0));
        this.emit('die', {avatar: this});
    }
};

/**
 * Set score
 *
 * @param {Number} score
 */
Avatar.prototype.setScore = function(score)
{
    BaseAvatar.prototype.setScore.call(this, score);
    this.emit('property', {avatar: this, property: 'score', value: this.score});
};

/**
 * Clear
 */
Avatar.prototype.clear = function()
{
    BaseAvatar.prototype.clear.call(this);
    this.bodyCount = 0;
};
