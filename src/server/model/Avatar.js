/**
 * Avatar
 *
 * @param {Player} player
 */
function Avatar(player)
{
    BaseAvatar.call(this, player);

    this.bodyCount    = 0;
    this.body         = new AvatarBody(this.x, this.y, this);
    this.printManager = new PrintManager(this);
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

        if (this.printing && this.isTimeToDraw()) {
            this.addPoint(this.x, this.y);
        }
    }
};

/**
 * Is time to draw?
 *
 * @return {Boolean}
 */
Avatar.prototype.isTimeToDraw = function()
{
    if (this.trail.lastX === null) {
        return true;
    }

    return this.getDistance(this.trail.lastX, this.trail.lastY, this.x, this.y) > this.radius;
};

/**
 * Set position
 *
 * @param {Number} x
 * @param {Number} y
 */
Avatar.prototype.setPosition = function(x, y)
{
    BaseAvatar.prototype.setPosition.call(this, x, y);

    this.body.x   = this.x;
    this.body.y   = this.y;
    this.body.num = this.bodyCount;

    this.emit('position', this);
};

/**
 * Set velocity
 *
 * @param {Number} step
 */
Avatar.prototype.setVelocity = function(velocity)
{
    if (this.velocity !== velocity) {
        BaseAvatar.prototype.setVelocity.call(this, velocity);
        this.emit('property', {avatar: this, property: 'velocity', value: this.velocity});
    }
};

/**
 * Set angle
 *
 * @param {Array} point
 */
Avatar.prototype.setAngle = function(angle)
{
    if (this.angle !== angle) {
        BaseAvatar.prototype.setAngle.call(this, angle);
        this.emit('angle', this);
    }
};

/**
 * Set angular velocity
 *
 * @param {Number} velocity
 */
Avatar.prototype.setAngularVelocity = function(angularVelocity)
{
    if (this.angularVelocity !== angularVelocity) {
        BaseAvatar.prototype.setAngularVelocity.call(this, angularVelocity);
    }
};

/**
 * Set angular velocity
 *
 * @param {Float} velocity
 */
Avatar.prototype.setRadius = function(radius)
{
    if (this.radius !== radius) {
        BaseAvatar.prototype.setRadius.call(this, radius);
        this.body.radius = this.radius;
        this.emit('property', {avatar: this, property: 'radius', value: this.radius});
    }
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
 * @param {Float} x
 * @param {Float} y
 * @param {Boolean} important
 */
Avatar.prototype.addPoint = function(x, y, important)
{
    BaseAvatar.prototype.addPoint.call(this, x, y);
    this.emit('point', {avatar: this, x: x, y: y, important: important});
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
 *
 * @param {Bodynull} body
 */
Avatar.prototype.die = function(body)
{
    BaseAvatar.prototype.die.call(this);
    this.printManager.stop();
    this.emit('die', {
        avatar: this,
        killer: body ? body.data : null,
        old: body ? body.isOld() : null
    });
};

/**
 * Set score
 *
 * @param {Number} score
 */
Avatar.prototype.setScore = function(score)
{
    BaseAvatar.prototype.setScore.call(this, score);
    this.emit('score', this);
};

/**
 * Set round score
 *
 * @param {Number} score
 */
Avatar.prototype.setRoundScore = function(score)
{
    BaseAvatar.prototype.setRoundScore.call(this, score);
    this.emit('score:round', this);
};

/**
 * Clear
 */
Avatar.prototype.clear = function()
{
    BaseAvatar.prototype.clear.call(this);
    this.printManager.stop();
    this.bodyCount = 0;
};
